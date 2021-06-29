def get_param_count(net):
    trainable = sum(p.numel() for p in net.parameters() if p.requires_grad)
    total = sum(p.numel() for p in net.parameters())
    return {'trainable': trainable, 'total': total}


# print(get_param_count(LUMWCNN()))