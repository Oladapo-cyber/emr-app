import { Edit, Delete } from "@mui/icons-material";

const AppointmentActions = ({ appointment, onEdit, onDelete }) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onEdit(appointment)}
        className="p-1 text-blue-600 hover:bg-blue-50 rounded-full"
        title="Edit appointment"
      >
        <Edit fontSize="small" />
      </button>
      <button
        onClick={() => onDelete(appointment.id)}
        className="p-1 text-red-600 hover:bg-red-50 rounded-full"
        title="Cancel appointment"
      >
        <Delete fontSize="small" />
      </button>
    </div>
  );
};

export default AppointmentActions;
