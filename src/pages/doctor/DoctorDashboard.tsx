
import React, { useState } from "react";
import { useAuth, Appointment } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format, addDays, startOfDay } from "date-fns";
import { toast } from "@/components/ui/sonner";
import { Check, Clock, Calendar as CalendarIcon, X } from "lucide-react";

const DoctorDashboard = () => {
  const { user, appointments, addPrescription } = useAuth();
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [prescriptionText, setPrescriptionText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!user || user.role !== "doctor") return null;

  // Filter appointments for the current doctor
  const doctorAppointments = appointments.filter(
    (appointment) => appointment.doctorId === user.id
  );

  // Generate dates for the 5-day calendar
  const calendarDates = Array.from({ length: 5 }, (_, i) => addDays(selectedDate, i));

  // Group appointments by date
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

  // Handle prescription submission
  const handlePrescriptionSubmit = () => {
    if (!selectedAppointment) return;
    
    addPrescription(selectedAppointment.id, prescriptionText);
    toast.success("Prescription added successfully");
    setIsDialogOpen(false);
    setPrescriptionText("");
  };

  // Stats for the dashboard
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

  // Helper function to display appointment time
  const formatAppointmentTime = (dateTime: Date) => {
    return format(new Date(dateTime), "h:mm a");
  };

  // Helper function to get the status color
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

      {/* Stats Cards */}
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

      {/* Calendar Tabs */}
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        {/* Calendar View */}
        <TabsContent value="calendar" className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Calendar</CardTitle>
              <CardDescription>
                View and manage your schedule for the next 5 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {appointmentsByDate.map(({ date, appointments }) => (
                  <div key={date.toISOString()} className="calendar-day">
                    <div className="font-medium mb-2">
                      {format(date, "EEE, MMM dd")}
                    </div>
                    {appointments.length > 0 ? (
                      appointments
                        .sort((a, b) => 
                          new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
                        )
                        .map((appointment) => (
                          <div 
                            key={appointment.id} 
                            className="calendar-event"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setPrescriptionText(appointment.prescription || "");
                              setIsDialogOpen(true);
                            }}
                          >
                            <div className="font-medium">
                              {formatAppointmentTime(appointment.dateTime)}
                            </div>
                            <div>{appointment.patientName}</div>
                          </div>
                        ))
                    ) : (
                      <div className="text-gray-400 text-sm italic">No appointments</div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* List View */}
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Appointments List</CardTitle>
              <CardDescription>
                View all your upcoming and past appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.length > 0 ? (
                  <div className="rounded-md border">
                    <div className="bg-gray-50 p-3 border-b">
                      <h3 className="font-medium">Upcoming Appointments</h3>
                    </div>
                    <div className="divide-y">
                      {upcomingAppointments
                        .sort((a, b) => 
                          new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
                        )
                        .map((appointment) => (
                          <div 
                            key={appointment.id} 
                            className="p-4 hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setPrescriptionText(appointment.prescription || "");
                              setIsDialogOpen(true);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{appointment.patientName}</p>
                                <p className="text-sm text-gray-500">
                                  {format(new Date(appointment.dateTime), "EEEE, MMMM dd, yyyy")} at {formatAppointmentTime(appointment.dateTime)}
                                </p>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(appointment.status)}`}>
                                {appointment.status}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500">You have no upcoming appointments</p>
                  </div>
                )}
                
                {completedAppointments.length > 0 && (
                  <div className="rounded-md border">
                    <div className="bg-gray-50 p-3 border-b">
                      <h3 className="font-medium">Past Appointments</h3>
                    </div>
                    <div className="divide-y">
                      {completedAppointments
                        .sort((a, b) => 
                          new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
                        )
                        .map((appointment) => (
                          <div 
                            key={appointment.id} 
                            className="p-4 hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setPrescriptionText(appointment.prescription || "");
                              setIsDialogOpen(true);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{appointment.patientName}</p>
                                <p className="text-sm text-gray-500">
                                  {format(new Date(appointment.dateTime), "EEEE, MMMM dd, yyyy")} at {formatAppointmentTime(appointment.dateTime)}
                                </p>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(appointment.status)}`}>
                                {appointment.status}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Appointment Details Dialog */}
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
