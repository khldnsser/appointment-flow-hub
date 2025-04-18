
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "@/types/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientMedicalRecords from "@/components/doctor/PatientMedicalRecords";
import PatientAppointments from "@/components/doctor/PatientAppointments";
import { Phone, Mail, Search } from "lucide-react";

const PatientRecords = () => {
  const { patients, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);

  if (!user || user.role !== "doctor") return null;

  const filteredPatients = patients.filter((patient) =>
    patient.phoneNumber.replace(/\D/g, '').includes(searchTerm.replace(/\D/g, ''))
  );

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Patient Records</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 bg-muted/30 rounded-md px-3 py-2 mb-6">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by phone number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  type="tel"
                />
              </div>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {filteredPatients.map((patient) => (
                  <Button
                    key={patient.id}
                    variant={selectedPatient?.id === patient.id ? "default" : "outline"}
                    className="w-full justify-start text-left p-4 h-auto"
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-medium text-base">{patient.name}</span>
                      <span className="text-sm text-muted-foreground">{patient.phoneNumber}</span>
                    </div>
                  </Button>
                ))}
                {filteredPatients.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg">
                    <p>No patients found</p>
                    <p className="text-sm mt-1">Try a different phone number</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <>
              <Card className="mb-8 shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4">
                    <h2 className="text-3xl font-semibold">{selectedPatient.name}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div className="flex items-center text-muted-foreground bg-muted/20 p-3 rounded-md">
                        <Phone className="w-5 h-5 mr-3 text-primary" />
                        <span>{selectedPatient.phoneNumber}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground bg-muted/20 p-3 rounded-md">
                        <Mail className="w-5 h-5 mr-3 text-primary" />
                        <span>{selectedPatient.email}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="records" className="space-y-6">
                <TabsList className="mb-6 p-1 w-full max-w-md mx-auto grid grid-cols-2">
                  <TabsTrigger value="records" className="py-3">Medical Records</TabsTrigger>
                  <TabsTrigger value="appointments" className="py-3">Appointments</TabsTrigger>
                </TabsList>
                
                <TabsContent value="records" className="mt-0">
                  <PatientMedicalRecords patient={selectedPatient} />
                </TabsContent>
                
                <TabsContent value="appointments" className="mt-0">
                  <PatientAppointments patient={selectedPatient} />
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <Card className="shadow-md h-[300px] flex items-center justify-center">
              <CardContent className="text-center py-10">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground text-lg">
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
