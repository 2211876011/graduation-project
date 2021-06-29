'''
    基线模型通用配置
'''

opt = {
    # 数据集
    'train_dir': r'/mnt/zhuoxu/datasets/DIV2K_HR/train/',
    'val_dir': r'/mnt/zhuoxu/datasets/DIV2K_HR/val/',
    # 'train_dir': r'/mnt/zhuoxu/datasets/deeplesion_split/sr/train/',
    # 'val_dir': r'/mnt/zhuoxu/datasets/deeplesion_split/sr/val/',
    
    'dataset_interface': 'div2k.DIV2KDataset',
    # 'dataset_interface': 'deeplesion.DeepLesionDataset',

    # 数据预处理
    'crop_size': 128,
    'noise_std': 5.0,
    
    # 数据加载
    'num_workers': 16,
    
    # 结果输出
    'output_path': r'/mnt/zhuoxu/code/graduation-project/baselines/outputs_div2k'
}
