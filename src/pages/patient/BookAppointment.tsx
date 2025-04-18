
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import BookAppointmentForm from "@/components/appointments/BookAppointmentForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const BookAppointment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get("doctorId");
  const { doctors, user, createAppointment, appointments } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();

  const doctor = doctors.find((d) => d.id === doctorId);
  const doctorAppointments = appointments.filter(apt => apt.doctorId === doctorId);

  if (!doctor) {
    return (
      <div className="text-center py-8">
        <p>Doctor not found.</p>
        <Button className="mt-4" onClick={() => navigate("/patient/find-doctors")}>
          Back to Find Doctors
        </Button>
      </div>
    );
  }

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime || !user) return;

    const [hours, minutes] = selectedTime.split(":").map(Number);
    const appointmentDateTime = new Date(selectedDate);
    appointmentDateTime.setHours(hours, minutes);

    const newAppointment = {
      doctorId: doctor.id,
      patientId: user.id,
      doctorName: doctor.name,
      patientName: user.name,
      dateTime: appointmentDateTime,
      status: "scheduled" as const,
    };

    createAppointment(newAppointment);
    toast.success("Appointment booked successfully!");
    navigate("/patient/dashboard");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <BookAppointmentForm
        doctor={doctor}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onDateSelect={setSelectedDate}
        onTimeSelect={setSelectedTime}
        onSubmit={handleBookAppointment}
        appointments={doctorAppointments}
      />
    </div>
  );
};

export default BookAppointment;
