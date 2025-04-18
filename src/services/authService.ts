import { User } from "@/types/auth";
import { toast } from "@/components/ui/sonner";
import api from './api';
import { AxiosError } from 'axios';

export const login = async (email: string, password: string): Promise<User> => {
  try {
    console.log("Login attempt for:", email);
    
    const response = await api.post('/auth/login', { email, password });
    
    if (response.status !== 200) {
      const error = response.data.message || 'Login failed';
      console.error("Login error:", error);
      toast.error(error);
      throw new Error(error);
    }
    
    // Store token and user data
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
    
    console.log("Login successful, user ID:", response.data.id);
    
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{message: string}>;
    console.error("Login function error:", error);
    toast.error(axiosError.response?.data?.message || 'Login failed');
    throw error;
  }
};

export const logout = async () => {
  try {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
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
    
    const response = await api.post('/auth/signup/patient', {
      name,
      email,
      phoneNumber,
      password
    });
    
    // Store token and user data
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
    
    console.log("Signup successful, user ID:", response.data.id);
    
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{message: string, details?: string[]}>;
    console.error("Patient signup error details:", axiosError.response?.data || error);
    
    let errorMessage = 'Signup failed';
    if (axiosError.response?.data?.message) {
      errorMessage = axiosError.response.data.message;
      
      // If there are validation details, add them
      if (axiosError.response.data.details && axiosError.response.data.details.length > 0) {
        errorMessage += ': ' + axiosError.response.data.details.join(', ');
      }
    }
    
    toast.error(errorMessage);
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
    
    const response = await api.post('/auth/signup/doctor', {
      name,
      email,
      phoneNumber,
      password,
      specialization,
      licenseNumber,
      hospitalKey
    });
    
    // Store token and user data
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
    
    console.log("Doctor signup successful, user ID:", response.data.id);
    
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{message: string, details?: string[]}>;
    console.error("Doctor signup error details:", axiosError.response?.data || error);
    
    let errorMessage = 'Signup failed';
    if (axiosError.response?.data?.message) {
      errorMessage = axiosError.response.data.message;
      
      // If there are validation details, add them
      if (axiosError.response.data.details && axiosError.response.data.details.length > 0) {
        errorMessage += ': ' + axiosError.response.data.details.join(', ');
      }
    }
    
    toast.error(errorMessage);
    throw error;
  }
};

export const fetchUserProfile = async (userId: string): Promise<User> => {
  try {
    console.log("Fetching profile for user ID:", userId);
    
    // Get from localStorage if available
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    
    // Otherwise fetch from API
    const response = await api.get('/auth/profile');
    
    if (response.status !== 200) {
      const error = response.data.message || 'Failed to fetch profile';
      console.error("Profile error:", error);
      throw new Error(error);
    }
    
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{message: string}>;
    console.error('Error fetching user profile:', error);
    toast.error(axiosError.response?.data?.message || 'Failed to fetch profile');
    throw error;
  }
};
