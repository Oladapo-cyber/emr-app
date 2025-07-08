import { useState } from "react";
import { Avatar } from "@mui/material";
import {
  Search,
  FilterList,
  GetApp,
  Visibility,
  Edit,
  MoreVert,
  PersonAdd,
  PersonOutline,
  CalendarToday,
  Phone,
  Email,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";

// Sample patient data - would come from API in production
const patientsList = [
  {
    id: "P001",
    name: "Willie Jennie",
    gender: "Female",
    age: 38,
    phone: "(555) 123-4567",
    email: "willie.jennie@example.com",
    lastVisit: "2024-05-15",
    upcomingAppt: "2024-06-22",
    status: "Active",
  },
  {
    id: "P002",
    name: "Christopher Smallwood",
    gender: "Male",
    age: 46,
    phone: "(555) 234-5678",
    email: "christopher.smallwood@example.com",
    lastVisit: "2024-04-03",
    upcomingAppt: null,
    status: "Inactive",
  },
  {
    id: "P003",
    name: "Maria Garcia",
    gender: "Female",
    age: 31,
    phone: "(555) 345-6789",
    email: "maria.garcia@example.com",
    lastVisit: "2024-01-10",
    upcomingAppt: "2024-07-15",
    status: "Active",
  },
  {
    id: "P004",
    name: "Robert Johnson",
    gender: "Male",
    age: 52,
    phone: "(555) 456-7890",
    email: "robert.johnson@example.com",
    lastVisit: "2024-03-22",
    upcomingAppt: "2024-06-18",
    status: "Active",
  },
  {
    id: "P005",
    name: "Emma Wilson",
    gender: "Female",
    age: 29,
    phone: "(555) 567-8901",
    email: "emma.wilson@example.com",
    lastVisit: "2024-05-08",
    upcomingAppt: null,
    status: "Active",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700";
    case "Inactive":
      return "bg-gray-100 text-gray-700";
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const Patients = () => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [patients, setPatients] = useState(patientsList);

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(search.toLowerCase()) ||
      patient.email.toLowerCase().includes(search.toLowerCase()) ||
      patient.phone.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filterStatus === "All" || patient.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and view patient information
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <GetApp fontSize="small" />
            Export
          </button>
          <Link
            to="/patients/new-patient"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PersonAdd fontSize="small" />
            Add New Patient
          </Link>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-200">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patients by name, email, phone..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50"
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            fontSize="small"
          />
        </div>

        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2">
            <FilterList fontSize="small" className="text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Patient Information
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Contact Details
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Last Visit
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Next Appointment
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link
                      to={`/patients/patient-details?id=${patient.id}`}
                      className="flex items-center gap-3 hover:text-blue-600 transition-colors"
                    >
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          fontSize: 16,
                          bgcolor: "#7c3aed",
                        }}
                      >
                        {patient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900">
                          {patient.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {patient.gender} • {patient.age} years • ID:{" "}
                          {patient.id}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Phone fontSize="small" className="text-gray-400" />
                        <span className="text-gray-700">{patient.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Email fontSize="small" className="text-gray-400" />
                        <span className="text-gray-700">{patient.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <CalendarToday
                        fontSize="small"
                        className="text-gray-400"
                      />
                      <span className="text-gray-700">
                        {formatDate(patient.lastVisit)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {patient.upcomingAppt ? (
                      <div className="flex items-center gap-2">
                        <CalendarToday
                          fontSize="small"
                          className="text-blue-400"
                        />
                        <span className="text-blue-700 font-medium">
                          {formatDate(patient.upcomingAppt)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">
                        No upcoming appointments
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        patient.status
                      )}`}
                    >
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/patients/patient-details?id=${patient.id}`}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Visibility fontSize="small" />
                      </Link>
                      <Link
                        to={`/patients/patient-details?id=${patient.id}&edit=true`}
                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Edit fontSize="small" />
                      </Link>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <MoreVert fontSize="small" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <PersonOutline
              className="mx-auto text-gray-300 mb-4"
              sx={{ fontSize: 48 }}
            />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No patients found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Patients" value={patients.length} color="gray" />
        <StatCard
          title="Active Patients"
          value={patients.filter((p) => p.status === "Active").length}
          color="green"
        />
        <StatCard title="New This Month" value={2} color="blue" />
        <StatCard
          title="With Appointments"
          value={patients.filter((p) => p.upcomingAppt).length}
          color="purple"
        />
      </div>
    </div>
  );
};

export default Patients;
