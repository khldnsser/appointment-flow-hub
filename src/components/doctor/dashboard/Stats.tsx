import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Check, Clock } from "lucide-react";
import { Appointment } from "@/types/auth";
import { startOfDay } from "date-fns";

interface StatsProps {
  appointments: Appointment[];
}

const Stats = ({ appointments }: StatsProps) => {
  const todayAppointments = appointments.filter(
    (appointment) =>
      startOfDay(new Date(appointment.dateTime)).getTime() === startOfDay(new Date()).getTime() &&
      appointment.status !== "cancelled"
  );

  const upcomingAppointments = appointments.filter(
    (appointment) =>
      new Date(appointment.dateTime) > new Date() &&
      appointment.status === "scheduled"
  );

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "completed"
  );

  return (
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
  );
};

export default Stats;
