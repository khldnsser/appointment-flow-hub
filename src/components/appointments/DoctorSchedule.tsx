
import React from "react";
import { format, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Appointment } from "@/types/auth";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DoctorScheduleProps {
  appointments: Appointment[];
  selectedDate: Date | undefined;
  selectedTime: string | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onTimeSelect: (time: string) => void;
}

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
];

const DoctorSchedule = ({
  appointments,
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
}: DoctorScheduleProps) => {
  const isTimeSlotAvailable = (date: Date, time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return !appointments.some((apt) => {
      const aptDate = new Date(apt.dateTime);
      return (
        isSameDay(aptDate, date) &&
        aptDate.getHours() === hours &&
        aptDate.getMinutes() === minutes &&
        apt.status === "scheduled"
      );
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Select Date</h3>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          disabled={(date) => date < new Date()}
          className={cn("rounded-md border", "p-3 pointer-events-auto")}
        />
      </div>
      {selectedDate && (
        <div>
          <h3 className="text-sm font-medium mb-2">Available Time Slots</h3>
          <ScrollArea className="h-[300px] rounded-md border p-4">
            <div className="grid grid-cols-2 gap-2">
              {TIME_SLOTS.map((time) => {
                const isAvailable = isTimeSlotAvailable(selectedDate, time);
                return (
                  <button
                    key={time}
                    onClick={() => isAvailable && onTimeSelect(time)}
                    className={cn(
                      "p-2 text-sm rounded-md text-center",
                      isAvailable
                        ? "hover:bg-medteal-100 border border-medteal-200",
                        : "bg-gray-100 text-gray-400 cursor-not-allowed",
                      selectedTime === time && "bg-medteal-200 border-medteal-300"
                    )}
                    disabled={!isAvailable}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default DoctorSchedule;
