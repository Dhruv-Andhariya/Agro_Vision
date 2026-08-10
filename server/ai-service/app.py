from pathlib import Path
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import tensorflow as tf
import numpy as np
import cv2

from classes import CLASS_NAMES, TREATMENTS

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model" / "agroguard_model.keras"

app = FastAPI()

print(f"Loading AgroVision AI Model from {MODEL_PATH}...")
model = tf.keras.models.load_model(str(MODEL_PATH))
print("✅ Model Loaded Successfully")


def is_plant_like(image):
    if image is None:
        return False

    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(hsv)
    green_mask = ((h >= 35) & (h <= 85)) & (s >= 30) & (v >= 40)
    green_ratio = float(green_mask.mean())

    return green_ratio > 0.03


@app.get("/")
def home():
    return {
        "message": "AgroVision AI Service Running 🚀",
        "model": "Loaded"
    }


@app.post("/predict")
async def predict(file: UploadFile | None = None, image: UploadFile | None = None):
    upload = file or image

    if upload is None:
        return JSONResponse(status_code=422, content={
            "disease": "Unknown",
            "confidence": 0,
            "treatment": "No image file was received."
        })

    image_bytes = await upload.read()

    image = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)

    if image is None:
        return JSONResponse(status_code=400, content={
            "disease": "Unknown",
            "confidence": 0,
            "treatment": "Please upload a valid image file."
        })

    if not is_plant_like(image):
        return JSONResponse(status_code=422, content={
            "disease": "Unknown",
            "confidence": 0,
            "treatment": "Please upload a clear photo of a plant leaf or crop. This model works best on leaf images."
        })

    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = cv2.resize(image, (224, 224))

    image = image.astype(np.float32) / 255.0
    image = np.expand_dims(image, axis=0)

    prediction = model.predict(image)[0]

    index = np.argmax(prediction)

    disease = CLASS_NAMES[index]
    confidence = float(prediction[index]) * 100

    if confidence < 60:
        return {
            "disease": "Unknown",
            "confidence": round(confidence, 2),
            "treatment": "Prediction confidence is too low. Please upload a clearer photo of a plant leaf."
        }

    return {
        "disease": disease,
        "confidence": round(confidence, 2),
        "treatment": TREATMENTS[disease]
    }