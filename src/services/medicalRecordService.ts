
import { User, SOAPNote, MedicalRecord } from "@/types/auth";
import { toast } from "@/components/ui/sonner";

export { SOAPNote }; // Export the SOAPNote type

export const addMedicalRecord = (
  patients: User[],
  setPatients: (patients: User[]) => void,
  patientId: string,
  soapNote: SOAPNote
) => {
  const newRecord: MedicalRecord = {
    id: `record-${Date.now()}`,
    date: new Date(),
    appointmentId: soapNote.appointmentId,
    doctorName: soapNote.doctorName,
    doctorId: soapNote.doctorId,
    subjective: soapNote.subjective,
    objective: soapNote.objective,
    assessment: soapNote.assessment,
    plan: soapNote.plan,
  };

  setPatients(
    patients.map((patient) => {
      if (patient.id === patientId) {
        const existingRecords = patient.medicalRecords || [];
        return {
          ...patient,
          medicalRecords: [...existingRecords, newRecord],
        };
      }
      return patient;
    })
  );

  toast.success("Medical record added successfully");
};

export const updateMedicalRecord = (
  patients: User[],
  setPatients: (patients: User[]) => void,
  patientId: string,
  recordId: string,
  soapNote: SOAPNote
) => {
  setPatients(
    patients.map((patient) => {
      if (patient.id === patientId && patient.medicalRecords) {
        return {
          ...patient,
          medicalRecords: patient.medicalRecords.map((record) =>
            record.id === recordId
              ? {
                  ...record,
                  subjective: soapNote.subjective,
                  objective: soapNote.objective,
                  assessment: soapNote.assessment,
                  plan: soapNote.plan,
                }
              : record
          ),
        };
      }
      return patient;
    })
  );

  toast.success("Medical record updated successfully");
};
