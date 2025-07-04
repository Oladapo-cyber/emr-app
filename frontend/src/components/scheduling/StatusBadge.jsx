import { Check, Schedule, Close } from "@mui/icons-material";

const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      case "Completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Confirmed":
        return <Check className="text-green-500" fontSize="small" />;
      case "Pending":
        return <Schedule className="text-yellow-500" fontSize="small" />;
      case "Cancelled":
        return <Close className="text-red-500" fontSize="small" />;
      case "Completed":
        return <Check className="text-blue-500" fontSize="small" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
        status
      )}`}
    >
      {getStatusIcon(status)} {status}
    </span>
  );
};

export default StatusBadge;
