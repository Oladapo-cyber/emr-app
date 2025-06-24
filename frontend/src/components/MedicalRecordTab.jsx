import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CheckCircle,
  HourglassEmpty,
  LineAxis,
  Medication,
  Science,
  MonitorHeart,
  BloodtypeOutlined,
  LocalHospital,
  Edit,
  Visibility,
} from "@mui/icons-material";

// Sample medical records data for general hospital
const medicalRecordsData = {
  P001: [
    {
      id: "MR001",
      date: "MAY 15",
      category: "Diagnosis",
      condition: "Hypertension",
      treatment: "Prescribed Lisinopril 10mg",
      doctor: "Dr. Sarah Johnson",
      status: "Active",
      notes:
        "Patient presenting with consistently elevated blood pressure readings. Monitor regularly.",
      vitals: {
        bp: "160/95",
        hr: "88",
        temp: "98.6°F",
      },
    },
    {
      id: "MR002",
      date: "JUN 22",
      category: "Follow-up",
      condition: "Hypertension",
      treatment: "Medication adjustment",
      doctor: "Dr. Sarah Johnson",
      status: "Completed",
      notes: "Blood pressure improving. Increased dose to 20mg daily.",
      vitals: {
        bp: "145/88",
        hr: "76",
        temp: "98.4°F",
      },
    },
  ],
  P002: [
    {
      id: "MR003",
      category: "Procedure",
      date: "APR 03",
      condition: "Appendicitis",
      treatment: "Appendectomy",
      doctor: "Dr. Michael Stevens",
      status: "Completed",
      notes:
        "Emergency procedure performed successfully. Patient recovered well post-operation.",
      vitals: {
        bp: "130/85",
        hr: "92",
        temp: "99.1°F",
      },
    },
  ],
  P003: [
    {
      id: "MR004",
      date: "JAN 10",
      category: "Lab Work",
      condition: "Annual Physical",
      treatment: "CBC, Comprehensive Metabolic Panel",
      doctor: "Dr. Emily Wilson",
      status: "Completed",
      notes:
        "All lab results within normal range. Vitamin D slightly low - recommended supplement.",
      vitals: {
        bp: "120/80",
        hr: "72",
        temp: "98.6°F",
      },
    },
  ],
};

// Get appropriate icon for record category
const getCategoryIcon = (category) => {
  switch (category) {
    case "Diagnosis":
      return <LocalHospital className="text-blue-500" />;
    case "Lab Work":
      return <Science className="text-purple-500" />;
    case "Procedure":
      return <BloodtypeOutlined className="text-red-500" />;
    case "Follow-up":
      return <MonitorHeart className="text-green-500" />;
    case "Medication":
      return <Medication className="text-orange-500" />;
    default:
      return <LocalHospital className="text-gray-500" />;
  }
};

