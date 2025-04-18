
import { User, MedicalRecord, SOAPNote } from "@/types/auth";

export const addMedicalRecord = (
  patients: User[],
  setPatients: (patients: User[]) => void,
  patientId: string,
  soapNote: SOAPNote
) => {
  const newRecord: MedicalRecord = {
    id: `record${Date.now()}`,
    date: new Date(),
    appointmentId: soapNote.appointmentId,
    doctorName: soapNote.doctorName,
    doctorId: soapNote.doctorId,
    subjective: soapNote.subjective,
    objective: soapNote.objective,
    assessment: soapNote.assessment,
    plan: soapNote.plan,
  };

  setPatients(patients.map(patient => {
    if (patient.id === patientId) {
      const updatedRecords = patient.medicalRecords ? [...patient.medicalRecords, newRecord] : [newRecord];
      return { ...patient, medicalRecords: updatedRecords };
    }
    return patient;
  }));
};

export const updateMedicalRecord = (
  patients: User[],
  setPatients: (patients: User[]) => void,
  patientId: string,
  recordId: string,
  soapNote: SOAPNote
) => {
  setPatients(patients.map(patient => {
    if (patient.id === patientId && patient.medicalRecords) {
      const updatedRecords = patient.medicalRecords.map(record => {
        if (record.id === recordId) {
          return {
            ...record,
            subjective: soapNote.subjective,
            objective: soapNote.objective,
            assessment: soapNote.assessment,
            plan: soapNote.plan,
          };
        }
        return record;
      });
      return { ...patient, medicalRecords: updatedRecords };
    }
    return patient;
  }));
};
