import { useState, useEffect } from "react";
import {
  Close,
  CalendarToday,
  AccessTime,
  Person,
  Notes,
  MedicalServices,
  Timer,
} from "@mui/icons-material";

const NewAppointmentModal = ({
  isOpen,
  onClose,
  onSave,
  appointmentToEdit,
}) => {
  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    date: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
    time: "09:00",
    duration: 30,
    type: "Consultation",
    doctor: "Dr. Soap Mactavish",
    notes: "",
    status: "Confirmed",
  });

  useEffect(() => {
    if (appointmentToEdit) {
      let dateValue = appointmentToEdit.date;
      if (typeof dateValue === "string") {
        dateValue = new Date(dateValue);
      }
      setFormData({
        patientId: appointmentToEdit.patientId,
        patientName: appointmentToEdit.patientName,
        date: dateValue.toISOString().split("T")[0],
        time: appointmentToEdit.time,
        duration: appointmentToEdit.duration,
        type: appointmentToEdit.type,
        doctor: appointmentToEdit.doctor,
        notes: appointmentToEdit.notes || "",
        status: appointmentToEdit.status,
      });
    }
  }, [appointmentToEdit]);

  // Sample data for dropdowns
  const doctors = [
    "Dr. Soap Mactavish",
    "Dr. Sarah Johnson",
    "Dr. Emily Wilson",
    "Dr. Robert Davis",
  ];

  const appointmentTypes = [
    "Consultation",
    "Follow-up",
    "Examination",
    "Treatment",
    "Surgery",
    "Checkup",
  ];

  // Sample patients for the patient search functionality
  const patients = [
    { id: "P001", name: "Willie Jennie" },
    { id: "P002", name: "Christopher Smallwood" },
    { id: "P003", name: "Maria Garcia" },
    { id: "P004", name: "Robert Johnson" },
    { id: "P005", name: "Emma Wilson" },
    { id: "P006", name: "James Brown" },
    { id: "P007", name: "Linda Davis" },
  ];

  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [errors, setErrors] = useState({});

  const handlePatientSearch = (searchTerm) => {
    const filtered = patients.filter((patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
    setShowPatientDropdown(searchTerm.length > 0);
  };

  const handlePatientSelect = (patient) => {
    setFormData({
      ...formData,
      patientId: patient.id,
      patientName: patient.name,
    });
    setShowPatientDropdown(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "patientName") {
      handlePatientSearch(value);
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.patientName.trim()) {
      errors.patientName = "Patient name is required";
    }

    if (!formData.date) {
      errors.date = "Date is required";
    } else {
      const selectedDate = new Date(formData.date);
      if (selectedDate < new Date().setHours(0, 0, 0, 0)) {
        errors.date = "Cannot schedule appointments in the past";
      }
    }

    // Add more validations as needed

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      // Handle form errors (e.g., show error messages)
      return;
    }

    setErrors({}); // Clear errors if the form is valid

    // Create a date object from the form date and time
    const appointmentDate = new Date(`${formData.date}T${formData.time}`);

    // Create the appointment object
    const newAppointment = {
      id: `A${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      patientName: formData.patientName,
      patientId: formData.patientId,
      time: formData.time,
      duration: parseInt(formData.duration),
      date: appointmentDate,
      type: formData.type,
      doctor: formData.doctor,
      notes: formData.notes,
      status: formData.status,
    };

    onSave(newAppointment);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {appointmentToEdit ? "Edit Appointment" : "New Appointment"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <Close />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]"
        >
          <div className="space-y-6">
            {/* Patient Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Patient <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.patientName ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.patientName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.patientName}
                  </p>
                )}
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarToday className="text-gray-400" fontSize="small" />
                  </div>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AccessTime className="text-gray-400" fontSize="small" />
                  </div>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Type and Doctor */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Appointment Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MedicalServices
                      className="text-gray-400"
                      fontSize="small"
                    />
                  </div>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {appointmentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Doctor <span className="text-red-500">*</span>
                </label>
                <select
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {doctors.map((doctor) => (
                    <option key={doctor} value={doctor}>
                      {doctor}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Duration and Status */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Duration (minutes) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Timer className="text-gray-400" fontSize="small" />
                  </div>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                    <option value="120">120 minutes</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <Notes className="text-gray-400" fontSize="small" />
                </div>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add appointment notes"
                  rows="3"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAppointmentModal;
