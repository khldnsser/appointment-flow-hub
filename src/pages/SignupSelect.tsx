
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserIcon, Stethoscope } from "lucide-react";

const SignupSelect = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-medblue-50">
      <div className="w-full max-w-3xl px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-medblue-800">MediTrack</h1>
          <p className="text-medblue-600">Choose your account type</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-medteal-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-medteal-700" />
                </div>
              </div>
              <CardTitle className="text-center">Patient</CardTitle>
              <CardDescription className="text-center">
                Sign up as a patient to book appointments and manage your medical records
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center text-sm">
              <ul className="space-y-2 text-left mx-auto max-w-xs">
                <li className="flex items-center">
                  <span className="bg-medteal-100 p-1 rounded-full mr-2">✓</span>
                  Book appointments with specialists
                </li>
                <li className="flex items-center">
                  <span className="bg-medteal-100 p-1 rounded-full mr-2">✓</span>
                  View your medical history
                </li>
                <li className="flex items-center">
                  <span className="bg-medteal-100 p-1 rounded-full mr-2">✓</span>
                  Get treatment recommendations
                </li>
                <li className="flex items-center">
                  <span className="bg-medteal-100 p-1 rounded-full mr-2">✓</span>
                  Manage your prescriptions
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link to="/signup-patient" className="w-full">
                <Button variant="outline" className="w-full">Sign up as Patient</Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-medblue-100 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-8 h-8 text-medblue-700" />
                </div>
              </div>
              <CardTitle className="text-center">Doctor</CardTitle>
              <CardDescription className="text-center">
                Sign up as a healthcare provider to manage your patients and appointments
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center text-sm">
              <ul className="space-y-2 text-left mx-auto max-w-xs">
                <li className="flex items-center">
                  <span className="bg-medblue-100 p-1 rounded-full mr-2">✓</span>
                  Manage your appointment schedule
                </li>
                <li className="flex items-center">
                  <span className="bg-medblue-100 p-1 rounded-full mr-2">✓</span>
                  View patient medical history
                </li>
                <li className="flex items-center">
                  <span className="bg-medblue-100 p-1 rounded-full mr-2">✓</span>
                  Issue digital prescriptions
                </li>
                <li className="flex items-center">
                  <span className="bg-medblue-100 p-1 rounded-full mr-2">✓</span>
                  Maintain patient records
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link to="/signup-doctor" className="w-full">
                <Button className="w-full">Sign up as Doctor</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-medblue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupSelect;
