import React, { useState } from "react";
import { Search, FilterAlt, ArrowDropDown } from "@mui/icons-material";

const AdvancedSearch = ({ onSearch }) => {
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [searchParams, setSearchParams] = useState({
    term: "",
    dateFrom: "",
    dateTo: "",
    doctor: "",
    type: "",
    status: "All",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap gap-2">
          <div className="flex-1 min-w-[200px] relative">
            <input
              type="text"
              name="term"
              value={searchParams.term}
              onChange={handleChange}
              placeholder="Search appointments..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <button
            type="button"
            onClick={() => setIsAdvanced(!isAdvanced)}
            className="px-3 py-2 border border-gray-300 rounded-lg flex items-center gap-1"
          >
            <FilterAlt fontSize="small" />
            {isAdvanced ? "Simple" : "Advanced"}
          </button>

          <select
            name="status"
            value={searchParams.status}
            onChange={handleChange}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="All">All Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Search
          </button>
        </div>

        {isAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">
                From Date
              </label>
              <input
                type="date"
                name="dateFrom"
                value={searchParams.dateFrom}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">
                To Date
              </label>
              <input
                type="date"
                name="dateTo"
                value={searchParams.dateTo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Doctor</label>
              <select
                name="doctor"
                value={searchParams.doctor}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Any Doctor</option>
                <option value="Dr. Soap Mactavish">Dr. Soap Mactavish</option>
                <option value="Dr. Sarah Johnson">Dr. Sarah Johnson</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Appointment Type
              </label>
              <select
                name="type"
                value={searchParams.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Any Type</option>
                <option value="Consultation">Consultation</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Examination">Examination</option>
              </select>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AdvancedSearch;
