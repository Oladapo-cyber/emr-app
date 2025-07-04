import { Search, FilterList } from "@mui/icons-material";

const FilterBar = ({ search, setSearch, filterStatus, setFilterStatus }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-200">
      <div className="relative flex-1 max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search appointments, patients, doctors..."
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
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
