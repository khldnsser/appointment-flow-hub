const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { auth, authorize } = require('../middleware/auth');

// Protected routes - all require authentication
router.use(auth);

// Routes for both patients and doctors
router.get('/', appointmentController.getAppointments);
router.post('/cancel/:appointmentId', appointmentController.cancelAppointment);

// Patient only routes
router.post('/', authorize(['patient']), appointmentController.createAppointment);
router.get('/doctors', authorize(['patient']), appointmentController.getDoctors);

// Doctor only routes
router.post('/complete/:appointmentId', authorize(['doctor']), appointmentController.completeAppointment);
router.post('/:appointmentId/prescription', authorize(['doctor']), appointmentController.addPrescription);

module.exports = router; 