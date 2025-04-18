const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth, authorize } = require('../middleware/auth');

// Public routes
router.post('/login', authController.login);
router.post('/signup/patient', authController.signupPatient);
router.post('/signup/doctor', authController.signupDoctor);

// Protected routes
router.use(auth);
router.get('/profile', authController.getUserProfile);
router.get('/doctors', authController.getAllDoctors);
router.get('/patients', authorize(['doctor']), authController.getAllPatients);
router.get('/patients/:patientId', authorize(['doctor']), authController.getPatientById);

module.exports = router; 