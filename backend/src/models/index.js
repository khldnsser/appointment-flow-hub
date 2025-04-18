const User = require('./User');
const Appointment = require('./Appointment');
const MedicalRecord = require('./MedicalRecord');

// Establish relationships here to avoid circular dependencies
User.hasMany(Appointment, { as: 'doctorAppointments', foreignKey: 'doctorId' });
User.hasMany(Appointment, { as: 'patientAppointments', foreignKey: 'patientId' });
User.hasMany(MedicalRecord, { as: 'doctorRecords', foreignKey: 'doctorId' });
User.hasMany(MedicalRecord, { as: 'patientRecords', foreignKey: 'patientId' });

module.exports = {
  User,
  Appointment,
  MedicalRecord
}; 