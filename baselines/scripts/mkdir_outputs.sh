# prepare directories for outputs

cd ../outputs

# dwsr
echo "[making DWSR]..."
rm -rf dwsr
mkdir dwsr
cd dwsr
mkdir ckp
mkdir tensorboard
mkdir val_inference
cd ..

# edsr
echo "[making EDSR]..."
rm -rf edsr
mkdir edsr
cd edsr
mkdir ckp
mkdir tensorboard
mkdir val_inference
cd ..

# espcn
echo "[making ESPCN]..."
rm -rf espcn
mkdir espcn
cd espcn
mkdir ckp
mkdir tensorboard
mkdir val_inference
cd ..

echo "mkdir_outputs done."
