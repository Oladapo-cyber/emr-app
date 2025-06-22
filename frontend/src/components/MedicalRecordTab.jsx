import React from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle, HourglassEmpty } from "@mui/icons-material";

// Sample medical records data
const medicalRecordsData = {
  P001: [
    {
      id: "MR001",
      date: "MAR 03",
      condition: "Caries",
      treatment: "Tooth filling",
      doctor: "Drg Soap Mactavish",
      status: "Done",
      notes: "Advanced Decay",
      tooth: "Maxillary Left Lateral Incisor",
    },
  ],
  P002: [
    {
      id: "MR002",
      date: "APR 12",
      condition: "Caries",
      treatment: "Tooth filling",
      doctor: "Drg Soap Mactavish",
      status: "Pending",
      notes: "Reason: Not enough time\nDecay in pulp",
      tooth: "Maxillary Left Lateral Incisor",
    },
  ],
  P003: [
    {
      id: "MR003",
      date: "JAN 10",
      condition: "Routine Checkup",
      treatment: "Cleaning & Examination",
      doctor: "Dr. Mike Wilson",
      status: "Done",
      notes: "No issues found",
      tooth: "General",
    },
  ],
};

const MedicalRecordTab = ({ patientId }) => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id") || patientId;

  // Get records for this patient
  const records = medicalRecordsData[id] || [];

  return (
    <div>
      {records.length > 0 ? (
        <div className="space-y-4">
          {records.map((record) => (
            <div key={record.id} className="border rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 text-blue-700 rounded-lg p-2">
                    <div className="text-xs">{record.date.split(" ")[0]}</div>
                    <div className="text-lg font-bold">
                      {record.date.split(" ")[1]}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">{record.treatment}</h3>
                    <p className="text-sm text-gray-600">{record.condition}</p>
                  </div>
                </div>
                <div>
                  {record.status === "Done" ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle fontSize="small" />
                      <span className="font-medium">Done</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-yellow-600">
                      <HourglassEmpty fontSize="small" />
                      <span className="font-medium">Pending</span>
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-2 text-sm">
                <p className="text-gray-700">{record.notes}</p>
                <p className="mt-1 text-gray-500">{record.doctor}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border rounded-lg">
          <p className="text-gray-500">
            No medical records found for this patient
          </p>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordTab;
