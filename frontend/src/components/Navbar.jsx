import { useLocation } from "react-router-dom";
import {
  ExpandMore,
  Help,
  HelpOutline,
  MonitorHeartOutlined,
  SettingsOutlined,
  ShowChart,
  TrendingUp,
} from "@mui/icons-material";
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

const userName = "Yinusa Oladapo";

const getInitials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

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
      <nav className="px-6 py-2 border-gray-200 bg-white border-b-2 flex items-center justify-between">
        <div className="font-bold text-xl">{pageName}</div>
        <div className="flex justify-center items-center">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for anything here..."
                className="pl-10 pr-3 h-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <Search
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                sx={{ fontSize: 22 }}
              />
            </div>
            <button
              type="submit"
              className="ml-2 w-10  h-10 text-2xl bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              +
            </button>
            <div className="w-px h-8 bg-gray-300 mx-4" />
          </form>
          <div className="flex gap-3  text-[#909090]">
            <HelpOutline />
            <TrendingUp />
            <SettingsOutlined />
            <div className="w-px h-8 bg-gray-300 mx-4" />
          </div>
          <div className="flex items-center gap-3">
            <Avatar>{getInitials(userName)}</Avatar>
            <div>
              <div className="flex items-center gap-1">
                <p className="font-medium text-sm">{userName}</p>
                <ExpandMore className="custom-gray" />
              </div>
              <span className="text-xs text-gray-400">Super Admin</span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
