const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware to authenticate JWT tokens
exports.auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
    // Find user by ID
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(401).json({ message: 'User not found, authorization denied' });
    }
    
    // Set user information in request
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

// Role-based authorization middleware
exports.authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const userRole = req.user.role;
    
    // Check if user role is included in the required roles
    if (roles.length && !roles.includes(userRole)) {
      return res.status(403).json({ message: 'Not authorized to access this resource' });
    }
    
    next();
  };
}; 