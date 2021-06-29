'''
    自然图像感知损失计算。
    by z0gSh1u @ 2021-02
'''

from lpips import LPIPS

lpips = LPIPS(net='vgg')
lpips.eval()

def calc_lpips(img1, img2):
    return lpips(img1, img2).detach().cpu().squeeze().mean()
