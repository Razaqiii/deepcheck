from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from PIL import Image
import io
import os
import tensorflow as tf
import cv2 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def build_xception():
    print("Building Xception Shell...")
    try:
        base = tf.keras.applications.Xception(include_top=False, weights=None, input_shape=(299, 299, 3))
        model = tf.keras.Sequential([
            base,
            tf.keras.layers.GlobalAveragePooling2D(),
            tf.keras.layers.Dense(512, activation='relu'),
            tf.keras.layers.Dropout(0.5),
            tf.keras.layers.Dense(1, activation='sigmoid')
        ])
        model.build((None, 299, 299, 3))
        return model
    except Exception as e:
        print(f"Error building Xception: {e}")
        return None

def build_mobilenet():
    print("Building MobileNet Shell...")
    try:
        base = tf.keras.applications.MobileNetV2(include_top=False, weights=None, input_shape=(224, 224, 3))
        model = tf.keras.Sequential([
            base,
            tf.keras.layers.GlobalAveragePooling2D(),
            tf.keras.layers.Dense(128, activation='relu'),
            tf.keras.layers.Dropout(0.5),
            tf.keras.layers.Dense(1, activation='sigmoid')
        ])
        model.build((None, 224, 224, 3))
        return model
    except Exception as e:
        print(f"Error building MobileNet: {e}")
        return None

models_cache = {}

def load_weights_safely(model_builder, filename, name):
    path = os.path.join(BASE_DIR, filename)
    if not os.path.exists(path):
        print(f"WARNING: {filename} not found.")
        return None
    
    model = model_builder()
    if model:
        print(f"Loading weights for {name}...")
        try:
            model.load_weights(path)
            print(f"SUCCESS: {name} Loaded.")
            return model
        except Exception as e:
            print(f"FAILED to load weights for {name}: {e}")
    return None

models_cache["Xception"] = load_weights_safely(build_xception, "xception.keras", "Xception")
models_cache["MobileNet"] = load_weights_safely(build_mobilenet, "mobilenet.keras", "MobileNet")

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def get_face_crop(image_bytes):
    img = Image.open(io.BytesIO(image_bytes))
    if img.mode != "RGB":
        img = img.convert("RGB")
    
    img_np = np.array(img)
    gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    
    if len(faces) > 0:
        (x, y, w, h) = faces[0]
        margin = 0.4
        x = max(0, int(x - w * margin))
        y = max(0, int(y - h * margin))
        w = int(w * (1 + margin * 2))
        h = int(h * (1 + margin * 2))
        return img.crop((x, y, x + w, y + h))
    return img

def preprocess(img_pil, model_type):
    target_size = (299, 299) if model_type == "Xception" else (224, 224)
    img = img_pil.resize(target_size)
    arr = np.array(img)
    
    if model_type == "Xception":
        # Xception: -1 to 1
        arr = (arr / 127.5) - 1.0
    else:
        # MobileNet: 0 to 1
        arr = arr.astype(np.float32) / 255.0
        
    return np.expand_dims(arr, axis=0)

@app.post("/predict")
async def predict(
    model_type: str = Form(...),
    file: UploadFile = File(...)
):
    selected_model = models_cache.get(model_type)
    if selected_model is None:
        return {"error": f"Model '{model_type}' is not loaded."}

    contents = await file.read()
    
    try:
        face = get_face_crop(contents)
        
        processed_data = preprocess(face, model_type)
        
        prediction = selected_model(processed_data, training=False)
        score = float(prediction[0][0])
        
        print(f"DEBUG: Model={model_type} || Score={score:.4f}")
        
        is_fake = score < 0.7
        confidence = score if not is_fake else 1 - score
        
        return {
            "is_fake": is_fake,
            "confidence": confidence,
            "model_used": model_type
        }
    except Exception as e:
        return {"error": str(e)}