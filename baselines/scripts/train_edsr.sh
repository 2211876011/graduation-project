# train EDSR baseline

if [ "$1" = "" ]; then
  echo "Please specify \$1."
  exit
fi

cd "../trains_${1}"

# specify CUDA card(s) here
CUDA_VISIBLE_DEVICES=2 python edsr.py
