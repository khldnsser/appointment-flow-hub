
import React from "react";
import { Check, X } from "lucide-react";

interface PasswordRequirementsProps {
  password: string;
}

const PasswordRequirements = ({ password }: PasswordRequirementsProps) => {
  const requirements = [
    {
      text: "At least 8 characters long",
      test: (pass: string) => pass.length >= 8,
    },
    {
      text: "At least one uppercase letter",
      test: (pass: string) => /[A-Z]/.test(pass),
    },
    {
      text: "At least one number",
      test: (pass: string) => /\d/.test(pass),
    },
    {
      text: "At least one special character",
      test: (pass: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    },
  ];

  return (
    <div className="space-y-2 mt-2">
      {requirements.map((req, index) => (
        <div key={index} className="flex items-center text-sm">
          {req.test(password) ? (
            <Check className="h-4 w-4 text-green-500 mr-2" />
          ) : (
            <X className="h-4 w-4 text-red-500 mr-2" />
          )}
          <span className={req.test(password) ? "text-green-700" : "text-gray-600"}>
            {req.text}
          </span>
        </div>
      ))}
    </div>
  );
};

export default PasswordRequirements;
