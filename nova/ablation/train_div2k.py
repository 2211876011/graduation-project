'''
    LU-MWCNN 训练代码。
'''

# 准备引入
import os.path as path

dirname__ = path.dirname(path.abspath(__file__))
import sys

sys.path.append(path.join(dirname__))  # current directory first
sys.path.append(path.join(dirname__, '../../baselines'))

LR = 1e-3
EPOCH = 300
BATCH_SIZE = 32
VAL_EVERY = 50
OUTPUT_PATH = r'/mnt/zhuoxu/code/graduation-project/nova/ablation/output_div2k'

CommonOpt = {
    # 数据集
    'train_dir': r'/mnt/zhuoxu/datasets/DIV2K_HR/train/',
    'val_dir': r'/mnt/zhuoxu/datasets/DIV2K_HR/val/',
    'dataset_interface': 'div2k.DIV2KDataset',

    # 数据预处理
    'crop_size': 128,
    'noise_std': 5.0,

    # 数据加载
    'num_workers': 16,
}

from torch.utils.tensorboard import SummaryWriter
from model import LUMWCNN_ABTEST
from torch.utils.data import DataLoader
from torch.optim import lr_scheduler
import torch.optim as optim
from utils.meters import AverageMeter
from utils.metrics import *
import importlib

import torch.nn as nn
import torch
from tqdm import tqdm
import os

tb = SummaryWriter(os.path.join(OUTPUT_PATH, './tensorboard'))

from lpips import LPIPS


class MyJointLoss(nn.Module):
    def __init__(self, lpips_weight=0.1):
        super(MyJointLoss, self).__init__()
        print('\nLoading VGG LPIPS for joint loss...\n')
        self.lpips = LPIPS(net='vgg').cuda()
        self.mse = nn.MSELoss()
        self.lpips_weight = lpips_weight

    def forward(self, x, y):
        def normalize(tensor):  # normalize to [-1, 1]
            return (tensor.clamp(0, 1) - 0.5) * 2

        return torch.mean(self.mse(x, y) + self.lpips_weight * self.lpips(normalize(x), normalize(y)))


if __name__ == '__main__':
    model = LUMWCNN_ABTEST()
    model = model.cuda()

    # Adam optimizer
    criterion = MyJointLoss()
    optimizer = optim.Adam(model.parameters(), lr=LR, weight_decay=1e-4, betas=(0.9, 0.999), eps=1e-8)
    # learning rate decays by x0.9 every 20 epochs
    scheduler = lr_scheduler.MultiStepLR(optimizer, list(range(20, EPOCH, 20)), gamma=0.9)

    # 加载数据集
    print('Current dataset_interface: ', CommonOpt['dataset_interface'])
    Dataset_ = importlib.import_module('.' + CommonOpt['dataset_interface'].split('.')[0], 'datasets')
    Dataset_ = eval('Dataset_.{}'.format(CommonOpt['dataset_interface'].split('.')[1]))
    train_set = Dataset_(CommonOpt['train_dir'], CommonOpt['crop_size'], CommonOpt['noise_std'], 'train')
    train_loader = DataLoader(train_set, batch_size=BATCH_SIZE, shuffle=True, num_workers=CommonOpt['num_workers'])
    val_set = Dataset_(CommonOpt['val_dir'], CommonOpt['crop_size'], CommonOpt['noise_std'], 'val')
    val_loader = DataLoader(val_set, batch_size=1, shuffle=False, pin_memory=True)

    # 训练
    for epoch in range(EPOCH):
        model.train()
        epoch_loss = AverageMeter()

        with tqdm(total=(len(train_set) - len(train_set) % BATCH_SIZE), ncols=80, desc='Training') as t:
            t.set_description('Epoch: {}/{}'.format(epoch + 1, EPOCH))

            # 训练过程
            for data in train_loader:
                lr, hr = data
                lr = lr.cuda()
                hr = hr.cuda()

                # 通过网络，获得输出
                predict = model(lr).cuda()
                loss = criterion(predict, hr)

                # 更新损失记录
                epoch_loss.update(torch.mean(loss))

                # 反向传播并优化
                optimizer.zero_grad()
                loss.backward()
                optimizer.step()

                t.set_postfix(loss='{:.6f}'.format(epoch_loss.avg))
                t.update(len(lr))

            tb.add_scalar('Loss', epoch_loss.avg, global_step=epoch)

            # 衰减学习率
            scheduler.step()

            # 保存ckp
            torch.save(model.state_dict(), os.path.join(OUTPUT_PATH, './ckp/', 'epoch_{}.pth'.format(epoch)))
