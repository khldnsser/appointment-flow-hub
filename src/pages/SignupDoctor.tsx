
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DoctorSignupForm } from "@/components/auth/DoctorSignupForm";

const SignupDoctor = () => {
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
            <DoctorSignupForm />
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
