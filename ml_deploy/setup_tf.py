# Run This script when your server will start
# If it does not return 0. that means that librarires are not loaded.

def setup_server():
    try:
        import cv2
        import sys
        from tensorflow.keras.models import load_model
        import numpy as np
        print("Libraries Sucessfully loaded")
        return 0
    
    except Exception as e:
        print("FAILED TO LOAD LIBRARIES")
        # Returning non zero exit code that means server is not setup properly
        return 1
    

if __name__ == "__main__":
    v = setup_server()    
    print(v)
