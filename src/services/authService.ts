
import { User } from "@/types/auth";
import { toast } from "@/components/ui/sonner";
import * as localDbService from "@/services/localDbService";

export const login = async (email: string, password: string): Promise<User> => {
  return localDbService.login(email, password);
};

export const logout = async () => {
  return localDbService.logout();
};

export const signupPatient = async (
  name: string, 
  email: string, 
  phoneNumber: string, 
  password: string
): Promise<User> => {
  return localDbService.signupPatient(name, email, phoneNumber, password);
};

export const signupDoctor = async (
  name: string,
  email: string,
  phoneNumber: string,
  password: string,
  specialization: string,
  licenseNumber: string,
  hospitalKey: string
): Promise<User> => {
  return localDbService.signupDoctor(
    name,
    email,
    phoneNumber,
    password,
    specialization,
    licenseNumber,
    hospitalKey
  );
};

export const fetchUserProfile = async (userId: string): Promise<User> => {
  return localDbService.fetchUserProfile(userId);
};
