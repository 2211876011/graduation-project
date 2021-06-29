import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
import torchvision.transforms as transforms
from torch.utils.tensorboard import SummaryWriter

BATCH_SIZE = 10
LEARNING_RATE = 1e-4
EPOCH = 50
N_CLASSES = 5  # see deeplesion dataset

import os
from PIL import Image
import numpy as np
from tqdm import tqdm

# 1~8型分别为骨、腹、纵膈、肝、肺、肾、软组织、骨盆
#1  2   3    4  5  #6  #7    8
LABEL_ADJUST = {'2': 0, '3': 1, '4': 2, '5': 3, '8': 4}


class CTLPIPSDataset(Dataset):
    def __init__(self, ct_dir):
        super(CTLPIPSDataset, self).__init__()
        self.ct_files = [os.path.join(ct_dir, x) for x in sorted(os.listdir(ct_dir))]
        self.lesion_types = [int(x.replace('.png', '').split('_')[-1]) for x in sorted(os.listdir(ct_dir))]

    def __getitem__(self, idx):
        image = Image.open(self.ct_files[idx]).convert('L')
        image = transforms.Compose([
            transforms.ToTensor(),
        ])(image)
        label = LABEL_ADJUST[str(self.lesion_types[idx])]
        return image, label

    def __len__(self):
        return len(self.ct_files)


TRAIN_PATH = r'/mnt/zhuoxu/datasets/deeplesion_split/lpips/train'
VAL_PATH = r'/mnt/zhuoxu/datasets/deeplesion_split/lpips/val'
OUTPUT_PATH = r'/mnt/zhuoxu/code/graduation-project/nova/ct-lpips/out'

train_loader = DataLoader(dataset=CTLPIPSDataset(TRAIN_PATH), batch_size=BATCH_SIZE, shuffle=True)
val_loader = DataLoader(dataset=CTLPIPSDataset(VAL_PATH), batch_size=BATCH_SIZE, shuffle=False)

from model import VGGLite

vgg = VGGLite(n_classes=N_CLASSES)
vgg.cuda()

# Loss, Optimizer & Scheduler
cost = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(vgg.parameters(), lr=LEARNING_RATE)
scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer)

tb = SummaryWriter(os.path.join(OUTPUT_PATH, 'tensorboard'))

# Train the model
for epoch in range(EPOCH):
    vgg.train()

    avg_loss = 0
    cnt = 0
    for images, labels in tqdm(train_loader):
        images = images.cuda()
        labels = labels.cuda()

        # Forward + Backward + Optimize
        optimizer.zero_grad()
        _, outputs = vgg(images)
        loss = cost(outputs, labels)
        avg_loss += loss.data
        cnt += 1

        loss.backward()
        optimizer.step()
    scheduler.step(avg_loss)
    print("[E: %d] loss: %f, avg_loss: %f" % (epoch, loss.data, avg_loss / cnt))
    tb.add_scalar('Train avg_loss', avg_loss / cnt, epoch)

    # Test the model
    vgg.eval()
    correct = 0
    total = 0

    print('Validating...')
    for images, labels in val_loader:
        images = images.cuda()
        _, outputs = vgg(images)
        _, predicted = torch.max(outputs.data, 1)
        total += labels.size(0)
        correct += (predicted.cpu() == labels).sum()
    print('avg acc: {} %'.format(100 * correct / total))
    tb.add_scalar('Val acc', correct / total, epoch)

    # Save the Trained Model
    torch.save(vgg.state_dict(), os.path.join(OUTPUT_PATH, './ckp/vgglite_{}.pth'.format(epoch)))
