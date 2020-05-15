# Run This script when your server will start
# If it does not return 0. that means that librarires are not loaded.

def setup_server():
    try:
        import sys
        # import tensorflow as tf
        from PIL import Image
        from tensorflow.keras.models import load_model
        import numpy as np
        return 1
    
    except Exception as e:
        # Returning zero exit code that means server is not setup properly
        return 0
    

if __name__ == "__main__":
    v = setup_server()    
    print(v)
