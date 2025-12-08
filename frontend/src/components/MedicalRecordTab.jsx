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
  SearchOff,
  FilterAltOff,
} from "@mui/icons-material";
import RecordDetailModal from "./modals/RecordDetailModal";
import EditRecordModal from "./modals/EditRecordModal";
import { medicalRecordService } from "../services";
import { formatDate } from "../utils/dateUtils";

// Get appropriate icon for record category
const getCategoryIcon = (category) => {
  const categoryMap = {
    'routine_checkup': <MonitorHeart className="text-green-500" />,
    'emergency': <LocalHospital className="text-red-500" />,
    'follow_up': <MonitorHeart className="text-green-500" />,
    'consultation': <LocalHospital className="text-blue-500" />,
    'procedure': <BloodtypeOutlined className="text-red-500" />,
    'lab_result': <Science className="text-purple-500" />,
    'diagnosis': <LocalHospital className="text-blue-500" />,
  };
  
  return categoryMap[category] || <LocalHospital className="text-gray-500" />;
};

const MedicalRecordTab = ({ patientId }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id") || patientId;
  const recordId = searchParams.get("recordId");
  const isEditing = searchParams.get("edit") === "true";

  // State management
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDetailRecord, setSelectedDetailRecord] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  // Fetch medical records on component mount
  useEffect(() => {
    if (id) {
      fetchMedicalRecords();
    }
  }, [id]);

  const fetchMedicalRecords = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await medicalRecordService.getPatientRecords(id);
      
      // Transform backend data to component format
      const transformedRecords = (response.data || []).map(record => ({
        id: record._id,
        date: formatRecordDate(record.visitDate || record.createdAt),
        category: formatCategory(record.visitType),
        condition: record.diagnosis || 'N/A',
        treatment: record.treatment || 'N/A',
        doctor: `${record.attendingPhysician?.firstName || 'Dr.'} ${record.attendingPhysician?.lastName || 'Unknown'}`,
        status: formatStatus(record.status),
        notes: record.notes || '',
        vitals: record.vitalSigns || null,
        // Keep full record for detailed view
        fullRecord: record
      }));

      setRecords(transformedRecords);
    } catch (err) {
      console.error('Failed to fetch medical records:', err);
      setError(err.message || 'Failed to load medical records');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const formatRecordDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day = date.getDate();
    return `${month} ${day}`;
  };

  const formatCategory = (visitType) => {
    const categoryMap = {
      'routine_checkup': 'Routine Checkup',
      'emergency': 'Emergency',
      'follow_up': 'Follow-up',
      'consultation': 'Consultation',
      'procedure': 'Procedure'
    };
    return categoryMap[visitType] || visitType;
  };

  const formatStatus = (status) => {
    const statusMap = {
      'draft': 'Pending',
      'completed': 'Completed',
      'reviewed': 'Active'
    };
    return statusMap[status] || status;
  };

  // Find current record to display/edit
  const currentRecord = recordId
    ? records.find((r) => r.id === recordId)
    : null;

  // Filter records based on active filter
  const filteredRecords = records.filter((record) => {
    if (activeFilter === "all") return true;
    return record.category === activeFilter;
  });

  // Get latest vitals from most recent record
  const latestVitals = records.length > 0 && records[0].vitals 
    ? records[0].vitals 
    : null;

  // Handle record update
  const handleRecordUpdate = async (updatedRecord) => {
    try {
      await medicalRecordService.updateMedicalRecord(currentRecord.id, updatedRecord);
      
      // Refresh records after update
      await fetchMedicalRecords();
      
      // Exit edit mode
      setSearchParams({ id, tab: "Medical Record" });
    } catch (err) {
      console.error('Failed to update record:', err);
      alert(`Failed to update record: ${err.message}`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-500">Loading medical records...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">Failed to load medical records</p>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={fetchMedicalRecords}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
            All Records ({records.length})
          </button>

          {['Routine Checkup', 'Emergency', 'Follow-up', 'Consultation', 'Procedure'].map(category => {
            const count = records.filter(r => r.category === category).length;
            if (count === 0) return null;
            
            return (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-3 py-1.5 text-sm rounded-full flex items-center gap-1 ${
                  activeFilter === category
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                {category} ({count})
              </button>
            );
          })}
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
            {latestVitals ? (
              <div>
                {/* Latest vitals */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {latestVitals.bloodPressure && (
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <p className="text-xs text-gray-500">BLOOD PRESSURE</p>
                      <p className="text-xl font-bold text-blue-700">
                        {latestVitals.bloodPressure.systolic}/{latestVitals.bloodPressure.diastolic}
                      </p>
                    </div>
                  )}
                  {latestVitals.heartRate && (
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <p className="text-xs text-gray-500">HEART RATE</p>
                      <p className="text-xl font-bold text-green-700">
                        {latestVitals.heartRate} <span className="text-sm">bpm</span>
                      </p>
                    </div>
                  )}
                  {latestVitals.temperature && (
                    <div className="bg-orange-50 p-3 rounded-lg text-center">
                      <p className="text-xs text-gray-500">TEMPERATURE</p>
                      <p className="text-xl font-bold text-orange-700">
                        {latestVitals.temperature}°F
                      </p>
                    </div>
                  )}
                </div>

                {latestVitals.weight && (
                  <div className="bg-purple-50 p-3 rounded-lg mb-4">
                    <p className="text-xs text-gray-500">Weight</p>
                    <p className="text-lg font-bold text-purple-700">
                      {latestVitals.weight} kg
                    </p>
                  </div>
                )}

                {/* Vitals history chart (placeholder) */}
                <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                  <p className="text-gray-500 text-sm">
                    Vitals Trend Chart
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
              record={currentRecord.fullRecord || currentRecord}
              onSave={handleRecordUpdate}
              onCancel={() => setSearchParams({ id, tab: "Medical Record" })}
            />
          ) : (
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
                              {getCategoryIcon(record.fullRecord?.visitType || record.category.toLowerCase().replace(' ', '_'))}
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
