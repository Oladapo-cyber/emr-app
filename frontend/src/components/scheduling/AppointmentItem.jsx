import { AccessTime, Person, MoreVert } from "@mui/icons-material";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

const AppointmentItem = ({ appointment, formatDate }) => {
  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div className="bg-blue-50 text-blue-600 h-12 w-12 rounded-lg flex flex-col items-center justify-center text-center">
            <AccessTime fontSize="small" />
            <div className="text-xs font-medium mt-1">{appointment.time}</div>
          </div>

          <div>
            <Link
              to={`/patients/patient-details?id=${appointment.patientId}`}
              className="font-medium text-gray-900 hover:text-blue-600"
            >
              {appointment.patientName}
            </Link>
            <div className="text-xs text-gray-500 mt-0.5">
              {appointment.type} • {formatDate(appointment.date)}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <StatusBadge status={appointment.status} />
              <span className="text-xs text-gray-500">
                {appointment.doctor}
              </span>
            </div>
            {appointment.notes && (
              <div className="mt-2 text-sm text-gray-600">
                {appointment.notes}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Link
            to={`/patients/patient-details?id=${appointment.patientId}`}
            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <Person fontSize="small" />
          </Link>
          <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <MoreVert fontSize="small" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentItem;
