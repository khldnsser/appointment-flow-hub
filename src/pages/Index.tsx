
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  CalendarRange, 
  FileText, 
  Users, 
  Search, 
  ShieldCheck, 
  Clock, 
  CheckCircle, 
  ArrowRight 
} from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-medblue-800">MediTrack</h1>
          </div>
          <nav className="hidden md:flex space-x-8 items-center">
            <a href="#features" className="text-gray-600 hover:text-medblue-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-medblue-600 transition-colors">How It Works</a>
            <div className="flex space-x-2">
              <Button variant="outline" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/signup-select">Sign Up</Link>
              </Button>
            </div>
          </nav>
          <div className="md:hidden">
            <Button variant="outline" asChild size="sm">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-medblue-50 to-medteal-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Modern Healthcare Management
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                MediTrack connects patients with doctors for efficient appointment scheduling and medical record management.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button asChild size="lg" className="h-12">
                  <Link to="/signup-select">Create an Account</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12">
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              {/* Replace with your own illustration or image */}
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="bg-medblue-100 p-6 rounded-lg mb-4">
                  <CalendarRange className="h-20 w-20 text-medblue-600 mx-auto" />
                </div>
                <div className="space-y-4">
                  <div className="h-6 bg-medblue-100 rounded-full w-3/4 mx-auto"></div>
                  <div className="h-6 bg-medblue-100 rounded-full w-1/2 mx-auto"></div>
                  <div className="h-6 bg-medblue-100 rounded-full w-2/3 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              MediTrack offers powerful tools for both patients and healthcare providers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="rounded-full bg-medteal-100 p-3 inline-block mb-4">
                <CalendarRange className="h-6 w-6 text-medteal-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Scheduling</h3>
              <p className="text-gray-600">Book, reschedule, or cancel appointments with your healthcare providers.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="rounded-full bg-medteal-100 p-3 inline-block mb-4">
                <FileText className="h-6 w-6 text-medteal-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Digital Records</h3>
              <p className="text-gray-600">Access your medical history and prescriptions all in one place.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="rounded-full bg-medteal-100 p-3 inline-block mb-4">
                <Search className="h-6 w-6 text-medteal-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Specialists</h3>
              <p className="text-gray-600">Search for doctors by specialty, symptoms, or availability.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="rounded-full bg-medblue-100 p-3 inline-block mb-4">
                <Users className="h-6 w-6 text-medblue-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Patient Management</h3>
              <p className="text-gray-600">Doctors can effectively manage their patient appointments and records.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="rounded-full bg-medblue-100 p-3 inline-block mb-4">
                <ShieldCheck className="h-6 w-6 text-medblue-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Access</h3>
              <p className="text-gray-600">Separate interfaces for doctors and patients with role-based access control.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="rounded-full bg-medblue-100 p-3 inline-block mb-4">
                <Clock className="h-6 w-6 text-medblue-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Availability Management</h3>
              <p className="text-gray-600">Doctors can manage their schedule and availability for appointments.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              MediTrack simplifies the healthcare journey for both patients and doctors
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="rounded-full bg-medteal-100 h-12 w-12 flex items-center justify-center mx-auto mb-4">
                <p className="font-bold text-medteal-800">1</p>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
              <p className="text-gray-600">Sign up as a patient or a doctor (requires hospital key).</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="rounded-full bg-medteal-100 h-12 w-12 flex items-center justify-center mx-auto mb-4">
                <p className="font-bold text-medteal-800">2</p>
              </div>
              <h3 className="text-xl font-semibold mb-2">Find & Book</h3>
              <p className="text-gray-600">Patients can search for doctors and book appointments. Doctors manage their schedule.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="rounded-full bg-medteal-100 h-12 w-12 flex items-center justify-center mx-auto mb-4">
                <p className="font-bold text-medteal-800">3</p>
              </div>
              <h3 className="text-xl font-semibold mb-2">Manage Healthcare</h3>
              <p className="text-gray-600">Access medical records, prescriptions, and manage future appointments.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-medblue-800 to-medteal-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to simplify your healthcare management?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join MediTrack today and experience a new way to manage your healthcare journey.
          </p>
          <Button asChild size="lg" variant="secondary" className="h-12">
            <Link to="/signup-select">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white text-lg font-bold mb-4">MediTrack</h3>
              <p className="mb-4">Modern healthcare management platform connecting patients and doctors.</p>
            </div>
            
            <div>
              <h4 className="text-white text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link to="/signup-select" className="hover:text-white transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white text-lg font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} MediTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
