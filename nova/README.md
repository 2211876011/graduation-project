# nova

改进模型与创新点。

## lu_mwcnn

小波 U-Net + 多任务学习，超越 baseline。

```bash
$ chmod 755 *.sh
$ ./trian_div2k.sh # ./train_deeplesion.sh
```

## ct_lpips

CT 图的感知损失（使用轻量化的类 VGG 网络）。

```bash
$ chmod 755 *.sh
$ ./trian.sh
```

## ablation

消融实验相关。

```bash
$ chmod 755 *.sh
$ ./train_div2k.sh
$ ./test_manual.sh
```

