import React, { useState, useEffect } from "react";
import { Edit } from "@mui/icons-material";

const EditRecordModal = ({ record, onSave, onCancel }) => {
  const [formValues, setFormValues] = useState({
    category: record?.category || "",
    condition: record?.condition || "",
    treatment: record?.treatment || "",
    notes: record?.notes || "",
    status: record?.status || "Active",
    doctor: record?.doctor || "",
  });

  // Update form when record changes
  useEffect(() => {
    if (record) {
      setFormValues({
        category: record.category,
        condition: record.condition,
        treatment: record.treatment,
        notes: record.notes,
        status: record.status,
        doctor: record.doctor,
      });
    }
  }, [record]);

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
    onSave(formValues);
  };

  return (
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
          ID: {record?.id}
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
          onClick={onCancel}
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
  );
};

export default EditRecordModal;