const MedicalRecordTab = ({ patientId }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id") || patientId;
  const recordId = searchParams.get("recordId");
  const isEditing = searchParams.get("edit") === "true";

  // Get records for this patient
  const records = medicalRecordsData[id] || [];

  // Find current record to display/edit
  const currentRecord = recordId
    ? records.find((r) => r.id === recordId)
    : null;

  // Form state for editing
  const [formValues, setFormValues] = useState(
    currentRecord
      ? {
          category: currentRecord.category,
          condition: currentRecord.condition,
          treatment: currentRecord.treatment,
          notes: currentRecord.notes,
          status: currentRecord.status,
          doctor: currentRecord.doctor,
        }
      : {}
  );

  // Update form when record changes
  useEffect(() => {
    if (currentRecord) {
      setFormValues({
        category: currentRecord.category,
        condition: currentRecord.condition,
        treatment: currentRecord.treatment,
        notes: currentRecord.notes,
        status: currentRecord.status,
        doctor: currentRecord.doctor,
      });
    }
  }, [currentRecord]);

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ id, tab: "Medical Record", recordId });
  };

  const handleCancel = () => {
    // Exit edit mode without saving
    setSearchParams({ id, tab: "Medical Record", recordId });
  };

  return (
    <div className="space-y-6">
      {/* Medical Record Categories */}
      <div className="flex gap-2 mb-4">
        <button className="px-4 py-1 rounded-full border bg-blue-600 text-white border-blue-600">
          All Records
        </button>
        <button className="px-4 py-1 rounded-full border bg-white text-gray-600 border-gray-300 hover:bg-gray-50">
          Diagnoses
        </button>
        <button className="px-4 py-1 rounded-full border bg-white text-gray-600 border-gray-300 hover:bg-gray-50">
          Lab Results
        </button>
        <button className="px-4 py-1 rounded-full border bg-white text-gray-600 border-gray-300 hover:bg-gray-50">
          Procedures
        </button>
      </div>

      <div className="flex gap-8">
        {/* Vitals Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col min-w-[260px] shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <LineAxis className="text-blue-500" />
            <span className="font-semibold text-gray-700">Patient Vitals</span>
          </div>

          <div className="space-y-4">
            {records.length > 0 ? (
              <div>
                {/* Latest vitals */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-500">BLOOD PRESSURE</p>
                    <p className="text-xl font-bold text-blue-700">
                      {records[0].vitals.bp}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-500">HEART RATE</p>
                    <p className="text-xl font-bold text-green-700">
                      {records[0].vitals.hr}{" "}
                      <span className="text-sm">bpm</span>
                    </p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-500">TEMPERATURE</p>
                    <p className="text-xl font-bold text-orange-700">
                      {records[0].vitals.temp}
                    </p>
                  </div>
                </div>

                {/* Vitals history chart (placeholder) */}
                <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                  <p className="text-gray-500 text-sm">
                    BP & Heart Rate Trend Chart
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No vitals data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Medical Record Timeline OR Edit Form */}
        <div className="flex-1">
          {isEditing && currentRecord ? (
            // EDIT FORM
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-blue-200 rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Edit className="text-blue-500" />
                  Edit Medical Record
                </h2>
                <span className="text-sm text-gray-500">
                  ID: {currentRecord.id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formValues.category}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  >
                    <option value="Diagnosis">Diagnosis</option>
                    <option value="Lab Work">Lab Work</option>
                    <option value="Procedure">Procedure</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Medication">Medication</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formValues.status}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Condition
                  </label>
                  <input
                    type="text"
                    name="condition"
                    value={formValues.condition}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Treatment
                  </label>
                  <input
                    type="text"
                    name="treatment"
                    value={formValues.treatment}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Doctor
                  </label>
                  <input
                    type="text"
                    name="doctor"
                    value={formValues.doctor}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formValues.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            // Keep your existing timeline view code
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <LocalHospital className="text-blue-500" />
                <span className="font-semibold text-lg">
                  Medical History Timeline
                </span>
                {currentRecord && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                    Viewing: {currentRecord.id}
                  </span>
                )}
              </div>

              {records.length > 0 ? (
                <div className="space-y-5">
                  {records.map((record) => (
                    <div
                      key={record.id}
                      className={`border rounded-xl p-4 shadow-sm ${
                        currentRecord && currentRecord.id === record.id
                          ? "bg-blue-50 border-blue-200 ring-2 ring-blue-200"
                          : "bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-gray-100 text-gray-700 rounded-lg p-2 w-16 text-center">
                            <div className="text-xs text-gray-500">
                              {record.date.split(" ")[0]}
                            </div>
                            <div className="text-lg font-bold">
                              {record.date.split(" ")[1]}
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(record.category)}
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                {record.category}
                              </span>
                            </div>
                            <h3 className="font-semibold mt-1">
                              {record.condition}
                            </h3>
                            <p className="text-sm text-gray-600 mt-0.5">
                              {record.treatment}
                            </p>
                          </div>
                        </div>

                        <div>
                          {record.status === "Completed" ? (
                            <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded">
                              <CheckCircle fontSize="small" />
                              <span className="font-medium text-sm">
                                Completed
                              </span>
                            </span>
                          ) : record.status === "Active" ? (
                            <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              <MonitorHeart fontSize="small" />
                              <span className="font-medium text-sm">
                                Active
                              </span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                              <HourglassEmpty fontSize="small" />
                              <span className="font-medium text-sm">
                                Pending
                              </span>
                            </span>
                          )}
                        </div>
                      </div>

                      {record.notes && (
                        <div className="bg-gray-50 rounded-lg p-3 mt-3 text-gray-700 text-sm">
                          <p>{record.notes}</p>
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                        <span className="text-sm text-gray-500">
                          Physician: {record.doctor}
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            className="text-blue-500 text-sm hover:font-bold hover:text-blue-700"
                            onClick={() => {
                              // You can add detailed view functionality here later
                            }}
                          >
                            <Visibility fontSize="small" /> View Details
                          </button>
                          <button
                            className="flex items-center gap-1 text-green-600 text-sm hover:text-green-800 hover:font-bold"
                            onClick={() => {
                              // This updates URL parameters to trigger edit mode
                              setSearchParams({
                                id: id,
                                tab: "Medical Record",
                                recordId: record.id,
                                edit: "true",
                              });
                            }}
                          >
                            <Edit fontSize="small" /> Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 border rounded-lg">
                  <LocalHospital
                    className="mx-auto text-gray-300 mb-3"
                    sx={{ fontSize: 40 }}
                  />
                  <p className="text-gray-500">
                    No medical records found for this patient
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordTab;
