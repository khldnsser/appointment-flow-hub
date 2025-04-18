const { Appointment, User } = require('../models');
const { Op } = require('sequelize');

// Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, dateTime } = req.body;
    const patientId = req.user.id; // Get patient ID from authenticated user
    
    // Fetch doctor details
    const doctor = await User.findByPk(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    // Fetch patient details
    const patient = await User.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Check if doctor already has an appointment at this time
    const existingAppointment = await Appointment.findOne({
      where: {
        doctorId,
        dateTime: new Date(dateTime),
        status: 'scheduled'
      }
    });
    
    if (existingAppointment) {
      return res.status(409).json({ message: 'Doctor already has an appointment at this time' });
    }
    
    // Create the appointment
    const appointment = await Appointment.create({
      doctorId,
      patientId,
      doctorName: doctor.name,
      patientName: patient.name,
      dateTime: new Date(dateTime),
      status: 'scheduled'
    });
    
    return res.status(201).json(appointment);
  } catch (error) {
    console.error('Create appointment error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel an appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user.id;
    
    const appointment = await Appointment.findByPk(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Ensure the user is either the patient or doctor of this appointment
    if (appointment.patientId !== userId && appointment.doctorId !== userId) {
      return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    }
    
    // Update appointment status
    appointment.status = 'cancelled';
    await appointment.save();
    
    return res.status(200).json(appointment);
  } catch (error) {
    console.error('Cancel appointment error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Complete an appointment (doctors only)
exports.completeAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const doctorId = req.user.id;
    
    // Ensure user is a doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can complete appointments' });
    }
    
    const appointment = await Appointment.findByPk(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Ensure the doctor is assigned to this appointment
    if (appointment.doctorId !== doctorId) {
      return res.status(403).json({ message: 'Not authorized to complete this appointment' });
    }
    
    // Update appointment status
    appointment.status = 'completed';
    await appointment.save();
    
    return res.status(200).json(appointment);
  } catch (error) {
    console.error('Complete appointment error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add prescription to appointment (doctors only)
exports.addPrescription = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { prescription } = req.body;
    const doctorId = req.user.id;
    
    // Ensure user is a doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can add prescriptions' });
    }
    
    const appointment = await Appointment.findByPk(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Ensure the doctor is assigned to this appointment
    if (appointment.doctorId !== doctorId) {
      return res.status(403).json({ message: 'Not authorized to modify this appointment' });
    }
    
    // Update appointment prescription
    appointment.prescription = prescription;
    await appointment.save();
    
    return res.status(200).json(appointment);
  } catch (error) {
    console.error('Add prescription error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all appointments for the current user
exports.getAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    let appointments;
    
    if (userRole === 'doctor') {
      // Get all appointments for this doctor
      appointments = await Appointment.findAll({
        where: { doctorId: userId },
        order: [['dateTime', 'DESC']]
      });
    } else {
      // Get all appointments for this patient
      appointments = await Appointment.findAll({
        where: { patientId: userId },
        order: [['dateTime', 'DESC']]
      });
    }
    
    return res.status(200).json(appointments);
  } catch (error) {
    console.error('Get appointments error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all doctors for patient booking
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.findAll({
      where: { role: 'doctor' },
      attributes: { exclude: ['password'] }
    });
    
    return res.status(200).json(doctors);
  } catch (error) {
    console.error('Get doctors error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 