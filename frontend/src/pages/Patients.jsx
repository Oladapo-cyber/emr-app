import { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import {
  Search,
  GetApp,
  PersonAdd,
  PersonOutline,
  CalendarToday,
  Phone,
  Email,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import { patientService } from "../services";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPatients, setTotalPatients] = useState(0);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Fetch patients with API integration
  useEffect(() => {
    fetchPatients();
  }, [page, filterStatus]);

  // Debounced search
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (search) {
        performSearch();
      } else {
        fetchPatients();
      }
    }, 500); // 500ms debounce

    setSearchTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [search]);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page,
        limit: 10,
      };

      if (filterStatus !== "All") {
        params.status = filterStatus.toLowerCase();
      }

      const response = await patientService.getPatients(params);

      setPatients(response.data || []);
      setTotalPages(response.totalPages || 1);
      setTotalPatients(response.total || 0);
    } catch (err) {
      console.error("Failed to fetch patients:", err);
      setError(err.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        search: search.trim(),
        page: 1, // Reset to first page on search
        limit: 10,
      };

      if (filterStatus !== "All") {
        params.status = filterStatus.toLowerCase();
      }

      const response = await patientService.getPatients(params);

      setPatients(response.data || []);
      setTotalPages(response.totalPages || 1);
      setTotalPatients(response.total || 0);
      setPage(1); // Reset page to 1
    } catch (err) {
      console.error("Search failed:", err);
      setError(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Create CSV content
    const headers = [
      "Patient ID",
      "Name",
      "Gender",
      "Age",
      "Phone",
      "Email",
      "Last Visit",
      "Status",
    ];
    const rows = patients.map((p) => [
      p.patientId,
      `${p.firstName} ${p.lastName}`,
      p.gender,
      calculateAge(p.dateOfBirth),
      p.phone,
      p.email || "N/A",
      formatDate(p.updatedAt),
      p.isActive ? "Active" : "Inactive",
    ]);

    let csvContent = headers.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    // Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `patients_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A";
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  // Stats calculation
  const activePatients = patients.filter((p) => p.isActive).length;

  if (loading && patients.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-500">Loading patients...</p>
        </div>
      </div>
    );
  }

  if (error && patients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">Failed to load patients</p>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={fetchPatients}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-500 text-sm mt-1">
            {totalPatients} total patients
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
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
            placeholder="Search by name, email, phone, or patient ID..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50"
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            fontSize="small"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="All">All Patients</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Stats Section */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Patients" value={totalPatients} color="gray" />
          <StatCard
            title="Active Patients"
            value={activePatients}
            color="green"
          />
          <StatCard title="Current Page" value={page} color="blue" />
          <StatCard title="Total Pages" value={totalPages} color="purple" />
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center py-12">
              <PersonOutline className="mx-auto text-gray-400 mb-4" sx={{ fontSize: 48 }} />
              <p className="text-gray-500 text-lg">No patients found</p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Last Visit
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
                {patients.map((patient) => (
                  <tr
                    key={patient._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar sx={{ width: 40, height: 40, bgcolor: "#3b82f6" }}>
                          {getInitials(patient.firstName, patient.lastName)}
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">
                            {patient.firstName} {patient.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {patient.patientId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 capitalize">
                      {patient.gender}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {patient.age || calculateAge(patient.dateOfBirth)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Phone fontSize="small" className="text-gray-400" />
                          <span className="text-gray-700">{patient.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Email fontSize="small" className="text-gray-400" />
                          <span className="text-gray-700">{patient.email || "N/A"}</span>
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
                          {formatDate(patient.updatedAt)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          patient.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {patient.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/patients/patient-details?id=${patient._id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && patients.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Patients;
