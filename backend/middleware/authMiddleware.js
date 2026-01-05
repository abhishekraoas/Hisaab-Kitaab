// Middleware to check if user is authenticated
export const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized. Please login." });
};

// Middleware to attach user info to request
export const attachUser = (req, res, next) => {
  if (req.session && req.session.userId) {
    req.userId = req.session.userId;
  }
  next();
};
