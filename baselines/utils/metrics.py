'''
    指标计算。
    by z0gSh1u @ 2021-02
'''

import torch
from skimage.metrics import structural_similarity, peak_signal_noise_ratio
import numpy as np

def calc_psnr_torch(img1, img2):
    '''计算 PSNR。参数为 torch.Tensor，范围在 [0, 1]。'''
    return 10. * torch.log10(1. / torch.mean((img1 - img2)**2))

def calc_psnr(img1, img2):
    '''计算 PSNR。参数为 np.array，范围在 [0, 255] 或 [0, 1]'''
    return peak_signal_noise_ratio(img1, img2)

def calc_ssim_torch(img1, img2):
    return structural_similarity(img1.detach().numpy(), img2.detach().numpy())

def calc_ssim(img1, img2):
    '''计算 SSIM。参数为 np.array，范围在 [0, 255] 或 [0, 1]'''
    return structural_similarity(img1, img2)
