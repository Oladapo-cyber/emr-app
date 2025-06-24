import React from "react";
import { Edit } from "@mui/icons-material";

const RecordDetailModal = ({ record, onClose, onEdit, getCategoryIcon }) => {
  if (!record) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            {getCategoryIcon(record.category)}
            <h2 className="text-xl font-semibold">{record.condition}</h2>
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
                <div className="text-sm text-gray-500">Category</div>
                <div className="font-medium">{record.category}</div>
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
                <div className="text-sm text-gray-500">Condition</div>
                <div className="font-medium">{record.condition}</div>
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

          {/* Vitals */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">VITALS</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">BLOOD PRESSURE</div>
                <div className="text-xl font-bold text-blue-700">
                  {record.vitals?.bp || "N/A"}
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">HEART RATE</div>
                <div className="text-xl font-bold text-green-700">
                  {record.vitals?.hr || "N/A"}{" "}
                  <span className="text-sm">bpm</span>
                </div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">TEMPERATURE</div>
                <div className="text-xl font-bold text-orange-700">
                  {record.vitals?.temp || "N/A"}
                </div>
              </div>
            </div>
          </div>

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
