import {
  DashboardRounded,
  LocalHospitalOutlined,
  SupportAgent,
  Schedule,
  FolderOpen,
  Settings,
  BadgeOutlined,
  PeopleAltOutlined,
  EventNoteOutlined,
  Logout,
  HelpOutlineOutlined,
  AssessmentOutlined,
} from "@mui/icons-material";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("emr-token");
    navigate("/login");
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-[230px] bg-white border-r-2 border-gray-200 p-2 flex flex-col z-30">
      <h1 className="flex items-center justify-start text-2xl font-bold m-2 tracking-wider">
        EcoClinic
      </h1>
      <div className="flex items-center border border-[#e6e8ea] rounded-md mb-2">
        <LocalHospitalOutlined
          sx={{ fontSize: 32 }}
          className="flex text-[#5c5f68] justify-center items-center"
        />
        <div className="flex flex-col">
          <h1 className="text-[#545859] font-semibold pl-1">Daps Hospital</h1>
          <p className="font-medium text-[#848997] text-sm pl-2">
            Lagos, Nigeria
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-gray-600 py-4">
        <DashboardRounded
          sx={{
            fontSize: 28,
            backgroundColor: "#e8f0fb",
            borderRadius: "50%",
            padding: "4px",
          }}
        />
        <h1 className="font-mono text-[#253344]">Dashboard</h1>
      </div>
      <h3 className="pl-2 text-gray-400 uppercase text-sm">Clinic</h3>
      <ul className="text-[#283747] my-2">
        <li className="pb-2">
          <NavLink
            to="/reservations"
            className={({ isActive }) =>
              `flex items-center gap-2 p-1.5 rounded-lg cursor-pointer whitespace-nowrap
      hover:bg-[#e8f0fb] hover:text-[#4059e7] transition-colors
      ${isActive ? "bg-[#e8f0fb] text-[#4059e7] font-semibold" : ""}`
            }
          >
            <EventNoteOutlined
              sx={{
                fontSize: 28,
                backgroundColor: "#e8f0fb",
                borderRadius: "50%",
                padding: "4px",
              }}
            />
            Reservations
          </NavLink>
        </li>
        <li className="pb-2">
          <NavLink
            to={"/patients"}
            className={({ isActive }) =>
              `flex items-center gap-2 p-1.5 rounded-lg cursor-pointer whitespace-nowrap
      hover:bg-[#e8f0fb] hover:text-[#4059e7] transition-colors
      ${isActive ? "bg-[#e8f0fb] text-[#4059e7] font-semibold" : ""}`
            }
          >
            <PeopleAltOutlined
              sx={{
                fontSize: 28,
                backgroundColor: "#e8f0fb",
                borderRadius: "50%",
                padding: "4px",
              }}
            />
            Patients
          </NavLink>
        </li>
        <li className="pb-2">
          <NavLink
            to={"/staff"}
            className={({ isActive }) =>
              `flex items-center gap-2 p-1.5 rounded-lg cursor-pointer whitespace-nowrap
      hover:bg-[#e8f0fb] hover:text-[#4059e7] transition-colors
      ${isActive ? "bg-[#e8f0fb] text-[#4059e7] font-semibold" : ""}`
            }
          >
            <BadgeOutlined
              sx={{
                fontSize: 28,
                backgroundColor: "#e8f0fb",
                borderRadius: "50%",
                padding: "4px",
              }}
            />
            Staff List
          </NavLink>
        </li>
        <li className="pb-2">
          <NavLink
            to={"/medical-records"}
            className={({ isActive }) =>
              `flex items-center gap-2 p-1.5 rounded-lg cursor-pointer whitespace-nowrap
      hover:bg-[#e8f0fb] hover:text-[#4059e7] transition-colors
      ${isActive ? "bg-[#e8f0fb] text-[#4059e7] font-semibold" : ""}`
            }
          >
            <FolderOpen
              sx={{
                fontSize: 28,
                backgroundColor: "#e8f0fb",
                borderRadius: "50%",
                padding: "4px",
              }}
            />
            Medical Records
          </NavLink>
        </li>
        <li className="pb-2">
          <NavLink
            to={"/scheduling"}
            className={({ isActive }) =>
              `flex items-center gap-2 p-1.5 rounded-lg cursor-pointer whitespace-nowrap
      hover:bg-[#e8f0fb] hover:text-[#4059e7] transition-colors
      ${isActive ? "bg-[#e8f0fb] text-[#4059e7] font-semibold" : ""}`
            }
          >
            <Schedule
              sx={{
                fontSize: 28,
                backgroundColor: "#e8f0fb",
                borderRadius: "50%",
                padding: "4px",
              }}
            />
            Scheduling
          </NavLink>
        </li>
        <li className="pb-2">
          <NavLink
            to={"/settings"}
            className={({ isActive }) =>
              `flex items-center gap-2 p-1.5 rounded-lg cursor-pointer whitespace-nowrap
      hover:bg-[#e8f0fb] hover:text-[#4059e7] transition-colors
      ${isActive ? "bg-[#e8f0fb] text-[#4059e7] font-semibold" : ""}`
            }
          >
            <Settings
              sx={{
                fontSize: 28,
                backgroundColor: "#e8f0fb",
                borderRadius: "50%",
                padding: "4px",
              }}
            />
            Settings
          </NavLink>
        </li>
        <li className="pb-2">
          <button
            onClick={handleLogout}
            className={`
            flex items-center gap-2 p-1.5 rounded-lg pb-2 cursor-pointer whitespace-nowrap w-full text-left
            hover:bg-red-200 hover:text-red-500 transition-colors
            font-medium
          `}
          >
            <Logout
              sx={{
                fontSize: 28,
                borderRadius: "50%",
                padding: "4px",
              }}
            />
            Logout
          </button>
        </li>
      </ul>
      <hr />
      <ul className="text-[#283747] mt-2">
        <li className="pb-2">
          <NavLink
            to={"/help"}
            className={({ isActive }) =>
              `flex items-center gap-2 p-1.5 rounded-lg cursor-pointer whitespace-nowrap
      hover:bg-[#e8f0fb] hover:text-[#4059e7] transition-colors
      ${isActive ? "bg-[#e8f0fb] text-[#4059e7] font-semibold" : ""}`
            }
          >
            <HelpOutlineOutlined
              sx={{
                fontSize: 28,
                backgroundColor: "#e8f0fb",
                borderRadius: "50%",
                padding: "4px",
              }}
            />
            Help
          </NavLink>
        </li>
        <li className="pb-2">
          <NavLink
            to={"/report"}
            className={({ isActive }) =>
              `flex items-center gap-2 p-1.5 rounded-lg cursor-pointer whitespace-nowrap
      hover:bg-[#e8f0fb] hover:text-[#4059e7] transition-colors
      ${isActive ? "bg-[#e8f0fb] text-[#4059e7] font-semibold" : ""}`
            }
          >
            <AssessmentOutlined
              sx={{
                fontSize: 28,
                backgroundColor: "#e8f0fb",
                borderRadius: "50%",
                padding: "4px",
              }}
            />
            Report
          </NavLink>
        </li>
        <li className="pb-2">
          <NavLink
            to={"/support"}
            className={({ isActive }) =>
              `flex items-center gap-2 p-1.5 rounded-lg cursor-pointer whitespace-nowrap
      hover:bg-[#e8f0fb] hover:text-[#4059e7] transition-colors
      ${isActive ? "bg-[#e8f0fb] text-[#4059e7] font-semibold" : ""}`
            }
          >
            <SupportAgent
              sx={{
                fontSize: 28,
                backgroundColor: "#e8f0fb",
                borderRadius: "50%",
                padding: "4px",
              }}
            />
            Customer Support
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
