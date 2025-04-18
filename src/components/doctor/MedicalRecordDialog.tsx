
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SOAPNote } from "@/services/medicalRecordService";
import { toast } from "sonner";
import { MedicalRecord } from "@/types/auth";

interface MedicalRecordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  appointmentId: string;
  doctorName: string;
  onRecordAdded?: () => void;
  existingRecord?: MedicalRecord;
  mode?: 'create' | 'edit';
}

const MedicalRecordDialog = ({
  isOpen,
  onClose,
  patientId,
  appointmentId,
  doctorName,
  onRecordAdded,
  existingRecord,
  mode = 'create'
}: MedicalRecordDialogProps) => {
  const { addMedicalRecord, updateMedicalRecord, completeAppointment, user } = useAuth();
  
  const [formData, setFormData] = useState<{
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  }>({
    subjective: "",
    objective: "",
    assessment: "",
    plan: ""
  });

  useEffect(() => {
    if (existingRecord && mode === 'edit') {
      setFormData({
        subjective: existingRecord.subjective,
        objective: existingRecord.objective,
        assessment: existingRecord.assessment,
        plan: existingRecord.plan
      });
    } else {
      setFormData({
        subjective: "",
        objective: "",
        assessment: "",
        plan: ""
      });
    }
  }, [existingRecord, mode]);
  
  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
  };
  
  const handleSubmit = () => {
    if (!formData.subjective || !formData.objective || !formData.assessment || !formData.plan) {
      toast.error("Please fill in all fields");
      return;
    }
    
    const soapNote: SOAPNote = {
      appointmentId,
      doctorName,
      doctorId: user?.id || '',  // Add the doctorId field
      ...formData
    };
    
    if (mode === 'edit' && existingRecord) {
      updateMedicalRecord(patientId, existingRecord.id, soapNote);
      toast.success("Medical record updated successfully");
    } else {
      addMedicalRecord(patientId, soapNote);
      if (appointmentId) {
        completeAppointment(appointmentId);
      }
      toast.success("Medical record added successfully");
    }
    
    if (onRecordAdded) {
      onRecordAdded();
    }
    
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit SOAP Note' : 'Add SOAP Note'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="subjective">Subjective</Label>
            <Textarea
              id="subjective"
              placeholder="Patient's statements about their symptoms, concerns, and history"
              value={formData.subjective}
              onChange={handleInputChange("subjective")}
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="objective">Objective</Label>
            <Textarea
              id="objective"
              placeholder="Measurable, observable findings from physical examination and test results"
              value={formData.objective}
              onChange={handleInputChange("objective")}
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="assessment">Assessment</Label>
            <Textarea
              id="assessment"
              placeholder="Diagnosis based on subjective and objective information"
              value={formData.assessment}
              onChange={handleInputChange("assessment")}
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="plan">Plan</Label>
            <Textarea
              id="plan"
              placeholder="Treatment plan, medications, follow-up, referrals, patient education"
              value={formData.plan}
              onChange={handleInputChange("plan")}
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>
            {mode === 'edit' ? 'Update' : 'Submit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MedicalRecordDialog;
