
import { User, MedicalRecord } from "../types/auth";

export interface SOAPNote {
  appointmentId: string;
  doctorName: string;
  doctorId: string;  // Added this field
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export const addNewMedicalRecord = (
  patientId: string,
  soapNote: SOAPNote,
  patients: User[]
): User[] => {
  return patients.map((patient) => {
    if (patient.id === patientId) {
      const newRecord: MedicalRecord = {
        id: `rec${(patient.medicalRecords?.length || 0) + 1}`,
        date: new Date(),
        appointmentId: soapNote.appointmentId,
        doctorName: soapNote.doctorName,
        doctorId: soapNote.doctorId,  // Include doctorId in the new record
        subjective: soapNote.subjective,
        objective: soapNote.objective,
        assessment: soapNote.assessment,
        plan: soapNote.plan,
      };
      
      return {
        ...patient,
        medicalRecords: [...(patient.medicalRecords || []), newRecord],
      };
    }
    return patient;
  });
};

export const getMedicalRecordsByAppointmentId = (
  patient: User | null,
  appointmentId: string
): MedicalRecord | undefined => {
  if (!patient || !patient.medicalRecords) return undefined;
  
  return patient.medicalRecords.find(
    (record) => record.appointmentId === appointmentId
  );
};
