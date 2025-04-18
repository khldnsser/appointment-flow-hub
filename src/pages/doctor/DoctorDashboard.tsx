
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Appointment } from "@/types/auth";
import { format, startOfDay } from "date-fns";
import { toast } from "@/components/ui/sonner";
import AppointmentCalendar from "@/components/shared/AppointmentCalendar";
import Stats from "@/components/doctor/dashboard/Stats";
import AppointmentDialog from "@/components/doctor/dashboard/AppointmentDialog";

const DoctorDashboard = () => {
  const { user, appointments, addPrescription } = useAuth();
  const [selectedDate] = useState(startOfDay(new Date()));
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [prescriptionText, setPrescriptionText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Add a useEffect to handle loading state
  useEffect(() => {
    // If user is available, we can consider the component loaded
    if (user) {
      setIsLoading(false);
    }
  }, [user]);

  // Show loading state while waiting for user data
  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading dashboard...</div>;
  }

  // If user is not a doctor or not authenticated, we should redirect (this is a fallback)
  if (!user || user.role !== "doctor") {
    return <div>Unauthorized access. Redirecting...</div>;
  }

  // Now we can safely filter appointments knowing user exists
  const doctorAppointments = appointments.filter(
    (appointment) => appointment.doctorId === user.id
  );

  const handlePrescriptionSubmit = () => {
    if (!selectedAppointment) return;
    
    addPrescription(selectedAppointment.id, prescriptionText);
    toast.success("Prescription added successfully");
    setIsDialogOpen(false);
    setPrescriptionText("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
        <div className="text-sm text-gray-500 mt-1 sm:mt-0">
          Today is {format(new Date(), "EEEE, MMMM dd, yyyy")}
        </div>
      </div>

      <Stats appointments={doctorAppointments} />

      <AppointmentCalendar
        appointments={doctorAppointments}
        onAppointmentClick={(appointment) => {
          setSelectedAppointment(appointment);
          setPrescriptionText(appointment.prescription || "");
          setIsDialogOpen(true);
        }}
        userType="doctor"
      />

      <AppointmentDialog
        appointment={selectedAppointment}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onPrescriptionSubmit={handlePrescriptionSubmit}
        prescriptionText={prescriptionText}
        setPrescriptionText={setPrescriptionText}
      />
    </div>
  );
};

export default DoctorDashboard;
