
import { useState } from 'react';
import { AuthState, User, Appointment } from '@/types/auth';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [patients, setPatients] = useState<User[]>([]);

  return {
    state: {
      user,
      appointments,
      doctors,
      patients,
    },
    setters: {
      setUser,
      setAppointments,
      setDoctors,
      setPatients,
    }
  };
};
