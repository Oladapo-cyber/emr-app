import React from "react";
import { Home } from "@mui/icons-material";
import FormField from "./FormField";

const AddressForm = ({ formData, handleChange, errors }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4 flex items-center">
        <Home className="text-blue-500 mr-2" fontSize="small" />
        <h3 className="text-lg font-medium">Address Information</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          <div className="lg:col-span-2">
            <FormField
              label="Street Address"
              name="street"
              value={formData.street}
              onChange={(e) =>
                handleChange("address", "street", e.target.value)
              }
              error={errors["address.street"]}
              required
            />
          </div>

          <FormField
            label="City"
            name="city"
            value={formData.city}
            onChange={(e) => handleChange("address", "city", e.target.value)}
            error={errors["address.city"]}
            required
          />

          <FormField
            label="State"
            name="state"
            value={formData.state}
            onChange={(e) => handleChange("address", "state", e.target.value)}
            error={errors["address.state"]}
            required
          />

          <FormField
            label="ZIP Code"
            name="zipCode"
            value={formData.zipCode}
            onChange={(e) => handleChange("address", "zipCode", e.target.value)}
          />

          <FormField
            label="Country"
            name="country"
            value={formData.country}
            onChange={(e) => handleChange("address", "country", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
