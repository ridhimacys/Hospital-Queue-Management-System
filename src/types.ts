export type Priority = 'EMERGENCY' | 'URGENT' | 'REGULAR';

export type PatientStatus = 
  | 'WAITING' 
  | 'CALLED' 
  | 'IN_CONSULTATION' 
  | 'COMPLETED' 
  | 'SKIPPED' 
  | 'CANCELLED';

export type Department = 
  | 'General Medicine' 
  | 'Cardiology' 
  | 'Pediatrics' 
  | 'Orthopedics' 
  | 'Dermatology';

export type Gender = 'Male' | 'Female' | 'Other';

export interface Patient {
  id: string;
  token: string;
  name: string;
  age: number;
  gender: Gender;
  phone: string;
  department: Department;
  symptoms: string;
  patientType: Priority;
  priority: Priority;
  status: PatientStatus;
  arrivalTime: string; // ISO string
  doctorAssigned?: string;
  notes?: string;
  calledAt?: string;
  completedAt?: string;
}

export interface Doctor {
  id: string;
  name: string;
  department: Department;
  qualification: string;
  roomNumber: string;
  avatarColor: string;
}

export type AppointmentStatus = 'Scheduled' | 'Completed' | 'Cancelled';

export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  department: Department;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
}

export type UserRole = 'Receptionist' | 'Doctor' | 'Patient';

export type ViewTab = 
  | 'dashboard' 
  | 'patients' 
  | 'register' 
  | 'queue' 
  | 'doctor-dashboard' 
  | 'appointments' 
  | 'patient-status' 
  | 'oop-concepts' 
  | 'about';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title?: string;
  message: string;
}
