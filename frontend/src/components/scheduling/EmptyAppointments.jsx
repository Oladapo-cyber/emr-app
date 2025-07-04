import { CalendarToday, Add } from "@mui/icons-material";

const EmptyAppointments = ({ viewMode, formatDate, selectedDate }) => {
  return (
    <div className="text-center py-12">
      <CalendarToday
        className="mx-auto text-gray-300 mb-4"
        sx={{ fontSize: 48 }}
      />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No appointments found
      </h3>
      <p className="text-gray-500">
        {viewMode === "day"
          ? `No appointments scheduled for ${formatDate(selectedDate)}`
          : "No appointments match your filters"}
      </p>
      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
        <Add fontSize="small" /> Schedule New Appointment
      </button>
    </div>
  );
};

export default EmptyAppointments;
