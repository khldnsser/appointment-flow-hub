
import React, { createContext, useContext, useEffect } from "react";
import { AuthContextType, User, SOAPNote, UserRole, Appointment } from "@/types/auth";
import { useAuthState } from "@/hooks/useAuthState";
import * as medicalRecordService from "@/services/medicalRecordService";
import * as localDbService from "@/services/localDbService";

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

// Key for storing user session in localStorage
const USER_SESSION_KEY = 'meditrack_user_session';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { state, setters } = useAuthState();
  const { user, appointments, doctors, patients } = state;
  const { setUser, setAppointments, setDoctors, setPatients } = setters;

  // Initialize local database with mock data
  useEffect(() => {
    localDbService.initializeLocalDb();
  }, []);

  // Check for saved session on initial load
  useEffect(() => {
    const checkSavedSession = async () => {
      try {
        const savedSession = localStorage.getItem(USER_SESSION_KEY);
        
        if (savedSession) {
          const userData = JSON.parse(savedSession);
          console.log("Found saved session:", userData.id);
          setUser(userData);
        }
      } catch (error) {
        console.error("Session check error:", error);
        localStorage.removeItem(USER_SESSION_KEY);
      }
    };

    checkSavedSession();
  }, [setUser]);

  // Load mock data when user logs in
  useEffect(() => {
    if (user) {
      console.log("Loading mock data for user:", user.id);
      loadMockData();
      fetchAppointments();
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

    setDoctors(mockDoctors);
    setPatients(mockPatients);
  };

  const fetchAppointments = async () => {
    if (!user) return;
    
    try {
      const appointments = await localDbService.fetchAppointments();
      setAppointments(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const userData = await localDbService.login(email, password);
    setUser(userData);
    
    // Save to local storage
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userData));
    
    return userData;
  };
  
  const handleLogout = () => {
    localStorage.removeItem(USER_SESSION_KEY);
    setUser(null);
    localDbService.logout();
  };
  
  const handleSignupPatient = async (name: string, email: string, phoneNumber: string, password: string) => {
    const userData = await localDbService.signupPatient(name, email, phoneNumber, password);
    setUser(userData);
    
    // Save to local storage
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userData));
    
    return userData;
  };
  
  const handleSignupDoctor = async (
    name: string,
    email: string,
    phoneNumber: string,
    password: string,
    specialization: string,
    licenseNumber: string,
    hospitalKey: string
  ) => {
    const userData = await localDbService.signupDoctor(
      name,
      email,
      phoneNumber,
      password,
      specialization,
      licenseNumber,
      hospitalKey
    );
    setUser(userData);
    
    // Save to local storage
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userData));
    
    return userData;
  };

  const contextValue: AuthContextType = {
    user,
    appointments,
    doctors,
    patients,
    login: handleLogin,
    logout: handleLogout,
    signupPatient: handleSignupPatient,
    signupDoctor: handleSignupDoctor,
    createAppointment: async (appointmentData) => {
      const newAppointment = await localDbService.createAppointment(appointmentData);
      
      // Convert the returned DB object to our Appointment type
      const formattedAppointment: Appointment = {
        id: newAppointment.id,
        doctorId: newAppointment.doctor_id,
        patientId: newAppointment.patient_id,
        doctorName: newAppointment.doctor_name,
        patientName: newAppointment.patient_name,
        dateTime: new Date(newAppointment.date_time),
        status: newAppointment.status as "scheduled" | "completed" | "cancelled",
        prescription: newAppointment.prescription,
        notes: newAppointment.notes
      };
      
      setAppointments([...appointments, formattedAppointment]);
    },
    cancelAppointment: async (appointmentId) => {
      await localDbService.cancelAppointment(appointmentId);
      setAppointments(
        appointments.map(apt =>
          apt.id === appointmentId ? { ...apt, status: "cancelled" } : apt
        )
      );
    },
    completeAppointment: async (appointmentId) => {
      await localDbService.completeAppointment(appointmentId);
      setAppointments(
        appointments.map(apt =>
          apt.id === appointmentId ? { ...apt, status: "completed" } : apt
        )
      );
    },
    addPrescription: async (appointmentId, prescription) => {
      await localDbService.addPrescription(appointmentId, prescription);
      setAppointments(
        appointments.map(apt =>
          apt.id === appointmentId ? { ...apt, prescription } : apt
        )
      );
    },
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
