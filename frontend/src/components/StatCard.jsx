const StatCard = ({ title, value, color, icon }) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className={`text-${color}-600`}>{icon}</span>}
        <div className="text-xs text-gray-500 uppercase tracking-wider">
          {title}
        </div>
      </div>
      <div className={`text-2xl font-bold text-${color}-600 mt-1`}>{value}</div>
    </div>
  );
};

export default StatCard;
