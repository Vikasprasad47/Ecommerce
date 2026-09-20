export const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(401).json({
      success: false,
      error: true,
      message: 'Authentication required',
      errorCode: 'AUTH_REQUIRED',
    });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      error: true,
      message: 'You do not have permission to perform this action',
      errorCode: 'FORBIDDEN',
    });
  }

  return next();
};

export default requireRole;
