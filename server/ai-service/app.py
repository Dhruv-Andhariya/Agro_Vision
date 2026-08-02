from fastapi import FastAPI, UploadFile, File
import tensorflow as tf
import numpy as np
import cv2

from classes import CLASS_NAMES, TREATMENTS

app = FastAPI()

print("Loading AgroVision AI Model...")
model = tf.keras.models.load_model("model/agroguard_model.keras")
print("✅ Model Loaded Successfully")


@app.get("/")
def home():
    return {
        "message": "AgroVision AI Service Running 🚀",
        "model": "Loaded"
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()

    image = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)

    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = cv2.resize(image, (224, 224))

    image = image.astype(np.float32) / 255.0
    image = np.expand_dims(image, axis=0)

    prediction = model.predict(image)[0]

    index = np.argmax(prediction)

    disease = CLASS_NAMES[index]
    confidence = float(prediction[index]) * 100

    return {
        "disease": disease,
        "confidence": round(confidence, 2),
        "treatment": TREATMENTS[disease]
    }