import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import ImageUpload from "../components/predict/ImageUpload";
import PredictionResult from "../components/predict/PredictionResult";
import { predictDisease } from "../services/predictionService";

const Predict = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const handlePredict = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    try {
      const data = await predictDisease(formData);

setResult({
  disease: data.prediction.predictedClass,
  confidence: data.prediction.confidence,
  treatment: data.prediction.treatment,
});
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MainLayout>
      <section className="min-h-screen bg-green-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="mb-12 text-center text-5xl font-bold">
            Crop Disease Detection
          </h1>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <ImageUpload image={image} setImage={setImage} />

              <button
                onClick={handlePredict}
                className="w-full rounded-xl bg-green-600 py-4 text-lg font-semibold text-white hover:bg-green-700"
              >
                Predict Disease
              </button>
            </div>

            <PredictionResult result={result} />
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Predict;