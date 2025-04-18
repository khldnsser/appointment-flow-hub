import React, { createContext, useContext, useState, useEffect } from "react";

// Define user types
export type UserRole = "doctor" | "patient";

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
  medicalRecords?: Array<{
    id: string;
    date: Date;
    content: string;
  }>;
}

// Mock data for initial testing
const MOCK_DOCTORS = [
  {
    id: "doc1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@meditrack.com",
    role: "doctor" as UserRole,
    phoneNumber: "12345678",
    specialization: "Cardiology",
    licenseNumber: "KJ1426",
    availability: [
      { date: new Date(2025, 3, 18, 9, 0), booked: false },
      { date: new Date(2025, 3, 18, 10, 0), booked: true },
      { date: new Date(2025, 3, 18, 11, 0), booked: false },
      { date: new Date(2025, 3, 19, 9, 0), booked: false },
      { date: new Date(2025, 3, 19, 10, 0), booked: false },
    ],
  },
  {
    id: "doc2",
    name: "Dr. Michael Chen",
    email: "michael.chen@meditrack.com",
    role: "doctor" as UserRole,
    phoneNumber: "87654321",
    specialization: "Dermatology",
    licenseNumber: "MC2345",
    availability: [
      { date: new Date(2025, 3, 18, 9, 0), booked: true },
      { date: new Date(2025, 3, 18, 10, 0), booked: false },
      { date: new Date(2025, 3, 18, 11, 0), booked: false },
      { date: new Date(2025, 3, 19, 9, 0), booked: true },
      { date: new Date(2025, 3, 19, 10, 0), booked: false },
    ],
  },
  {
    id: "doc3",
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@meditrack.com",
    role: "doctor" as UserRole,
    phoneNumber: "23456789",
    specialization: "Neurology",
    licenseNumber: "ER3456",
    availability: [
      { date: new Date(2025, 3, 18, 9, 0), booked: false },
      { date: new Date(2025, 3, 18, 10, 0), booked: false },
      { date: new Date(2025, 3, 18, 11, 0), booked: true },
      { date: new Date(2025, 3, 19, 9, 0), booked: false },
      { date: new Date(2025, 3, 19, 10, 0), booked: true },
    ],
  },
];

const MOCK_PATIENTS = [
  {
    id: "pat1",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "patient" as UserRole,
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
    role: "patient" as UserRole,
    phoneNumber: "87654321",
    medicalRecords: [],
  },
];

// Type definitions for appointments
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

