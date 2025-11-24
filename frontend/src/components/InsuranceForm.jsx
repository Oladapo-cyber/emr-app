import React from "react";
import { HealthAndSafety } from "@mui/icons-material";
import FormField from "./FormField";

const InsuranceForm = ({
  formData,
  hasInsurance,
  setHasInsurance,
  handleChange,
  errors,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <HealthAndSafety
            className={`mr-2 ${hasInsurance ? "text-blue-500" : "text-gray-400"}`}
            fontSize="small"
          />
          <h3 className={`text-lg font-medium ${hasInsurance ? "" : "text-gray-500"}`}>
            Insurance Information
          </h3>
        </div>
        <label className="inline-flex items-center cursor-pointer">
          <span className="mr-2 text-sm text-gray-600">Has Insurance</span>
          <input
            type="checkbox"
            checked={hasInsurance}
            onChange={() => setHasInsurance(!hasInsurance)}
            className="sr-only peer"
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
        </label>
      </div>

      <div className="p-6">
        {hasInsurance ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            <FormField
              label="Provider"
              name="provider"
              value={formData?.provider || ""}
              onChange={(e) => handleChange("insurance", "provider", e.target.value)}
              error={errors["insurance.provider"]}
              required
            />

            <FormField
              label="Policy Number"
              name="policyNumber"
              value={formData?.policyNumber || ""}
              onChange={(e) => handleChange("insurance", "policyNumber", e.target.value)}
              error={errors["insurance.policyNumber"]}
              required
            />

            <FormField
              label="Group Number"
              name="groupNumber"
              value={formData?.groupNumber || ""}
              onChange={(e) => handleChange("insurance", "groupNumber", e.target.value)}
            />

            <FormField
              label="Policy Holder"
              name="policyHolder"
              value={formData?.policyHolder || ""}
              onChange={(e) => handleChange("insurance", "policyHolder", e.target.value)}
              error={errors["insurance.policyHolder"]}
              required
            />

            <FormField
              label="Effective Date"
              name="effectiveDate"
              type="date"
              value={formData?.effectiveDate || ""}
              onChange={(e) => handleChange("insurance", "effectiveDate", e.target.value)}
            />

            <FormField
              label="Expiration Date"
              name="expirationDate"
              type="date"
              value={formData?.expirationDate || ""}
              onChange={(e) => handleChange("insurance", "expirationDate", e.target.value)}
            />
          </div>
        ) : (
          <div className="text-center py-6 border border-dashed border-gray-200 rounded-lg bg-gray-50">
            <div className="text-gray-500 mb-2">No insurance information on file</div>
            <div className="text-sm text-gray-400">
              Toggle the switch above if patient has insurance coverage
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsuranceForm;
