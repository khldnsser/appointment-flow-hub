import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import PasswordRequirements from "@/components/auth/PasswordRequirements";

const SignupPatient = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signupPatient } = useAuth();
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

    // Password requirements validation
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
      await signupPatient(name, email, phoneNumber, password);
      toast.success("Account created successfully!");
      navigate("/patient/dashboard");
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
          <p className="text-medblue-600">Create your patient account</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Patient Registration</CardTitle>
            <CardDescription>
              Enter your details to create a patient account
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
                  placeholder="John Smith"
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
                  placeholder="john.smith@example.com"
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
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-medblue-600 hover:underline">
                Sign in
              </Link>
            </div>
            <div className="text-sm text-center">
              Want to register as a doctor?{" "}
              <Link to="/signup-doctor" className="text-medblue-600 hover:underline">
                Doctor signup
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignupPatient;
