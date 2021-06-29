# 准备引入
import os.path as path

dirname__ = path.dirname(path.abspath(__file__))
import sys

sys.path.append(path.join(dirname__))  # current directory first
sys.path.append(path.join(dirname__, '../../nova'))

from ct_lpips.ctlpips import get_ct_lpips

GroundTruth = r'/mnt/zhuoxu/datasets/deeplesion_split/sr/val/'

import os

ct_filenames = os.listdir(GroundTruth)

Candidates = [
    {
        'name': 'ESPCN',
        'out_dir': r'/mnt/zhuoxu/code/graduation-project/baselines/outputs_deeplesion/espcn/val_inference',
        'avg': 0
    },
    {
        'name': 'EDSR',
        'out_dir': r'/mnt/zhuoxu/code/graduation-project/baselines/outputs_deeplesion/edsr/val_inference',
        'avg': 0
    },
    {
        'name': 'DWSR',
        'out_dir': r'/mnt/zhuoxu/code/graduation-project/baselines/outputs_deeplesion/dwsr/val_inference',
        'avg': 0
    },
    {
        'name': 'LUMWCNN',
        'out_dir': r'/mnt/zhuoxu/code/graduation-project/nova/lu_mwcnn/output_deeplesion/val_inference',
        'avg': 0
    },
]

from PIL import Image
import torchvision.transforms as transforms
from tqdm import tqdm

step = 0

for fn in tqdm(ct_filenames, ncols=80):
    gt = transforms.ToTensor()(Image.open(path.join(GroundTruth, fn)).convert('L'))

    def get_sr_name(filename):
        return filename.replace('.png', '') + '_gray.png'

    for model in Candidates:
        sr = transforms.ToTensor()(Image.open(path.join(model['out_dir'], get_sr_name(fn))).convert('L'))
        model['avg'] = (model['avg'] + get_ct_lpips(sr, gt)) / 2

    step += 1

    def report_status():
        avgs = ['%.6f' % float(x['avg']) for x in Candidates]
        print()
        print(avgs)

    if step % 50 == 0:
        report_status()

print('-- DONE --')
print(Candidates)

import json

with open('./out.json', 'w') as f:
    f.write(json.dumps(Candidates, indent=2))

print('-- DONE --')
