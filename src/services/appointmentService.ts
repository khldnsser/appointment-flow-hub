
import { Appointment, User } from "@/types/auth";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

export const createAppointment = async (appointmentData: Omit<Appointment, "id">) => {
  try {
    // Transform from camelCase to snake_case for the database
    const dbAppointmentData = {
      doctor_id: appointmentData.doctorId,
      patient_id: appointmentData.patientId,
      doctor_name: appointmentData.doctorName,
      patient_name: appointmentData.patientName,
      date_time: appointmentData.dateTime.toISOString(),
      status: appointmentData.status,
      prescription: appointmentData.prescription,
      notes: appointmentData.notes
    };
    
    const { data, error } = await supabase
      .from('appointments')
      .insert([dbAppointmentData])
      .select()
      .single();

    if (error) throw error;
    
    toast.success("Appointment created successfully");
    return data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    toast.error("Failed to create appointment");
    throw error;
  }
};

export const cancelAppointment = async (appointmentId: string) => {
  try {
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', appointmentId);

    if (error) throw error;
    
    toast.success("Appointment cancelled successfully");
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    toast.error("Failed to cancel appointment");
    throw error;
  }
};

export const completeAppointment = async (appointmentId: string) => {
  try {
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'completed' })
      .eq('id', appointmentId);

    if (error) throw error;
    
    toast.success("Appointment marked as completed");
  } catch (error) {
    console.error('Error completing appointment:', error);
    toast.error("Failed to complete appointment");
    throw error;
  }
};

export const addPrescription = async (appointmentId: string, prescription: string) => {
  try {
    const { error } = await supabase
      .from('appointments')
      .update({ prescription })
      .eq('id', appointmentId);

    if (error) throw error;
    
    toast.success("Prescription added successfully");
  } catch (error) {
    console.error('Error adding prescription:', error);
    toast.error("Failed to add prescription");
    throw error;
  }
};
