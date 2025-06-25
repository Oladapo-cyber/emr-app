import React from "react";
import { ContactPhone } from "@mui/icons-material";
import FormField from "./FormField";

const EmergencyContactForm = ({ formData, handleChange, errors }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4 flex items-center">
        <ContactPhone className="text-blue-500 mr-2" fontSize="small" />
        <h3 className="text-lg font-medium">Emergency Contact</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
          <FormField
            label="Name"
            name="name"
            value={formData.name}
            onChange={(e) =>
              handleChange("emergencyContact", "name", e.target.value)
            }
            error={errors["emergencyContact.name"]}
            required
          />

          <FormField
            label="Relationship"
            name="relationship"
            value={formData.relationship}
            onChange={(e) =>
              handleChange("emergencyContact", "relationship", e.target.value)
            }
          />

          <FormField
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              handleChange("emergencyContact", "phone", e.target.value)
            }
            error={errors["emergencyContact.phone"]}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default EmergencyContactForm;
