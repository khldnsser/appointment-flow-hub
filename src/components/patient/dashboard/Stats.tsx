
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Clock } from "lucide-react";
import { Appointment } from "@/contexts/AuthContext";

interface StatsProps {
  appointments: Appointment[];
}

const Stats = ({ appointments }: StatsProps) => {
  const upcomingAppointments = appointments.filter(
    (appointment) =>
      new Date(appointment.dateTime) > new Date() &&
      appointment.status === "scheduled"
  );

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "completed"
  );

  return (
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
  );
};

export default Stats;
