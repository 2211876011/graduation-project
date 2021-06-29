import torch.nn as nn


def conv_layer(chann_in, chann_out, k_size, p_size):
    layer = nn.Sequential(nn.Conv2d(chann_in, chann_out, kernel_size=k_size, padding=p_size), nn.BatchNorm2d(chann_out),
                          nn.ReLU())
    return layer


def vgg_conv_block(in_list, out_list, k_list, p_list, pooling_k, pooling_s):
    layers = [conv_layer(in_list[i], out_list[i], k_list[i], p_list[i]) for i in range(len(in_list))]
    layers += [nn.MaxPool2d(kernel_size=pooling_k, stride=pooling_s)]
    return nn.Sequential(*layers)


def vgg_fc_layer(size_in, size_out):
    layer = nn.Sequential(nn.Linear(size_in, size_out), nn.BatchNorm1d(size_out), nn.ReLU())
    return layer


class VGGLite(nn.Module):
    def __init__(self, n_classes):
        super(VGGLite, self).__init__()

        # Conv blocks (BatchNorm + ReLU activation added in each block)
        # 512*512
        self.layer1 = vgg_conv_block([1, 32], [32, 32], [3, 3], [1, 1], 2, 2)
        # 256*256
        self.layer2 = vgg_conv_block([32, 64], [64, 64], [3, 3], [1, 1], 2, 2)
        # 128*128
        self.layer3 = vgg_conv_block([64, 96], [96, 96], [3, 3], [1, 1], 2, 2)
        # 64*64
        self.layer4 = vgg_conv_block([96, 128], [128, 128], [3, 3], [1, 1], 2, 2)
        # 32*32

        # FC layers
        self.layer5 = vgg_fc_layer(32 * 32 * 128, 512)
        self.layer6 = vgg_fc_layer(512, 512)

        # Final layer
        self.layer7 = nn.Sequential(nn.Linear(512, n_classes))#, nn.Softmax())

    def forward(self, x):
        out = self.layer1(x)
        out = self.layer2(out)
        out = self.layer3(out)
        vgglite_features = self.layer4(out)

        # Flatten
        out = vgglite_features.view(out.size(0), -1)

        out = self.layer5(out)
        out = self.layer6(out)
        out = self.layer7(out)

        return vgglite_features, out
