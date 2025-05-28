import { Avatar } from "@mui/material";

import { StickyNote2Outlined } from "@mui/icons-material";
const PatientDetails = () => {
  return (
    <div>
      <div className="flex">
        <Avatar sx={{ width: 50, height: 50 }}>YO</Avatar>
        <div className="flex flex-col items-center justify-center ml-4">
          <p>Yinusa Oladapo</p>
          <div className="flex items-center space-x-2 border">
            <StickyNote2Outlined className="text-blue-500" />
            <button className="bg-transparent border-none text-blue-600 hover:font-medium hover:text-blue-700 p-0 m-0 focus:outline-none">
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
