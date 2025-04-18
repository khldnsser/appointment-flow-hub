
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { AuthProviderWrapper, useAuth } from "@/contexts/AuthContext";
import { Suspense, lazy, useState, useEffect } from "react";

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
import SymptomCheckerPage from "./pages/patient/SymptomChecker";

const queryClient = new QueryClient();

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medblue-500"></div>
  </div>
);

// Protected Route component
const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode, 
  requiredRole?: "doctor" | "patient" 
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Short timeout to ensure auth state is loaded
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isChecking) {
    return <LoadingFallback />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    const redirectPath = user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProviderWrapper>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup-select" element={<SignupSelect />} />
              <Route path="/signup-patient" element={<SignupPatient />} />
              <Route path="/signup-doctor" element={<SignupDoctor />} />
              
              {/* Doctor Routes */}
              <Route path="/doctor" element={
                <ProtectedRoute requiredRole="doctor">
                  <DoctorLayout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<DoctorDashboard />} />
                <Route path="records" element={<PatientRecords />} />
                <Route path="settings" element={<div>Settings (Coming Soon)</div>} />
              </Route>
              
              {/* Patient Routes */}
              <Route path="/patient" element={
                <ProtectedRoute requiredRole="patient">
                  <PatientLayout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<PatientDashboard />} />
                <Route path="find-doctors" element={<FindDoctors />} />
                <Route path="book-appointment" element={<BookAppointment />} />
                <Route path="symptoms" element={<SymptomCheckerPage />} />
                <Route path="records" element={<MedicalRecords />} />
                <Route path="profile" element={<div>Profile (Coming Soon)</div>} />
              </Route>
              
              {/* Catch-all Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProviderWrapper>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
