
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MedicalRecord, User } from "@/types/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import AddMedicalRecordDialog from "@/components/doctor/AddMedicalRecordDialog";

const PatientRecords = () => {
  const { patients, appointments, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);

  if (!user || user.role !== "doctor") return null;

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const patientAppointments = selectedPatient 
    ? appointments.filter(
        (apt) => 
          apt.patientId === selectedPatient.id && 
          apt.doctorId === user.id
      ).sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
    : [];

  const handleSelectPatient = (patient: User) => {
    setSelectedPatient(patient);
  };

  const handleAddRecord = (appointmentId: string) => {
    setSelectedAppointment(appointmentId);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Patient Medical Records</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Patients</CardTitle>
              <CardDescription>Select a patient to view their records</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
              />
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {filteredPatients.map((patient) => (
                  <Button
                    key={patient.id}
                    variant={selectedPatient?.id === patient.id ? "default" : "outline"}
                    className="w-full justify-start text-left"
                    onClick={() => handleSelectPatient(patient)}
                  >
                    {patient.name}
                  </Button>
                ))}
                {filteredPatients.length === 0 && (
                  <p className="text-center py-4 text-muted-foreground">No patients found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <Tabs defaultValue="appointments">
              <TabsList className="mb-4">
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="records">Medical Records</TabsTrigger>
              </TabsList>
              
              <TabsContent value="appointments">
                <Card>
                  <CardHeader>
                    <CardTitle>Appointments for {selectedPatient.name}</CardTitle>
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
                                  onClick={() => handleAddRecord(appointment.id)}
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
                </Card>
              </TabsContent>
              
              <TabsContent value="records">
                <Card>
                  <CardHeader>
                    <CardTitle>Medical Records for {selectedPatient.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedPatient.medicalRecords && selectedPatient.medicalRecords.length > 0 ? (
                      <div className="space-y-4">
                        {selectedPatient.medicalRecords.map((record) => (
                          <Card key={record.id}>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">
                                Record from {format(new Date(record.date), "PPP")}
                              </CardTitle>
                              <CardDescription>
                                By Dr. {record.doctorName}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid gap-4">
                                <div>
                                  <h4 className="font-semibold">Subjective</h4>
                                  <p>{record.subjective}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold">Objective</h4>
                                  <p>{record.objective}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold">Assessment</h4>
                                  <p>{record.assessment}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold">Plan</h4>
                                  <p>{record.plan}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-4 text-muted-foreground">
                        No medical records found
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="text-center py-10">
                <p className="text-muted-foreground">
                  Select a patient to view their records
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {selectedPatient && (
        <AddMedicalRecordDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          patientId={selectedPatient.id}
          appointmentId={selectedAppointment || ""}
          doctorName={user.name}
        />
      )}
    </div>
  );
};

export default PatientRecords;
