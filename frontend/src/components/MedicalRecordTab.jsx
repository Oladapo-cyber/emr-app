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
  FilterList,
} from "@mui/icons-material";
import RecordDetailModal from "./modals/RecordDetailModal";
import EditRecordModal from "./modals/EditRecordModal";
import { SearchOff, FilterAltOff } from "@mui/icons-material";

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

  // Add these state variables for the modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDetailRecord, setSelectedDetailRecord] = useState(null);

  // Add state for active filter
  const [activeFilter, setActiveFilter] = useState("all");

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

  // Filter records based on active filter
  const filteredRecords = records.filter((record) => {
    if (activeFilter === "all") return true;
    return record.category === activeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Medical Record Categories */}
      {/* <div className="flex gap-2 mb-4">
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
      </div> */}

      {/* Filter section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <FilterList className="text-gray-500" />
          <span className="text-sm text-gray-500 font-medium">
            Filter by record type:
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 text-sm rounded-full flex items-center gap-1 ${
              activeFilter === "all"
                ? "bg-blue-100 text-blue-700 border border-blue-200"
                : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            All Records
          </button>

          <button
            onClick={() => setActiveFilter("Diagnosis")}
            className={`px-3 py-1.5 text-sm rounded-full flex items-center gap-1 ${
              activeFilter === "Diagnosis"
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Diagnosis
          </button>

          <button
            onClick={() => setActiveFilter("Lab Work")}
            className={`px-3 py-1.5 text-sm rounded-full flex items-center gap-1 ${
              activeFilter === "Lab Work"
                ? "bg-purple-100 text-purple-700 border border-purple-200"
                : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            Lab Work
          </button>

          <button
            onClick={() => setActiveFilter("Procedure")}
            className={`px-3 py-1.5 text-sm rounded-full flex items-center gap-1 ${
              activeFilter === "Procedure"
                ? "bg-orange-100 text-orange-700 border border-orange-200"
                : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            Procedure
          </button>

          <button
            onClick={() => setActiveFilter("Follow-up")}
            className={`px-3 py-1.5 text-sm rounded-full flex items-center gap-1 ${
              activeFilter === "Follow-up"
                ? "bg-teal-100 text-teal-700 border border-teal-200"
                : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
            Follow-up
          </button>
        </div>
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
            <EditRecordModal
              record={currentRecord}
              onSave={(updatedRecord) => {
                // In a real app, you would update the database here
                // For now, just exit edit mode
                setSearchParams({ id, tab: "Medical Record", recordId });
              }}
              onCancel={handleCancel}
            />
          ) : (
            // Keep your existing timeline view code
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-100 p-1 rounded text-blue-500">
                  <LocalHospital fontSize="small" />
                </span>
                <h3 className="text-lg font-medium">
                  Medical History Timeline
                </h3>
                {currentRecord && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                    Viewing: {currentRecord.id}
                  </span>
                )}
              </div>

              {filteredRecords.length > 0 ? (
                <div className="space-y-5">
                  {filteredRecords.map((record) => (
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
                            className="text-blue-500 text-sm hover:text-blue-700 hover:font-bold flex items-center gap-1"
                            onClick={() => {
                              setSelectedDetailRecord(record);
                              setShowDetailModal(true);
                            }}
                          >
                            <Visibility fontSize="small" /> View Details
                          </button>
                          <button
                            className="flex items-center gap-1 text-green-500 text-sm hover:text-green-700 hover:font-bold"
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
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                  <div className="mb-4 flex justify-center">
                    <span className="p-3 bg-gray-100 rounded-full text-gray-400">
                      <SearchOff fontSize="large" />
                    </span>
                  </div>
                  <h4 className="text-lg font-medium text-gray-700 mb-2">
                    No Records Found
                  </h4>
                  <p className="text-gray-500">
                    {activeFilter === "all"
                      ? "This patient doesn't have any medical records yet."
                      : `No ${activeFilter} records found for this patient.`}
                  </p>
                  {activeFilter !== "all" && (
                    <button
                      className="mt-4 text-blue-600 hover:text-blue-700 hover:font-bold flex items-center gap-1 mx-auto"
                      onClick={() => setActiveFilter("all")}
                    >
                      <FilterAltOff fontSize="small" />
                      Clear filter
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Record Detail Modal */}
      {showDetailModal && (
        <RecordDetailModal
          record={selectedDetailRecord}
          onClose={() => setShowDetailModal(false)}
          onEdit={(recordId) => {
            setSearchParams({
              id: id,
              tab: "Medical Record",
              recordId: recordId,
              edit: "true",
            });
          }}
          getCategoryIcon={getCategoryIcon}
        />
      )}
    </div>
  );
};

export default MedicalRecordTab;
