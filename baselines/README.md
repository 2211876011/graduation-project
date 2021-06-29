# baselines

- 修改 `config/common.py`，选择数据集和输出路径。目前提供的数据集接口有
  - div2k.DIV2KDataset
  - deeplesion.DeepLesionDataset

- 训练

  ```bash
  $ cd script
  $ chmod 755 *
  $ ./train_dwsr.sh div2k # ./train_<model>.sh <data>
  # 修改脚本可以指定 GPU 编号
  ```

- 验证结果、权重、TensorBoard 日志会输出在 `output_<data>/<model>`下
