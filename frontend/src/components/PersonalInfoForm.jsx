import React from "react";
import { Person } from "@mui/icons-material";
import FormField from "./FormField";

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Non-binary", label: "Non-binary" },
  { value: "Other", label: "Other" },
];

const maritalStatusOptions = [
  { value: "Single", label: "Single" },
  { value: "Married", label: "Married" },
  { value: "Divorced", label: "Divorced" },
  { value: "Widowed", label: "Widowed" },
  { value: "Separated", label: "Separated" },
];

const PersonalInfoForm = ({ formData, handleChange, errors }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4 flex items-center">
        <Person className="text-blue-500 mr-2" fontSize="small" />
        <h3 className="text-lg font-medium">Personal Information</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          <FormField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={(e) =>
              handleChange("personalInfo", "firstName", e.target.value)
            }
            error={errors["personalInfo.firstName"]}
            required
          />

          <FormField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={(e) =>
              handleChange("personalInfo", "lastName", e.target.value)
            }
            error={errors["personalInfo.lastName"]}
            required
          />

          <FormField
            label="Date of Birth"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={(e) =>
              handleChange("personalInfo", "dob", e.target.value)
            }
            error={errors["personalInfo.dob"]}
            required
          />

          <FormField
            label="Gender"
            name="gender"
            type="select"
            value={formData.gender}
            onChange={(e) =>
              handleChange("personalInfo", "gender", e.target.value)
            }
            options={genderOptions}
          />

          <FormField
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              handleChange("personalInfo", "phone", e.target.value)
            }
            error={errors["personalInfo.phone"]}
            placeholder="(555) 123-4567"
            required
          />

          <FormField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              handleChange("personalInfo", "email", e.target.value)
            }
            error={errors["personalInfo.email"]}
            placeholder="patient@example.com"
          />

          <FormField
            label="Occupation"
            name="occupation"
            value={formData.occupation}
            onChange={(e) =>
              handleChange("personalInfo", "occupation", e.target.value)
            }
          />

          <FormField
            label="Marital Status"
            name="maritalStatus"
            type="select"
            value={formData.maritalStatus}
            onChange={(e) =>
              handleChange("personalInfo", "maritalStatus", e.target.value)
            }
            options={maritalStatusOptions}
          />

          <FormField
            label="Preferred Language"
            name="language"
            value={formData.language}
            onChange={(e) =>
              handleChange("personalInfo", "language", e.target.value)
            }
            placeholder="English"
          />

          <FormField
            label="Ethnicity"
            name="ethnicity"
            value={formData.ethnicity}
            onChange={(e) =>
              handleChange("personalInfo", "ethnicity", e.target.value)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
