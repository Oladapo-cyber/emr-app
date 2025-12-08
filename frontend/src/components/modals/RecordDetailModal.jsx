import React from "react";
import { Edit, FolderOpen } from "@mui/icons-material";

const RecordDetailModal = ({ record, onClose, onEdit, getCategoryIcon }) => {
  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            {getCategoryIcon(record.recordType)}
            <h2 className="text-xl font-semibold">{record.diagnosis}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Record info */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              RECORD INFORMATION
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Record ID</div>
                <div className="font-medium">{record.id}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Date</div>
                <div className="font-medium">{record.date}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Record Type</div>
                <div className="font-medium">{record.recordType}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Status</div>
                <div className="font-medium">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${
                      record.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : record.status === "Active"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {record.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-200" />

          {/* Medical Details */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              MEDICAL DETAILS
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Diagnosis</div>
                <div className="font-medium">{record.diagnosis}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Treatment</div>
                <div className="font-medium">{record.treatment}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Physician</div>
                <div className="font-medium">{record.doctor}</div>
              </div>
            </div>
          </div>

          {/* Vital Signs Section */}
          {record.vitalSigns && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                VITAL SIGNS
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {record.vitalSigns.temperature && (
                  <div>
                    <div className="text-sm text-gray-500">Temperature</div>
                    <div className="font-medium">
                      {record.vitalSigns.temperature}°F
                    </div>
                  </div>
                )}
                {record.vitalSigns.bloodPressure && (
                  <div>
                    <div className="text-sm text-gray-500">Blood Pressure</div>
                    <div className="font-medium">
                      {record.vitalSigns.bloodPressure.systolic}/
                      {record.vitalSigns.bloodPressure.diastolic} mmHg
                    </div>
                  </div>
                )}
                {record.vitalSigns.heartRate && (
                  <div>
                    <div className="text-sm text-gray-500">Heart Rate</div>
                    <div className="font-medium">
                      {record.vitalSigns.heartRate} bpm
                    </div>
                  </div>
                )}
                {record.vitalSigns.weight && (
                  <div>
                    <div className="text-sm text-gray-500">Weight</div>
                    <div className="font-medium">
                      {record.vitalSigns.weight} kg
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Medications Section */}
          {record.medications && record.medications.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                MEDICATIONS
              </h3>
              <div className="space-y-2">
                {record.medications.map((med, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">{med.name}</div>
                    <div className="text-sm text-gray-600">
                      {med.dosage} - {med.frequency} for {med.duration}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attachments Section */}
          {record.attachments && record.attachments.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                ATTACHMENTS
              </h3>
              <div className="space-y-2">
                {record.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                  >
                    <FolderOpen fontSize="small" className="text-gray-400" />
                    <span className="text-sm">{file.filename}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {record.notes && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">NOTES</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {record.notes}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-end space-x-3 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onEdit(record.id);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Edit fontSize="small" /> Edit Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordDetailModal;
