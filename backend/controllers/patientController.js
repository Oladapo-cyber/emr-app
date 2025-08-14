import Patient from '../models/Patient.js';

// Create new patient
export const createPatient = async (req, res, next) => {
  try {
    const patientData = {
      ...req.body,
      createdBy: req.user._id
    };

    const patient = await Patient.create(patientData);
    res.status(201).json({
      success: true,
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

// Get all patients with basic search
export const getPatients = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = { isActive: true };

    if (search) {
      query = {
        isActive: true,
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { patientId: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const patients = await Patient.find(query)
      .populate('primaryDoctor', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    next(error);
  }
};

// Get single patient
export const getPatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('primaryDoctor', 'firstName lastName');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      data: patient
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
      { ...req.body },
      { new: true, runValidators: true }
    ).populate('primaryDoctor', 'firstName lastName');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      data: patient
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
      { isActive: false },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};