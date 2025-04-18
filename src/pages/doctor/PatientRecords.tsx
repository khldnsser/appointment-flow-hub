import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Edit, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface Patient {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
}

interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  role: 'doctor' | 'patient';
}

interface AuthContextType {
  user: User | null;
}

const PatientRecords = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth() as AuthContextType;
  const currentDoctorId = user?.id;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for the record form
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!patientId) return;
      
      try {
        const [patientRes, recordsRes] = await Promise.all([
          api.get(`/auth/patients/${patientId}`),
          api.get(`/medical-records/patient/${patientId}`)
        ]);
        
        setPatient(patientRes.data);
        setRecords(recordsRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        toast.error("Error loading patient data");
      }
    };
    
    fetchData();
  }, [patientId]);

  // Sort records by date (newest first)
  const sortedRecords = [...records].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (record: MedicalRecord) => {
    setEditingRecordId(record.id);
    setIsCreating(true);
    setFormData({
      subjective: record.subjective,
      objective: record.objective,
      assessment: record.assessment,
      plan: record.plan
    });
  };

  const handleCreateNew = () => {
    setEditingRecordId(null);
    setIsCreating(true);
    setFormData({
      subjective: "",
      objective: "",
      assessment: "",
      plan: ""
    });
  };

  const handleCancel = () => {
    setEditingRecordId(null);
    setIsCreating(false);
    setFormData({
      subjective: "",
      objective: "",
      assessment: "",
      plan: ""
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) return;
    
    // Validate form
    if (
      !formData.subjective.trim() || 
      !formData.objective.trim() || 
      !formData.assessment.trim() || 
      !formData.plan.trim()
    ) {
      toast.error("All fields are required");
      return;
    }
    
    setSubmitting(true);
    
    try {
      let response;
      if (editingRecordId) {
        // Update existing record
        response = await api.put(`/medical-records/${editingRecordId}`, formData);
        
        // Update local state
        setRecords(prev => 
          prev.map(record => 
            record.id === editingRecordId 
              ? { ...record, ...response.data } 
              : record
          )
        );
        
        toast.success("Medical record updated successfully");
      } else {
        // Create new record
        response = await api.post('/medical-records', {
          ...formData,
          patientId
        });
        
        // Update local state
        setRecords(prev => [...prev, response.data]);
        toast.success("Medical record created successfully");
      }
      
      // Reset form
      handleCancel();
    } catch (error) {
      console.error("Error saving medical record:", error);
      toast.error("Error saving medical record");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading patient records...</div>;
  }

  if (!patient) {
    return <div className="p-8 text-center">Patient not found</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <Button 
        variant="outline" 
        onClick={() => navigate("/doctor/all-patients")}
        className="mb-6"
      >
        Back to All Patients
      </Button>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{patient.name}'s Medical Records</h1>
        <p className="text-muted-foreground">{patient.email} • {patient.phoneNumber}</p>
      </div>
      
      {isCreating ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingRecordId ? "Edit Medical Record" : "Create New Medical Record"}
            </CardTitle>
            <CardDescription>
              {editingRecordId 
                ? "Update the medical record information" 
                : "Fill in the details for the new medical record"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Subjective (Patient's symptoms, complaints)
                </label>
                <Textarea
                  name="subjective"
                  value={formData.subjective}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Enter patient's description of symptoms"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Objective (Clinical observations, measurements)
                </label>
                <Textarea
                  name="objective"
                  value={formData.objective}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Enter physical examination findings"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Assessment (Diagnosis, clinical impression)
                </label>
                <Textarea
                  name="assessment"
                  value={formData.assessment}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Enter your assessment/diagnosis"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Plan (Treatment, recommendations)
                </label>
                <Textarea
                  name="plan"
                  value={formData.plan}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Enter treatment plan and recommendations"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {editingRecordId ? "Update Record" : "Save Record"}
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Medical Records</h2>
            <Button onClick={handleCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Record
            </Button>
          </div>
          
          {sortedRecords.length > 0 ? (
            <div className="space-y-6">
              {sortedRecords.map((record) => (
                <Card key={record.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-xl">
                          Record from {format(new Date(record.date), "PPPP")}
                        </CardTitle>
                        <CardDescription>
                          Created by Dr. {record.doctorName}
                        </CardDescription>
                      </div>
                      {record.doctorId === currentDoctorId && (
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleEdit(record)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid gap-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Subjective</h3>
                        <p className="text-muted-foreground">{record.subjective}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Objective</h3>
                        <p className="text-muted-foreground">{record.objective}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Assessment</h3>
                        <p className="text-muted-foreground">{record.assessment}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Plan</h3>
                        <p className="text-muted-foreground">{record.plan}</p>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {record.updatedAt > record.createdAt && (
                          <p>Last updated: {format(new Date(record.updatedAt), "PPP")} at {format(new Date(record.updatedAt), "p")}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground mb-4">No medical records found for this patient.</p>
                <Button onClick={handleCreateNew}>
                  Create a new record
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default PatientRecords;
