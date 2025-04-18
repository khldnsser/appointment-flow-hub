
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  
  // If user is already logged in, redirect them
  useEffect(() => {
    if (user) {
      console.log("User already logged in, redirecting to dashboard:", user);
      const destination = user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard';
      navigate(destination);
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);

    try {
      console.log("Attempting login with:", email);
      const userData = await login(email, password);
      console.log("Login successful, user data:", userData);
      
      toast.success(`Welcome back, ${userData.name}!`);
      
      // Navigate based on user role
      const destination = userData.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard';
      console.log("Redirecting to:", destination);
      navigate(destination);
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Login failed. Please check your credentials.";
      
      // Check for rate limit error
      if (error instanceof Error) {
        const errorText = error.message.toLowerCase();
        
        if (errorText.includes("rate limit") || errorText.includes("too many requests") || errorText.includes("429")) {
          errorMessage = "You've reached the login rate limit. Please wait a few minutes before trying again.";
        }
        
        setLoginError(error.message);
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-medblue-50">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-medblue-800">MediTrack</h1>
          <p className="text-medblue-600">Your healthcare management solution</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
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
                  className="w-full"
                />
              </div>
              {loginError && (
                <div className="text-sm text-red-500">
                  {loginError}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center">
              Don't have an account?{" "}
              <Link to="/signup-select" className="text-medblue-600 hover:underline">
                Create an account
              </Link>
            </div>
            <div className="text-xs text-gray-500 text-center mt-2">
              Note: For testing, if you hit rate limits, try again after a few minutes or use a different account.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
