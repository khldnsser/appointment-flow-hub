
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePlus, PenLine } from "lucide-react";
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
    <Card key={refreshKey}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Medical Records for {patient.name}</CardTitle>
        <Button 
          onClick={handleCreateClick}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <FilePlus className="h-4 w-4" />
          Add Record
        </Button>
      </CardHeader>
      <CardContent>
        {patient.medicalRecords && patient.medicalRecords.length > 0 ? (
          <div className="space-y-4">
            {patient.medicalRecords
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((record: MedicalRecord) => (
                <Card key={record.id} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-medium">
                          Visit on {format(new Date(record.date), "PPP")}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          By {record.doctorName}
                        </p>
                      </div>
                      {canEditRecord(record) && (
                        <Button
                          variant="ghost"
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
                  <CardContent>
                    <div className="grid gap-4 text-sm">
                      <div>
                        <h4 className="font-medium mb-1 text-primary">Subjective</h4>
                        <p className="text-muted-foreground">{record.subjective}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1 text-primary">Objective</h4>
                        <p className="text-muted-foreground">{record.objective}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1 text-primary">Assessment</h4>
                        <p className="text-muted-foreground">{record.assessment}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1 text-primary">Plan</h4>
                        <p className="text-muted-foreground">{record.plan}</p>
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
