'''
    Torchvision Transforms 补充。
'''

import numpy as np
import random
from PIL import Image


class AddGaussianNoise(object):
    """添加高斯噪声"""
    def __init__(self, sigma, prob=1.):
        """ 以 prob 的概率按方差 sigma 、均值 0 添加高斯噪声"""
        assert isinstance(sigma, float) and isinstance(prob, float)
        self.sigma = sigma
        self.prob = prob

    def __call__(self, img):
        """
        Args:
            img (PIL Image): PIL Image
        Returns:
            PIL Image
        """
        if random.uniform(0, 1) < self.prob:
            clean_image = np.array(img).copy()
            noise_mask = np.random.randn(*clean_image.shape) * self.sigma
            result = clean_image + noise_mask
            result[result > 255] = 255
            result[result < 0] = 0
            return Image.fromarray(result.astype('uint8'))
        else:
            return img
