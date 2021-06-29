import os.path as path
dirname__ = path.dirname(path.abspath(__file__))

from PIL import Image
from matplotlib import pyplot as plt
import numpy as np

lena_grayscale = Image.open(path.join(dirname__, 'lena-grayscale.bmp')).convert('L')

import pywt

subbands = pywt.dwt2(lena_grayscale, 'haar')
flat = np.array([subbands[0], *subbands[1]])

pos = 221
def imshow(img):
    global pos
    plt.subplot(pos)
    plt.imshow(img, cmap='gray')
    plt.yticks([])
    plt.xticks([])
    pos += 1

list(map(imshow, flat))
plt.show()

# def imwrite(img):
#     global pos
#     pil = Image.fromarray(img).convert('L')
#     pil.save(path.join(dirname__, 'subband_' + str(pos) + '.bmp'))
#     pos += 1

# list(map(imwrite, flat))
