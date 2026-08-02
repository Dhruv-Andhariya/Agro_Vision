const PredictionCard = ({ prediction }) => {
  return (
    <div className="rounded-2xl border border-green-100 bg-white p-5 transition hover:shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">
          {prediction.predictedClass}
        </h3>

        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
          {prediction.confidence}%
        </span>
      </div>

      <p className="mt-4 text-gray-600">
        {prediction.treatment}
      </p>

      <p className="mt-5 text-sm text-gray-400">
        {new Date(prediction.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default PredictionCard;