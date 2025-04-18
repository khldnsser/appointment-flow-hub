
import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/types/auth";
import { Link } from "react-router-dom";

interface AppointmentsListProps {
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
}

const AppointmentsList = ({ appointments, onAppointmentClick }: AppointmentsListProps) => {
  const formatAppointmentTime = (dateTime: Date) => {
    return format(new Date(dateTime), "h:mm a");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent & Upcoming Appointments</CardTitle>
        <CardDescription>
          Click on an appointment to view details or manage it
        </CardDescription>
      </CardHeader>
      <CardContent>
        {appointments.length > 0 ? (
          <div className="divide-y">
            {appointments
              .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
              .slice(0, 5)
              .map((appointment) => (
                <div
                  key={appointment.id}
                  className="py-3 cursor-pointer hover:bg-gray-50 px-3 rounded-md"
                  onClick={() => onAppointmentClick(appointment)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{appointment.doctorName}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(appointment.dateTime), "EEEE, MMMM dd, yyyy")} at{" "}
                        {formatAppointmentTime(appointment.dateTime)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        appointment.status === "scheduled"
                          ? "outline"
                          : appointment.status === "completed"
                          ? "default"
                          : "destructive"
                      }
                    >
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
  );
};

export default AppointmentsList;