// Mock appointments
const MOCK_APPOINTMENTS: Appointment[] = [
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

// Define symptom-specialty mapping for recommendation feature
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

// Create auth context with default values
type AuthContextType = {
  user: User | null;
  doctors: User[];
  patients: User[];
  appointments: Appointment[];
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  signupDoctor: (
    name: string,
    email: string,
    phoneNumber: string,
    password: string,
    specialization: string,
    licenseNumber: string,
    hospitalKey: string
  ) => Promise<User>;
  signupPatient: (
    name: string,
    email: string,
    phoneNumber: string,
    password: string
  ) => Promise<User>;
  createAppointment: (appointment: Omit<Appointment, "id">) => Appointment;
  updateAppointment: (appointment: Appointment) => Appointment;
  cancelAppointment: (appointmentId: string) => void;
  addMedicalRecord: (patientId: string, content: string) => void;
  addPrescription: (appointmentId: string, prescription: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [doctors, setDoctors] = useState<User[]>(MOCK_DOCTORS);
  const [patients, setPatients] = useState<User[]>(MOCK_PATIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("meditrack-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<User> => {
    // In a real app, this would be an API call to your backend
    // For demo purposes, we're just checking if a user exists with that email
    const doctorUser = doctors.find((d) => d.email === email);
    if (doctorUser) {
      setUser(doctorUser);
      localStorage.setItem("meditrack-user", JSON.stringify(doctorUser));
      return doctorUser;
    }

    const patientUser = patients.find((p) => p.email === email);
    if (patientUser) {
      setUser(patientUser);
      localStorage.setItem("meditrack-user", JSON.stringify(patientUser));
      return patientUser;
    }

    throw new Error("Invalid email or password");
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("meditrack-user");
  };

  // Sign up functions
  const signupDoctor = async (
    name: string,
    email: string,
    phoneNumber: string,
    password: string,
    specialization: string,
    licenseNumber: string,
    hospitalKey: string
  ): Promise<User> => {
    // Validate hospital key (in a real app, would be checked against a database)
    if (hospitalKey !== "1234") {
      throw new Error("Invalid hospital key");
    }

    // Check if email already exists
    if (doctors.some((d) => d.email === email) || patients.some((p) => p.email === email)) {
      throw new Error("Email already in use");
    }

    const newDoctor: User = {
      id: `doc${doctors.length + 1}`,
      name,
      email,
      phoneNumber,
      role: "doctor",
      specialization,
      licenseNumber,
    };

    setDoctors([...doctors, newDoctor]);
    setUser(newDoctor);
    localStorage.setItem("meditrack-user", JSON.stringify(newDoctor));
    return newDoctor;
  };

  const signupPatient = async (
    name: string,
    email: string,
    phoneNumber: string,
    password: string
  ): Promise<User> => {
    // Check if email already exists
    if (doctors.some((d) => d.email === email) || patients.some((p) => p.email === email)) {
      throw new Error("Email already in use");
    }

    const newPatient: User = {
      id: `pat${patients.length + 1}`,
      name,
      email,
      phoneNumber,
      role: "patient",
      medicalRecords: [],
    };

    setPatients([...patients, newPatient]);
    setUser(newPatient);
    localStorage.setItem("meditrack-user", JSON.stringify(newPatient));
    return newPatient;
  };

  // Appointment functions
  const createAppointment = (appointmentData: Omit<Appointment, "id">) => {
    // Check if there's already an active appointment between this doctor and patient
    const existingAppointment = appointments.find(
      (app) => 
        app.doctorId === appointmentData.doctorId && 
        app.patientId === appointmentData.patientId && 
        app.status === "scheduled"
    );
    
    if (existingAppointment) {
      // Cancel the existing appointment
      const updatedAppointments = appointments.map((app) =>
        app.id === existingAppointment.id ? { ...app, status: "cancelled" as const } : app
      );
      
      // Create the new appointment
      const newAppointment: Appointment = {
        ...appointmentData,
        id: `app${appointments.length + 1}`,
      };
      
      setAppointments([...updatedAppointments, newAppointment]);
      return newAppointment;
    } else {
      // Create a new appointment as before
      const newAppointment: Appointment = {
        ...appointmentData,
        id: `app${appointments.length + 1}`,
      };
      setAppointments([...appointments, newAppointment]);
      return newAppointment;
    }
  };

  const updateAppointment = (updatedAppointment: Appointment) => {
    const updatedAppointments = appointments.map((app) =>
      app.id === updatedAppointment.id ? updatedAppointment : app
    );
    setAppointments(updatedAppointments);
    return updatedAppointment;
  };

  const cancelAppointment = (appointmentId: string) => {
    const updatedAppointments = appointments.map((app) =>
      app.id === appointmentId ? { ...app, status: "cancelled" as const } : app
    );
    setAppointments(updatedAppointments);
  };

  // Medical record and prescription functions
  const addMedicalRecord = (patientId: string, content: string) => {
    const updatedPatients = patients.map((patient) => {
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
    setPatients(updatedPatients);
  };

  const addPrescription = (appointmentId: string, prescription: string) => {
    const updatedAppointments = appointments.map((app) =>
      app.id === appointmentId ? { ...app, prescription } : app
    );
    setAppointments(updatedAppointments);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        doctors,
        patients,
        appointments,
        login,
        logout,
        signupDoctor,
        signupPatient,
        createAppointment,
        updateAppointment,
        cancelAppointment,
        addMedicalRecord,
        addPrescription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
