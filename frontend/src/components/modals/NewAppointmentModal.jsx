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
import { patientService, userService } from "../../services";

const NewAppointmentModal = ({
  isOpen,
  onClose,
  onSave,
  appointmentToEdit,
}) => {
  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    date: new Date().toISOString().split("T")[0],
    time: "09:00",
    duration: 30,
    type: "Consultation",
    doctor: "",
    providerId: "",
    notes: "",
    status: "Confirmed",
  });

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch doctors and patients on mount
  useEffect(() => {
    fetchDoctors();
    fetchPatients();
  }, []);

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
        providerId: appointmentToEdit.providerId || "",
        notes: appointmentToEdit.notes || "",
        status: appointmentToEdit.status,
      });
    }
  }, [appointmentToEdit]);

  const fetchDoctors = async () => {
    try {
      const response = await userService.getDoctors();
      setDoctors(response.data || []);
      
      // Set first doctor as default if available
      if (response.data?.length > 0 && !formData.doctor) {
        const firstDoctor = response.data[0];
        setFormData(prev => ({
          ...prev,
          doctor: `${firstDoctor.firstName} ${firstDoctor.lastName}`,
          providerId: firstDoctor._id
        }));
      }
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await patientService.getPatients({ limit: 100 });
      setPatients(response.data || []);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    }
  };

  const appointmentTypes = [
    "Consultation",
    "Follow-up",
    "Examination",
    "Treatment",
    "Surgery",
    "Checkup",
  ];

  const handlePatientSearch = (searchTerm) => {
    const filtered = patients.filter((patient) => {
      const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase()) ||
             patient.patientId?.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredPatients(filtered);
    setShowPatientDropdown(searchTerm.length > 0);
  };

  const handlePatientSelect = (patient) => {
    setFormData({
      ...formData,
      patientId: patient._id,
      patientName: `${patient.firstName} ${patient.lastName}`,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      // Transform form data to match backend schema
      const appointmentData = {
        patient: formData.patientId,
        provider: formData.providerId || formData.doctor,
        appointmentDate: formData.date,
        appointmentTime: {
          start: formData.time,
          end: calculateEndTime(formData.time, formData.duration)
        },
        appointmentType: formData.type.toLowerCase().replace(' ', '_'),
        duration: parseInt(formData.duration),
        reasonForVisit: formData.notes,
        status: formData.status.toLowerCase()
      };

      await onSave(appointmentData);
      onClose();
    } catch (error) {
      console.error('Failed to save appointment:', error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const calculateEndTime = (startTime, duration) => {
    if (!startTime) return '';
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0);
    const endDate = new Date(startDate.getTime() + duration * 60000);
    return `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;
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
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Person className="text-gray-400" fontSize="small" />
                </div>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  placeholder="Search patient by name or ID..."
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.patientName ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
                {showPatientDropdown && filteredPatients.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredPatients.map((patient) => (
                      <button
                        key={patient._id}
                        type="button"
                        onClick={() => handlePatientSelect(patient)}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors"
                      >
                        <div className="font-medium">
                          {patient.firstName} {patient.lastName}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {patient.patientId} • {patient.phone}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
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
                  name="providerId"
                  value={formData.providerId}
                  onChange={(e) => {
                    const selectedDoctor = doctors.find(d => d._id === e.target.value);
                    setFormData({
                      ...formData,
                      providerId: e.target.value,
                      doctor: selectedDoctor ? `${selectedDoctor.firstName} ${selectedDoctor.lastName}` : ''
                    });
                  }}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a doctor...</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.firstName} {doctor.lastName} - {doctor.department || 'General'}
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

          {/* Error Message */}
          {errors.submit && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{errors.submit}</p>
            </div>
          )}

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                `${appointmentToEdit ? 'Update' : 'Save'} Appointment`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAppointmentModal;
