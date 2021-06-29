'''
    WaveletUNet 网络结构。（消融实验）
'''

import os.path as path

dirname__ = path.dirname(path.abspath(__file__))
import sys

sys.path.append(path.join(dirname__, '../../baselines'))

import torch.nn as nn
import torch.nn.functional as F
from utils.wavelet import DWT_Haar, IWT_Haar


class Conv2d(nn.Module):
    def __init__(self, in_ch, out_ch, kernel_size, act=True) -> None:
        super(Conv2d, self).__init__()
        self.layers = [
            nn.Conv2d(in_ch, out_ch, kernel_size=kernel_size, padding=kernel_size // 2),
        ]
        if act:
            self.layers.append(nn.ReLU())
        self.layers = nn.Sequential(*self.layers)

    def forward(self, x):
        return self.layers(x)


class LUMWCNN_ABTEST(nn.Module):
    def __init__(self) -> None:
        super(LUMWCNN_ABTEST, self).__init__()

        self.DWT = DWT_Haar()
        self.IWT = IWT_Haar()

        self.l_conv1 = nn.Sequential(*[Conv2d(1, 64, 3), Conv2d(64, 64, 3)])
        # DWT, 64 -> 256
        self.l_conv2 = nn.Sequential(*[Conv2d(256, 128, 3), Conv2d(128, 128, 3)])
        # DWT, 128 -> 512
        self.l_conv3 = nn.Sequential(*[Conv2d(512, 256, 3), Conv2d(256, 256, 3)])
        # === HALF, ch = 256 ===
        self.r_conv3 = nn.Sequential(*[Conv2d(256, 256, 3), Conv2d(256, 512, 3)])  # 256->512
        # DWT, 512 -> 128
        self.r_conv2 = nn.Sequential(*[Conv2d(128, 128, 3), Conv2d(128, 256, 3)])  # 128->256
        # DWT, 256 -> 64
        self.r_conv1 = nn.Sequential(*[Conv2d(64, 64, 3), Conv2d(64, 1, 3)])  # 64->1

        self.valing = False
        self.pads = []

    def forward(self, x):
        self.print_shape(x, 'Input')

        x_l1 = self.l_conv1(x)  # 1->64
        self.print_shape(x_l1, 'After l_conv1')

        x_l1_pad = self.wavelet_pad(x_l1)
        self.print_shape(x_l1_pad, 'x_l1_pad')

        _x_l2 = self.DWT(x_l1_pad)
        self.print_shape(_x_l2, 'DWT 1')

        x_l2 = self.l_conv2(_x_l2)  # 64->128
        self.print_shape(x_l2, 'After l_conv2')

        x_l2_pad = self.wavelet_pad(x_l2)
        self.print_shape(x_l2_pad, 'x_l2_pad')

        _x_l3 = self.DWT(x_l2_pad)
        self.print_shape(_x_l3, 'DWT 2')

        x_l3 = self.l_conv3(_x_l3)  # 128->256
        self.print_shape(x_l3, 'After l_conv3')

        _after_r_conv3 = self.r_conv3(x_l3)
        self.print_shape(_after_r_conv3, 'After r_conv3')

        lhs = self.IWT(_after_r_conv3).cuda()
        self.print_shape(lhs, 'IWT 1')

        lhs_shave = self.wavelet_shave(lhs)
        self.print_shape(lhs_shave, 'lhs_shave')

        x_r3 = lhs_shave + x_l2
        self.print_shape(x_r3, 'x_r3 = lhs_shave + x_l2')

        _after_r_conv2 = self.r_conv2(x_r3)
        self.print_shape(_after_r_conv2, 'After r_conv2')

        _x_r2 = self.IWT(_after_r_conv2).cuda()
        self.print_shape(_x_r2, 'IWT _x_r2')

        x_r2 = self.wavelet_shave(_x_r2) + x_l1
        self.print_shape(x_r2, 'x_r2')

        x_r1 = self.r_conv1(x_r2) + x

        return x_r1

    def print_shape(self, x, desc):
        return
        # if not self.valing:
        #     return
        # return
        # print('\n--------------------------------------')
        # print('\n|-- Tensor: {}  /  Shape: {}'.format(desc, x.shape))
        # print('\n--------------------------------------')

    def wavelet_pad(self, x):
        # BCHW
        should_pad_h = x.shape[-2] % 2 != 0
        should_pad_w = x.shape[-1] % 2 != 0
        padding = (1 if should_pad_w else 0, 0, 1 if should_pad_h else 0, 0)  # lrtb
        self.pads.append([should_pad_w, should_pad_h])
        return F.pad(x, padding, 'constant', 0)

    def wavelet_shave(self, x):
        should_shave_w, should_shave_h = self.pads.pop()
        if should_shave_w:
            x = x[:, :, :, 1:]
        if should_shave_h:
            x = x[:, :, 1:, :]
        return x


if __name__ == "__main__":
    print(LUMWCNN_ABTEST())
