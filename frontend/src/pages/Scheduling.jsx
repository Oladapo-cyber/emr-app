import { useState, useEffect } from "react";
import {
  CalendarToday,
  Today,
  Event,
  Schedule,
  Person,
  Search,
  Add,
  FilterList,
  AccessTime,
  MoreVert,
  Check,
  Close,
} from "@mui/icons-material";
import DayCalendarView from "../components/scheduling/DayCalendarView";
import { Link } from "react-router-dom";

// Import components
import StatusBadge from "../components/scheduling/StatusBadge";
import AppointmentItem from "../components/scheduling/AppointmentItem";
import MonthCalendarView from "../components/scheduling/MonthCalendarView";
import WeekCalendarView from "../components/scheduling/WeekCalendarView";
import StatCard from "../components/StatCard";
import FilterBar from "../components/scheduling/FilterBar";
import EmptyAppointments from "../components/scheduling/EmptyAppointments";
import NewAppointmentModal from "../components/modals/NewAppointmentModal";
import AdvancedSearch from "../components/scheduling/AdvancedSearch";
import { appointmentService } from "../services";

const Scheduling = () => {
  // State management
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [viewMode, setViewMode] = useState("day"); // day, week, month
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);
  
  // Data states
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Stats
  const [stats, setStats] = useState({
    today: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0
  });

  // Fetch appointments on mount and when filters change
  useEffect(() => {
    fetchAppointments();
  }, [selectedDate, viewMode, search, filterStatus]);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (viewMode === "day") {
        // Fetch appointments for selected day
        const dateStr = selectedDate.toISOString().split('T')[0];
        response = await appointmentService.getAppointments({
          date: dateStr,
          status: filterStatus === 'All' ? undefined : filterStatus.toLowerCase(),
          limit: 100
        });
      } else if (viewMode === "week") {
        // Fetch appointments for the week
        const startDate = new Date(selectedDate);
        startDate.setDate(startDate.getDate() - startDate.getDay());
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        
        response = await appointmentService.getAppointmentsByDateRange(
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0]
        );
      } else {
        // Fetch appointments for the month
        const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        const endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
        
        response = await appointmentService.getAppointmentsByDateRange(
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0]
        );
      }

      // Transform API data to match component format
      const transformedAppointments = (response.data || []).map(appt => ({
        id: appt._id,
        patientName: `${appt.patient?.firstName || ''} ${appt.patient?.lastName || ''}`,
        patientId: appt.patient?._id || appt.patient,
        time: appt.appointmentTime?.start || '',
        duration: appt.duration || 30,
        date: new Date(appt.appointmentDate),
        type: formatAppointmentType(appt.appointmentType),
        doctor: `${appt.provider?.firstName || 'Dr.'} ${appt.provider?.lastName || 'Unknown'}`,
        notes: appt.reasonForVisit || '',
        status: capitalizeFirstLetter(appt.status)
      }));

      // Filter by search term if provided
      let filteredData = transformedAppointments;
      if (search) {
        filteredData = transformedAppointments.filter(appt =>
          appt.patientName.toLowerCase().includes(search.toLowerCase()) ||
          appt.doctor.toLowerCase().includes(search.toLowerCase()) ||
          appt.type.toLowerCase().includes(search.toLowerCase())
        );
      }

      setAppointments(filteredData);
      
      // Calculate stats
      const today = new Date().toDateString();
      setStats({
        today: filteredData.filter(a => a.date.toDateString() === today).length,
        confirmed: filteredData.filter(a => a.status === 'Confirmed').length,
        pending: filteredData.filter(a => a.status === 'Pending').length,
        cancelled: filteredData.filter(a => a.status === 'Cancelled').length
      });

    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const formatAppointmentType = (type) => {
    if (!type) return 'Consultation';
    return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const capitalizeFirstLetter = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };



  // Generate dates for the calendar view
  const getDatesForView = () => {
    const dates = [];

    if (viewMode === "day") {
      // Just return the selected date
      return [selectedDate];
    } else if (viewMode === "week") {
      // Get the week view (7 days starting from Sunday/Monday of the week)
      const firstDay = new Date(selectedDate);
      const day = selectedDate.getDay();
      const diff = selectedDate.getDate() - day;
      firstDay.setDate(diff);

      for (let i = 0; i < 7; i++) {
        const date = new Date(firstDay);
        date.setDate(firstDay.getDate() + i);
        dates.push(date);
      }
    } else if (viewMode === "month") {
      // Get the month view
      const firstDay = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1
      );
      const lastDay = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0
      );

      // Add days from previous month to fill the first week
      const firstDayOfWeek = firstDay.getDay();
      for (let i = firstDayOfWeek; i > 0; i--) {
        const date = new Date(firstDay);
        date.setDate(firstDay.getDate() - i);
        dates.push(date);
      }

      // Add all days of the current month
      for (let i = 0; i < lastDay.getDate(); i++) {
        const date = new Date(firstDay);
        date.setDate(firstDay.getDate() + i);
        dates.push(date);
      }

      // Add days from next month to complete the grid (6 rows x 7 days = 42)
      const remainingDays = 42 - dates.length;
      for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(lastDay);
        date.setDate(lastDay.getDate() + i);
        dates.push(date);
      }
    }

    return dates;
  };

  // Filter appointments based on selected date and search/filter criteria
  const filteredAppointments = appointments.filter((appointment) => {
    // Filter by date (only for day view)
    const isSameDate =
      viewMode === "day" &&
      appointment.date.toDateString() === selectedDate.toDateString();

    // Filter by search term
    const matchesSearch =
      appointment.patientName.toLowerCase().includes(search.toLowerCase()) ||
      appointment.doctor.toLowerCase().includes(search.toLowerCase()) ||
      appointment.type.toLowerCase().includes(search.toLowerCase());

    // Filter by status
    const matchesStatus =
      filterStatus === "All" || appointment.status === filterStatus;

    return (viewMode !== "day" || isSameDate) && matchesSearch && matchesStatus;
  });

  // Format date display
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle saving a new appointment
  const handleSaveAppointment = async (appointmentData) => {
    try {
      if (editingAppointmentId) {
        // Update existing appointment
        await appointmentService.updateAppointment(editingAppointmentId, appointmentData);
        setEditingAppointmentId(null);
      } else {
        // Create new appointment
        await appointmentService.createAppointment(appointmentData);
      }
      
      // Refresh appointments list
      await fetchAppointments();
      setShowModal(false);
    } catch (err) {
      console.error('Failed to save appointment:', err);
      alert(`Failed to save appointment: ${err.message}`);
    }
  };

  // Handler for editing appointments
  const handleEditAppointment = (appointment) => {
    setEditingAppointmentId(appointment.id);
    setShowModal(true);
  };

  // Handler for deleting appointments
  const handleDeleteAppointment = async (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await appointmentService.cancelAppointment(appointmentId, "Cancelled by user");
        // Refresh appointments list
        await fetchAppointments();
      } catch (err) {
        console.error('Failed to cancel appointment:', err);
        alert(`Failed to cancel appointment: ${err.message}`);
      }
    }
  };

  // Handle advanced search
  const handleAdvancedSearch = (params) => {
    setSearch(params.term || "");
    setFilterStatus(params.status || "All");
    // Additional filtering logic could be implemented here
  };

  // Loading state
  if (loading && appointments.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Failed to load appointments: {error}</p>
          <button 
            onClick={fetchAppointments}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scheduling</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage appointments and scheduling
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setSelectedDate(new Date())}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Today fontSize="small" />
            Today
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Add fontSize="small" />
            New Appointment
          </button>
        </div>
      </div>

      {/* Calendar View Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="text-lg font-medium">
            {selectedDate.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(newDate.getDate() - 1);
                setSelectedDate(newDate);
              }}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(newDate.getDate() + 1);
                setSelectedDate(newDate);
              }}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("day")}
            className={`px-4 py-2 rounded-md ${
              viewMode === "day"
                ? "bg-blue-100 text-blue-700 border border-blue-200"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Day
          </button>
          <button
            onClick={() => setViewMode("week")}
            className={`px-4 py-2 rounded-md ${
              viewMode === "week"
                ? "bg-blue-100 text-blue-700 border border-blue-200"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setViewMode("month")}
            className={`px-4 py-2 rounded-md ${
              viewMode === "month"
                ? "bg-blue-100 text-blue-700 border border-blue-200"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}

      <AdvancedSearch onSearch={handleAdvancedSearch} />

      {/* Calendar and Appointments View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Component */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4 flex items-center">
            <CalendarToday className="text-blue-500 mr-2" fontSize="small" />
            <h3 className="text-lg font-medium">Calendar</h3>
          </div>

          {viewMode === "day" && (
            <DayCalendarView
              selectedDate={selectedDate}
              appointments={appointments}
            />
          )}

          {viewMode === "month" && (
            <MonthCalendarView
              getDatesForView={getDatesForView}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              appointments={appointments}
            />
          )}

          {viewMode === "week" && (
            <WeekCalendarView
              getDatesForView={getDatesForView}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              appointments={appointments}
            />
          )}
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <Event className="text-blue-500 mr-2" fontSize="small" />
              <h3 className="text-lg font-medium">
                {viewMode === "day"
                  ? `Appointments for ${selectedDate.toLocaleDateString(
                      "en-US",
                      { month: "long", day: "numeric", year: "numeric" }
                    )}`
                  : "Upcoming Appointments"}
              </h3>
            </div>
            {filteredAppointments.length > 0 && (
              <div className="text-sm text-gray-500">
                {filteredAppointments.length} appointment
                {filteredAppointments.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          <div className="divide-y divide-gray-100">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <AppointmentItem
                  key={appointment.id}
                  appointment={appointment}
                  formatDate={formatDate}
                  onEdit={handleEditAppointment}
                  onDelete={handleDeleteAppointment}
                />
              ))
            ) : (
              <EmptyAppointments
                viewMode={viewMode}
                formatDate={formatDate}
                selectedDate={selectedDate}
              />
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Today's Appointments"
          value={stats.today}
          color="blue"
          icon={<CalendarToday fontSize="small" />}
        />
        <StatCard
          title="Confirmed"
          value={stats.confirmed}
          color="green"
          icon={<Check fontSize="small" />}
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          color="yellow"
          icon={<Schedule fontSize="small" />}
        />
        <StatCard
          title="Cancelled"
          value={stats.cancelled}
          color="red"
          icon={<Close fontSize="small" />}
        />
      </div>

      {/* New Appointment Modal */}
      {showModal && (
        <NewAppointmentModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingAppointmentId(null);
          }}
          onSave={handleSaveAppointment}
          appointmentToEdit={
            editingAppointmentId
              ? appointments.find((a) => a.id === editingAppointmentId)
              : null
          }
        />
      )}
    </div>
  );
};

export default Scheduling;
