const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`rounded-2xl border border-white/20 bg-white/70 p-6 shadow-lg backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;