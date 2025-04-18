import React, { createContext, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  addMedicalRecord: () => {},
  updateMedicalRecord: () => {},
  completeAppointment: () => {},
  cancelAppointment: () => {},
  createAppointment: () => {},
  addPrescription: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { state, setters } = useAuthState();
  const { user, appointments, doctors, patients } = state;
  const { setUser, setAppointments, setDoctors, setPatients } = setters;

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        if (event === 'SIGNED_IN' && session) {
          try {
            const userData = await authService.fetchUserProfile(session.user.id);
            setUser(userData);
          } catch (error) {
            console.error("Error fetching user profile:", error);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session check:", session?.user?.id);
        
        if (session?.user) {
          const userData = await authService.fetchUserProfile(session.user.id);
          setUser(userData);
        }
      } catch (error) {
        console.error("Session check error:", error);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser]);

  useEffect(() => {
    if (user) {
      console.log("Loading mock data for user:", user.id);
      loadMockData();
    }
  }, [user]);

  const loadMockData = () => {
    const mockDoctors: User[] = [
      {
        id: "doctor1",
        name: "Dr. John Smith",
        email: "john.smith@example.com",
        role: "doctor",
        phoneNumber: "12345678",
        specialization: "Cardiology",
        licenseNumber: "MED12345",
      },
      {
        id: "doctor2",
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@example.com",
        role: "doctor",
        phoneNumber: "87654321",
        specialization: "Neurology",
        licenseNumber: "MED67890",
      },
    ];

    const mockPatients: User[] = [
      {
        id: "patient1",
        name: "James Wilson",
        email: "james.wilson@example.com",
        role: "patient",
        phoneNumber: "13579246",
        medicalRecords: [],
      },
      {
        id: "patient2",
        name: "Emily Davis",
        email: "emily.davis@example.com",
        role: "patient",
        phoneNumber: "24681357",
        medicalRecords: [],
      },
    ];

    const mockAppointments: Appointment[] = [
      {
        id: "apt1",
        doctorId: "doctor1",
        patientId: "patient1",
        doctorName: "Dr. John Smith",
        patientName: "James Wilson",
        dateTime: new Date(2025, 3, 20, 10, 0),
        status: "scheduled",
      },
      {
        id: "apt2",
        doctorId: "doctor2",
        patientId: "patient2",
        doctorName: "Dr. Sarah Johnson",
        patientName: "Emily Davis",
        dateTime: new Date(2025, 3, 21, 14, 30),
        status: "scheduled",
      },
    ];

    setDoctors(mockDoctors);
    setPatients(mockPatients);
    setAppointments(mockAppointments);
  };

  const contextValue: AuthContextType = {
    user,
    appointments,
    doctors,
    patients,
    login: (email: string, password: string) => authService.login(email, password),
    logout: () => authService.logout(),
    signupPatient: (name: string, email: string, phoneNumber: string, password: string) =>
      authService.signupPatient(name, email, phoneNumber, password),
    signupDoctor: (
      name: string,
      email: string,
      phoneNumber: string,
      password: string,
      specialization: string,
      licenseNumber: string,
      hospitalKey: string
    ) =>
      authService.signupDoctor(
        name,
        email,
        phoneNumber,
        password,
        specialization,
        licenseNumber,
        hospitalKey
      ),
    createAppointment: (appointmentData) =>
      appointmentService.createAppointment(appointments, setAppointments, appointmentData),
    cancelAppointment: (appointmentId) =>
      appointmentService.cancelAppointment(appointments, setAppointments, appointmentId),
    completeAppointment: (appointmentId) =>
      appointmentService.completeAppointment(appointments, setAppointments, appointmentId),
    addPrescription: (appointmentId, prescription) =>
      appointmentService.addPrescription(appointments, setAppointments, appointmentId, prescription),
    addMedicalRecord: (patientId, soapNote) =>
      medicalRecordService.addMedicalRecord(patients, setPatients, patientId, soapNote),
    updateMedicalRecord: (patientId, recordId, soapNote) =>
      medicalRecordService.updateMedicalRecord(patients, setPatients, patientId, recordId, soapNote),
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>{children}</AuthProvider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
