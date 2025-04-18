import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Appointment } from "@/types/auth";
import { format, startOfDay } from "date-fns";
import { toast } from "@/components/ui/sonner";
import AppointmentCalendar from "@/components/shared/AppointmentCalendar";
import Stats from "@/components/doctor/dashboard/Stats";
import AppointmentDialog from "@/components/doctor/dashboard/AppointmentDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, FileText } from "lucide-react";

const DoctorDashboard = () => {
  const { user, appointments, addPrescription } = useAuth();
  const [selectedDate] = useState(startOfDay(new Date()));
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [prescriptionText, setPrescriptionText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!user || user.role !== "doctor") return null;

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Patient Management</CardTitle>
            <CardDescription>View and manage patient records</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/doctor/all-patients">
              <Button className="w-full" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                View All Patients
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Medical Records</CardTitle>
            <CardDescription>Create and manage patient medical records</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/doctor/all-patients">
              <Button className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Access Patient Records
              </Button>
            </Link>
          </CardContent>
        </Card>
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
