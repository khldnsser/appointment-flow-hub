
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeSelectorProps {
  selectedTime: string | undefined;
  onTimeSelect: (time: string) => void;
}

const TimeSelector = ({ selectedTime, onTimeSelect }: TimeSelectorProps) => {
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Time</label>
      <Select value={selectedTime} onValueChange={onTimeSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Select time slot" />
        </SelectTrigger>
        <SelectContent>
          {timeSlots.map((time) => (
            <SelectItem key={time} value={time}>
              {time}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeSelector;
