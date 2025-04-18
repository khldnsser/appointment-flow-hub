import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PasswordRequirements from "@/components/auth/PasswordRequirements";
import { DoctorFormFields } from "./DoctorFormFields";

export const DoctorSignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [hospitalKey, setHospitalKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signupDoctor } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (phoneNumber.length !== 8 || !/^\d+$/.test(phoneNumber)) {
      toast.error("Phone number must be 8 digits");
      return;
    }
    
    if (!/^[A-Za-z]{2}\d{4}$/.test(licenseNumber)) {
      toast.error("License number must be 2 letters followed by 4 numbers");
      return;
    }
    
    if (hospitalKey !== "1234") {
      toast.error("Invalid hospital key");
      return;
    }
    
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasMinLength || !hasUpperCase || !hasNumber || !hasSpecialChar) {
      toast.error("Password does not meet all requirements");
      return;
    }
    
    setIsLoading(true);

    try {
      await signupDoctor(name, email, phoneNumber, password, specialization, licenseNumber, hospitalKey);
      toast.success("Doctor account created successfully!");
      navigate("/doctor/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DoctorFormFields
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        specialization={specialization}
        setSpecialization={setSpecialization}
        licenseNumber={licenseNumber}
        setLicenseNumber={setLicenseNumber}
        hospitalKey={hospitalKey}
        setHospitalKey={setHospitalKey}
      />
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <PasswordRequirements password={password} />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
};
