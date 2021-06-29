'''
    ESPCN 网络结构。
'''

import torch.nn as nn


class Conv2d(nn.Module):
    def __init__(self, in_ch, out_ch, kernel_size, act=True):
        super(Conv2d, self).__init__()
        self.layers = [
            nn.Conv2d(in_ch, out_ch, kernel_size=kernel_size, padding=kernel_size // 2),
        ]
        if act:
            self.layers.append(nn.ReLU())
        self.layers = nn.Sequential(*self.layers)

    def forward(self, x):
        return self.layers(x)


class ESPCN(nn.Module):
    def __init__(self):
        super(ESPCN, self).__init__()

        self.conv1 = Conv2d(1, 32, 5)
        self.conv2 = Conv2d(32, 32, 3)
        self.conv3 = Conv2d(32, 16, 3)
        self.conv4 = Conv2d(16, 1 * (4**2), 3, False)  # 放大倍率为4，最后一层不激活

        self.ps = nn.PixelShuffle(4)

    def forward(self, x):
        x = self.conv1(x)
        x = self.conv2(x)
        x = self.conv3(x)
        x = self.conv4(x)
        x = self.ps(x)

        return x
