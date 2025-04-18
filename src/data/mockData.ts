
import { User, Appointment } from "../types/auth";

export const MOCK_DOCTORS: User[] = [
  {
    id: "doc1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@meditrack.com",
    role: "doctor",
    phoneNumber: "12345678",
    specialization: "Cardiology",
    licenseNumber: "KJ1426",
  },
  {
    id: "doc2",
    name: "Dr. Michael Chen",
    email: "michael.chen@meditrack.com",
    role: "doctor",
    phoneNumber: "87654321",
    specialization: "Dermatology",
    licenseNumber: "MC2345",
  },
  {
    id: "doc3",
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@meditrack.com",
    role: "doctor",
    phoneNumber: "23456789",
    specialization: "Neurology",
    licenseNumber: "ER3456",
  },
];

export const MOCK_PATIENTS: User[] = [
  {
    id: "pat1",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "patient",
    phoneNumber: "12345678",
    medicalRecords: [
      {
        id: "rec1",
        date: new Date(2025, 2, 15),
        content: "Patient presented with symptoms of seasonal allergies. Prescribed antihistamines.",
      },
    ],
  },
  {
    id: "pat2",
    name: "Lisa Wong",
    email: "lisa.wong@example.com",
    role: "patient",
    phoneNumber: "87654321",
    medicalRecords: [],
  },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "app1",
    doctorId: "doc1",
    patientId: "pat1",
    doctorName: "Dr. Sarah Johnson",
    patientName: "John Smith",
    dateTime: new Date(2025, 3, 15, 10, 0),
    status: "completed",
    prescription: "Take Claritin 10mg once daily for 14 days",
    notes: "Follow up in two weeks if symptoms persist",
  },
  {
    id: "app2",
    doctorId: "doc2",
    patientId: "pat1",
    doctorName: "Dr. Michael Chen",
    patientName: "John Smith",
    dateTime: new Date(2025, 3, 18, 9, 0),
    status: "scheduled",
  },
  {
    id: "app3",
    doctorId: "doc3",
    patientId: "pat2",
    doctorName: "Dr. Emily Rodriguez",
    patientName: "Lisa Wong",
    dateTime: new Date(2025, 3, 18, 11, 0),
    status: "scheduled",
  },
];
