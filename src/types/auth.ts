
export type UserRole = "doctor" | "patient";

export interface MedicalRecord {
  id: string;
  date: Date;
  appointmentId: string;
  doctorName: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phoneNumber: string;
  // Doctor specific
  specialization?: string;
  licenseNumber?: string;
  // Patient specific
  medicalRecords?: MedicalRecord[];
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  doctorName: string;
  patientName: string;
  dateTime: Date;
  status: "scheduled" | "completed" | "cancelled";
  prescription?: string;
  notes?: string;
}

export const SYMPTOM_SPECIALTY_MAP: Record<string, string[]> = {
  "headache": ["Neurology", "General Medicine"],
  "skin rash": ["Dermatology", "Allergy and Immunology"],
  "chest pain": ["Cardiology", "Emergency Medicine"],
  "joint pain": ["Rheumatology", "Orthopedics"],
  "sore throat": ["ENT", "General Medicine"],
  "vision problems": ["Ophthalmology"],
  "stomach pain": ["Gastroenterology", "General Medicine"],
  "anxiety": ["Psychiatry", "Psychology"],
  "fever": ["General Medicine", "Infectious Disease"],
  "cough": ["Pulmonology", "ENT", "General Medicine"],
  "back pain": ["Orthopedics", "Neurology", "Physical Therapy"],
  "dizziness": ["Neurology", "ENT", "Cardiology"],
};
