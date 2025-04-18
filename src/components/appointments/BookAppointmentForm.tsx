
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Appointment } from "@/types/auth";
import DoctorSchedule from "./DoctorSchedule";

interface BookAppointmentFormProps {
  doctor: User;
  selectedDate: Date | undefined;
  selectedTime: string | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onTimeSelect: (time: string) => void;
  onSubmit: () => void;
  appointments: Appointment[];
}

const BookAppointmentForm = ({
  doctor,
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  onSubmit,
  appointments,
}: BookAppointmentFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Book an Appointment with {doctor.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <DoctorSchedule 
          appointments={appointments}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onDateSelect={onDateSelect}
          onTimeSelect={onTimeSelect}
        />
        <Button
          className="w-full"
          onClick={onSubmit}
          disabled={!selectedDate || !selectedTime}
        >
          Confirm Appointment
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookAppointmentForm;
