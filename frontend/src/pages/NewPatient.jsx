import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowBack } from "@mui/icons-material";
import PersonalInfoForm from "../components/PersonalInfoForm";
import AddressForm from "../components/AddressForm";
import EmergencyContactForm from "../components/EmergencyContactForm";
import InsuranceForm from "../components/InsuranceForm";
import patientService from "../services/patientService";
import { useAuth } from "../hooks/useAuth";

const NewPatient = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Initialize form state with full structure
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      dob: "",
      gender: "male",
      phone: "",
      email: "",
      occupation: "",
      maritalStatus: "single",
      language: "English",
      ethnicity: "",
    },
    address: {
      street: "",
      city: "",
      state: "",
      country: "Nigeria",
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    hasInsurance: false,
    insurance: {
      provider: "",
      policyNumber: "",
      groupNumber: "",
      policyHolder: "",
      effectiveDate: "",
      expirationDate: "",
    },
    allergies: [],
    bloodType: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Handle regular form field changes
  const handleChange = (section, field, value) => {
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

    // Personal info validation
    if (!formData.personalInfo.firstName?.trim()) {
      newErrors["personalInfo.firstName"] = "First name is required";
    }
    if (!formData.personalInfo.lastName?.trim()) {
      newErrors["personalInfo.lastName"] = "Last name is required";
    }

    if (!formData.personalInfo.dob) {
      newErrors["personalInfo.dob"] = "Date of birth is required";
    }

    // Phone validation
    if (!formData.personalInfo.phone?.trim()) {
      newErrors["personalInfo.phone"] = "Phone number is required";
    } else {
      const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
      if (!phoneRegex.test(formData.personalInfo.phone)) {
        newErrors["personalInfo.phone"] = "Invalid phone number use only numbers, spaces, parenthesis or a leading '+'";
      }
    }

    // Email validation (optional field)
    if (formData.personalInfo.email?.trim() && !/\S+@\S+\.\S+/.test(formData.personalInfo.email)) {
      newErrors["personalInfo.email"] = "Invalid email format";
    }

    // Address validation
    if (!formData.address.street?.trim()) {
      newErrors["address.street"] = "Street address is required";
    }
    if (!formData.address.city?.trim()) {
      newErrors["address.city"] = "City is required";
    }
    if (!formData.address.state?.trim()) {
      newErrors["address.state"] = "State is required";
    }

    // Emergency contact validation
    if (!formData.emergencyContact.name?.trim()) {
      newErrors["emergencyContact.name"] = "Emergency contact name is required";
    }

    if (!formData.emergencyContact.phone?.trim()) {
      newErrors["emergencyContact.phone"] = "Emergency contact phone is required";
    } else {
      const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
      if (!phoneRegex.test(formData.emergencyContact.phone)) {
        newErrors["emergencyContact.phone"] = "Invalid phone number use only numbers, spaces, parenthesis or a leading '+'";
      }
    }

    // Single insurance validation
    if (formData.hasInsurance) {
      if (!formData.insurance.provider?.trim()) {
        newErrors["insurance.provider"] = "Provider name is required";
      }
      if (!formData.insurance.policyNumber?.trim()) {
        newErrors["insurance.policyNumber"] = "Policy number is required";
      }
      if (!formData.insurance.policyHolder?.trim()) {
        newErrors["insurance.policyHolder"] = "Policy holder name is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = document.querySelector(".error-message");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Transform form data to match backend schema
      const patientData = {
        firstName: formData.personalInfo.firstName,
        lastName: formData.personalInfo.lastName,
        dateOfBirth: formData.personalInfo.dob,
        gender: formData.personalInfo.gender,
        phone: formData.personalInfo.phone,
        email: formData.personalInfo.email,
        occupation: formData.personalInfo.occupation,
        maritalStatus: formData.personalInfo.maritalStatus,
        language: formData.personalInfo.language,
        ethnicity: formData.personalInfo.ethnicity,
        address: {
          street: formData.address.street,
          city: formData.address.city,
          state: formData.address.state,
          country: formData.address.country,
        },
        emergencyContact: {
          name: formData.emergencyContact.name,
          relationship: formData.emergencyContact.relationship,
          phone: formData.emergencyContact.phone,
        },
        insurance: formData.hasInsurance ? formData.insurance : undefined,
        allergies: formData.allergies || [],
        bloodType: formData.bloodType || undefined,
        createdBy: user._id,
      };

      const response = await patientService.createPatient(patientData);
      navigate(`/patients/patient-details?id=${response.data._id}`);
    } catch (err) {
      console.error("Failed to create patient:", err);
      setError(err.message || "Failed to create patient. Please try again.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
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

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

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
          handleChange={handleChange}
          errors={errors}
        />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/patients")}
            disabled={submitting}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save fontSize="small" />
            {submitting ? "Saving..." : "Save Patient"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPatient;
