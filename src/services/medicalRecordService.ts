
import { User } from "../types/auth";

export const addNewMedicalRecord = (
  patientId: string,
  content: string,
  patients: User[]
): User[] => {
  return patients.map((patient) => {
    if (patient.id === patientId) {
      const newRecord = {
        id: `rec${(patient.medicalRecords?.length || 0) + 1}`,
        date: new Date(),
        content,
      };
      return {
        ...patient,
        medicalRecords: [...(patient.medicalRecords || []), newRecord],
      };
    }
    return patient;
  });
};
