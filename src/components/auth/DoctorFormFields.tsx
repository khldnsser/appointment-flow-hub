
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { specializations } from "./doctorSpecializations";

interface DoctorFormFieldsProps {
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  specialization: string;
  setSpecialization: (value: string) => void;
  licenseNumber: string;
  setLicenseNumber: (value: string) => void;
  hospitalKey: string;
  setHospitalKey: (value: string) => void;
}

export const DoctorFormFields: React.FC<DoctorFormFieldsProps> = ({
  name,
  setName,
  email,
  setEmail,
  phoneNumber,
  setPhoneNumber,
  specialization,
  setSpecialization,
  licenseNumber,
  setLicenseNumber,
  hospitalKey,
  setHospitalKey,
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Dr. John Smith"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="john.smith@hospital.com"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number (8 digits)</Label>
        <Input
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          placeholder="12345678"
          maxLength={8}
          pattern="\d{8}"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="specialization">Specialization</Label>
        <Select value={specialization} onValueChange={setSpecialization} required>
          <SelectTrigger>
            <SelectValue placeholder="Select specialization" />
          </SelectTrigger>
          <SelectContent>
            {specializations.map((spec) => (
              <SelectItem key={spec} value={spec}>
                {spec}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="licenseNumber">License Number</Label>
        <Input
          id="licenseNumber"
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
          required
          placeholder="AB1234"
          maxLength={6}
        />
        <p className="text-xs text-gray-500">
          Format: 2 letters followed by 4 numbers (e.g., KJ1426)
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="hospitalKey">Hospital Key</Label>
        <Input
          id="hospitalKey"
          type="password"
          value={hospitalKey}
          onChange={(e) => setHospitalKey(e.target.value)}
          required
          placeholder="Enter 1234"
          maxLength={4}
        />
        <p className="text-xs text-gray-500">
          Hospital key (1234) required for verification
        </p>
      </div>
    </>
  );
};
