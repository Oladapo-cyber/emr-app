import { useLocation } from "react-router-dom";
import { Search } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { useState } from "react";

const pageNames = {
  "/": "Home",
  "/patients": "Patients",
  "/new-patient": "New Patient",
  "/medical-records": "Medical Records",
  "/scheduling": "Scheduling",
  "/help": "Help",
  "/report": "Report",
  "/support": "Customer Support",
  "/staff": "Staff List",
  "/reservations": "Reservations",
  "/settings": "Settings",
  "/login": "Login",
};

const Navbar = () => {
  const location = useLocation();
  const pageName = pageNames[location.pathname] || "Home";
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for: ${search}`);
  };

  return (
    <header className="w-full">
      <nav className="px-6 py-4 border-gray-200 bg-white border-b-2 flex items-center justify-between">
        <div className="font-bold text-xl">{pageName}</div>
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative ">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for anything here..."
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <Search
              className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
              sx={{ fontSize: 22 }}
            />
          </div>
          <button
            type="submit"
            className="ml-2 px-4 h2= py-2 text-2xl bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            +
          </button>
        </form>
        <div>
          <Avatar />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
