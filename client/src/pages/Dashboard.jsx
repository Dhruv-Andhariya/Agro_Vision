import { Link } from "react-router-dom";
import PredictionCard from "../components/dashboard/PredictionCard";
import MainLayout from "../components/layout/MainLayout";
import { useEffect, useState } from "react";
import { getPredictionHistory } from "../services/predictionService";
const Dashboard = () => {
  const [predictions, setPredictions] = useState([]);
const [loading, setLoading] = useState(true);
useEffect(() => {
  const fetchHistory = async () => {
    try {
      const data = await getPredictionHistory();
      setPredictions(data.predictions);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchHistory();
}, []);
const averageConfidence =
  predictions.length > 0
    ? (
        predictions.reduce(
          (sum, prediction) => sum + prediction.confidence,
          0
        ) / predictions.length
      ).toFixed(1)
    : 0;
  return (
    <MainLayout>
      <div className="min-h-screen bg-green-50">
        <div className="mx-auto max-w-7xl px-6 py-10">

          {/* Header */}
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                Dashboard
              </h1>
              <p className="mt-2 text-gray-500">
                Welcome back! Monitor your crop health with AI.
              </p>
            </div>

            <Link
              to="/predict"
              className="rounded-xl bg-green-600 px-6 py-3 text-white transition hover:bg-green-700"
            >
              + Scan Crop
            </Link>
          </div>

          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-gray-500">Total Scans</p>
              <h2 className="mt-2 text-4xl font-bold text-green-600">
                {predictions.length}
              </h2>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-gray-500">Healthy Crops</p>
              <h2 className="mt-2 text-4xl font-bold text-green-600">
                {
  predictions.filter(
    (item) => item.predictedClass === "Healthy"
  ).length
}
              </h2>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-gray-500">Diseases Detected</p>
              <h2 className="mt-2 text-4xl font-bold text-red-500">
                {
  predictions.filter(
    (item) => item.predictedClass !== "Healthy"
  ).length
}
              </h2>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-gray-500">Accuracy</p>
              <h2 className="mt-2 text-4xl font-bold text-blue-600">
                {averageConfidence}%
              </h2>
            </div>

          </div>

          {/* Recent Predictions */}
          <div className="mt-10 rounded-2xl bg-white p-8 shadow-sm">

            <h2 className="mb-6 text-2xl font-bold">
              Recent Predictions
            </h2>

            {loading ? (
  <div className="py-20 text-center">
    Loading...
  </div>
) : predictions.length === 0 ? (
  <div className="rounded-xl border border-dashed py-20 text-center text-gray-500">
    No predictions yet.
    <br />
    Start by scanning your first crop.
  </div>
) : (
  <div className="grid gap-5 md:grid-cols-2">
    {predictions.map((prediction) => (
      <PredictionCard
        key={prediction._id}
        prediction={prediction}
      />
    ))}
  </div>
)}

          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;