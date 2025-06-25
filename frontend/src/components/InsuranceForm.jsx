import React from "react";
import { HealthAndSafety, Add, Delete } from "@mui/icons-material";
import FormField from "./FormField";

const relationshipOptions = [
  { value: "Self", label: "Self" },
  { value: "Spouse", label: "Spouse" },
  { value: "Child", label: "Child" },
  { value: "Other", label: "Other" },
];

const InsuranceForm = ({
  formData,
  hasInsurance,
  setHasInsurance,
  handleChange,
  errors,
  hasSecondaryInsurance = false,
  setHasSecondaryInsurance = () => {},
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <HealthAndSafety
            className={`mr-2 ${
              hasInsurance ? "text-blue-500" : "text-gray-400"
            }`}
            fontSize="small"
          />
          <h3 className="text-lg font-medium">Insurance Information</h3>
        </div>
        <div>
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
                <FormField
                  label="Provider"
                  name="provider"
                  value={formData.primary?.provider || ""}
                  onChange={(e) =>
                    handleChange(
                      "insurance.primary",
                      "provider",
                      e.target.value
                    )
                  }
                  error={errors["insurance.primary.provider"]}
                  required
                />

                <FormField
                  label="Policy Number"
                  name="policyNumber"
                  value={formData.primary?.policyNumber || ""}
                  onChange={(e) =>
                    handleChange(
                      "insurance.primary",
                      "policyNumber",
                      e.target.value
                    )
                  }
                  error={errors["insurance.primary.policyNumber"]}
                  required
                />

                <FormField
                  label="Group Number"
                  name="groupNumber"
                  value={formData.primary?.groupNumber || ""}
                  onChange={(e) =>
                    handleChange(
                      "insurance.primary",
                      "groupNumber",
                      e.target.value
                    )
                  }
                />

                <FormField
                  label="Policy Holder"
                  name="policyHolder"
                  value={formData.primary?.policyHolder || ""}
                  onChange={(e) =>
                    handleChange(
                      "insurance.primary",
                      "policyHolder",
                      e.target.value
                    )
                  }
                  error={errors["insurance.primary.policyHolder"]}
                  required
                />

                <FormField
                  label="Relationship to Patient"
                  name="relationship"
                  type="select"
                  value={formData.primary?.relationship || "Self"}
                  onChange={(e) =>
                    handleChange(
                      "insurance.primary",
                      "relationship",
                      e.target.value
                    )
                  }
                  options={relationshipOptions}
                />

                <FormField
                  label="Effective Date"
                  name="effectiveDate"
                  type="date"
                  value={formData.primary?.effectiveDate || ""}
                  onChange={(e) =>
                    handleChange(
                      "insurance.primary",
                      "effectiveDate",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            {/* Secondary Insurance */}
            {hasSecondaryInsurance && formData.secondary && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-blue-600">
                    Secondary Insurance
                  </div>
                  <button
                    type="button"
                    onClick={() => setHasSecondaryInsurance(false)}
                    className="text-red-600 hover:text-red-700 flex items-center gap-1 text-sm"
                  >
                    <Delete fontSize="small" /> Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                  {/* Secondary insurance fields */}
                  <FormField
                    label="Provider"
                    name="provider"
                    value={formData.secondary?.provider || ""}
                    onChange={(e) =>
                      handleChange(
                        "insurance.secondary",
                        "provider",
                        e.target.value
                      )
                    }
                    error={errors["insurance.secondary.provider"]}
                    required
                  />

                  <FormField
                    label="Policy Number"
                    name="policyNumber"
                    value={formData.secondary?.policyNumber || ""}
                    onChange={(e) =>
                      handleChange(
                        "insurance.secondary",
                        "policyNumber",
                        e.target.value
                      )
                    }
                    error={errors["insurance.secondary.policyNumber"]}
                    required
                  />

                  {/* More secondary insurance fields */}
                </div>
              </div>
            )}

            {/* Add Secondary Insurance Button */}
            {!hasSecondaryInsurance && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setHasSecondaryInsurance(true)}
                  className="px-4 py-2 bg-white border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 flex items-center gap-1"
                >
                  <Add fontSize="small" /> Add Secondary Insurance
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 border border-dashed border-gray-200 rounded-lg bg-gray-50">
            <div className="text-gray-500 mb-2">
              No insurance information will be added
            </div>
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
