import { Patient, Appointment, UserRole } from '../types';
import { INITIAL_PATIENTS, INITIAL_APPOINTMENTS } from '../data/mockData';

const STORAGE_KEYS = {
  PATIENTS: 'medqueue_patients_data_v1',
  APPOINTMENTS: 'medqueue_appointments_data_v1',
  ROLE: 'medqueue_user_role_v1',
  HAS_INITIALIZED: 'medqueue_initialized_v1',
};

export const storage = {
  getPatients(): Patient[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      if (!data) {
        // Initialize with default demo patients
        this.savePatients(INITIAL_PATIENTS);
        return INITIAL_PATIENTS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load patients from localStorage:', e);
      return INITIAL_PATIENTS;
    }
  },

  savePatients(patients: Patient[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    } catch (e) {
      console.error('Failed to save patients to localStorage:', e);
    }
  },

  getAppointments(): Appointment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      if (!data) {
        this.saveAppointments(INITIAL_APPOINTMENTS);
        return INITIAL_APPOINTMENTS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load appointments from localStorage:', e);
      return INITIAL_APPOINTMENTS;
    }
  },

  saveAppointments(appointments: Appointment[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    } catch (e) {
      console.error('Failed to save appointments to localStorage:', e);
    }
  },

  getRole(): UserRole | null {
    try {
      return (localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole) || null;
    } catch {
      return null;
    }
  },

  saveRole(role: UserRole | null): void {
    try {
      if (role) {
        localStorage.setItem(STORAGE_KEYS.ROLE, role);
      } else {
        localStorage.removeItem(STORAGE_KEYS.ROLE);
      }
    } catch (e) {
      console.error('Failed to save role to localStorage:', e);
    }
  },

  resetToDemoData(): { patients: Patient[]; appointments: Appointment[] } {
    try {
      localStorage.removeItem(STORAGE_KEYS.PATIENTS);
      localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
    } catch (e) {
      console.error('Failed to reset demo data in localStorage:', e);
    }
    return {
      patients: INITIAL_PATIENTS,
      appointments: INITIAL_APPOINTMENTS,
    };
  },
};
