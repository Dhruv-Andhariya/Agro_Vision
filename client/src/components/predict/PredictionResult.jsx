const PredictionResult = ({ result }) => {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl">
      <h2 className="mb-8 text-3xl font-bold">
        Prediction Result
      </h2>

      <div className="space-y-5">
        <div className="rounded-xl bg-green-50 p-5">
          <p className="text-gray-500">Disease</p>
          <h3 className="text-2xl font-bold text-green-600">
            {result?.disease || "--"}
          </h3>
        </div>

        <div className="rounded-xl bg-green-50 p-5">
          <p className="text-gray-500">Confidence</p>
          <h3 className="text-2xl font-bold">
            {result ? `${result.confidence}%` : "--"}
          </h3>
        </div>

        <div className="rounded-xl bg-green-50 p-5">
          <p className="text-gray-500">Treatment</p>
          <p className="mt-2 text-gray-600">
            {result?.treatment || "Upload an image to get prediction."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;