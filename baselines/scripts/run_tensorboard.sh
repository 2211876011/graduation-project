if [ "$1" = "" ] || [ "$2" = "" ]; then
  echo "Please specify \$1 and \$2."
  exit
fi

tensorboard --logdir="../outputs_$1/$2/tensorboard/" --bind_all