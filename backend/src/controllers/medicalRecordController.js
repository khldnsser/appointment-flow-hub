const { MedicalRecord, User, Appointment } = require('../models');

// Add a new medical record (doctors only)
exports.addMedicalRecord = async (req, res) => {
  try {
    const { patientId, subjective, objective, assessment, plan } = req.body;
    const doctorId = req.user.id;
    
    // Ensure user is a doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can add medical records' });
    }
    
    // Get the patient
    const patient = await User.findOne({
      where: {
        id: patientId,
        role: 'patient'
      }
    });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Get the doctor's name
    const doctor = await User.findByPk(doctorId);
    
    // Create the medical record
    const medicalRecord = await MedicalRecord.create({
      patientId,
      doctorId,
      doctorName: doctor.name,
      subjective,
      objective,
      assessment,
      plan,
      date: new Date()
    });
    
    return res.status(201).json(medicalRecord);
  } catch (error) {
    console.error('Add medical record error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a medical record (only by the doctor who created it)
exports.updateMedicalRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    const { subjective, objective, assessment, plan } = req.body;
    const doctorId = req.user.id;
    
    // Ensure user is a doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can update medical records' });
    }
    
    // Get the medical record
    const medicalRecord = await MedicalRecord.findByPk(recordId);
    
    if (!medicalRecord) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    
    // Ensure the doctor is the one who created this record
    if (medicalRecord.doctorId !== doctorId) {
      return res.status(403).json({ message: 'You can only update medical records that you created' });
    }
    
    // Update the medical record
    medicalRecord.subjective = subjective || medicalRecord.subjective;
    medicalRecord.objective = objective || medicalRecord.objective;
    medicalRecord.assessment = assessment || medicalRecord.assessment;
    medicalRecord.plan = plan || medicalRecord.plan;
    
    await medicalRecord.save();
    
    return res.status(200).json(medicalRecord);
  } catch (error) {
    console.error('Update medical record error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get medical records for a patient
exports.getPatientMedicalRecords = async (req, res) => {
  try {
    const { patientId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    // If user is a patient, they can only view their own records
    if (userRole === 'patient' && patientId !== userId) {
      return res.status(403).json({ message: 'Not authorized to view these medical records' });
    }
    
    // Get the medical records
    const medicalRecords = await MedicalRecord.findAll({
      where: { patientId },
      order: [['date', 'DESC']]
    });
    
    return res.status(200).json(medicalRecords);
  } catch (error) {
    console.error('Get patient medical records error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a specific medical record
exports.getMedicalRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    // Get the medical record
    const medicalRecord = await MedicalRecord.findByPk(recordId);
    
    if (!medicalRecord) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    
    // If user is a patient, they can only view their own records
    if (userRole === 'patient' && medicalRecord.patientId !== userId) {
      return res.status(403).json({ message: 'Not authorized to view this medical record' });
    }
    
    return res.status(200).json(medicalRecord);
  } catch (error) {
    console.error('Get medical record error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 