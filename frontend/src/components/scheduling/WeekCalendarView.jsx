const WeekCalendarView = ({
  getDatesForView,
  selectedDate,
  setSelectedDate,
  appointments,
}) => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-7 gap-2">
        {getDatesForView().map((date, index) => {
          const isToday = date.toDateString() === new Date().toDateString();
          const isSelected =
            date.toDateString() === selectedDate.toDateString();
          const day = date.toLocaleDateString("en-US", {
            weekday: "short",
          });

          // Count appointments for this date
          const appointmentsForDate = appointments.filter(
            (appt) => appt.date.toDateString() === date.toDateString()
          );

          return (
            <div
              key={index}
              onClick={() => setSelectedDate(date)}
              className={`
				  cursor-pointer p-2 border rounded-md
				  ${isToday ? "border-blue-500" : "border-gray-100"}
				  ${isSelected ? "bg-blue-100" : ""}
				  hover:bg-blue-50 transition-colors
				`}
            >
              <div className="text-center">
                <div className="text-xs text-gray-500">{day}</div>
                <div
                  className={`text-lg font-medium ${
                    isToday ? "text-blue-500" : ""
                  }`}
                >
                  {date.getDate()}
                </div>
              </div>

              <div className="mt-2 space-y-1">
                {appointmentsForDate.slice(0, 2).map((appt) => (
                  <div
                    key={appt.id}
                    className="text-xs bg-blue-50 text-blue-700 p-1 rounded truncate"
                  >
                    {appt.time} - {appt.patientName.split(" ")[0]}
                  </div>
                ))}
                {appointmentsForDate.length > 2 && (
                  <div className="text-xs text-center text-blue-600">
                    +{appointmentsForDate.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekCalendarView;
