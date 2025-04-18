
import { Appointment } from "../types/auth";

export const handleCreateAppointment = (
  appointmentData: Omit<Appointment, "id">,
  appointments: Appointment[]
): { newAppointment: Appointment; updatedAppointments: Appointment[] } => {
  const existingAppointment = appointments.find(
    (app) =>
      app.doctorId === appointmentData.doctorId &&
      app.patientId === appointmentData.patientId &&
      app.status === "scheduled"
  );

  const newAppointment: Appointment = {
    ...appointmentData,
    id: `app${appointments.length + 1}`,
  };

  if (existingAppointment) {
    const updatedAppointments = appointments.map((app) =>
      app.id === existingAppointment.id ? { ...app, status: "cancelled" as const } : app
    );
    return {
      newAppointment,
      updatedAppointments: [...updatedAppointments, newAppointment],
    };
  }

  return {
    newAppointment,
    updatedAppointments: [...appointments, newAppointment],
  };
};

export const handleUpdateAppointment = (
  updatedAppointment: Appointment,
  appointments: Appointment[]
): Appointment[] => {
  return appointments.map((app) =>
    app.id === updatedAppointment.id ? updatedAppointment : app
  );
};

export const handleCancelAppointment = (
  appointmentId: string,
  appointments: Appointment[]
): Appointment[] => {
  return appointments.map((app) =>
    app.id === appointmentId ? { ...app, status: "cancelled" as const } : app
  );
};

export const handleCompleteAppointment = (
  appointmentId: string,
  appointments: Appointment[]
): Appointment[] => {
  return appointments.map((app) =>
    app.id === appointmentId ? { ...app, status: "completed" as const } : app
  );
};
