
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Appointment } from "@/types/auth";
import { toast } from "@/components/ui/sonner";
import { format, startOfDay } from "date-fns";
import AppointmentCalendar from "@/components/shared/AppointmentCalendar";
import QuickActions from "@/components/patient/dashboard/QuickActions";
import Stats from "@/components/patient/dashboard/Stats";
import AppointmentsList from "@/components/patient/dashboard/AppointmentsList";
import AppointmentDialog from "@/components/patient/dashboard/AppointmentDialog";

const PatientDashboard = () => {
  const { user, appointments, cancelAppointment } = useAuth();
  const [selectedDate] = useState(startOfDay(new Date()));
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!user || user.role !== "patient") return null;

  const patientAppointments = appointments.filter(
    (appointment) => appointment.patientId === user.id
  );

  const handleCancelAppointment = () => {
    if (!selectedAppointment) return;
    
    cancelAppointment(selectedAppointment.id);
    toast.success("Appointment cancelled successfully");
    setIsDialogOpen(false);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900">Your Dashboard</h1>
        <div className="text-sm text-gray-500 mt-1 sm:mt-0">
          Today is {format(new Date(), "EEEE, MMMM dd, yyyy")}
        </div>
      </div>

      <QuickActions />
      <Stats appointments={patientAppointments} />

      <AppointmentCalendar
        appointments={patientAppointments}
        onAppointmentClick={handleAppointmentClick}
        userType="patient"
      />

      <AppointmentsList
        appointments={patientAppointments}
        onAppointmentClick={handleAppointmentClick}
      />

      <AppointmentDialog
        appointment={selectedAppointment}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCancel={handleCancelAppointment}
      />
    </div>
  );
};

export default PatientDashboard;
