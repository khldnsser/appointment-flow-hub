
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Stethoscope, Search, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { SYMPTOM_SPECIALTY_MAP } from "@/types/auth";
import { toast } from "@/components/ui/sonner";

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { doctors } = useAuth();
  const navigate = useNavigate();

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      toast.error("Please describe your symptoms first");
      return;
    }

    setIsAnalyzing(true);
    try {
      // Basic keyword matching from the symptoms to specialties
      const lowerSymptoms = symptoms.toLowerCase();
      const matchedSpecialties = new Set<string>();
      
      Object.entries(SYMPTOM_SPECIALTY_MAP).forEach(([symptom, specialties]) => {
        if (lowerSymptoms.includes(symptom)) {
          specialties.forEach(specialty => matchedSpecialties.add(specialty));
        }
      });

      // If no matches found, default to General Medicine
      if (matchedSpecialties.size === 0) {
        matchedSpecialties.add("General Medicine");
      }

      // Filter doctors by matched specialties
      const suggestedDoctors = doctors.filter(doctor => 
        doctor.specialization && matchedSpecialties.has(doctor.specialization)
      );

      // Navigate to find doctors with pre-filtered results
      if (suggestedDoctors.length > 0) {
        navigate(`/patient/find-doctors?specialty=${Array.from(matchedSpecialties)[0]}`);
        toast.success("Found doctors that match your symptoms");
      } else {
        toast.info("No specific specialists found. Showing all doctors.");
        navigate("/patient/find-doctors");
      }
    } catch (error) {
      toast.error("Error analyzing symptoms. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Stethoscope className="h-6 w-6 text-medteal-600" />
          Symptom Checker
        </CardTitle>
        <CardDescription>
          Describe your symptoms and we'll help you find the right specialist
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <HoverCard>
            <HoverCardTrigger asChild>
              <label className="text-sm font-medium cursor-help">
                What symptoms are you experiencing?
              </label>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <p className="text-sm">
                Describe your symptoms in detail. For example: "I have a persistent headache 
                and blurred vision for the past 3 days"
              </p>
            </HoverCardContent>
          </HoverCard>
          <Textarea
            placeholder="Describe your symptoms here..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="min-h-[120px] text-base"
          />
        </div>
        <Button 
          onClick={analyzeSymptoms}
          className="w-full"
          disabled={isAnalyzing || !symptoms.trim()}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Symptoms...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Find Specialists
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SymptomChecker;
