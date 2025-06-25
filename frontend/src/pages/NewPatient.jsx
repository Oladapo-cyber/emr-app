import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowBack } from "@mui/icons-material";
import PersonalInfoForm from "../components/PersonalInfoForm";
import AddressForm from "../components/AddressForm";
import EmergencyContactForm from "../components/EmergencyContactForm";
import InsuranceForm from "../components/InsuranceForm";

const NewPatient = () => {
  const navigate = useNavigate();

  // Initialize form state with full structure
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      dob: "",
      gender: "Male",
      phone: "",
      email: "",
      occupation: "",
      maritalStatus: "Single",
      language: "English",
      ethnicity: "",
    },
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Nigeria",
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    hasInsurance: true,
    insurance: {
      primary: {
        provider: "",
        policyNumber: "",
        groupNumber: "",
        policyHolder: "",
        relationship: "Self",
        effectiveDate: "",
      },
      secondary: null,
    },
  });

  const [errors, setErrors] = useState({});
  const [hasSecondaryInsurance, setHasSecondaryInsurance] = useState(false);

  // Handle regular form field changes
  const handleChange = (section, field, value) => {
    // Handle nested properties with dot notation (e.g., "insurance.primary")
    if (section.includes(".")) {
      const [parentSection, childSection] = section.split(".");
      setFormData((prev) => ({
        ...prev,
        [parentSection]: {
          ...prev[parentSection],
          [childSection]: {
            ...prev[parentSection][childSection],
            [field]: value,
          },
        },
      }));
    } else {
      // Handle regular section updates
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    }

    // Clear any errors for this field
    const errorKey = section.includes(".")
      ? `${section}.${field}`
      : `${section}.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // Validate the form before submission
  const validateForm = () => {
    const newErrors = {};

    // Required personal info fields
    if (!formData.personalInfo.firstName.trim()) {
      newErrors["personalInfo.firstName"] = "First name is required";
    }

    if (!formData.personalInfo.lastName.trim()) {
      newErrors["personalInfo.lastName"] = "Last name is required";
    }

    if (!formData.personalInfo.dob) {
      newErrors["personalInfo.dob"] = "Date of birth is required";
    }

    if (!formData.personalInfo.phone.trim()) {
      newErrors["personalInfo.phone"] = "Phone number is required";
    }

    // Email validation if provided
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      formData.personalInfo.email &&
      !emailRegex.test(formData.personalInfo.email)
    ) {
      newErrors["personalInfo.email"] = "Valid email is required";
    }

    // Address validation
    if (!formData.address.street.trim()) {
      newErrors["address.street"] = "Street address is required";
    }

    if (!formData.address.city.trim()) {
      newErrors["address.city"] = "City is required";
    }

    if (!formData.address.state.trim()) {
      newErrors["address.state"] = "State is required";
    }

    // Emergency contact
    if (!formData.emergencyContact.name.trim()) {
      newErrors["emergencyContact.name"] = "Emergency contact name is required";
    }

    if (!formData.emergencyContact.phone.trim()) {
      newErrors["emergencyContact.phone"] =
        "Emergency contact phone is required";
    }

    // Insurance validation if enabled
    if (formData.hasInsurance) {
      if (!formData.insurance.primary.provider.trim()) {
        newErrors["insurance.primary.provider"] = "Provider name is required";
      }

      if (!formData.insurance.primary.policyNumber.trim()) {
        newErrors["insurance.primary.policyNumber"] =
          "Policy number is required";
      }

      if (!formData.insurance.primary.policyHolder.trim()) {
        newErrors["insurance.primary.policyHolder"] =
          "Policy holder name is required";
      }

      // Secondary insurance validation if added
      if (hasSecondaryInsurance && formData.insurance.secondary) {
        if (!formData.insurance.secondary.provider?.trim()) {
          newErrors["insurance.secondary.provider"] =
            "Provider name is required";
        }

        if (!formData.insurance.secondary.policyNumber?.trim()) {
          newErrors["insurance.secondary.policyNumber"] =
            "Policy number is required";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add/remove secondary insurance
  const handleSecondaryInsurance = (hasSecondary) => {
    setHasSecondaryInsurance(hasSecondary);
    if (hasSecondary) {
      setFormData((prev) => ({
        ...prev,
        insurance: {
          ...prev.insurance,
          secondary: {
            provider: "",
            policyNumber: "",
            groupNumber: "",
            policyHolder: "",
            relationship: "Self",
            effectiveDate: "",
          },
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        insurance: {
          ...prev.insurance,
          secondary: null,
        },
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // In a real app, you would send this data to your API
      console.log("Form submitted:", formData);

      // Generate a random patient ID for demo purposes
      const patientId = `P${Math.floor(1000 + Math.random() * 9000)}`;

      // Navigate to the patient details page with the new ID
      navigate(
        `/patients/patient-details?id=${patientId}&tab=Patient Information`
      );
    } else {
      // Scroll to the first error
      const firstError = document.querySelector(".error-message");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Patient</h1>
          <p className="text-gray-500 text-sm mt-1">
            Enter patient information to create a new record
          </p>
        </div>
        <button
          onClick={() => navigate("/patients")}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <ArrowBack fontSize="small" /> Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <PersonalInfoForm
          formData={formData.personalInfo}
          handleChange={handleChange}
          errors={errors}
        />

        <AddressForm
          formData={formData.address}
          handleChange={handleChange}
          errors={errors}
        />

        <EmergencyContactForm
          formData={formData.emergencyContact}
          handleChange={handleChange}
          errors={errors}
        />

        <InsuranceForm
          formData={formData.insurance}
          hasInsurance={formData.hasInsurance}
          setHasInsurance={(value) =>
            setFormData((prev) => ({ ...prev, hasInsurance: value }))
          }
          hasSecondaryInsurance={hasSecondaryInsurance}
          setHasSecondaryInsurance={handleSecondaryInsurance}
          handleChange={handleChange}
          errors={errors}
        />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/patients")}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Save fontSize="small" /> Save Patient
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPatient;
