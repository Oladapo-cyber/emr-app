// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    LOGOUT: '/auth/logout',
    CHANGE_PASSWORD: '/auth/change-password'
  },
  PATIENTS: {
    BASE: '/patients',
    BY_ID: (id) => `/patients/${id}`
  },
  APPOINTMENTS: {
    BASE: '/appointments',
    TODAY: '/appointments/today',
    BY_ID: (id) => `/appointments/${id}`
  },
  MEDICAL_RECORDS: {
    BASE: '/medicalRecords',
    BY_ID: (id) => `/medicalRecords/${id}`,
    UPLOAD: '/medicalRecords/upload'
  },
  STAFF: {
    BASE: '/staff',
    BY_ID: (id) => `/staff/${id}`
  }
};

// Import roles from your backend constants
export const ROLES = {
  ADMIN: "admin",
  DOCTOR: "doctor",
  NURSE: "nurse",
  RECEPTIONIST: "receptionist",
  LAB_TECH: "lab_tech"
};

// Status codes matching your backend
export const APPOINTMENT_STATUS = {
  SCHEDULED: "scheduled",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  NO_SHOW: "no_show"
};

export const DEPARTMENTS = [
  "emergency",
  "cardiology",
  "neurology",
  "pediatrics",
  "orthopedics",
  "general",
  "administration",
  "laboratory"
];