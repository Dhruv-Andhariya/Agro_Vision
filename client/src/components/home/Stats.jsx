const stats = [
  { value: "800+", label: "Training Images" },
  { value: "74.19%", label: "Validation Accuracy" },
  { value: "4", label: "Disease Classes" },
  { value: "5+", label: "Supported Crops" },
];

const Stats = () => {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl border border-green-100 bg-green-50 p-8 text-center shadow-md transition hover:-translate-y-2 hover:shadow-xl"
            >
              <h2 className="text-5xl font-bold text-green-600">
                {item.value}
              </h2>

              <p className="mt-3 text-gray-600">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;