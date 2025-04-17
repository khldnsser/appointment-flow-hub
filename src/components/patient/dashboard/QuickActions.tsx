
import React from "react";
import { User, CalendarIcon, FileText, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const QuickActions = () => {
  const actions = [
    {
      icon: <User />,
      title: "Find Doctors",
      description: "Search by specialty or name",
      path: "/patient/find-doctors",
    },
    {
      icon: <CalendarIcon />,
      title: "Book Appointment",
      description: "Schedule your next visit",
      path: "/patient/book-appointment",
    },
    {
      icon: <FileText />,
      title: "Medical Records",
      description: "View your health history",
      path: "/patient/records",
    },
    {
      icon: <AlertTriangle />,
      title: "Symptom Checker",
      description: "Find the right specialist",
      path: "/patient/symptoms",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => (
        <Card key={action.path} className="card-hover">
          <CardContent className="p-6">
            <Link
              to={action.path}
              className="flex flex-col h-full items-center justify-center text-center"
            >
              <div className="rounded-full bg-medteal-100 p-3 mb-3">
                <div className="h-6 w-6 text-medteal-700">{action.icon}</div>
              </div>
              <h3 className="font-medium">{action.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{action.description}</p>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickActions;
