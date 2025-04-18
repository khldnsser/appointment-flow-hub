
import { Appointment, User } from "@/types/auth";
import { toast } from "@/components/ui/sonner";

// In-memory database for local development
const localDb = {
  users: [] as User[],
  appointments: [] as Appointment[],
  doctorProfiles: [] as any[],
  patientProfiles: [] as any[]
};

// Helper to generate unique IDs
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Auth methods
export const login = async (email: string, password: string): Promise<User> => {
  try {
    console.log("Login attempt for:", email);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = localDb.users.find(u => u.email === email);
    
    if (!user) {
      console.error("No user found with email:", email);
      throw new Error("Invalid email or password");
    }
    
    // In a real app, you would hash passwords
    console.log("Login successful, user ID:", user.id);
    
    return user;
  } catch (error) {
    console.error("Login function error:", error);
    toast.error(error instanceof Error ? error.message : "Login failed");
    throw error;
  }
};

export const logout = async () => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Force redirect to login page
    window.location.href = '/login';
  } catch (error) {
    console.error("Logout function error:", error);
    toast.error("Failed to log out");
  }
};

export const signupPatient = async (
  name: string, 
  email: string, 
  phoneNumber: string, 
  password: string
): Promise<User> => {
  try {
    console.log("Patient signup attempt for:", email);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (localDb.users.some(u => u.email === email)) {
      throw new Error("User with this email already exists");
    }
    
    const newUserId = generateId();
    
    const newUser: User = {
      id: newUserId,
      name,
      email,
      role: 'patient',
      phoneNumber,
      medicalRecords: [],
    };
    
    // Store in our local database
    localDb.users.push(newUser);
    localDb.patientProfiles.push({
      id: newUserId,
      name,
      email,
      phone_number: phoneNumber,
      created_at: new Date().toISOString()
    });
    
    console.log("Signup successful, user ID:", newUserId);
    
    return newUser;
  } catch (error) {
    console.error("Patient signup error:", error);
    toast.error(error instanceof Error ? error.message : "Signup failed");
    throw error;
  }
};

export const signupDoctor = async (
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
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (hospitalKey !== '1234') {
      throw new Error('Invalid hospital key');
    }

    if (localDb.users.some(u => u.email === email)) {
      throw new Error("User with this email already exists");
    }
    
    const newUserId = generateId();
    
    const newUser: User = {
      id: newUserId,
      name,
      email,
      role: 'doctor',
      phoneNumber,
      specialization,
      licenseNumber,
    };
    
    // Store in our local database
    localDb.users.push(newUser);
    localDb.doctorProfiles.push({
      id: newUserId,
      name,
      email,
      phone_number: phoneNumber,
      specialization,
      license_number: licenseNumber,
      created_at: new Date().toISOString()
    });
    
    console.log("Doctor signup successful, user ID:", newUserId);
    
    return newUser;
  } catch (error) {
    console.error("Doctor signup error:", error);
    toast.error(error instanceof Error ? error.message : "Signup failed");
    throw error;
  }
};

export const fetchUserProfile = async (userId: string): Promise<User> => {
  try {
    console.log("Fetching profile for user ID:", userId);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const user = localDb.users.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('No profile found');
    }
    
    return user;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Appointment methods
export const createAppointment = async (appointmentData: Omit<Appointment, "id">) => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newAppointmentId = generateId();
    
    const newAppointment = {
      id: newAppointmentId,
      doctor_id: appointmentData.doctorId,
      patient_id: appointmentData.patientId,
      doctor_name: appointmentData.doctorName,
      patient_name: appointmentData.patientName,
      date_time: appointmentData.dateTime.toISOString(),
      status: appointmentData.status,
      prescription: appointmentData.prescription,
      notes: appointmentData.notes,
      created_at: new Date().toISOString()
    };
    
    // Add to local database
    localDb.appointments.push({
      id: newAppointmentId,
      doctorId: appointmentData.doctorId,
      patientId: appointmentData.patientId,
      doctorName: appointmentData.doctorName,
      patientName: appointmentData.patientName,
      dateTime: appointmentData.dateTime,
      status: appointmentData.status,
      prescription: appointmentData.prescription,
      notes: appointmentData.notes
    });
    
    toast.success("Appointment created successfully");
    return newAppointment;
  } catch (error) {
    console.error('Error creating appointment:', error);
    toast.error("Failed to create appointment");
    throw error;
  }
};

export const cancelAppointment = async (appointmentId: string) => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const appointmentIndex = localDb.appointments.findIndex(apt => apt.id === appointmentId);
    
    if (appointmentIndex !== -1) {
      localDb.appointments[appointmentIndex].status = 'cancelled';
    } else {
      throw new Error('Appointment not found');
    }
    
    toast.success("Appointment cancelled successfully");
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    toast.error("Failed to cancel appointment");
    throw error;
  }
};

export const completeAppointment = async (appointmentId: string) => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const appointmentIndex = localDb.appointments.findIndex(apt => apt.id === appointmentId);
    
    if (appointmentIndex !== -1) {
      localDb.appointments[appointmentIndex].status = 'completed';
    } else {
      throw new Error('Appointment not found');
    }
    
    toast.success("Appointment marked as completed");
  } catch (error) {
    console.error('Error completing appointment:', error);
    toast.error("Failed to complete appointment");
    throw error;
  }
};

export const addPrescription = async (appointmentId: string, prescription: string) => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const appointmentIndex = localDb.appointments.findIndex(apt => apt.id === appointmentId);
    
    if (appointmentIndex !== -1) {
      localDb.appointments[appointmentIndex].prescription = prescription;
    } else {
      throw new Error('Appointment not found');
    }
    
    toast.success("Prescription added successfully");
  } catch (error) {
    console.error('Error adding prescription:', error);
    toast.error("Failed to add prescription");
    throw error;
  }
};

export const fetchAppointments = async () => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return localDb.appointments;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

// Initialize with some mock data
export const initializeLocalDb = () => {
  // Add mock doctors if not already present
  if (localDb.users.filter(u => u.role === 'doctor').length === 0) {
    const mockDoctors = [
      {
        id: "doctor1",
        name: "Dr. John Smith",
        email: "john.smith@example.com",
        role: "doctor" as const,
        phoneNumber: "12345678",
        specialization: "Cardiology",
        licenseNumber: "ME1234",
      },
      {
        id: "doctor2",
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@example.com",
        role: "doctor" as const,
        phoneNumber: "87654321",
        specialization: "Neurology",
        licenseNumber: "ME6789",
      },
    ];
    
    localDb.users.push(...mockDoctors);
  }
  
  // Add mock patients if not already present
  if (localDb.users.filter(u => u.role === 'patient').length === 0) {
    const mockPatients = [
      {
        id: "patient1",
        name: "James Wilson",
        email: "james.wilson@example.com",
        role: "patient" as const,
        phoneNumber: "13579246",
        medicalRecords: [],
      },
      {
        id: "patient2",
        name: "Emily Davis",
        email: "emily.davis@example.com",
        role: "patient" as const,
        phoneNumber: "24681357",
        medicalRecords: [],
      },
    ];
    
    localDb.users.push(...mockPatients);
  }
  
  console.log("Local database initialized with mock data");
}
