
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { specializations } from "@/components/auth/doctorSpecializations";
import { format, isSameDay, isAfter } from "date-fns";
import { Appointment } from "@/types/auth";

// Define the Doctor interface with the missing properties
interface Doctor {
  id: string;
  name: string;
  email: string;
  role: "doctor";
  phoneNumber: string;
  specialization?: string;
}

const FindDoctors = () => {
  const navigate = useNavigate();
  const { doctors, appointments } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [specialty, setSpecialty] = useState("all");

  // Cast doctors to Doctor[] to ensure TypeScript recognizes the specialty property
  const doctorsWithSpecialty = doctors as Doctor[];

  // Find next available appointment for each doctor
  const getNextAvailableSlot = (doctorId: string) => {
    const doctorAppointments = appointments.filter(
      (apt) => apt.doctorId === doctorId && apt.status === "scheduled"
    );
    
    if (doctorAppointments.length === 0) {
      return "Today";
    }
    
    const timeSlots = [
      "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
      "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
    ];
    
    // Check next 14 days
    const today = new Date();
    
    for (let day = 0; day < 14; day++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + day);
      
      for (const timeSlot of timeSlots) {
        const [hours, minutes] = timeSlot.split(":").map(Number);
        const slotTime = new Date(checkDate);
        slotTime.setHours(hours, minutes, 0, 0);
        
        // Skip past time slots
        if (!isAfter(slotTime, new Date())) continue;
        
        const isBooked = doctorAppointments.some((apt) => {
          const aptDate = new Date(apt.dateTime);
          return isSameDay(aptDate, slotTime) && 
                 aptDate.getHours() === hours && 
                 aptDate.getMinutes() === minutes;
        });
        
        if (!isBooked) {
          return day === 0 
            ? `Today at ${timeSlot}` 
            : day === 1 
              ? `Tomorrow at ${timeSlot}` 
              : `${format(slotTime, "E, MMM d")} at ${timeSlot}`;
        }
      }
    }
    
    return "No slots available in next 14 days";
  };

  const filteredDoctors = doctorsWithSpecialty
    .filter((doctor) => {
      const matchesSearch = doctor.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesSpecialty =
        specialty === "all" || doctor.specialization === specialty;
      return matchesSearch && matchesSpecialty;
    })
    .sort((a, b) => {
      // Sort by availability - this is a simple sort that prioritizes doctors with "Today" availability
      const slotA = getNextAvailableSlot(a.id);
      const slotB = getNextAvailableSlot(b.id);
      
      if (slotA.startsWith("Today") && !slotB.startsWith("Today")) return -1;
      if (!slotA.startsWith("Today") && slotB.startsWith("Today")) return 1;
      if (slotA.startsWith("Tomorrow") && !slotB.startsWith("Tomorrow") && !slotB.startsWith("Today")) return -1;
      if (!slotA.startsWith("Tomorrow") && !slotA.startsWith("Today") && slotB.startsWith("Tomorrow")) return 1;
      
      return 0;
    });

  const handleBookAppointment = (doctorId: string) => {
    navigate(`/patient/book-appointment?doctorId=${doctorId}`);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Find Doctors</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by doctor name..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={specialty} onValueChange={setSpecialty}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by specialty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specialties</SelectItem>
            {specializations.map((spec) => (
              <SelectItem key={spec} value={spec}>
                {spec}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredDoctors.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No doctors found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col space-y-3">
                  <h3 className="font-semibold text-lg">{doctor.name}</h3>
                  <Badge className="w-fit">{doctor.specialization || "General Medicine"}</Badge>
                  <p className="text-sm text-muted-foreground">
                    Next available: {getNextAvailableSlot(doctor.id)}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 px-6 py-4">
                <Button
                  className="w-full"
                  onClick={() => handleBookAppointment(doctor.id)}
                >
                  Book Appointment
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FindDoctors;
