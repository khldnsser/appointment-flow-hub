
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SOAPNote } from "@/services/medicalRecordService";
import { toast } from "sonner";

interface AddMedicalRecordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  appointmentId: string;
  doctorName: string;
}

const AddMedicalRecordDialog = ({
  isOpen,
  onClose,
  patientId,
  appointmentId,
  doctorName
}: AddMedicalRecordDialogProps) => {
  const { addMedicalRecord, completeAppointment } = useAuth();
  
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
      ...formData
    };
    
    addMedicalRecord(patientId, soapNote);
    completeAppointment(appointmentId);
    toast.success("Medical record added successfully");
    onClose();
    
    // Reset form
    setFormData({
      subjective: "",
      objective: "",
      assessment: "",
      plan: ""
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add SOAP Note</DialogTitle>
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
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMedicalRecordDialog;
