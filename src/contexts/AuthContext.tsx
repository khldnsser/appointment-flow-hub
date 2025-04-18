import React, { createContext, useContext, useState, useEffect } from "react";
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

export const AuthProvider = ({ 
  children, 
  navigate 
}: { 
  children: React.ReactNode;
  navigate: Function | (() => void);
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [patients, setPatients] = useState<User[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        if (event === 'SIGNED_IN' && session) {
          try {
            const userData = await fetchUserProfile(session.user.id);
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
          const userData = await fetchUserProfile(session.user.id);
          setUser(userData);
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  const fetchUserProfile = async (userId: string): Promise<User> => {
    try {
      console.log("Fetching profile for user ID:", userId);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        throw profileError;
      }

      console.log("Profile data retrieved:", profileData);

      let doctorDetails = null;
      if (profileData.role === 'doctor') {
        const { data: doctorData, error: doctorError } = await supabase
          .from('doctor_details')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (doctorError) {
          console.error("Doctor details fetch error:", doctorError);
        } else {
          doctorDetails = doctorData;
          console.log("Doctor details retrieved:", doctorDetails);
        }
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

      return userProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load user profile');
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    try {
      console.log("Login attempt for:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Supabase auth error:", error);
        toast.error(error.message);
        throw error;
      }

      if (!data.user) {
        console.error("No user returned from login");
        throw new Error('Login failed');
      }
      
      console.log("Supabase auth successful, user ID:", data.user.id);
      
      const userProfile = await fetchUserProfile(data.user.id);
      console.log("User profile fetched:", userProfile);
      
      return userProfile;
    } catch (error) {
      console.error("Login function error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      if (typeof navigate === 'function') {
        navigate('/');
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  const signupPatient = async (
    name: string, 
    email: string, 
    phoneNumber: string, 
    password: string
  ): Promise<User> => {
    try {
      console.log("Patient signup attempt for:", email);
      
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
        console.error("Signup error:", error);
        toast.error(error.message);
        throw error;
      }

      if (!data.user) {
        console.error("No user returned from signup");
        throw new Error('Signup failed');
      }
      
      console.log("Signup successful, user ID:", data.user.id);
      
      const newUser: User = {
        id: data.user.id,
        name: name,
        email: email,
        role: 'patient',
        phoneNumber: phoneNumber,
        medicalRecords: [],
      };
      
      return newUser;
    } catch (error) {
      console.error("Patient signup error:", error);
      throw error;
    }
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
    try {
      console.log("Doctor signup attempt for:", email);
      
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
        console.error("Doctor signup error:", error);
        toast.error(error.message);
        throw error;
      }

      if (!data.user) {
        console.error("No user returned from doctor signup");
        throw new Error('Signup failed');
      }
      
      console.log("Doctor signup successful, user ID:", data.user.id);
      
      const newUser: User = {
        id: data.user.id,
        name: name,
        email: email,
        role: 'doctor',
        phoneNumber: phoneNumber,
        specialization: specialization,
        licenseNumber: licenseNumber,
      };
      
      return newUser;
    } catch (error) {
      console.error("Doctor signup error:", error);
      throw error;
    }
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

// Fix the error here - removing the navigate parameter
export const AuthProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider navigate={() => {}}>{children}</AuthProvider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
