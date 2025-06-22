import { useState } from "react";
import { Avatar } from "@mui/material";
import {
  Search,
  FilterList,
  GetApp,
  Visibility,
  Edit,
  MoreVert,
  FolderOpen,
  AccessTime,
  Person,
  LocalHospital,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const medicalRecords = [
  {
    id: "MR001",
    patientName: "Willie Jennie",
    patientId: "P001",
    recordType: "Consultation",
    diagnosis: "Dental Caries",
    treatment: "Tooth Filling",
    doctor: "Dr. Soap Mactavish",
    date: "2024-01-15",
    status: "Completed",
    notes: "Advanced decay treatment completed successfully",
  },
  {
    id: "MR002",
    patientName: "Christopher Smallwood",
    patientId: "P002",
    recordType: "Surgery",
    diagnosis: "Impacted Wisdom Tooth",
    treatment: "Tooth Extraction",
    doctor: "Dr. Sarah Johnson",
    date: "2024-01-12",
    status: "In Progress",
    notes: "Post-operative care required",
  },
  {
    id: "MR003",
    patientName: "Maria Garcia",
    patientId: "P003",
    recordType: "Preventive",
    diagnosis: "Routine Checkup",
    treatment: "Cleaning & Examination",
    doctor: "Dr. Mike Wilson",
    date: "2024-01-10",
    status: "Completed",
    notes: "No issues found, next appointment in 6 months",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700";
    case "In Progress":
      return "bg-yellow-100 text-yellow-700";
    case "Pending":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getRecordTypeIcon = (type) => {
  switch (type) {
    case "Surgery":
      return <LocalHospital className="text-red-500" fontSize="small" />;
    case "Consultation":
      return <Person className="text-blue-500" fontSize="small" />;
    case "Preventive":
      return <AccessTime className="text-green-500" fontSize="small" />;
    default:
      return <FolderOpen className="text-gray-500" fontSize="small" />;
  }
};

const MedicalRecords = () => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [records, setRecords] = useState(medicalRecords);

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.patientName.toLowerCase().includes(search.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
      record.treatment.toLowerCase().includes(search.toLowerCase()) ||
      record.doctor.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filterStatus === "All" || record.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and view all patient medical records
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <GetApp fontSize="small" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FolderOpen fontSize="small" />
            New Record
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-200">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search records, patients, diagnoses..."
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
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
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
                  Patient
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Record Details
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Treatment
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
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
              {filteredRecords.map((record) => (
                <tr
                  key={record.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link
                      to={`/patients/patient-details?id=${record.patientId}&tab=Medical Record`}
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
                        {record.patientName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900">
                          {record.patientName}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {record.patientId}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      {getRecordTypeIcon(record.recordType)}
                      <div>
                        <div className="font-medium text-gray-900">
                          {record.diagnosis}
                        </div>
                        <div className="text-xs text-gray-500">
                          {record.recordType} • {record.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {record.treatment}
                    </div>
                    {record.notes && (
                      <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                        {record.notes}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {record.doctor}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">
                      {new Date(record.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        record.status
                      )}`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Visibility fontSize="small" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Edit fontSize="small" />
                      </button>
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

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen
              className="mx-auto text-gray-300 mb-4"
              sx={{ fontSize: 48 }}
            />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No records found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-xs text-gray-500 uppercase tracking-wider">
            Total Records
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {records.length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-xs text-gray-500 uppercase tracking-wider">
            Completed
          </div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            {records.filter((r) => r.status === "Completed").length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-xs text-gray-500 uppercase tracking-wider">
            In Progress
          </div>
          <div className="text-2xl font-bold text-yellow-600 mt-1">
            {records.filter((r) => r.status === "In Progress").length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-xs text-gray-500 uppercase tracking-wider">
            Pending
          </div>
          <div className="text-2xl font-bold text-red-600 mt-1">
            {records.filter((r) => r.status === "Pending").length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;
