import logger from '../utils/logger.js';

export const auditLog = (action) => async (req, res, next) => {
  try {
    const auditData = {
      action,
      userId: req.user?._id,
      userRole: req.user?.role,
      resourceId: req.params.id || null,
      method: req.method,
      path: req.path,
      timestamp: new Date(),
      ipAddress: req.ip
    };

    logger.info('Audit Log:', auditData);
    next();
  } catch (error) {
    next(error);
  }
};