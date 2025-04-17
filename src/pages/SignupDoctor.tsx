
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";

const specializations = [
  "Cardiology",
  "Dermatology",
  "ENT",
  "Gastroenterology",
  "General Medicine",
  "Neurology",
  "Obstetrics & Gynecology",
  "Ophthalmology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Pulmonology",
  "Radiology",
  "Urology",
];

const SignupDoctor = () => {
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
    
    // Validate inputs
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
    
    if (hospitalKey.length !== 4 || !/^\d+$/.test(hospitalKey)) {
      toast.error("Hospital key must be 4 digits");
      return;
    }
    
    if (!specialization) {
      toast.error("Please select a specialization");
      return;
    }
    
    // Validate password complexity
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error("Password must be at least 8 characters and include at least one uppercase letter and one number");
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
    <div className="min-h-screen flex items-center justify-center bg-medblue-50 py-12">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-medblue-800">MediTrack</h1>
          <p className="text-medblue-600">Create your doctor account</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Doctor Registration</CardTitle>
            <CardDescription>
              Enter your details to create a healthcare provider account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="4-digit key"
                  maxLength={4}
                />
                <p className="text-xs text-gray-500">
                  4-digit key provided by your hospital (use 1234 for demo)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <p className="text-xs text-gray-500">
                  Must be at least 8 characters long and include a number and uppercase letter
                </p>
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
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-medblue-600 hover:underline">
                Sign in
              </Link>
            </div>
            <div className="text-sm text-center">
              Want to register as a patient?{" "}
              <Link to="/signup-patient" className="text-medblue-600 hover:underline">
                Patient signup
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignupDoctor;
