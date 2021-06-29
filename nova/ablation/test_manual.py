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
from model_cpu import LUMWCNN_ABTEST
from torch.utils.data import DataLoader
from utils.meters import AverageMeter
from utils.metrics import *

from lpips import LPIPS

lpips = LPIPS(net='vgg')
lpips = lpips.to('cpu')
lpips.eval()

def calc_lpips(img1, img2):
    return lpips(img1, img2).detach().cpu().squeeze().mean()

import importlib
from PIL import Image
import numpy as np

import torch
from tqdm import tqdm
import os

tb = SummaryWriter(os.path.join(OUTPUT_PATH, './tensorboard'))

if __name__ == '__main__':
    with torch.no_grad():
        model = LUMWCNN_ABTEST()
        # model = model.cuda()
        model.load_state_dict(
            torch.load(r'/mnt/zhuoxu/code/graduation-project/nova/ablation/output_div2k/ckp/epoch_299.pth'))

        # 加载数据集
        print('Current dataset_interface: ', CommonOpt['dataset_interface'])
        Dataset_ = importlib.import_module('.' + CommonOpt['dataset_interface'].split('.')[0], 'datasets')
        Dataset_ = eval('Dataset_.{}'.format(CommonOpt['dataset_interface'].split('.')[1]))
        val_set = Dataset_(CommonOpt['val_dir'], CommonOpt['crop_size'], CommonOpt['noise_std'], 'val')
        val_loader = DataLoader(val_set, batch_size=1, shuffle=False, pin_memory=True)

        # 测试
        model.eval()
        model.valing = True

        # PSNR / SSIM 和 LPIPS 均只在 Y 通道上计算
        epoch_psnr = AverageMeter()
        epoch_ssim = AverageMeter()
        epoch_lpips = AverageMeter()

        for data in tqdm(val_loader, ncols=80, desc='Validation'):
            lr, hr, cb_lr, cr_lr, filename = data
            # lr = lr.cuda()
            # hr = hr.cuda()

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
            cb_lr = np.array(cb_lr.numpy().squeeze().squeeze() * 255, dtype=np.uint8)
            cr_lr = np.array(cr_lr.numpy().squeeze().squeeze() * 255, dtype=np.uint8)
            # 融合多通道图并保存
            predict_np = np.array((predict_y, cb_lr, cr_lr)).transpose(1, 2, 0)  # CHW To HWC
            predict_rgb = Image.fromarray(predict_np, mode='YCbCr').convert('RGB')
            predict_rgb.save(os.path.join(OUTPUT_PATH, './val_inference/', '{}_rgb.png'.format(filename[0])))
            # 保存单通道图
            predict_y = Image.fromarray(predict_y, mode='L')
            predict_y.save(os.path.join(OUTPUT_PATH, './val_inference/', '{}_y.png'.format(filename[0])))
            # 保存输入的图片
            noisy_y = Image.fromarray(np.array(lr.detach().cpu().numpy().squeeze().squeeze() * 255, dtype=np.uint8),
                                    mode='L')
            noisy_y.save(os.path.join(OUTPUT_PATH, './val_inference/', '{}_lr.png'.format(filename[0])))

        # 打印当前指标结果
        print('Val PSNR: {:.2f}'.format(epoch_psnr.avg))
        print('Val SSIM: {:.2f}'.format(epoch_ssim.avg))
        print('Val LPIPS: {:.2f}'.format(epoch_lpips.avg))

        # 保存相关指标到 TensorBoard
        tb.add_scalar('Val PSNR', epoch_psnr.avg, global_step=0)
        tb.add_scalar('Val SSIM', epoch_ssim.avg, global_step=0)
        tb.add_scalar('Val LPIPS', epoch_lpips.avg, global_step=0)
