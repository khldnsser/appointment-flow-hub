
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { User } from "@/types/auth";
import MedicalRecordDialog from "./MedicalRecordDialog";

interface PatientAppointmentsProps {
  patient: User;
}

const PatientAppointments = ({ patient }: PatientAppointmentsProps) => {
  const { appointments, user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  // Add a state variable to force re-render when a record is added
  const [refreshKey, setRefreshKey] = useState(0);

  // Function to refresh the appointments
  const handleRecordAdded = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  const patientAppointments = appointments.filter(
    (apt) => apt.patientId === patient.id && apt.doctorId === user?.id
  ).sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

  return (
    <Card key={refreshKey}>
      <CardHeader>
        <CardTitle>Appointments for {patient.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patientAppointments.length > 0 ? (
              patientAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    {format(new Date(appointment.dateTime), "PPP p")}
                  </TableCell>
                  <TableCell>
                    <span className={`capitalize px-2 py-1 rounded-full text-xs
                      ${appointment.status === "scheduled" ? "bg-blue-100 text-blue-800" : 
                        appointment.status === "completed" ? "bg-green-100 text-green-800" : 
                        "bg-gray-100 text-gray-800"}`}>
                      {appointment.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedAppointment(appointment.id);
                        setIsDialogOpen(true);
                      }}
                    >
                      Add SOAP Note
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No appointments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {user && (
        <MedicalRecordDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          patientId={patient.id}
          appointmentId={selectedAppointment || ""}
          doctorName={user.name}
          onRecordAdded={handleRecordAdded}
        />
      )}
    </Card>
  );
};

export default PatientAppointments;
