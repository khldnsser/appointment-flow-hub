const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecordController');
const { auth, authorize } = require('../middleware/auth');

// Protected routes - all require authentication
router.use(auth);

// Routes for both patients and doctors - with authorization inside controller
router.get('/patient/:patientId', medicalRecordController.getPatientMedicalRecords);
router.get('/:recordId', medicalRecordController.getMedicalRecord);

// Doctor only routes
router.post('/', authorize(['doctor']), medicalRecordController.addMedicalRecord);
router.put('/:recordId', authorize(['doctor']), medicalRecordController.updateMedicalRecord);

module.exports = router; 