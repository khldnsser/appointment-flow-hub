
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

    setDoctors(mockDoctors);
    setPatients(mockPatients);
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*');

        if (error) throw error;
        
        // Map the database fields (snake_case) to our Appointment interface (camelCase)
        const formattedAppointments: Appointment[] = data.map(apt => ({
          id: apt.id,
          doctorId: apt.doctor_id,
          patientId: apt.patient_id,
          doctorName: apt.doctor_name,
          patientName: apt.patient_name,
          dateTime: new Date(apt.date_time),
          status: apt.status as "scheduled" | "completed" | "cancelled",
          prescription: apt.prescription,
          notes: apt.notes
        }));
        
        setAppointments(formattedAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    if (user) {
      fetchAppointments();
    }
  }, [user, setAppointments]);

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
    createAppointment: async (appointmentData) => {
      const newAppointment = await appointmentService.createAppointment(appointmentData);
      
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
      await appointmentService.cancelAppointment(appointmentId);
      setAppointments(
        appointments.map(apt =>
          apt.id === appointmentId ? { ...apt, status: "cancelled" } : apt
        )
      );
    },
    completeAppointment: async (appointmentId) => {
      await appointmentService.completeAppointment(appointmentId);
      setAppointments(
        appointments.map(apt =>
          apt.id === appointmentId ? { ...apt, status: "completed" } : apt
        )
      );
    },
    addPrescription: async (appointmentId, prescription) => {
      await appointmentService.addPrescription(appointmentId, prescription);
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
