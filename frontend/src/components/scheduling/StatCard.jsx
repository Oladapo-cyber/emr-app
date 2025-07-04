const StatCard = ({ title, value, color }) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="text-xs text-gray-500 uppercase tracking-wider">
        {title}
      </div>
      <div className={`text-2xl font-bold text-${color}-600 mt-1`}>{value}</div>
    </div>
  );
};

export default StatCard;
