'''
    DeepLesion 数据集接口（医学图像超分辨率）
    by z0gSh1u @ 2021-02
'''

import torchvision.transforms as transforms
from torch.utils.data.dataset import Dataset
from PIL import Image
import os
import numpy as np
from utils.transforms import AddGaussianNoise


class DeepLesionDataset(Dataset):
    def __init__(self, hr_dir, crop_size, noise_std, phase) -> None:
        """DeepLesion 数据集接口（医学图像超分辨率）

        Args:
            hr_dir (str): 高分图像路径
            crop_size (int): Patch 切片大小（4的倍数）
            noise_std (float): 注入的高斯噪声的标准差
            phase ('train' | 'val'): 阶段
        """
        super(DeepLesionDataset, self).__init__()

        self.hr_dir = hr_dir
        self.crop_size = crop_size
        self.phase = phase

        assert self.phase == 'train' or self.phase == 'val', '无效的阶段'

        self.hr_files = [os.path.join(self.hr_dir, x) for x in sorted(os.listdir(hr_dir))]

        # 训练阶段：随机裁剪、随机翻转、注入噪声
        self.train_public_transform = transforms.Compose([
            transforms.RandomCrop(crop_size, padding=0, pad_if_needed=True),
        ])

        # 验证阶段：不进行特别的处理，使用 BatchSize 为 1 来在全图上进行验证

        self.lr_transform = transforms.Compose([
            AddGaussianNoise(noise_std),  # 注入噪声
            transforms.Resize(crop_size // 4, interpolation=Image.BICUBIC) if self.phase == 'train' else transforms.
            Lambda(lambda x: transforms.Resize((x.size[1] // 4, x.size[0] // 4), interpolation=Image.BICUBIC)(x)),
            transforms.ToTensor()
        ])

        self.hr_transform = transforms.Compose([transforms.ToTensor()])

    def __getitem__(self, index):
        # 单通道
        image_PIL = Image.open(self.hr_files[index]).convert('L')
        image_np = np.array(image_PIL)

        y = Image.fromarray(image_np)  # HW, 0-255, gray, PIL
        x = self.train_public_transform(y) if self.phase == 'train' else y

        y_lr = self.lr_transform(x)  # CHW, 0-1, gray, Tensor
        y_hr = self.hr_transform(x)  # CHW, 0-1, gray, Tensor

        if self.phase == 'train':
            return y_lr, y_hr
        else:
            filename = ''.join(os.path.basename(self.hr_files[index]).split('.')[:-1])
            return y_lr, y_hr, filename

    def __len__(self):
        return len(self.hr_files)