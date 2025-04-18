import { Appointment } from "@/types/auth";
import { toast } from "@/components/ui/sonner";
import api from './api';
import { AxiosError } from 'axios';

export const createAppointment = async (appointmentData: Omit<Appointment, "id">) => {
  try {
    const response = await api.post('/appointments', {
      doctorId: appointmentData.doctorId,
      dateTime: appointmentData.dateTime
    });
    
    if (response.status !== 201) {
      throw new Error(response.data.message || 'Failed to create appointment');
    }
    
    toast.success("Appointment created successfully");
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{message: string}>;
    console.error('Error creating appointment:', error);
    toast.error(axiosError.response?.data?.message || 'Failed to create appointment');
    throw error;
  }
};

export const cancelAppointment = async (appointmentId: string) => {
  try {
    const response = await api.post(`/appointments/cancel/${appointmentId}`);
    
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to cancel appointment');
    }
    
    toast.success("Appointment cancelled successfully");
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{message: string}>;
    console.error('Error cancelling appointment:', error);
    toast.error(axiosError.response?.data?.message || 'Failed to cancel appointment');
    throw error;
  }
};

export const completeAppointment = async (appointmentId: string) => {
  try {
    const response = await api.post(`/appointments/complete/${appointmentId}`);
    
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to complete appointment');
    }
    
    toast.success("Appointment marked as completed");
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{message: string}>;
    console.error('Error completing appointment:', error);
    toast.error(axiosError.response?.data?.message || 'Failed to complete appointment');
    throw error;
  }
};

export const addPrescription = async (appointmentId: string, prescription: string) => {
  try {
    const response = await api.post(`/appointments/${appointmentId}/prescription`, {
      prescription
    });
    
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to add prescription');
    }
    
    toast.success("Prescription added successfully");
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{message: string}>;
    console.error('Error adding prescription:', error);
    toast.error(axiosError.response?.data?.message || 'Failed to add prescription');
    throw error;
  }
};

export const getAppointments = async () => {
  try {
    const response = await api.get('/appointments');
    
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to fetch appointments');
    }
    
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{message: string}>;
    console.error('Error fetching appointments:', error);
    toast.error(axiosError.response?.data?.message || 'Failed to fetch appointments');
    throw error;
  }
};

export const getDoctors = async () => {
  try {
    const response = await api.get('/appointments/doctors');
    
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to fetch doctors');
    }
    
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{message: string}>;
    console.error('Error fetching doctors:', error);
    toast.error(axiosError.response?.data?.message || 'Failed to fetch doctors');
    throw error;
  }
};
