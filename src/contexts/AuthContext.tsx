import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Appointment, MedicalRecord, UserRole } from "@/types/auth";
import { toast } from "@/components/ui/sonner";
import { SOAPNote } from "@/services/medicalRecordService";

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  signupPatient: (
    name: string, 
    email: string, 
    phoneNumber: string, 
    password: string
  ) => Promise<User>;
  signupDoctor: (
    name: string,
    email: string,
    phoneNumber: string,
    password: string,
    specialization: string,
    licenseNumber: string,
    hospitalKey: string
  ) => Promise<User>;
  appointments: Appointment[];
  doctors: User[];
  patients: User[];
  addMedicalRecord: (patientId: string, soapNote: SOAPNote) => void;
  updateMedicalRecord: (patientId: string, recordId: string, soapNote: SOAPNote) => void;
  completeAppointment: (appointmentId: string) => void;
  cancelAppointment: (appointmentId: string) => void;
  createAppointment: (appointment: Omit<Appointment, "id">) => void;
  addPrescription: (appointmentId: string, prescription: string) => void;
};

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

export const AuthProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider navigate={() => {}}>{children}</AuthProvider>
  );
};

export const AuthProvider = ({ 
  children, 
  navigate 
}: { 
  children: React.ReactNode;
  navigate: NavigateFunction | (() => void);
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [patients, setPatients] = useState<User[]>([]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await fetchUserProfile(session.user.id);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      loadMockData();
    }
  }, [user]);

  const loadMockData = () => {
    const mockDoctors: User[] = [
      {
        id: "doctor1",
        name: "Dr. John Smith",
        email: "john.smith@example.com",
        role: "doctor" as UserRole,
        phoneNumber: "12345678",
        specialization: "Cardiology",
        licenseNumber: "MED12345",
      },
      {
        id: "doctor2",
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@example.com",
        role: "doctor" as UserRole,
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
        role: "patient" as UserRole,
        phoneNumber: "13579246",
        medicalRecords: [],
      },
      {
        id: "patient2",
        name: "Emily Davis",
        email: "emily.davis@example.com",
        role: "patient" as UserRole,
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

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      let doctorDetails = null;
      if (profileData.role === 'doctor') {
        const { data: doctorData } = await supabase
          .from('doctor_details')
          .select('*')
          .eq('id', userId)
          .single();
        
        doctorDetails = doctorData;
      }

      const userProfile: User = {
        id: profileData.id,
        name: profileData.name,
        email: profileData.email,
        role: profileData.role as UserRole,
        phoneNumber: profileData.phone_number,
        specialization: doctorDetails?.specialization,
        licenseNumber: doctorDetails?.license_number,
      };

      setUser(userProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load user profile');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      if (!data.user) {
        throw new Error('Login failed');
      }

      await fetchUserProfile(data.user.id);
      
      const currentUser = user;
      
      if (!currentUser) {
        const minimalUser: User = {
          id: data.user.id,
          name: data.user.user_metadata?.name || email.split('@')[0],
          email: email,
          role: (data.user.user_metadata?.role as UserRole) || 'patient',
          phoneNumber: data.user.user_metadata?.phoneNumber || '',
        };
        
        setUser(minimalUser);
        return minimalUser;
      }
      
      return currentUser;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  const signupPatient = async (
    name: string, 
    email: string, 
    phoneNumber: string, 
    password: string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          email,
          phoneNumber,
          role: 'patient',
        }
      }
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    if (!data.user) {
      throw new Error('Signup failed');
    }

    navigate('/patient/dashboard');

    return user as User;
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
    if (hospitalKey !== '1234') {
      throw new Error('Invalid hospital key');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          email,
          phoneNumber,
          role: 'doctor',
          specialization,
          licenseNumber,
        }
      }
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    if (!data.user) {
      throw new Error('Signup failed');
    }

    navigate('/doctor/dashboard');

    return user as User;
  };

  const createAppointment = (appointmentData: Omit<Appointment, "id">) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: `apt${appointments.length + 1}`,
    };
    setAppointments([...appointments, newAppointment]);
    toast.success("Appointment created successfully");
  };

  const cancelAppointment = (appointmentId: string) => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: "cancelled" } : apt
    ));
    toast.success("Appointment cancelled successfully");
  };

  const completeAppointment = (appointmentId: string) => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: "completed" } : apt
    ));
    toast.success("Appointment marked as completed");
  };

  const addPrescription = (appointmentId: string, prescription: string) => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, prescription } : apt
    ));
    toast.success("Prescription added successfully");
  };

  const addMedicalRecord = (patientId: string, soapNote: SOAPNote) => {
    const newRecord: MedicalRecord = {
      id: `record${Date.now()}`,
      date: new Date(),
      appointmentId: soapNote.appointmentId,
      doctorName: soapNote.doctorName,
      doctorId: soapNote.doctorId,
      subjective: soapNote.subjective,
      objective: soapNote.objective,
      assessment: soapNote.assessment,
      plan: soapNote.plan,
    };

    setPatients(patients.map(patient => {
      if (patient.id === patientId) {
        const updatedRecords = patient.medicalRecords ? [...patient.medicalRecords, newRecord] : [newRecord];
        return { ...patient, medicalRecords: updatedRecords };
      }
      return patient;
    }));
  };

  const updateMedicalRecord = (patientId: string, recordId: string, soapNote: SOAPNote) => {
    setPatients(patients.map(patient => {
      if (patient.id === patientId && patient.medicalRecords) {
        const updatedRecords = patient.medicalRecords.map(record => {
          if (record.id === recordId) {
            return {
              ...record,
              subjective: soapNote.subjective,
              objective: soapNote.objective,
              assessment: soapNote.assessment,
              plan: soapNote.plan,
            };
          }
          return record;
        });
        return { ...patient, medicalRecords: updatedRecords };
      }
      return patient;
    }));
  };

  return (
    <AuthContext.Provider 
      value={{ 
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
        addPrescription
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
