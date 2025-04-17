
import React, { useState } from "react";
import { useAuth, Appointment } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format, startOfDay, addDays } from "date-fns";
import { toast } from "@/components/ui/sonner";
import { CalendarIcon, Clock, FileText, User, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import AppointmentCalendar from "@/components/shared/AppointmentCalendar";

const PatientDashboard = () => {
  const { user, appointments, cancelAppointment } = useAuth();
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!user || user.role !== "patient") return null;

  const patientAppointments = appointments.filter(
    (appointment) => appointment.patientId === user.id
  );

  const calendarDates = Array.from({ length: 5 }, (_, i) => addDays(selectedDate, i));

  const appointmentsByDate = calendarDates.map((date) => {
    return {
      date,
      appointments: patientAppointments.filter(
        (appointment) =>
          startOfDay(new Date(appointment.dateTime)).getTime() === date.getTime() &&
          appointment.status !== "cancelled"
      ),
    };
  });

  const upcomingAppointments = patientAppointments.filter(
    (appointment) =>
      new Date(appointment.dateTime) > new Date() &&
      appointment.status === "scheduled"
  );

  const completedAppointments = patientAppointments.filter(
    (appointment) => appointment.status === "completed"
  );

  const handleCancelAppointment = () => {
    if (!selectedAppointment) return;
    
    cancelAppointment(selectedAppointment.id);
    toast.success("Appointment cancelled successfully");
    setIsDialogOpen(false);
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Your Dashboard</h1>
        <div className="text-sm text-gray-500 mt-1 sm:mt-0">
          Today is {format(new Date(), "EEEE, MMMM dd, yyyy")}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-hover">
          <CardContent className="p-6">
            <Link to="/patient/find-doctors" className="flex flex-col h-full items-center justify-center text-center">
              <div className="rounded-full bg-medteal-100 p-3 mb-3">
                <User className="h-6 w-6 text-medteal-700" />
              </div>
              <h3 className="font-medium">Find Doctors</h3>
              <p className="text-sm text-gray-500 mt-1">Search by specialty or name</p>
            </Link>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <Link to="/patient/book-appointment" className="flex flex-col h-full items-center justify-center text-center">
              <div className="rounded-full bg-medteal-100 p-3 mb-3">
                <CalendarIcon className="h-6 w-6 text-medteal-700" />
              </div>
              <h3 className="font-medium">Book Appointment</h3>
              <p className="text-sm text-gray-500 mt-1">Schedule your next visit</p>
            </Link>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <Link to="/patient/records" className="flex flex-col h-full items-center justify-center text-center">
              <div className="rounded-full bg-medteal-100 p-3 mb-3">
                <FileText className="h-6 w-6 text-medteal-700" />
              </div>
              <h3 className="font-medium">Medical Records</h3>
              <p className="text-sm text-gray-500 mt-1">View your health history</p>
            </Link>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <Link to="/patient/symptoms" className="flex flex-col h-full items-center justify-center text-center">
              <div className="rounded-full bg-medteal-100 p-3 mb-3">
                <AlertTriangle className="h-6 w-6 text-medteal-700" />
              </div>
              <h3 className="font-medium">Symptom Checker</h3>
              <p className="text-sm text-gray-500 mt-1">Find the right specialist</p>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-medteal-500 mr-2" />
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Past Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-medteal-500 mr-2" />
              <div className="text-2xl font-bold">{completedAppointments.length}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AppointmentCalendar
        appointments={patientAppointments}
        onAppointmentClick={(appointment) => {
          setSelectedAppointment(appointment);
          setIsDialogOpen(true);
        }}
        userType="patient"
      />

      <Card>
        <CardHeader>
          <CardTitle>Recent & Upcoming Appointments</CardTitle>
          <CardDescription>
            Click on an appointment to view details or manage it
          </CardDescription>
        </CardHeader>
        <CardContent>
          {patientAppointments.length > 0 ? (
            <div className="divide-y">
              {patientAppointments
                .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
                .slice(0, 5)
                .map((appointment) => (
                  <div 
                    key={appointment.id} 
                    className="py-3 cursor-pointer hover:bg-gray-50 px-3 rounded-md"
                    onClick={() => {
                      setSelectedAppointment(appointment);
                      setIsDialogOpen(true);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{appointment.doctorName}</p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(appointment.dateTime), "EEEE, MMMM dd, yyyy")} at {formatAppointmentTime(appointment.dateTime)}
                        </p>
                      </div>
                      <Badge variant={appointment.status === "scheduled" ? "outline" : appointment.status === "completed" ? "default" : "destructive"}>
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You have no appointments scheduled</p>
              <Button asChild>
                <Link to="/patient/book-appointment">Book an Appointment</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

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
                <h3 className="font-medium mb-1">Doctor</h3>
                <p>{selectedAppointment.doctorName}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Status</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedAppointment.status)}`}>
                  {selectedAppointment.status}
                </span>
              </div>
              
              {selectedAppointment.prescription && (
                <div>
                  <h3 className="font-medium mb-1">Prescription</h3>
                  <div className="bg-gray-50 p-3 rounded-md text-sm">
                    {selectedAppointment.prescription}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                {selectedAppointment.status === "scheduled" && (
                  <Button variant="destructive" onClick={handleCancelAppointment}>
                    Cancel Appointment
                  </Button>
                )}
                <Button onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientDashboard;
