import os.path as path
dirname__ = path.dirname(path.abspath(__file__))

from PIL import Image
from matplotlib import pyplot as plt

rgb_image = Image.open(path.join(dirname__, 'rgb.png')).convert('RGB')
ycbcr_image = rgb_image.copy().convert('YCbCr')
y_image = ycbcr_image.getchannel(0)
cb_image = ycbcr_image.getchannel(1)
cr_image = ycbcr_image.getchannel(2)

pos = 221
def imshow(img):
    global pos
    plt.subplot(pos)
    plt.imshow(img, cmap='gray')
    plt.yticks([])
    plt.xticks([])
    pos += 1

list(map(imshow, (rgb_image, y_image, cb_image, cr_image)))
plt.show()
