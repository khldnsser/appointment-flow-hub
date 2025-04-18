
import { Appointment } from "@/types/auth";
import { toast } from "@/components/ui/sonner";
import * as localDbService from "@/services/localDbService";

export const createAppointment = async (appointmentData: Omit<Appointment, "id">) => {
  return localDbService.createAppointment(appointmentData);
};

export const cancelAppointment = async (appointmentId: string) => {
  return localDbService.cancelAppointment(appointmentId);
};

export const completeAppointment = async (appointmentId: string) => {
  return localDbService.completeAppointment(appointmentId);
};

export const addPrescription = async (appointmentId: string, prescription: string) => {
  return localDbService.addPrescription(appointmentId, prescription);
};
