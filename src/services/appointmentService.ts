
import { Appointment, SOAPNote, User } from "@/types/auth";
import { toast } from "@/components/ui/sonner";

export const createAppointment = (
  appointments: Appointment[],
  setAppointments: (appointments: Appointment[]) => void,
  appointmentData: Omit<Appointment, "id">
) => {
  const newAppointment: Appointment = {
    ...appointmentData,
    id: `apt${appointments.length + 1}`,
  };
  setAppointments([...appointments, newAppointment]);
  toast.success("Appointment created successfully");
};

export const cancelAppointment = (
  appointments: Appointment[],
  setAppointments: (appointments: Appointment[]) => void,
  appointmentId: string
) => {
  setAppointments(
    appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: "cancelled" } : apt
    )
  );
  toast.success("Appointment cancelled successfully");
};

export const completeAppointment = (
  appointments: Appointment[],
  setAppointments: (appointments: Appointment[]) => void,
  appointmentId: string
) => {
  setAppointments(
    appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: "completed" } : apt
    )
  );
  toast.success("Appointment marked as completed");
};

export const addPrescription = (
  appointments: Appointment[],
  setAppointments: (appointments: Appointment[]) => void,
  appointmentId: string,
  prescription: string
) => {
  setAppointments(
    appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, prescription } : apt
    )
  );
  toast.success("Prescription added successfully");
};
