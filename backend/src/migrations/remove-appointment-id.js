'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('MedicalRecords', 'appointmentId');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('MedicalRecords', 'appointmentId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Appointments',
        key: 'id'
      }
    });
  }
}; 