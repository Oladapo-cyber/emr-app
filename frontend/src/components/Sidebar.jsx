import {
  Dashboard,
  DashboardCustomizeOutlined,
  DashboardOutlined,
  DashboardRounded,
} from "@mui/icons-material";

const Sidebar = () => {
  return (
    <div className="w-[25%] min-w-[200px] bg-white shadow-2xl min-h-full hidden md:block px-2">
      <div className="h-16 ">
        <hr />
        <h1 className="text-xl text-black font-semibold">Daps Hospital</h1>
        <p className="font-medium text-sm">Lagos, Nigeria.</p>
        <hr />
      </div>
      <div className="flex items-center gap-2 text-gray-700 mb-2">
        <DashboardRounded />
        <h1 className="font-bold text-xl">Dashboard</h1>
      </div>
      <h3 className="pl-2 text-gray-400 font-semibold">Clinic</h3>
      <ul>
        <li className="p-1.5 rounded-lg hover:bg-[#e8f0fb] cursor-pointer whitespace-nowrap">
          Reservations
        </li>
        <li className="p-1.5 rounded-lg hover:bg-[#e8f0fb] cursor-pointer whitespace-nowrap">
          Patients
        </li>
        <li className="p-1.5 rounded-lg hover:bg-[#e8f0fb] cursor-pointer whitespace-nowrap">
          Staff List
        </li>
        <li className="p-1.5 rounded-lg hover:bg-[#e8f0fb] cursor-pointer whitespace-nowrap">
          Medical Records
        </li>
        <li className="p-1.5 rounded-lg hover:bg-[#e8f0fb] cursor-pointer whitespace-nowrap">
          Scheduling
        </li>
        <li className="p-1.5 rounded-lg hover:bg-[#e8f0fb] cursor-pointer whitespace-nowrap">
          Settings
        </li>
        <li className="p-1.5 rounded-lg hover:bg-[#e8f0fb] cursor-pointer whitespace-nowrap">
          Logout
        </li>
        <li className="p-1.5 rounded-lg hover:bg-[#e8f0fb] cursor-pointer whitespace-nowrap">
          Help
        </li>
        <li className="p-1.5 rounded-lg hover:bg-[#e8f0fb] cursor-pointer whitespace-nowrap">
          Contact Us
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
