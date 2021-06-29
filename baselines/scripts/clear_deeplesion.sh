if [ "$1" = "" ]; then
  echo "Please specify \$1."
  exit
fi

cd ../outputs_deeplesion
cd "$1"

cd ckp
rm *
cd ../tensorboard
rm *
cd ../val_inference
rm *