import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, User, SOAPNote, UserRole, Appointment } from "@/types/auth";
import { useAuthState } from "@/hooks/useAuthState";
import * as authService from "@/services/authService";
import * as appointmentService from "@/services/appointmentService";
import * as medicalRecordService from "@/services/medicalRecordService";

const defaultContextValue: AuthContextType = {
  user: null,
  login: () => Promise.reject("Not initialized"),
  logout: () => {},
  signupPatient: () => Promise.reject("Not initialized"),
  signupDoctor: () => Promise.reject("Not initialized"),
  appointments: [],
  doctors: [],
  patients: [],
  addMedicalRecord: () => Promise.reject("Not initialized"),
  updateMedicalRecord: () => Promise.reject("Not initialized"),
  completeAppointment: () => Promise.reject("Not initialized"),
  cancelAppointment: () => Promise.reject("Not initialized"),
  createAppointment: () => Promise.reject("Not initialized"),
  addPrescription: () => Promise.reject("Not initialized"),
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { state, setters } = useAuthState();
  const { user, appointments, doctors, patients } = state;
  const { setUser, setAppointments, setDoctors, setPatients } = setters;

  useEffect(() => {
    // Check for user in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, [setUser]);

  // Load appointments when user is authenticated
  useEffect(() => {
    if (user) {
      loadAppointments();
      if (user.role === 'patient') {
        loadDoctors();
      }
    }
  }, [user]);

  const loadAppointments = async () => {
    try {
      const fetchedAppointments = await appointmentService.getAppointments();
      setAppointments(fetchedAppointments);
    } catch (error) {
      console.error("Error loading appointments:", error);
    }
  };

  const loadDoctors = async () => {
    try {
      const fetchedDoctors = await appointmentService.getDoctors();
      setDoctors(fetchedDoctors);
    } catch (error) {
      console.error("Error loading doctors:", error);
    }
  };

  const login = async (email: string, password: string) => {
    const userData = await authService.login(email, password);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setAppointments([]);
    setDoctors([]);
    setPatients([]);
  };

  const signupPatient = async (name: string, email: string, phoneNumber: string, password: string) => {
    const userData = await authService.signupPatient(name, email, phoneNumber, password);
    setUser(userData);
    return userData;
  };

  const signupDoctor = async (
    name: string,
    email: string,
    phoneNumber: string,
    password: string,
    specialization: string,
    licenseNumber: string,
    hospitalKey: string
  ) => {
    const userData = await authService.signupDoctor(
      name,
      email,
      phoneNumber,
      password,
      specialization,
      licenseNumber,
      hospitalKey
    );
    setUser(userData);
    return userData;
  };

  const createAppointment = async (appointmentData: Omit<Appointment, "id">) => {
    const newAppointment = await appointmentService.createAppointment(appointmentData);
    setAppointments((prevAppointments) => [...prevAppointments, newAppointment]);
    return newAppointment;
  };

  const cancelAppointment = async (appointmentId: string) => {
    const updatedAppointment = await appointmentService.cancelAppointment(appointmentId);
    setAppointments((prevAppointments) =>
      prevAppointments.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: "cancelled" } : apt
      )
    );
    return updatedAppointment;
  };

  const completeAppointment = async (appointmentId: string) => {
    const updatedAppointment = await appointmentService.completeAppointment(appointmentId);
    setAppointments((prevAppointments) =>
      prevAppointments.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: "completed" } : apt
      )
    );
    return updatedAppointment;
  };

  const addPrescription = async (appointmentId: string, prescription: string) => {
    const updatedAppointment = await appointmentService.addPrescription(appointmentId, prescription);
    setAppointments((prevAppointments) =>
      prevAppointments.map((apt) =>
        apt.id === appointmentId ? { ...apt, prescription } : apt
      )
    );
    return updatedAppointment;
  };

  const addMedicalRecord = async (patientId: string, soapNote: SOAPNote) => {
    const medicalRecord = await medicalRecordService.addMedicalRecord(patientId, soapNote);
    
    // If we have this patient loaded, update their records
    setPatients((prevPatients) =>
      prevPatients.map((patient) => {
        if (patient.id === patientId) {
          const existingRecords = patient.medicalRecords || [];
          return {
            ...patient,
            medicalRecords: [...existingRecords, medicalRecord],
          };
        }
        return patient;
      })
    );
    
    return medicalRecord;
  };

  const updateMedicalRecord = async (recordId: string, soapNote: Partial<SOAPNote>) => {
    const medicalRecord = await medicalRecordService.updateMedicalRecord(recordId, soapNote);
    
    // Update the record in the patient's records if loaded
    setPatients((prevPatients) =>
      prevPatients.map((patient) => {
        if (patient.medicalRecords?.some(record => record.id === recordId)) {
          return {
            ...patient,
            medicalRecords: patient.medicalRecords.map((record) =>
              record.id === recordId ? { ...record, ...medicalRecord } : record
            ),
          };
        }
        return patient;
      })
    );
    
    return medicalRecord;
  };

  const contextValue: AuthContextType = {
    user,
    login,
    logout,
    signupPatient,
    signupDoctor,
    appointments,
    doctors,
    patients,
    addMedicalRecord,
    updateMedicalRecord,
    completeAppointment,
    cancelAppointment,
    createAppointment,
    addPrescription,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Wrapper component to ensure proper provider order with other contexts
export const AuthProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};
