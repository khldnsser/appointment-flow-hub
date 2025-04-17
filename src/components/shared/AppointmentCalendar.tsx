
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { startOfWeek, addDays, format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  dateTime: Date;
  doctorName?: string;
  patientName?: string;
  status: "scheduled" | "completed" | "cancelled";
}

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
  userType: "doctor" | "patient";
}

const HOURS = Array.from({ length: 9 }, (_, i) => i + 9); // 9 AM to 5 PM

const AppointmentCalendar = ({ appointments, onAppointmentClick, userType }: AppointmentCalendarProps) => {
  const mondayOfWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(mondayOfWeek, i));

  const getAppointmentsForDateAndHour = (date: Date, hour: number) => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.dateTime);
      return isSameDay(aptDate, date) && aptDate.getHours() === hour;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule</CardTitle>
        <CardDescription>Your {userType === "doctor" ? "patient appointments" : "medical appointments"} for the week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Calendar Header */}
            <div className="grid grid-cols-6 gap-2 mb-2">
              <div className="p-2 font-medium text-center text-gray-500">Time</div>
              {weekDays.map((day) => (
                <div key={day.toString()} className="p-2 text-center">
                  <div className="font-medium">{format(day, "EEE")}</div>
                  <div className="text-sm text-gray-500">{format(day, "MMM d")}</div>
                </div>
              ))}
            </div>

            {/* Time Slots */}
            {HOURS.map((hour) => (
              <div key={hour} className="grid grid-cols-6 gap-2 border-t">
                <div className="p-2 text-sm text-gray-500 text-center">
                  {format(new Date().setHours(hour, 0), "h:mm a")}
                </div>
                {weekDays.map((day) => {
                  const dayAppointments = getAppointmentsForDateAndHour(day, hour);
                  return (
                    <div 
                      key={day.toString()} 
                      className="p-1 min-h-[60px] border-l"
                    >
                      {dayAppointments.map((apt) => (
                        <div
                          key={apt.id}
                          onClick={() => onAppointmentClick(apt)}
                          className={cn(
                            "text-xs p-1 mb-1 rounded cursor-pointer",
                            "bg-medteal-100 text-medteal-800 hover:bg-medteal-200",
                            apt.status === "cancelled" && "bg-red-100 text-red-800",
                            apt.status === "completed" && "bg-green-100 text-green-800"
                          )}
                        >
                          <div className="font-medium">
                            {userType === "doctor" ? apt.patientName : apt.doctorName}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCalendar;
