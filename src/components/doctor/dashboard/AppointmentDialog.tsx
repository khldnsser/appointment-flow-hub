import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Appointment } from "@/types/auth";

interface AppointmentDialogProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onPrescriptionSubmit: () => void;
  prescriptionText: string;
  setPrescriptionText: (text: string) => void;
}

const AppointmentDialog = ({
  appointment,
  isOpen,
  onClose,
  onPrescriptionSubmit,
  prescriptionText,
  setPrescriptionText,
}: AppointmentDialogProps) => {
  const formatAppointmentTime = (dateTime: Date) => {
    return format(new Date(dateTime), "h:mm a");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
          <DialogDescription>
            {appointment && (
              <span className="text-sm">
                {format(new Date(appointment.dateTime), "EEEE, MMMM dd, yyyy")} at{" "}
                {formatAppointmentTime(appointment.dateTime)}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        {appointment && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Patient</h3>
              <p>{appointment.patientName}</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Status</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="prescription">Prescription</Label>
              </div>
              <Textarea
                id="prescription"
                placeholder="Enter prescription details..."
                value={prescriptionText}
                onChange={(e) => setPrescriptionText(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={onPrescriptionSubmit}>
                Save Prescription
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDialog;
