import { User } from "../types/auth";

export const validateHospitalKey = (key: string): boolean => {
  return key === "1234";
};

export const checkEmailExists = (
  doctors: User[],
  patients: User[],
  email: string
): boolean => {
  return doctors.some((d) => d.email === email) || patients.some((p) => p.email === email);
};

export const createNewDoctor = async (
  name: string,
  email: string,
  phoneNumber: string,
  specialization: string,
  licenseNumber: string,
  doctors: User[]
): Promise<User> => {
  // Check if license number already exists
  const { data: existingDoctor } = await supabase
    .from('doctor_details')
    .select('id')
    .eq('license_number', licenseNumber)
    .single();

  if (existingDoctor) {
    throw new Error('This license number is already registered');
  }

  // Check if email is already used by another doctor
  const { data: existingDoctorEmail } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .eq('role', 'doctor')
    .single();

  if (existingDoctorEmail) {
    throw new Error('This email is already registered to another doctor');
  }

  // Add Dr. prefix if it's not already there
  const formattedName = name.startsWith("Dr.") ? name : `Dr. ${name}`;
  
  return {
    id: `doc${doctors.length + 1}`,
    name: formattedName,
    email,
    phoneNumber,
    role: "doctor",
    specialization,
    licenseNumber,
  };
};

export const createNewPatient = (
  name: string,
  email: string,
  phoneNumber: string,
  patients: User[]
): User => {
  return {
    id: `pat${patients.length + 1}`,
    name,
    email,
    phoneNumber,
    role: "patient",
    medicalRecords: [],
  };
};
