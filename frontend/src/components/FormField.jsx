import React from "react";

const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  options = null,
  placeholder = "",
}) => {
  // Common styling for form fields with error handling
  const inputClasses = `mt-1 block w-full rounded-md shadow-sm p-2 border ${
    error
      ? "border-red-300 focus:border-red-500 focus:ring focus:ring-red-200"
      : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"
  } focus:ring-opacity-50`;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={inputClasses}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600 error-message">{error}</p>
      )}
    </div>
  );
};

export default FormField;
