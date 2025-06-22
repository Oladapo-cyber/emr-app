import React, { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import { StickyNote2Outlined, Edit } from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";
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

// Sample patient data - would come from API in real app
const patientsData = {
  P001: {
    name: "Willie Jennie",
    notes: "Have uneven jawline",
  },
  P002: {
    name: "Christopher Smallwood",
    notes: "The lower and upper lips have canker sores",
  },
  P003: {
    name: "Maria Garcia",
    notes: "Regular patient, excellent oral hygiene",
  },
};

const PatientDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const patientId = searchParams.get("id");
  const defaultTab = searchParams.get("tab") || tabs[0];

  const [activeTab, setActiveTab] = useState(defaultTab);

  // Get patient data based on ID
  const patientData = patientsData[patientId] || {
    name: "Unknown Patient",
    notes: "",
  };

  useEffect(() => {
    // Update active tab when URL changes
    if (defaultTab && tabs.includes(defaultTab)) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  // Update URL when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ id: patientId, tab });
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Patient Information":
        return <PatientInfoTab patientId={patientId} />;
      case "Appointment History":
        return <AppointmentHistoryTab patientId={patientId} />;
      case "Next Treatment":
        return <NextTreatmentTab patientId={patientId} />;
      case "Medical Record":
        return <MedicalRecordTab patientId={patientId} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex items-center">
        <Avatar sx={{ width: 64, height: 64 }}>
          {getInitials(patientData.name)}
        </Avatar>
        <div className="flex flex-col ml-4">
          <p className="text-xl font-semibold">{patientData.name}</p>
          <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
            <StickyNote2Outlined fontSize="small" className="text-blue-500" />
            <span>{patientData.notes}</span>
            <button className="text-blue-600 hover:underline">Edit</button>
          </div>
        </div>
      </div>
      <div className="flex gap-6 border-b-2 border-gray-200 mt-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
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
    </>
  );
};

export default PatientDetails;
