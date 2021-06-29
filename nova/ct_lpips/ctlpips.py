import os.path as path

dirname__ = path.dirname(path.abspath(__file__))
import sys

sys.path.append(path.join(dirname__, './'))

BEST_CKP = r'/mnt/zhuoxu/code/graduation-project/nova/ct_lpips/out/ckp/vgglite_49.pth'

from model import VGGLite

import torch

vgg_model = VGGLite(5)
vgg_model.load_state_dict(torch.load(BEST_CKP))
vgg_model.eval()

from torchvision import transforms

from PIL import Image

import numpy as np


def get_ct_lpips(img1: torch.Tensor, img2: torch.Tensor):
    '''
        单通道图，CHW。
    '''
    assert len(img1.shape) == 3 and len(img2.shape) == 3
    assert img1.shape[0] == 1 and img2.shape[0] == 1
    assert img1.shape[1] == img2.shape[1] and img1.shape[2] == img2.shape[2]

    def atom(img):
        fmap, type_ = vgg_model.forward(img.unsqueeze(0))
        # shape of fmap is [1, 128, 32, 32]
        fmap = fmap.squeeze().detach().numpy()
        return fmap, type_

    fmap1, _ = atom(img1)
    fmap2, _ = atom(img2)
    # calc L2 distance
    dis = 0
    for ch in range(fmap1.shape[0]):
        dis += np.linalg.norm(fmap1[ch] - fmap2[ch])
    area = img1.shape[1] * img1.shape[2]
    return dis / area

if __name__ == '__main__':
    # 1~8型分别为骨、腹、纵膈、肝、肺、肾、软组织、骨盆
    #1  2   3    4  5  #6  #7    8
    LABEL_ADJUST = {'2': 0, '3': 1, '4': 2, '5': 3, '8': 4}

    TEST_1 = r'/mnt/zhuoxu/code/graduation-project/nova/lu-mwcnn/output_deeplesion/val_inference/002615_03_01_412_gray.png'
    TEST_2 = r'/mnt/zhuoxu/code/graduation-project/nova/lu-mwcnn/output_deeplesion/val_inference/002328_02_01_025_gray.png'

    img1 = transforms.ToTensor()(Image.open(TEST_1).convert('L'))
    img2 = transforms.ToTensor()(Image.open(TEST_2).convert('L'))

    print(get_ct_lpips(img1, img2))
    # 0.007931032299893559
    # 0.012023473092995118
