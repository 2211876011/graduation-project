'''
    ESPCN在DIV2K上的训练代码。
'''

# 准备引入
import os.path as path

dirname__ = path.dirname(path.abspath(__file__))
import sys

sys.path.append(path.join(dirname__, '../'))

from torch.utils.tensorboard import SummaryWriter
from models.espcn import ESPCN
from torch.utils.data import DataLoader
from torch.optim import lr_scheduler
import torch.optim as optim
from utils.meters import AverageMeter
from utils.metrics import *
from utils.lpips import calc_lpips
import importlib
from PIL import Image
import numpy as np
import torchvision.transforms as transforms

import torch.nn as nn
import torch
from tqdm import tqdm
import os

ESPCNOpt = {
    # 模型
    'nothing': None,
    # 训练
    'lr': 1e-2,
    'epochs': 100,
    'batch_size': 64,
    # 验证
    'val_every': 10
}

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
    
    # 结果输出
    'output_path': r'/mnt/zhuoxu/code/graduation-project/baselines/outputs_div2k'
}


tb = SummaryWriter(os.path.join(CommonOpt['output_path'], 'espcn/tensorboard'))

if __name__ == '__main__':
    model = ESPCN()
    model = model.cuda()

    # MSELoss, Adam optimizer
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=ESPCNOpt['lr'], weight_decay=1e-4, betas=(0.9, 0.999), eps=1e-8)
    # learning rate decays
    # https://github.com/leftthomas/ESPCN/blob/master/train.py
    scheduler = lr_scheduler.MultiStepLR(optimizer, [30, 80], gamma=0.1)

    # 加载数据集
    Dataset_ = importlib.import_module('.' + CommonOpt['dataset_interface'].split('.')[0], 'datasets')
    Dataset_ = eval('Dataset_.{}'.format(CommonOpt['dataset_interface'].split('.')[1]))
    train_set = Dataset_(CommonOpt['train_dir'], CommonOpt['crop_size'], CommonOpt['noise_std'], 'train')
    train_loader = DataLoader(train_set,
                              batch_size=ESPCNOpt['batch_size'],
                              shuffle=True,
                              num_workers=CommonOpt['num_workers'])
    val_set = Dataset_(CommonOpt['val_dir'], CommonOpt['crop_size'], CommonOpt['noise_std'], 'val')
    val_loader = DataLoader(val_set, batch_size=1, shuffle=False, pin_memory=True)

    # 训练
    for epoch in range(ESPCNOpt['epochs']):
        model.train()
        epoch_loss = AverageMeter()

        with tqdm(total=(len(train_set) - len(train_set) % ESPCNOpt['batch_size']), ncols=80, desc='Training') as t:
            t.set_description('Epoch: {}/{}'.format(epoch + 1, ESPCNOpt['epochs']))

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
            torch.save(model.state_dict(),
                       os.path.join(CommonOpt['output_path'], 'espcn/ckp/', 'epoch_{}.pth'.format(epoch)))

            # 验证
            if epoch == 0 or (epoch + 1) % ESPCNOpt['val_every'] == 0:
                model.eval()

                # PSNR / SSIM 和 LPIPS 均只在 Y 通道上计算
                epoch_psnr = AverageMeter()
                epoch_ssim = AverageMeter()
                epoch_lpips = AverageMeter()

                for data in tqdm(val_loader, ncols=80, desc='Validation'):
                    lr, hr, cb_lr, cr_lr, filename = data
                    lr = lr.cuda()
                    hr = hr.cuda()

                    # Y 通道通过模型
                    with torch.no_grad():
                        predict = model(lr).detach().cpu().clamp(0, 1)

                    # squeeze BatchSize and Channel dimensions, become 1-ch Y-ch
                    predict = predict.squeeze().squeeze()
                    hr = hr.squeeze().squeeze()

                    # 更新 PSNR / SSIM 和 LPIPS 记录
                    epoch_psnr.update(calc_psnr_torch(predict, hr.cpu()))
                    epoch_ssim.update(calc_ssim_torch(predict, hr.cpu()))
                    epoch_lpips.update(calc_lpips(predict, hr.cpu()))

                    # 保存最新推断结果
                    # Y 通道
                    predict_y = np.array(predict.numpy() * 255, dtype=np.uint8)
                    # Cb、Cr直接插值
                    cb_lr = Image.fromarray(np.array(cb_lr.numpy().squeeze().squeeze() * 255, dtype=np.uint8))
                    cr_lr = Image.fromarray(np.array(cr_lr.numpy().squeeze().squeeze() * 255, dtype=np.uint8))
                    predict_cb = np.array(
                        transforms.Resize((cb_lr.size[1] * 4, cb_lr.size[0] * 4), interpolation=Image.BICUBIC)(cb_lr))
                    predict_cr = np.array(
                        transforms.Resize((cr_lr.size[1] * 4, cr_lr.size[0] * 4), interpolation=Image.BICUBIC)(cr_lr))
                    # 融合多通道图并保存
                    predict_np = np.array((predict_y, predict_cb, predict_cr)).transpose(1, 2, 0)  # CHW To HWC
                    predict_rgb = Image.fromarray(predict_np, mode='YCbCr').convert('RGB')
                    predict_rgb.save(
                        os.path.join(CommonOpt['output_path'], 'espcn/val_inference/', '{}_rgb.png'.format(filename[0])))
                    # 保存单通道图
                    predict_y = Image.fromarray(predict_y, mode='L')
                    predict_y.save(
                        os.path.join(CommonOpt['output_path'], 'espcn/val_inference/', '{}_y.png'.format(filename[0])))
                    # 保存输入的图片
                    noisy_y = Image.fromarray(np.array(lr.detach().cpu().numpy().squeeze().squeeze() * 255,
                                                       dtype=np.uint8),
                                              mode='L')
                    noisy_y.save(
                        os.path.join(CommonOpt['output_path'], 'espcn/val_inference/', '{}_lr.png'.format(filename[0])))

                # 打印当前指标结果
                print('Val PSNR: {:.2f}'.format(epoch_psnr.avg))
                print('Val SSIM: {:.2f}'.format(epoch_ssim.avg))
                print('Val LPIPS: {:.2f}'.format(epoch_lpips.avg))

                # 保存相关指标到 TensorBoard
                tb.add_scalar('Val PSNR', epoch_psnr.avg, global_step=epoch)
                tb.add_scalar('Val SSIM', epoch_ssim.avg, global_step=epoch)
                tb.add_scalar('Val LPIPS', epoch_lpips.avg, global_step=epoch)
