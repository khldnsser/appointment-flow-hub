import React, { useState, useEffect } from "react";
import api from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

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

const MedicalRecords = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await api.get('/auth/profile');
        const userId = userResponse.data.id;
        
        const recordsRes = await api.get(`/medical-records/patient/${userId}`);
        setRecords(recordsRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching medical records:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sort by date (newest first)
  const sortedRecords = [...records].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Your Medical Records</h1>
      
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : sortedRecords.length > 0 ? (
        <div className="space-y-6">
          {sortedRecords.map((record) => (
            <Card key={record.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <CardTitle className="text-xl">
                  Record from {format(new Date(record.date), "PPPP")}
                </CardTitle>
                <CardDescription>
                  By Dr. {record.doctorName}
                </CardDescription>
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
                  <div className="text-xs text-muted-foreground mt-4">
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
          <CardContent className="text-center py-10">
            <p className="text-muted-foreground">
              You don't have any medical records yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MedicalRecords;
