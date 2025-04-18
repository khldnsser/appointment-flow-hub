const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '24h' }
  );
};

// Login controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check password
    const isPasswordValid = await user.checkPassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Return user data and token
    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      specialization: user.specialization,
      licenseNumber: user.licenseNumber,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Patient signup controller
exports.signupPatient = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    
    console.log("Attempting patient signup:", { name, email, phoneNumber });
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(409).json({ message: 'User with this email already exists' });
    }
    
    // Create new patient user
    console.log("Creating new patient user");
    const newUser = await User.create({
      name,
      email,
      phoneNumber,
      password,
      role: 'patient'
    });
    
    console.log("Patient created successfully:", newUser.id);
    
    // Generate JWT token
    const token = generateToken(newUser);
    
    // Return user data and token
    return res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phoneNumber: newUser.phoneNumber,
      token
    });
  } catch (error) {
    console.error('Patient signup error details:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.errors.map(e => e.message) 
      });
    }
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Doctor signup controller
exports.signupDoctor = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, specialization, licenseNumber, hospitalKey } = req.body;
    
    console.log("Attempting doctor signup:", { name, email, phoneNumber, specialization });
    
    // Validate hospital key
    if (hospitalKey !== '1234') {  // You would use an environment variable in production
      console.log("Invalid hospital key provided");
      return res.status(401).json({ message: 'Invalid hospital key' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(409).json({ message: 'User with this email already exists' });
    }
    
    // Create new doctor user
    console.log("Creating new doctor user");
    const newUser = await User.create({
      name,
      email,
      phoneNumber,
      password,
      role: 'doctor',
      specialization,
      licenseNumber
    });
    
    console.log("Doctor created successfully:", newUser.id);
    
    // Generate JWT token
    const token = generateToken(newUser);
    
    // Return user data and token
    return res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phoneNumber: newUser.phoneNumber,
      specialization: newUser.specialization,
      licenseNumber: newUser.licenseNumber,
      token
    });
  } catch (error) {
    console.error('Doctor signup error details:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.errors.map(e => e.message) 
      });
    }
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user profile controller
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Get from auth middleware
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Get user profile error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.findAll({
      where: { role: 'doctor' },
      attributes: ['id', 'name', 'email', 'phoneNumber', 'specialization'],
      order: [['name', 'ASC']]
    });
    
    return res.status(200).json(doctors);
  } catch (error) {
    console.error('Get all doctors error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all patients (doctors only)
exports.getAllPatients = async (req, res) => {
  try {
    // Ensure user is a doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const patients = await User.findAll({
      where: { role: 'patient' },
      attributes: ['id', 'name', 'email', 'phoneNumber'],
      order: [['name', 'ASC']]
    });
    
    return res.status(200).json(patients);
  } catch (error) {
    console.error('Get all patients error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get patient by ID (doctors only)
exports.getPatientById = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Ensure user is a doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const patient = await User.findOne({
      where: { 
        id: patientId,
        role: 'patient'
      },
      attributes: ['id', 'name', 'email', 'phoneNumber']
    });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    return res.status(200).json(patient);
  } catch (error) {
    console.error('Get patient by ID error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 