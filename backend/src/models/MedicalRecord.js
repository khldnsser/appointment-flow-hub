const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const MedicalRecord = sequelize.define('MedicalRecord', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  patientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  doctorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  doctorName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subjective: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  objective: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  assessment: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  plan: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: true
});

// Define relationships
MedicalRecord.belongsTo(User, { as: 'doctor', foreignKey: 'doctorId' });
MedicalRecord.belongsTo(User, { as: 'patient', foreignKey: 'patientId' });

module.exports = MedicalRecord; 