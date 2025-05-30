import React, { useState } from "react";
import { Avatar } from "@mui/material";
import { StickyNote2Outlined } from "@mui/icons-material";
import PatientInfoTab from "./PatientInfoTab";
import AppointmentHistoryTab from "./AppointmentHistoryTab";
import NextTreatmentTab from "./NextTreatmentTab";
import MedicalRecordTab from "./MedicalRecordTab";

const tabs = [
  "Patient Information",
  "Appointment History",
  "Next Treatment",
  "Medical Record",
];

const PatientDetails = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "Patient Information":
        return <PatientInfoTab />;
      case "Appointment History":
        return <AppointmentHistoryTab />;
      case "Next Treatment":
        return <NextTreatmentTab />;
      case "Medical Record":
        return <MedicalRecordTab />;
      default:
        return null;
    }
  };
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
      <div className="flex gap-6 border-b-2 border-gray-200 mt-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-base font-medium transition-colors -mb-[1.5px] ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 border-b-2 border-transparent hover:text-blue-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-6">{renderTabContent()}</div>
    </div>
  );
};

export default PatientDetails;
