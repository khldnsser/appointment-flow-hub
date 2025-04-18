import React from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/types/auth";

interface AppointmentDialogProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
}

const AppointmentDialog = ({
  appointment,
  isOpen,
  onClose,
  onCancel,
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

  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
          <DialogDescription>
            {format(new Date(appointment.dateTime), "EEEE, MMMM dd, yyyy")} at{" "}
            {formatAppointmentTime(appointment.dateTime)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Doctor</h3>
            <p>{appointment.doctorName}</p>
          </div>

          <div>
            <h3 className="font-medium mb-1">Status</h3>
            <span
              className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                appointment.status
              )}`}
            >
              {appointment.status}
            </span>
          </div>

          {appointment.prescription && (
            <div>
              <h3 className="font-medium mb-1">Prescription</h3>
              <div className="bg-gray-50 p-3 rounded-md text-sm">
                {appointment.prescription}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            {appointment.status === "scheduled" && (
              <Button variant="destructive" onClick={onCancel}>
                Cancel Appointment
              </Button>
            )}
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDialog;
