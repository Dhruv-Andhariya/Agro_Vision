const SectionTitle = ({ title, subtitle }) => {
  return (
    <div className="mb-12 text-center">
      <h2 className="text-4xl font-bold text-gray-900">{title}</h2>
      <p className="mt-3 text-gray-600">{subtitle}</p>
    </div>
  );
};

export default SectionTitle;