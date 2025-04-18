import { User, MedicalRecord } from "@/types/auth";
import type { SOAPNote } from "@/types/auth";
import { toast } from "@/components/ui/sonner";
import api from './api';
import { AxiosError } from 'axios';

export type { SOAPNote }; // Properly re-export the type with "export type"

export const addMedicalRecord = async (
  patientId: string,
  soapNote: SOAPNote
) => {
  try {
    const response = await api.post('/medical-records', {
      appointmentId: soapNote.appointmentId,
      subjective: soapNote.subjective,
      objective: soapNote.objective,
      assessment: soapNote.assessment,
      plan: soapNote.plan
    });
    
    if (response.status !== 201) {
      throw new Error(response.data.message || 'Failed to add medical record');
    }
    
    toast.success("Medical record added successfully");
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{message: string}>;
    console.error('Error adding medical record:', error);
    toast.error(axiosError.response?.data?.message || 'Failed to add medical record');
    throw error;
  }
};

export const updateMedicalRecord = async (
  recordId: string,
  soapNote: Partial<SOAPNote>
) => {
  try {
    const response = await api.put(`/medical-records/${recordId}`, {
      subjective: soapNote.subjective,
      objective: soapNote.objective,
      assessment: soapNote.assessment,
      plan: soapNote.plan
    });
    
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to update medical record');
    }
    
    toast.success("Medical record updated successfully");
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{message: string}>;
    console.error('Error updating medical record:', error);
    toast.error(axiosError.response?.data?.message || 'Failed to update medical record');
    throw error;
  }
};

export const getPatientMedicalRecords = async (patientId: string) => {
  try {
    const response = await api.get(`/medical-records/patient/${patientId}`);
    
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to fetch medical records');
    }
    
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{message: string}>;
    console.error('Error fetching medical records:', error);
    toast.error(axiosError.response?.data?.message || 'Failed to fetch medical records');
    throw error;
  }
};
