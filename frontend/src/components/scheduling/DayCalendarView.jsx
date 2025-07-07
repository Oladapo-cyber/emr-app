import { AccessTime } from "@mui/icons-material";

const DayCalendarView = ({ selectedDate, appointments }) => {
  // Generate time slots (hourly from 8am to 6pm)
  const timeSlots = Array.from({ length: 11 }, (_, i) => i + 8);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 gap-2">
        {timeSlots.map((hour) => {
          const hourFormatted =
            hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
          const appts = appointments.filter((a) => {
            const apptHour = new Date(a.date).getHours();
            return (
              selectedDate.toDateString() === a.date.toDateString() &&
              apptHour === hour
            );
          });

          return (
            <div key={hour} className="flex gap-2">
              <div className="w-20 py-2 text-gray-500 text-sm flex items-center">
                <AccessTime fontSize="small" className="mr-1" />
                {hourFormatted}
              </div>
              <div className="flex-1 min-h-16 border border-gray-200 rounded-md p-1 bg-gray-50">
                {appts.map((appt) => (
                  <div
                    key={appt.id}
                    className="bg-blue-100 border-l-4 border-blue-600 p-2 mb-1 rounded text-sm"
                  >
                    <div className="font-medium">{appt.patientName}</div>
                    <div className="text-xs text-gray-500">
                      {appt.type} • {appt.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DayCalendarView;
