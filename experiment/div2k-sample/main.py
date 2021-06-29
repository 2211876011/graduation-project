import os.path as path
dirname__ = path.dirname(path.abspath(__file__))

from PIL import Image
from matplotlib import pyplot as plt

models = ['espcn', 'edsr', 'dwsr', 'lu', 'gt']

# crops = [
#     {
#         'image_id': '0805',
#         'left_top': [747, 429],
#         'wh': 315
#     },
#     {
#         'image_id': '0832',
#         'left_top': [1667, 259],
#         'wh': 320
#     },
#     {
#         'image_id': '0880',
#         'left_top': [428, 219],
#         'wh': 500
#     },
# ]
crops = [
    {
        'image_id': '0890',
        'left_top': [860, 543],
        'wh': 270
    },
    {
        'image_id': '0899',
        'left_top': [342, 590],
        'wh': 370
    },
]

plt_id = 1
for crop in crops:
    for model in models:
        image = Image.open(path.join('./raw', model + '-' + crop['image_id'] + '.png')).convert('RGB')
        plt.subplot(3, 5, plt_id)
        plt_id += 1
        plt.imshow(
            image.crop((crop['left_top'][0], crop['left_top'][1], crop['left_top'][0] + crop['wh'],
                        crop['left_top'][1] + crop['wh'])))
        plt.xticks([])
        plt.yticks([])
        plt.axis('off')

# plt.show()
plt.tight_layout()
# plt.savefig(path.join('./output', 'compare1.png'), bbox_inches='tight')
plt.savefig(path.join('./output', 'compare2.png'), bbox_inches='tight')
