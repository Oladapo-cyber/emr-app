import MedicalRecord from '../models/MedicalRecord.js';
import logger from '../utils/logger.js';

export const createMedicalRecord = async (req, res, next) => {
  try {
    const recordData = {
      ...req.body,
      createdBy: req.user._id,
      attendingPhysician: req.user._id
    };

    const medicalRecord = await MedicalRecord.create(recordData);
    await medicalRecord.populate(['patient', 'attendingPhysician']);

    logger.info(`Medical record created: ${medicalRecord._id}`);

    res.status(201).json({
      success: true,
      message: 'Medical record created successfully',
      data: medicalRecord
    });
  } catch (error) {
    next(error);
  }
};

export const getMedicalRecords = async (req, res, next) => {
  try {
    const { patient, startDate, endDate, type } = req.query;
    let query = {};

    if (patient) query.patient = patient;
    if (type) query.visitType = type;
    if (startDate && endDate) {
      query.visitDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const records = await MedicalRecord.find(query)
      .populate('patient', 'firstName lastName patientId')
      .populate('attendingPhysician', 'firstName lastName')
      .sort({ visitDate: -1 });

    res.json({
      success: true,
      message: 'Medical records retrieved successfully',
      data: records,
      count: records.length
    });
  } catch (error) {
    next(error);
  }
};

export const getMedicalRecord = async (req, res, next) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('patient', 'firstName lastName patientId')
      .populate('attendingPhysician', 'firstName lastName');

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    res.json({
      success: true,
      message: 'Medical record retrieved successfully',
      data: record
    });
  } catch (error) {
    next(error);
  }
};

export const updateMedicalRecord = async (req, res, next) => {
  try {
    const record = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedBy: req.user._id
      },
      { new: true, runValidators: true }
    )
    .populate('patient', 'firstName lastName patientId')
    .populate('attendingPhysician', 'firstName lastName');

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    logger.info(`Medical record updated: ${record._id}`);

    res.json({
      success: true,
      message: 'Medical record updated successfully',
      data: record
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMedicalRecord = async (req, res, next) => {
  try {
    const record = await MedicalRecord.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    logger.info(`Medical record deleted: ${record._id}`);

    res.json({
      success: true,
      message: 'Medical record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Upload a single medical record file
export const uploadSingleRecord = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Save file reference into MongoDB
    const record = await MedicalRecord.findByIdAndUpdate(
      req.body.recordId, // Pass the record ID in the request body
      {
        $push: {
          attachments: {
            filename: req.file.filename,
            path: req.file.path,
            uploadedBy: req.user._id,
            uploadedAt: new Date()
          }
        }
      },
      { new: true }
    ).populate('patient attendingPhysician');

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: record
    });
  } catch (error) {
    next(error);
  }
};

// Upload multiple medical record files
export const uploadMultipleRecords = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const attachments = req.files.map(file => ({
      filename: file.filename,
      path: file.path,
      uploadedBy: req.user._id,
      uploadedAt: new Date()
    }));

    const record = await MedicalRecord.findByIdAndUpdate(
      req.body.recordId,
      { $push: { attachments: { $each: attachments } } },
      { new: true }
    ).populate('patient attendingPhysician');

    res.json({
      success: true,
      message: 'Files uploaded successfully',
      data: record
    });
  } catch (error) {
    next(error);
  }
};
