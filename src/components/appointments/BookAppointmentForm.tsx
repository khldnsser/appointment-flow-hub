
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DateSelector from "./DateSelector";
import TimeSelector from "./TimeSelector";
import { User } from "@/types/auth";

interface BookAppointmentFormProps {
  doctor: User;
  selectedDate: Date | undefined;
  selectedTime: string | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onTimeSelect: (time: string) => void;
  onSubmit: () => void;
}

const BookAppointmentForm = ({
  doctor,
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  onSubmit,
}: BookAppointmentFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Book an Appointment with {doctor.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <DateSelector selectedDate={selectedDate} onDateSelect={onDateSelect} />
        <TimeSelector selectedTime={selectedTime} onTimeSelect={onTimeSelect} />
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
