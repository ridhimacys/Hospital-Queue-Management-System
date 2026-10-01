import { Patient, Doctor, Appointment } from '../types';

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'DOC-1',
    name: 'Dr. Rahul Verma',
    department: 'General Medicine',
    qualification: 'MD, Internal Medicine (AIIMS)',
    roomNumber: 'OPD-101',
    avatarColor: 'bg-blue-600'
  },
  {
    id: 'DOC-2',
    name: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    qualification: 'DM, Cardiology (Gold Medalist)',
    roomNumber: 'OPD-104',
    avatarColor: 'bg-rose-600'
  },
  {
    id: 'DOC-3',
    name: 'Dr. Neha Sharma',
    department: 'Pediatrics',
    qualification: 'MD, Pediatrics, DNB',
    roomNumber: 'OPD-108',
    avatarColor: 'bg-emerald-600'
  },
  {
    id: 'DOC-4',
    name: 'Dr. Simran Kapoor',
    department: 'Orthopedics',
    qualification: 'MS, Orthopedics, Fellowship Joint Replacement',
    roomNumber: 'OPD-112',
    avatarColor: 'bg-amber-600'
  },
  {
    id: 'DOC-5',
    name: 'Dr. Priya Nair',
    department: 'Dermatology',
    qualification: 'MD, Dermatology & Venereology',
    roomNumber: 'OPD-115',
    avatarColor: 'bg-purple-600'
  }
];

