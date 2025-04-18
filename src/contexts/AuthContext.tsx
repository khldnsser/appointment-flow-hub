
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Appointment, MedicalRecord } from "@/types/auth";
import { toast } from "@/components/ui/sonner";

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
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => Promise.reject("Not initialized"),
  logout: () => {},
  signupPatient: () => Promise.reject("Not initialized"),
  signupDoctor: () => Promise.reject("Not initialized"),
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await fetchUserProfile(session.user.id);
      }
    };

    // Listen for auth state changes
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

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Fetch user profile from the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // If it's a doctor, fetch additional doctor details
      let doctorDetails = null;
      if (profileData.role === 'doctor') {
        const { data: doctorData } = await supabase
          .from('doctor_details')
          .select('*')
          .eq('id', userId)
          .single();
        
        doctorDetails = doctorData;
      }

      // Create user object matching the User type
      const userProfile: User = {
        id: profileData.id,
        name: profileData.name,
        email: profileData.email,
        role: profileData.role,
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

    // Navigate based on user role
    const userProfile = await fetchUserProfile(data.user.id);
    
    // Redirect based on role
    if (user?.role === 'doctor') {
      navigate('/doctor/dashboard');
    } else {
      navigate('/patient/dashboard');
    }

    return user as User;
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
    // Signup with Supabase
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

    // Automatically navigate to patient dashboard
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
    // Validate hospital key (you might want to implement a more secure check)
    if (hospitalKey !== '1234') {
      throw new Error('Invalid hospital key');
    }

    // Signup with Supabase
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

    // Automatically navigate to doctor dashboard
    navigate('/doctor/dashboard');

    return user as User;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        signupPatient, 
        signupDoctor 
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

