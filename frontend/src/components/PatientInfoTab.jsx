import React, { useState } from "react";
import {
  Person,
  CalendarToday,
  Phone,
  Email,
  Home,
  ContactPhone,
  HealthAndSafety,
  Edit,
  Save,
  Cancel,
  Add,
} from "@mui/icons-material";

// Sample patient demographic data
const patientDemographics = {
  // Your existing patient data
};

const PatientInfoTab = ({ patientId }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  // Step 1: Define patientData first
  const patientData = patientDemographics[patientId] || null;

  // Step 2: Check if patient has insurance
  const hasInsuranceData = !!(
    patientData?.insurance?.primary || patientData?.insurance?.secondary
  );

  // Step 3: State for toggling insurance visibility
  const [hasInsurance, setHasInsurance] = useState(hasInsuranceData);

  if (!patientData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Patient information not available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Personal Info and Address sections remain the same */}

      {/* Insurance Section - Now with conditional styling */}
      <div
        className={`bg-white border ${
          hasInsurance ? "border-gray-200" : "border-gray-100"
        } rounded-xl shadow-sm`}
      >
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <HealthAndSafety
              className={`mr-2 ${
                hasInsurance ? "text-blue-500" : "text-gray-400"
              }`}
              fontSize="small"
            />
            <h3
              className={`text-lg font-medium ${
                hasInsurance ? "" : "text-gray-500"
              }`}
            >
              Insurance Information
            </h3>
          </div>
          {isEditMode && (
            <div>
              <label className="inline-flex items-center cursor-pointer">
                <span className="mr-2 text-sm text-gray-600">
                  Has Insurance
                </span>
                <input
                  type="checkbox"
                  checked={hasInsurance}
                  onChange={() => setHasInsurance(!hasInsurance)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          )}
        </div>

        <div className="p-6">
          {hasInsurance ? (
            <div className="space-y-8">
              {/* Primary Insurance */}
              <div>
                <div className="mb-2 font-medium text-blue-600">
                  Primary Insurance
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                  {/* Insurance fields */}
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      Provider
                    </div>
                    {isEditMode ? (
                      <input
                        type="text"
                        defaultValue={
                          patientData.insurance?.primary?.provider || ""
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2 border"
                      />
                    ) : (
                      <div className="font-medium">
                        {patientData.insurance?.primary?.provider ||
                          "Not specified"}
                      </div>
                    )}
                  </div>

                  {/* More insurance fields */}
                </div>
              </div>

              {/* Secondary Insurance section */}
            </div>
          ) : (
            <div className="text-center py-6 border border-dashed border-gray-200 rounded-lg bg-gray-50">
              <div className="text-gray-500 mb-2">
                No insurance information on file
              </div>
              {isEditMode ? (
                <button
                  onClick={() => setHasInsurance(true)}
                  className="px-4 py-2 bg-white border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 flex items-center gap-1 mx-auto"
                >
                  <Add fontSize="small" /> Add Insurance Information
                </button>
              ) : (
                <div className="text-sm text-gray-400">
                  This patient does not have medical insurance coverage
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientInfoTab;
