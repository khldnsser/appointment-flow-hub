
import React, { useState } from "react";
import { useAuth, Appointment } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format, startOfDay, addDays } from "date-fns";
import { toast } from "@/components/ui/sonner";
import { CalendarIcon, Check, Clock } from "lucide-react";
import AppointmentCalendar from "@/components/shared/AppointmentCalendar";

const DoctorDashboard = () => {
  const { user, appointments, addPrescription } = useAuth();
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [prescriptionText, setPrescriptionText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!user || user.role !== "doctor") return null;

  const doctorAppointments = appointments.filter(
    (appointment) => appointment.doctorId === user.id
  );

  const calendarDates = Array.from({ length: 5 }, (_, i) => addDays(selectedDate, i));

  const appointmentsByDate = calendarDates.map((date) => {
    return {
      date,
      appointments: doctorAppointments.filter(
        (appointment) =>
          startOfDay(new Date(appointment.dateTime)).getTime() === date.getTime() &&
          appointment.status !== "cancelled"
      ),
    };
  });

  const handlePrescriptionSubmit = () => {
    if (!selectedAppointment) return;
    
    addPrescription(selectedAppointment.id, prescriptionText);
    toast.success("Prescription added successfully");
    setIsDialogOpen(false);
    setPrescriptionText("");
  };

  const todayAppointments = doctorAppointments.filter(
    (appointment) =>
      startOfDay(new Date(appointment.dateTime)).getTime() === startOfDay(new Date()).getTime() &&
      appointment.status !== "cancelled"
  );

  const upcomingAppointments = doctorAppointments.filter(
    (appointment) =>
      new Date(appointment.dateTime) > new Date() &&
      appointment.status === "scheduled"
  );

  const completedAppointments = doctorAppointments.filter(
    (appointment) => appointment.status === "completed"
  );

  const formatAppointmentTime = (dateTime: Date) => {
    return format(new Date(dateTime), "h:mm a");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
        <div className="text-sm text-gray-500 mt-1 sm:mt-0">
          Today is {format(new Date(), "EEEE, MMMM dd, yyyy")}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-medblue-500 mr-2" />
              <div className="text-2xl font-bold">{todayAppointments.length}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-medblue-500 mr-2" />
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-medblue-500 mr-2" />
              <div className="text-2xl font-bold">{completedAppointments.length}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AppointmentCalendar
        appointments={doctorAppointments}
        onAppointmentClick={(appointment) => {
          setSelectedAppointment(appointment);
          setPrescriptionText(appointment.prescription || "");
          setIsDialogOpen(true);
        }}
        userType="doctor"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              {selectedAppointment && (
                <span className="text-sm">
                  {format(new Date(selectedAppointment.dateTime), "EEEE, MMMM dd, yyyy")} at {formatAppointmentTime(selectedAppointment.dateTime)}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Patient</h3>
                <p>{selectedAppointment.patientName}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Status</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedAppointment.status)}`}>
                  {selectedAppointment.status}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="prescription">Prescription</Label>
                </div>
                <Textarea
                  id="prescription"
                  placeholder="Enter prescription details..."
                  value={prescriptionText}
                  onChange={(e) => setPrescriptionText(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handlePrescriptionSubmit}>
                  Save Prescription
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorDashboard;
