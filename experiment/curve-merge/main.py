import json
import matplotlib.pyplot as plt
import numpy as np

dataset = 'DEEP'
metric = 'SSIM' # PSNR SSIM LPIPS
models = ['ESPCN', 'EDSR', 'DWSR', 'LU']
legends = ['ESPCN', 'EDSR', 'DWSR', 'LU-MWCNN']
colors = ['blue', 'green', 'red', 'orange']

RAW_PATH = r'F:/graduation-project/experiment/curve-merge/raw-data'
OUTPUT_PATH = r'F:/graduation-project/experiment/curve-merge/cooked'

import os
import os.path as path


def parse_one(model):
    jsonfile = path.join(RAW_PATH, '{}-{}-{}.json'.format(model, dataset, metric))
    jsontext = ''
    with open(jsonfile, 'r') as fp:
        jsontext = fp.read()
    jsonobj = json.loads(jsontext)
    xs = []
    ys = []
    for record in jsonobj:
        xs.append(record[1] + 1)
        ys.append(record[2])
    return xs, ys


font = {
    'family': 'Times New Roman',
    'weight': 'normal',
    'size': 16,
}

if __name__ == '__main__':
    data = {}
    for idx, model in enumerate(models):
        data[model] = parse_one(model)
        plt.plot(data[model][0], data[model][1], color=colors[idx], linewidth=2, label=legends[idx])
    plt.xlabel('Epoch', fontdict=font)
    plt.ylabel(metric, fontdict=font)
    plt.yticks(fontproperties='Times New Roman', size=10)
    plt.xticks(fontproperties='Times New Roman', size=10)
    plt.legend(prop=font)
    # plt.show()
    plt.savefig(path.join(OUTPUT_PATH, '{}-{}.png'.format(dataset, metric)))