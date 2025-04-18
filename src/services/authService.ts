
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/auth";
import { toast } from "@/components/ui/sonner";

export const login = async (email: string, password: string): Promise<User> => {
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

export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
      throw error;
    }
    
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

export const fetchUserProfile = async (userId: string): Promise<User> => {
  try {
    console.log("Fetching profile for user ID:", userId);
    
    // Try fetching patient profile first
    const { data: patientData, error: patientError } = await supabase
      .from('patient_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!patientError && patientData) {
      return {
        id: patientData.id,
        name: patientData.name,
        email: patientData.email,
        role: 'patient',
        phoneNumber: patientData.phone_number,
        medicalRecords: [],
      };
    }

    // If not a patient, try fetching doctor profile
    const { data: doctorData, error: doctorError } = await supabase
      .from('doctor_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!doctorError && doctorData) {
      return {
        id: doctorData.id,
        name: doctorData.name,
        email: doctorData.email,
        role: 'doctor',
        phoneNumber: doctorData.phone_number,
        specialization: doctorData.specialization,
        licenseNumber: doctorData.license_number,
      };
    }

    throw new Error('No profile found');
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};
