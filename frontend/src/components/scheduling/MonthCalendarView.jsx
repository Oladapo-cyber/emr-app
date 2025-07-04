const MonthCalendarView = ({
  getDatesForView,
  selectedDate,
  setSelectedDate,
  appointments,
}) => {
  return (
    <div className="p-4">
      {/* Calendar Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {getDatesForView().map((date, index) => {
          const isToday = date.toDateString() === new Date().toDateString();
          const isSelected =
            date.toDateString() === selectedDate.toDateString();
          const isCurrentMonth = date.getMonth() === selectedDate.getMonth();

          // Count appointments for this date
          const appointmentsForDate = appointments.filter(
            (appt) => appt.date.toDateString() === date.toDateString()
          ).length;

          return (
            <div
              key={index}
              onClick={() => setSelectedDate(date)}
              className={`
				  cursor-pointer h-16 p-1 border rounded-md flex flex-col items-center justify-center
				  ${isToday ? "border-blue-500" : "border-gray-100"}
				  ${isSelected ? "bg-blue-100" : ""}
				  ${!isCurrentMonth ? "text-gray-300" : ""}
				  hover:bg-blue-50 transition-colors
				`}
            >
              <div
                className={`w-7 h-7 flex items-center justify-center rounded-full ${
                  isToday ? "bg-blue-500 text-white" : ""
                }`}
              >
                {date.getDate()}
              </div>
              {appointmentsForDate > 0 && (
                <div className="text-xs mt-1 text-blue-600 font-medium">
                  {appointmentsForDate} appt
                  {appointmentsForDate > 1 ? "s" : ""}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthCalendarView;
