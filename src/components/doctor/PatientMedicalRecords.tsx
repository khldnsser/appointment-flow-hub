
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePlus, PenLine, Calendar, User as UserIcon } from "lucide-react";
import { format } from "date-fns";
import { MedicalRecord, User } from "@/types/auth";
import MedicalRecordDialog from "./MedicalRecordDialog";
import { useAuth } from "@/contexts/AuthContext";

interface PatientMedicalRecordsProps {
  patient: User;
}

const PatientMedicalRecords = ({ patient }: PatientMedicalRecordsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | undefined>();
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRecordAdded = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  const handleCreateClick = () => {
    setMode('create');
    setSelectedRecord(undefined);
    setIsDialogOpen(true);
  };

  const handleEditClick = (record: MedicalRecord) => {
    setMode('edit');
    setSelectedRecord(record);
    setIsDialogOpen(true);
  };

  const canEditRecord = (record: MedicalRecord) => {
    return user?.id === record.doctorId;
  };

  return (
    <Card key={refreshKey} className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between p-6 border-b">
        <CardTitle className="text-2xl">Medical Records for {patient.name}</CardTitle>
        <Button 
          onClick={handleCreateClick}
          variant="default"
          size="sm"
          className="flex items-center gap-2 px-4 py-2"
        >
          <FilePlus className="h-4 w-4" />
          Add Record
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        {patient.medicalRecords && patient.medicalRecords.length > 0 ? (
          <div className="space-y-6">
            {patient.medicalRecords
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((record: MedicalRecord) => (
                <Card key={record.id} className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2 p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 text-primary mb-2">
                          <Calendar className="h-4 w-4" />
                          <CardTitle className="text-lg font-medium">
                            Visit on {format(new Date(record.date), "PPP")}
                          </CardTitle>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <UserIcon className="h-4 w-4" />
                          <p className="text-sm">
                            By {record.doctorName}
                          </p>
                        </div>
                      </div>
                      {canEditRecord(record) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(record)}
                          className="flex items-center gap-2"
                        >
                          <PenLine className="h-4 w-4" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 pt-0">
                    <div className="grid gap-6 text-sm">
                      <div className="bg-muted/20 p-4 rounded-md">
                        <h4 className="font-semibold mb-2 text-primary">Subjective</h4>
                        <p className="text-muted-foreground">{record.subjective}</p>
                      </div>
                      <div className="bg-muted/20 p-4 rounded-md">
                        <h4 className="font-semibold mb-2 text-primary">Objective</h4>
                        <p className="text-muted-foreground">{record.objective}</p>
                      </div>
                      <div className="bg-muted/20 p-4 rounded-md">
                        <h4 className="font-semibold mb-2 text-primary">Assessment</h4>
                        <p className="text-muted-foreground">{record.assessment}</p>
                      </div>
                      <div className="bg-muted/20 p-4 rounded-md">
                        <h4 className="font-semibold mb-2 text-primary">Plan</h4>
                        <p className="text-muted-foreground">{record.plan}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted/10 rounded-lg border border-dashed">
            <FilePlus className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg mb-2">
              No medical records found
            </p>
            <p className="text-sm text-muted-foreground">
              Create a new record by clicking the "Add Record" button
            </p>
          </div>
        )}
      </CardContent>
      
      {user && (
        <MedicalRecordDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          patientId={patient.id}
          appointmentId={selectedRecord?.appointmentId || ""}
          doctorName={user.name}
          onRecordAdded={handleRecordAdded}
          existingRecord={selectedRecord}
          mode={mode}
        />
      )}
    </Card>
  );
};

export default PatientMedicalRecords;
