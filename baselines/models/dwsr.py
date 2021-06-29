'''
    DWSR 网络结构。
'''

import torch.nn as nn
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


class DWSR(nn.Module):
    def __init__(self, n_conv, residue_weight) -> None:
        super(DWSR, self).__init__()

        self.n_conv = n_conv
        self.residue_weight = residue_weight

        self.upsample = nn.Upsample(scale_factor=4, mode='bicubic')
        self.DWT = DWT_Haar()

        # 主体卷积层
        self.body = nn.Sequential(*[Conv2d(4, 64, 5), *[Conv2d(64, 64, 3) for _ in range(n_conv)], Conv2d(64, 4, 3)])

        self.IWT = IWT_Haar()

    def forward(self, x):
        # 由于小波变换+逆变换对不改变图像大小，所以要先上采样
        upsampled = self.upsample(x)

        # 小波变换和跳接
        lrsb = self.DWT(upsampled)
        main = self.body(lrsb)
        srsb = main + lrsb * self.residue_weight
        out = self.IWT(srsb)

        return out
