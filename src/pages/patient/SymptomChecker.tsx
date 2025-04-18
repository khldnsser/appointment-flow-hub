
import React from "react";
import SymptomChecker from "@/components/patient/symptoms/SymptomChecker";

const SymptomCheckerPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Symptom Checker</h1>
      <SymptomChecker />
    </div>
  );
};

export default SymptomCheckerPage;
