export const ROLES = {
  ADMIN: "admin",
  DOCTOR: "doctor",
  NURSE: "nurse",
  RECEPTIONIST: "receptionist",
};

export const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};

export const APPOINTMENT_STATUS = {
  SCHEDULED: "scheduled",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  NO_SHOW: "no_show",
};

export const MEDICAL_RECORD_TYPES = {
  DIAGNOSIS: "diagnosis",
  PRESCRIPTION: "prescription",
  LAB_RESULT: "lab_result",
  PROGRESS_NOTE: "progress_note",
};

export default {
  ROLES,
  STATUS,
  APPOINTMENT_STATUS,
  MEDICAL_RECORD_TYPES,
};