// Reference base date/time for realistic arrival order
const now = new Date();
const getRecentTime = (minutesAgo: number) => {
  const d = new Date(now.getTime() - minutesAgo * 60000);
  return d.toISOString();
};

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'P-101',
    token: 'T001',
    name: 'Ramesh Patel',
    age: 58,
    gender: 'Male',
    phone: '98765-43210',
    department: 'Cardiology',
    symptoms: 'Sudden sharp chest pressure radiating to left arm, sweating',
    patientType: 'EMERGENCY',
    priority: 'EMERGENCY',
    status: 'WAITING',
    arrivalTime: getRecentTime(35),
    doctorAssigned: 'Dr. Arjun Mehta',
    notes: 'Immediate ECG recommended'
  },
  {
    id: 'P-102',
    token: 'T002',
    name: 'Ananya Deshmukh',
    age: 26,
    gender: 'Female',
    phone: '98220-11234',
    department: 'General Medicine',
    symptoms: 'High fever (103°F) for 4 days with body aches and chills',
    patientType: 'URGENT',
    priority: 'URGENT',
    status: 'WAITING',
    arrivalTime: getRecentTime(50),
    doctorAssigned: 'Dr. Rahul Verma',
    notes: 'Check for suspected viral/dengue markers'
  },
  {
    id: 'P-103',
    token: 'T003',
    name: 'Sunita Reddy',
    age: 42,
    gender: 'Female',
    phone: '94401-88990',
    department: 'Cardiology',
    symptoms: 'Severe shortness of breath while resting, history of arrhythmia',
    patientType: 'EMERGENCY',
    priority: 'EMERGENCY',
    status: 'WAITING',
    arrivalTime: getRecentTime(20), // Arrived later than T001, so T001 is before T003
    doctorAssigned: 'Dr. Arjun Mehta',
    notes: 'Oxygen saturation monitored at 91%'
  },
  {
    id: 'P-104',
    token: 'T004',
    name: 'Vikram Malhotra',
    age: 34,
    gender: 'Male',
    phone: '98111-54321',
    department: 'Orthopedics',
    symptoms: 'Severe acute ankle sprain and inability to bear weight after fall',
    patientType: 'URGENT',
    priority: 'URGENT',
    status: 'WAITING',
    arrivalTime: getRecentTime(40),
    doctorAssigned: 'Dr. Simran Kapoor',
    notes: 'X-ray of right ankle requested'
  },
  {
    id: 'P-105',
    token: 'T005',
    name: 'Aarav Gupta',
    age: 6,
    gender: 'Male',
    phone: '98333-77221',
    department: 'Pediatrics',
    symptoms: 'Persistent dry cough and mild throat irritation for a week',
    patientType: 'REGULAR',
    priority: 'REGULAR',
    status: 'WAITING',
    arrivalTime: getRecentTime(75),
    doctorAssigned: 'Dr. Neha Sharma',
    notes: 'Routine pediatric assessment'
  },
  {
    id: 'P-106',
    token: 'T006',
    name: 'Meera Kulkarni',
    age: 62,
    gender: 'Female',
    phone: '98900-33441',
    department: 'General Medicine',
    symptoms: 'Chronic hypertension routine prescription renewal and checkup',
    patientType: 'REGULAR',
    priority: 'REGULAR',
    status: 'WAITING',
    arrivalTime: getRecentTime(60),
    doctorAssigned: 'Dr. Rahul Verma',
    notes: 'BP logged at 134/86 mmHg'
  },
  {
    id: 'P-107',
    token: 'T007',
    name: 'Devansh Roy',
    age: 12,
    gender: 'Male',
    phone: '97110-44992',
    department: 'Pediatrics',
    symptoms: 'Severe asthma flare-up, audible wheezing and labored breathing',
    patientType: 'EMERGENCY',
    priority: 'EMERGENCY',
    status: 'IN_CONSULTATION',
    arrivalTime: getRecentTime(55),
    calledAt: getRecentTime(10),
    doctorAssigned: 'Dr. Neha Sharma',
    notes: 'Administered bronchodilator nebulization in OPD-108'
  },
  {
    id: 'P-108',
    token: 'T008',
    name: 'Kavita Joshi',
    age: 39,
    gender: 'Female',
    phone: '98200-55667',
    department: 'Dermatology',
    symptoms: 'Mild localized skin rash on forearms with itching',
    patientType: 'REGULAR',
    priority: 'REGULAR',
    status: 'WAITING',
    arrivalTime: getRecentTime(30),
    doctorAssigned: 'Dr. Priya Nair',
    notes: 'Possible contact dermatitis'
  },
  {
    id: 'P-109',
    token: 'T009',
    name: 'Harish Choudhury',
    age: 67,
    gender: 'Male',
    phone: '99887-12345',
    department: 'Orthopedics',
    symptoms: 'Bilateral knee osteoarthritis, follow-up after physiotherapy',
    patientType: 'REGULAR',
    priority: 'REGULAR',
    status: 'COMPLETED',
    arrivalTime: getRecentTime(120),
    calledAt: getRecentTime(45),
    completedAt: getRecentTime(15),
    doctorAssigned: 'Dr. Simran Kapoor',
    notes: 'Prescribed topical NSAID gel and quad strengthening'
  },
  {
    id: 'P-110',
    token: 'T010',
    name: 'Pooja Bhatia',
    age: 29,
    gender: 'Female',
    phone: '98109-66554',
    department: 'General Medicine',
    symptoms: 'Migraine headache with visual aura and mild nausea',
    patientType: 'URGENT',
    priority: 'URGENT',
    status: 'COMPLETED',
    arrivalTime: getRecentTime(95),
    calledAt: getRecentTime(40),
    completedAt: getRecentTime(20),
    doctorAssigned: 'Dr. Rahul Verma',
    notes: 'Prescribed triptan medication and advised dark room rest'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-1001',
    patientName: 'Rohan Sen',
    doctorName: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    date: new Date().toISOString().split('T')[0],
    time: '10:30 AM',
    status: 'Scheduled',
    notes: 'Post-angioplasty 3-month follow up'
  },
  {
    id: 'APT-1002',
    patientName: 'Tanya Saxena',
    doctorName: 'Dr. Neha Sharma',
    department: 'Pediatrics',
    date: new Date().toISOString().split('T')[0],
    time: '11:15 AM',
    status: 'Scheduled',
    notes: '18-month MMR vaccination booster'
  },
  {
    id: 'APT-1003',
    patientName: 'Prakash Rao',
    doctorName: 'Dr. Rahul Verma',
    department: 'General Medicine',
    date: new Date().toISOString().split('T')[0],
    time: '09:00 AM',
    status: 'Completed',
    notes: 'Diabetes HbA1c review'
  },
  {
    id: 'APT-1004',
    patientName: 'Fatima Sheikh',
    doctorName: 'Dr. Simran Kapoor',
    department: 'Orthopedics',
    date: new Date().toISOString().split('T')[0],
    time: '01:30 PM',
    status: 'Scheduled',
    notes: 'Lumbar spine MRI evaluation'
  },
  {
    id: 'APT-1005',
    patientName: 'Amitabh Sengupta',
    doctorName: 'Dr. Priya Nair',
    department: 'Dermatology',
    date: new Date().toISOString().split('T')[0],
    time: '02:00 PM',
    status: 'Scheduled',
    notes: 'Eczema patch testing'
  }
];
