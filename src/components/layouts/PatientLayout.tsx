
import React, { useEffect, useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Calendar, 
  Search, 
  FileText, 
  UserCog, 
  LogOut,
  Menu,
  X,
  PlusCircle
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const PatientLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is loaded
    if (user !== undefined) {
      setIsLoading(false);
    }
  }, [user]);

  // This layout should only be rendered for authenticated patients
  // The App.tsx ProtectedRoute component handles redirection
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medblue-500"></div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigationItems = [
    {
      name: "Dashboard",
      path: "/patient/dashboard",
      icon: <Calendar className="w-5 h-5 mr-2" />,
    },
    {
      name: "Find Doctors",
      path: "/patient/find-doctors",
      icon: <Search className="w-5 h-5 mr-2" />,
    },
    {
      name: "Book Appointment",
      path: "/patient/book-appointment",
      icon: <PlusCircle className="w-5 h-5 mr-2" />,
    },
    {
      name: "Medical Records",
      path: "/patient/records",
      icon: <FileText className="w-5 h-5 mr-2" />,
    },
    {
      name: "Profile",
      path: "/patient/profile",
      icon: <UserCog className="w-5 h-5 mr-2" />,
    },
  ];

  const MobileNavigation = () => (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px] p-0">
        <div className="py-4">
          <div className="flex items-center justify-between px-4 pb-4 border-b">
            <span className="font-bold text-lg text-medblue-800">MediTrack</span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="px-4 py-4">
            <div className="flex items-center mb-6">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src="" />
                <AvatarFallback className="bg-medteal-200 text-medteal-800">
                  {user?.name?.split(" ").map(n => n[0]).join("") || "P"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{user?.name || "Patient"}</p>
                <p className="text-xs text-gray-500">{user?.email || "Email not available"}</p>
              </div>
            </div>
            <nav className="space-y-1">
              {navigationItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={`flex items-center px-2 py-2 text-sm rounded-md w-full ${
                    location.pathname === item.path 
                      ? "bg-medteal-100 text-medteal-900" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center px-2 py-2 text-sm rounded-md w-full text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center px-4 mb-6">
              <h1 className="text-xl font-bold text-medteal-800">MediTrack</h1>
            </div>
            <div className="px-4 mb-6">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-medteal-200 text-medteal-800">
                    {user?.name?.split(" ").map(n => n[0]).join("") || "P"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{user?.name || "Patient"}</p>
                  <p className="text-xs text-gray-500">{user?.email || "Email not available"}</p>
                </div>
              </div>
            </div>
            <nav className="flex-1 px-2 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-2 py-2 text-sm rounded-md ${
                    location.pathname === item.path
                      ? "bg-medteal-100 text-medteal-900"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center px-2 py-2 text-sm rounded-md w-full text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation */}
        <div className="flex items-center justify-between h-16 bg-white border-b px-4">
          {/* Mobile Nav */}
          <div className="flex items-center">
            <MobileNavigation />
            <h1 className="text-xl font-bold text-medteal-800 md:hidden ml-2">MediTrack</h1>
          </div>

          {/* User Menu - Mobile & Desktop */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-medteal-200 text-medteal-800">
                      {user?.name?.split(" ").map(n => n[0]).join("") || "P"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/patient/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PatientLayout;
