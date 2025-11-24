import React, { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import { StickyNote2Outlined, Edit } from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";
import PatientInfoTab from "./PatientInfoTab";
import AppointmentHistoryTab from "./AppointmentHistoryTab";
import NextTreatmentTab from "./NextTreatmentTab";
import MedicalRecordTab from "./MedicalRecordTab";
import { patientService } from "../services";

const tabs = [
  "Patient Information",
  "Appointment History",
  "Next Treatment",
  "Medical Record",
];

const PatientDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const patientId = searchParams.get("id");
  const defaultTab = searchParams.get("tab") || tabs[0];

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch patient data on mount
  useEffect(() => {
    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  const fetchPatientData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await patientService.getPatientById(patientId);
      setPatientData(response.data);
    } catch (err) {
      console.error('Failed to fetch patient:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error || !patientData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Failed to load patient details: {error || 'Patient not found'}</p>
        <button 
          onClick={fetchPatientData}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const patientName = `${patientData.firstName || ''} ${patientData.lastName || ''}`;

  return (
    <>
      <div className="flex items-center">
        <Avatar sx={{ width: 64, height: 64 }}>
          {getInitials(patientName)}
        </Avatar>
        <div className="flex flex-col ml-4">
          <p className="text-xl font-semibold">{patientName}</p>
          <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
            <StickyNote2Outlined fontSize="small" className="text-blue-500" />
            <span>{patientData.medicalHistory?.allergies?.join(', ') || 'No allergies noted'}</span>
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
