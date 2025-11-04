import Patient from "../models/Patient.js";
import logger from "../utils/logger.js";

// Create new patient
export const createPatient = async (req, res, next) => {
  try {
    const patientData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const patient = await Patient.create(patientData);
    logger.info(`New patient created: ${patient.patientId}`);

    res.status(201).json({
      success: true,
      message: "Patient created successfully",
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

// Get all patients with search and pagination
export const getPatients = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    let query = { isActive: true };

    if (search) {
      query = {
        isActive: true,
        $or: [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { patientId: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Fix pagination logic - use skip and limit properly
    const pageInt = Math.max(1, parseInt(page, 10));
    const limitInt = Math.max(1, parseInt(limit, 10));

    const patients = await Patient.find(query)
      .populate("primaryDoctor", "firstName lastName")
      .sort({ createdAt: -1 })
      .skip((pageInt - 1) * limitInt)
      .limit(limitInt);

    const total = await Patient.countDocuments(query);

    res.json({
      success: true,
      message: "Patients retrieved successfully",
      data: patients,
      count: patients.length,
      total,
      page: pageInt,
      totalPages: Math.ceil(total / limitInt),
    });
  } catch (error) {
    next(error);
  }
};

// Get single patient
export const getPatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id).populate(
      "primaryDoctor",
      "firstName lastName"
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.json({
      success: true,
      message: "Patient retrieved successfully",
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

// Update patient
export const updatePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedBy: req.user._id,
      },
      { new: true, runValidators: true }
    ).populate("primaryDoctor", "firstName lastName");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    logger.info(`Patient updated: ${patient.patientId}`);

    res.json({
      success: true,
      message: "Patient updated successfully",
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

// Delete patient (soft delete)
export const deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
        updatedBy: req.user._id,
      },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    logger.info(`Patient deleted: ${patient.patientId}`);

    res.json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
