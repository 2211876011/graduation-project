import flask
import torch
import io
import os
from os import path
from PIL import Image
import torchvision

dirname__ = path.dirname(path.abspath(__file__))
import sys

sys.path.append(path.join(dirname__, '../../'))
sys.path.append(path.join(dirname__, '../../nova'))

APP_NAME = 'CTSR'
APP_PORT = 9090

from nova.lu_mwcnn.model_cpu import LUMWCNN_CPU

app = flask.Flask(APP_NAME)

weight_file = r'/mnt/zhuoxu/code/graduation-project/nova/lu_mwcnn/output_deeplesion/ckp/epoch_299.pth'
input_directory = r'/mnt/zhuoxu/code/graduation-project/platform/backend/input'
output_directory = r'/mnt/zhuoxu/code/graduation-project/platform/backend/output'

import random
import string
from time import time

sr_model = None


def gen_temp_name():
    def gen_random_string(length):
        return ''.join(random.sample(string.ascii_letters + string.digits, length))

    return '{}_{}'.format(str(int(time())), gen_random_string(8))


def load_model():
    model = LUMWCNN_CPU()
    model.load_state_dict(torch.load(weight_file))
    model.eval()
    print('----- SR Model loaded -----')
    return model


@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    global sr_model
    response = {'success': False}

    # save image to temp directory
    temp_basename = gen_temp_name()
    temp_filename = temp_basename + '.bmp'
    temp_filepath = os.path.join(input_directory, temp_filename)
    bmp_image_bin = io.BytesIO(flask.request.files['image'].read())
    with open(temp_filepath, 'wb') as f:
        f.write(bmp_image_bin.getvalue())

    # pre-process image for model
    image_pil = Image.open(temp_filepath).convert('L')
    image_tensor = torchvision.transforms.ToTensor()(image_pil).unsqueeze(0)  # add batch dim

    # go through the network
    image_out_tensor = sr_model(image_tensor).clamp(0, 1).detach().cpu().squeeze()  # 1-ch
    image_out_pil = torchvision.transforms.ToPILImage()(image_out_tensor)
    image_out_pil.save(path.join(output_directory, temp_filename))

    # make response
    response['success'] = True
    response['filename'] = temp_basename

    return flask.jsonify(response)


@app.route('/get_output', methods=['GET'])
def get_output():
    filename = flask.request.args.get('filename', type=str) + '.bmp'
    return flask.make_response(flask.send_from_directory(output_directory, filename, as_attachment=True))


@app.route('/ping', methods=['GET'])
def ping():
    return flask.jsonify({'success': True})


@app.route('/')
def index():
    return '/ GET 200 for {}'.format(APP_NAME)


@app.after_request
def cors(environ):
    environ.headers['Access-Control-Allow-Origin'] = '*'
    environ.headers['Access-Control-Allow-Method'] = '*'
    environ.headers['Access-Control-Allow-Headers'] = 'x-requested-with,content-type'
    return environ


if __name__ == '__main__':
    sr_model = load_model()
    app.run(host='0.0.0.0', port=APP_PORT)
