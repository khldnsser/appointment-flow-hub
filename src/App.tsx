
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Public pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignupSelect from "./pages/SignupSelect";
import SignupPatient from "./pages/SignupPatient";
import SignupDoctor from "./pages/SignupDoctor";
import NotFound from "./pages/NotFound";

// Layouts
import DoctorLayout from "./components/layouts/DoctorLayout";
import PatientLayout from "./components/layouts/PatientLayout";

// Doctor pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import PatientRecords from "./pages/doctor/PatientRecords";

// Patient pages
import PatientDashboard from "./pages/patient/PatientDashboard";
import FindDoctors from "./pages/patient/FindDoctors";
import BookAppointment from "./pages/patient/BookAppointment";
import MedicalRecords from "./pages/patient/MedicalRecords";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup-select" element={<SignupSelect />} />
            <Route path="/signup-patient" element={<SignupPatient />} />
            <Route path="/signup-doctor" element={<SignupDoctor />} />
            
            {/* Doctor Routes */}
            <Route path="/doctor" element={<DoctorLayout />}>
              <Route path="dashboard" element={<DoctorDashboard />} />
              <Route path="patients" element={<PatientRecords />} />
              <Route path="records" element={<PatientRecords />} />
              <Route path="settings" element={<div>Settings (Coming Soon)</div>} />
            </Route>
            
            {/* Patient Routes */}
            <Route path="/patient" element={<PatientLayout />}>
              <Route path="dashboard" element={<PatientDashboard />} />
              <Route path="find-doctors" element={<FindDoctors />} />
              <Route path="book-appointment" element={<BookAppointment />} />
              <Route path="symptoms" element={<div>Symptom Checker (Coming Soon)</div>} />
              <Route path="records" element={<MedicalRecords />} />
              <Route path="profile" element={<div>Profile (Coming Soon)</div>} />
            </Route>
            
            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
