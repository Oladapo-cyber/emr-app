import {
  Dashboard,
  DashboardCustomizeOutlined,
  DashboardOutlined,
  DashboardRounded,
  LocalHospitalOutlined,
} from "@mui/icons-material";

const Sidebar = () => {
  return (
    <div className="w-[25%] min-w-[200px] bg-white shadow-2xl min-h-full hidden md:block p-2">
      <h1 className=" tex-2xl font-bold ">EcoClinic</h1>
      <div className=" flex border border-gray-300 rounded-md">
        <LocalHospitalOutlined className="flex justify-center items-center" />
        <div className="flex flex-col">
          <h1 className=" text-black font-semibold pl-1">Daps Hospital</h1>
          <p className="font-light text-sm pl-2">Lagos, Nigeria.</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-gray-600 py-4">
        <DashboardRounded className="text-[18px]" />
        <h1 className="font-bold text-lg">Dashboard</h1>
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
