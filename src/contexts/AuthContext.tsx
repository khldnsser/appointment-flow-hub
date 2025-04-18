
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Appointment } from "../types/auth";
import { MOCK_DOCTORS, MOCK_PATIENTS, MOCK_APPOINTMENTS } from "../data/mockData";
import {
  validateHospitalKey,
  checkEmailExists,
  createNewDoctor,
  createNewPatient,
} from "../services/authService";
import {
  handleCreateAppointment,
  handleUpdateAppointment,
  handleCancelAppointment,
  handleCompleteAppointment,
} from "../services/appointmentService";
import { addNewMedicalRecord, SOAPNote } from "../services/medicalRecordService";

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
  completeAppointment: (appointmentId: string) => void;
  addMedicalRecord: (patientId: string, soapNote: SOAPNote) => void;
  addPrescription: (appointmentId: string, prescription: string) => void;
  updateMedicalRecord: (patientId: string, recordId: string, soapNote: SOAPNote) => void;
};

const AuthContext = createContext<{
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
  completeAppointment: (appointmentId: string) => void;
  addMedicalRecord: (patientId: string, soapNote: SOAPNote) => void;
  addPrescription: (appointmentId: string, prescription: string) => void;
  updateMedicalRecord: (patientId: string, recordId: string, soapNote: SOAPNote) => void;
}>({
  user: null,
  doctors: MOCK_DOCTORS,
  patients: MOCK_PATIENTS,
  appointments: MOCK_APPOINTMENTS,
  login: () => Promise.resolve(null as any),
  logout: () => {},
  signupDoctor: () => Promise.resolve(null as any),
  signupPatient: () => Promise.resolve(null as any),
  createAppointment: () => ({} as Appointment),
  updateAppointment: () => ({} as Appointment),
  cancelAppointment: () => {},
  completeAppointment: () => {},
  addMedicalRecord: () => {},
  addPrescription: () => {},
  updateMedicalRecord: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [doctors, setDoctors] = useState<User[]>(MOCK_DOCTORS);
  const [patients, setPatients] = useState<User[]>(MOCK_PATIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);

  useEffect(() => {
    const storedUser = localStorage.getItem("meditrack-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem("meditrack-user");
  };

  const signupDoctor = async (
    name: string,
    email: string,
    phoneNumber: string,
    password: string,
    specialization: string,
    licenseNumber: string,
    hospitalKey: string
  ): Promise<User> => {
    if (!validateHospitalKey(hospitalKey)) {
      throw new Error("Invalid hospital key");
    }

    if (checkEmailExists(doctors, patients, email)) {
      throw new Error("Email already in use");
    }

    const newDoctor = createNewDoctor(name, email, phoneNumber, specialization, licenseNumber, doctors);
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
    if (checkEmailExists(doctors, patients, email)) {
      throw new Error("Email already in use");
    }

    const newPatient = createNewPatient(name, email, phoneNumber, patients);
    setPatients([...patients, newPatient]);
    setUser(newPatient);
    localStorage.setItem("meditrack-user", JSON.stringify(newPatient));
    return newPatient;
  };

  const createAppointment = (appointmentData: Omit<Appointment, "id">) => {
    const { newAppointment, updatedAppointments } = handleCreateAppointment(
      appointmentData,
      appointments
    );
    setAppointments(updatedAppointments);
    return newAppointment;
  };

  const updateAppointment = (updatedAppointment: Appointment) => {
    const updatedAppointments = handleUpdateAppointment(updatedAppointment, appointments);
    setAppointments(updatedAppointments);
    return updatedAppointment;
  };

  const cancelAppointment = (appointmentId: string) => {
    const updatedAppointments = handleCancelAppointment(appointmentId, appointments);
    setAppointments(updatedAppointments);
  };

  const completeAppointment = (appointmentId: string) => {
    const updatedAppointments = handleCompleteAppointment(appointmentId, appointments);
    setAppointments(updatedAppointments);
  };

  const addMedicalRecord = (patientId: string, soapNote: SOAPNote) => {
    const updatedPatients = addNewMedicalRecord(patientId, soapNote, patients);
    setPatients(updatedPatients);
  };

  const addPrescription = (appointmentId: string, prescription: string) => {
    const updatedAppointments = appointments.map((app) =>
      app.id === appointmentId ? { ...app, prescription } : app
    );
    setAppointments(updatedAppointments);
  };

  const updateMedicalRecord = (patientId: string, recordId: string, soapNote: SOAPNote) => {
    setPatients((prevPatients) =>
      prevPatients.map((patient) => {
        if (patient.id === patientId) {
          return {
            ...patient,
            medicalRecords: patient.medicalRecords?.map((record) =>
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
        completeAppointment,
        addMedicalRecord,
        addPrescription,
        updateMedicalRecord,
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
