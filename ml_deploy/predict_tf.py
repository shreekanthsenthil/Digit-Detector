# This is just for double check. If libraries are loaded before it will not reload.
import cv2
from tensorflow.keras.models import load_model
import numpy as np
import sys
# import json

# These lines are written in setup which should be run earlier.

# You need to give me these two paths relative to your server.
# MODEL_PATH will not change. But everytime you need to give me the image path.
# I think we need to use sys.argv[] to take the paths. Do let me know.

# Paths are working fine Run the code from digit detector as follows
# python .\ml_deploy\predict_tf.py
# You need to adjust the relative paths if it is running wrong. As per node requirements.

# MODEL_PATH = "ml_code\\model.h5"
MODEL_PATH = "ml_code\\best_model"
IMAGE_PATH = "uploads\\demo.png"

def softmax(x):
    x = x.astype(np.float32)
    # print(x.dtype)
    """Compute softmax values for each sets of scores in x."""
    e_x = np.exp(x - np.max(x))
    return e_x / e_x.sum(axis=0) # only difference

def predict_image(model_path, img_path):
    final_model = load_model(
        model_path, custom_objects=None, compile=True
    )
    img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, (28, 28))
    img = np.array(img)
    img = np.expand_dims(img, axis=-1)
    img = np.expand_dims(img, axis=0)
    #print(img.shape)
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
    print("-----------------Running MODEL----------------")
    prediction, probability = predict_image(MODEL_PATH, IMAGE_PATH)
    print("Confidence: %0.4f" %(probability))
    print("Prediction: %d" %(prediction))
    print("----------Done--------------------------------")
