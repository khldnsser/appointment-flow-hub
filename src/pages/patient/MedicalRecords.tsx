
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { format } from "date-fns";
import { Appointment, MedicalRecord } from "@/types/auth";

const MedicalRecords = () => {
  const { user, appointments } = useAuth();

  if (!user || user.role !== "patient") return null;

  const patientAppointments = appointments.filter(
    (apt) => apt.patientId === user.id
  ).sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

  // Get appointments with records
  const getAppointmentWithRecord = (appointment: Appointment): { appointment: Appointment; record: MedicalRecord | undefined } => {
    const record = user.medicalRecords?.find(
      (rec) => rec.appointmentId === appointment.id
    );
    
    return { appointment, record };
  };

  const appointmentsWithRecords = patientAppointments.map(getAppointmentWithRecord)
    .filter((item) => item.record !== undefined);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Your Medical Records</h1>
      
      {appointmentsWithRecords.length > 0 ? (
        <div className="space-y-6">
          {appointmentsWithRecords.map(({ appointment, record }) => (
            <Card key={appointment.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <CardTitle className="text-xl">
                  Appointment on {format(new Date(appointment.dateTime), "PPPP")}
                </CardTitle>
                <CardDescription>
                  With Dr. {appointment.doctorName} at {format(new Date(appointment.dateTime), "p")}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {record && (
                  <div className="grid gap-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Subjective</h3>
                      <p className="text-muted-foreground">{record.subjective}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Objective</h3>
                      <p className="text-muted-foreground">{record.objective}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Assessment</h3>
                      <p className="text-muted-foreground">{record.assessment}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Plan</h3>
                      <p className="text-muted-foreground">{record.plan}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-10">
            <p className="text-muted-foreground">
              You don't have any medical records yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MedicalRecords;
