import React from "react";
import {
  PeopleAlt,
  Today,
  LocalHospital,
  MedicalServices,
  EventAvailable,
  DashboardCustomize,
  TrendingUp,
  Visibility,
  CalendarToday,
  Person,
  AccessTime,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const Home = () => {
  // Sample data
  const stats = {
    totalPatients: 856,
    appointmentsToday: 24,
    newPatientsThisWeek: 17,
    pendingMedicalRecords: 8,
  };

  const upcomingAppointments = [
    {
      id: "A001",
      patientName: "Willie Jennie",
      patientId: "P001",
      time: "09:30 AM",
      date: "Today",
      type: "Consultation",
    },
    {
      id: "A002",
      patientName: "Christopher Smallwood",
      patientId: "P002",
      time: "11:15 AM",
      date: "Today",
      type: "Follow-up",
    },
    {
      id: "A003",
      patientName: "Maria Garcia",
      patientId: "P003",
      time: "02:00 PM",
      date: "Tomorrow",
      type: "Examination",
    },
  ];

  const recentPatientActivity = [
    {
      id: "RA001",
      patientName: "Robert Johnson",
      patientId: "P004",
      action: "Medical record updated",
      time: "1 hour ago",
      doctor: "Dr. Soap Mactavish",
    },
    {
      id: "RA002",
      patientName: "Emma Wilson",
      patientId: "P005",
      action: "New appointment scheduled",
      time: "3 hours ago",
      doctor: "Dr. Sarah Johnson",
    },
    {
      id: "RA003",
      patientName: "Willie Jennie",
      patientId: "P001",
      action: "Prescription renewed",
      time: "Yesterday",
      doctor: "Dr. Soap Mactavish",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome to EcoClinic
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Dashboard overview for Daps Hospital, Lagos
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/scheduling"
            className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Today fontSize="small" />
            View Schedule
          </Link>
          <Link
            to="/patients/new-patient"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PeopleAlt fontSize="small" />
            Add New Patient
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center">
          <div className="bg-blue-100 p-3 rounded-lg">
            <PeopleAlt className="text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500 font-medium">Total Patients</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {stats.totalPatients}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center">
          <div className="bg-green-100 p-3 rounded-lg">
            <Today className="text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500 font-medium">
              Appointments Today
            </p>
            <h3 className="text-2xl font-bold text-gray-900">
              {stats.appointmentsToday}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center">
          <div className="bg-purple-100 p-3 rounded-lg">
            <LocalHospital className="text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500 font-medium">
              New Patients (Week)
            </p>
            <h3 className="text-2xl font-bold text-gray-900">
              {stats.newPatientsThisWeek}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center">
          <div className="bg-orange-100 p-3 rounded-lg">
            <MedicalServices className="text-orange-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500 font-medium">Pending Records</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {stats.pendingMedicalRecords}
            </h3>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Link
            to="/patients"
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            <PeopleAlt className="text-blue-600 mb-2" fontSize="large" />
            <span className="text-sm text-gray-700 text-center">
              View Patients
            </span>
          </Link>

          <Link
            to="/scheduling"
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            <EventAvailable className="text-blue-600 mb-2" fontSize="large" />
            <span className="text-sm text-gray-700 text-center">
              Scheduling
            </span>
          </Link>

          <Link
            to="/medical-records"
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            <MedicalServices className="text-blue-600 mb-2" fontSize="large" />
            <span className="text-sm text-gray-700 text-center">
              Medical Records
            </span>
          </Link>

          <Link
            to="/patients/new-patient"
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            <Person className="text-blue-600 mb-2" fontSize="large" />
            <span className="text-sm text-gray-700 text-center">
              New Patient
            </span>
          </Link>

          <Link
            to="/staff"
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            <DashboardCustomize
              className="text-blue-600 mb-2"
              fontSize="large"
            />
            <span className="text-sm text-gray-700 text-center">
              Staff List
            </span>
          </Link>

          <Link
            to="/report"
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            <TrendingUp className="text-blue-600 mb-2" fontSize="large" />
            <span className="text-sm text-gray-700 text-center">Reports</span>
          </Link>
        </div>
      </div>

      {/* Upcoming Appointments & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Upcoming Appointments
            </h2>
            <Link
              to="/scheduling"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </Link>
          </div>

          <div className="p-4">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="mb-4 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-50 p-2 rounded-lg mr-3">
                      <CalendarToday
                        fontSize="small"
                        className="text-blue-600"
                      />
                    </div>
                    <div>
                      <Link
                        to={`/patients/patient-details?id=${appointment.patientId}`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {appointment.patientName}
                      </Link>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {appointment.type} • {appointment.time},{" "}
                        {appointment.date}
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/patients/patient-details?id=${appointment.patientId}`}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Visibility fontSize="small" />
                  </Link>
                </div>
              </div>
            ))}

            {upcomingAppointments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No upcoming appointments
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Patient Activity
            </h2>
            <Link
              to="/medical-records"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </Link>
          </div>

          <div className="p-4">
            {recentPatientActivity.map((activity) => (
              <div
                key={activity.id}
                className="mb-4 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="bg-purple-50 p-2 rounded-lg mr-3">
                      <AccessTime
                        fontSize="small"
                        className="text-purple-600"
                      />
                    </div>
                    <div>
                      <Link
                        to={`/patients/patient-details?id=${activity.patientId}`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {activity.patientName}
                      </Link>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {activity.action} • {activity.time}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {activity.doctor}
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/patients/patient-details?id=${activity.patientId}`}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Visibility fontSize="small" />
                  </Link>
                </div>
              </div>
            ))}

            {recentPatientActivity.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No recent activity
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
