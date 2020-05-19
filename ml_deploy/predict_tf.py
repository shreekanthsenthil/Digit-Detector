# This is just for double check. If libraries are loaded before it will not reload.
from tensorflow.keras.models import load_model
import numpy as np
# import tensorflow as tf
from PIL import Image
import sys
import re
from io import BytesIO
import base64

# These lines are written in setup which should be run earlier.

# You need to give me these two paths relative to your server.
# MODEL_PATH will not change. But everytime you need to give me the image path.
# I think we need to use sys.argv[] to take the paths. Do let me know.

# Paths are working fine Run the code from digit detector as follows
# python .\ml_deploy\predict_tf.py
# You need to adjust the relative paths if it is running wrong. As per node requirements.

# MODEL_PATH = "ml_code\\model.h5"
MODEL_PATH = "ml_code\\best_model"
IMAGE_PATH = "uploads\\images\\correct\\image_1_real_7.png"

def softmax(x):
    x = x.astype(np.float32)
    # print(x.dtype)
    """Compute softmax values for each sets of scores in x."""
    e_x = np.exp(x - np.max(x))
    return e_x / e_x.sum(axis=0) # only difference

def predict_image(model_path, image):
    final_model = load_model(
        model_path, custom_objects=None, compile=True
    )
    # img = Image.Open(IMAGE_PATH)
    # img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
    # img = cv2.resize(img, (28, 28))
    # img = np.array(img)
    # # print(img.shape)
    # img = tf.io.decode_png()
    #img = Image.open(IMAGE_PATH).convert('L')
    image_data = re.sub('^data:image/.+;base64,', '', image)
    img = Image.open(BytesIO(base64.b64decode(image_data)))
    img = img.convert('L')
    # img = img.resize(28, 28)
    img = img.resize((28, 28))
    img = np.array(img)
    img = np.expand_dims(img, axis=-1)
    img = np.expand_dims(img, axis=0)
    # print(img.shape)

    out = final_model.predict(img)
    # print(out.dtype)
    # The digit with highest probability
    probability = softmax(out[0])
    # print(probability)
    return (np.argmax(probability), np.max(probability))

if __name__ == "__main__":
    # IMAGE_PATH = sys.argv[1]    
    # print(IMAGE_PATH)
    # print("Not over YET")
    #print("-----------------Running MODEL----------------")
    IMAGE = sys.argv[1]
    prediction, probability = predict_image(MODEL_PATH, IMAGE)
    #Confidence
    print("%0.4f" %(probability))
    #Prediction
    print("%d" %(prediction))
    #print("----------Done--------------------------------")
