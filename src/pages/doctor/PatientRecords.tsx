
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "@/types/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientMedicalRecords from "@/components/doctor/PatientMedicalRecords";
import PatientAppointments from "@/components/doctor/PatientAppointments";
import { Phone, Mail } from "lucide-react";

const PatientRecords = () => {
  const { patients, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);

  if (!user || user.role !== "doctor") return null;

  const filteredPatients = patients.filter((patient) =>
    patient.phoneNumber.replace(/\D/g, '').includes(searchTerm.replace(/\D/g, ''))
  );

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Patient Records</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <Input
                placeholder="Search by phone number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
                type="tel"
              />
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {filteredPatients.map((patient) => (
                  <Button
                    key={patient.id}
                    variant={selectedPatient?.id === patient.id ? "default" : "outline"}
                    className="w-full justify-start text-left"
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <div className="flex flex-col items-start">
                      <span>{patient.name}</span>
                      <span className="text-sm text-muted-foreground">{patient.phoneNumber}</span>
                    </div>
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
            <>
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-2">
                    <h2 className="text-2xl font-semibold">{selectedPatient.name}</h2>
                    <div className="flex items-center text-muted-foreground">
                      <Phone className="w-4 h-4 mr-2" />
                      {selectedPatient.phoneNumber}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Mail className="w-4 h-4 mr-2" />
                      {selectedPatient.email}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="records">
                <TabsList className="mb-4">
                  <TabsTrigger value="records">Medical Records</TabsTrigger>
                  <TabsTrigger value="appointments">Appointments</TabsTrigger>
                </TabsList>
                
                <TabsContent value="records">
                  <PatientMedicalRecords patient={selectedPatient} />
                </TabsContent>
                
                <TabsContent value="appointments">
                  <PatientAppointments patient={selectedPatient} />
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-10">
                <p className="text-muted-foreground">
                  Search for a patient using their phone number to view their records
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientRecords;
