import os.path as path
dirname__ = path.dirname(path.abspath(__file__))

import cv2 as cv

left_up = [207, 107]
bbox = [100, 95]

LR_IMAGE = path.join(dirname__, 'lr.png')
SR_IMAGE = path.join(dirname__, 'sr.png')

lr_image = cv.imread(LR_IMAGE, cv.IMREAD_GRAYSCALE)
sr_image = cv.imread(SR_IMAGE, cv.IMREAD_GRAYSCALE)

lr_cut = lr_image[
    left_up[1]:left_up[1] + bbox[1],
    left_up[0]:left_up[0] + bbox[0]
]

sr_cut = sr_image[
    left_up[1] * 4:(left_up[1] + bbox[1]) * 4,
    left_up[0] * 4:(left_up[0] + bbox[0]) * 4
]

cv.imwrite('./lr_cut.png', lr_cut)
cv.imwrite('./bicubic_cut.png', cv.resize(lr_cut, None, fx=4, fy=4))
cv.imwrite('./sr_cut.png', sr_cut)
