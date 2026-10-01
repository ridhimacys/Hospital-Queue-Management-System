import { Patient, Priority, PatientStatus } from '../types';

/**
 * MedQueue Core Priority Queue Implementation
 * 
 * Priority hierarchy:
 * 1. EMERGENCY (1) - Highest clinical priority
 * 2. URGENT (2)    - Medium priority
 * 3. REGULAR (3)   - Lowest priority
 * 
 * Tie-breaker:
 * Patients with identical priority are ordered by earlier arrivalTime first (FIFO within priority level).
 */

export const PRIORITY_WEIGHTS: Record<Priority, number> = {
  EMERGENCY: 1,
  URGENT: 2,
  REGULAR: 3,
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  EMERGENCY: 'Emergency (High)',
  URGENT: 'Urgent (Medium)',
  REGULAR: 'Regular (Normal)',
};

export const PRIORITY_COLORS: Record<Priority, { bg: string; text: string; border: string; badge: string; dot: string }> = {
  EMERGENCY: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    badge: 'bg-rose-100 text-rose-700 border-rose-300 ring-rose-500/20',
    dot: 'bg-rose-500',
  },
  URGENT: {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-800 border-amber-300 ring-amber-500/20',
    dot: 'bg-amber-500',
  },
  REGULAR: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700 border-blue-300 ring-blue-500/20',
    dot: 'bg-blue-500',
  },
};

export const STATUS_BADGES: Record<PatientStatus, { label: string; className: string }> = {
  WAITING: {
    label: 'Waiting in Queue',
    className: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  CALLED: {
    label: 'Now Called',
    className: 'bg-purple-100 text-purple-800 border-purple-300 font-semibold animate-pulse',
  },
  IN_CONSULTATION: {
    label: 'In Consultation',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold',
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  SKIPPED: {
    label: 'Skipped',
    className: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-rose-100 text-rose-700 border-rose-200',
  },
};

/**
 * Compares two patients using MedQueue priority queue logic.
 * Negative number if p1 comes BEFORE p2.
 */
export function comparePatients(p1: Patient, p2: Patient): number {
  const p1Weight = PRIORITY_WEIGHTS[p1.priority] ?? 3;
  const p2Weight = PRIORITY_WEIGHTS[p2.priority] ?? 3;

  if (p1Weight !== p2Weight) {
    return p1Weight - p2Weight; // 1 comes before 2, 2 comes before 3
  }

  // Tie-breaker: earlier arrival time comes first
  const t1 = new Date(p1.arrivalTime).getTime();
  const t2 = new Date(p2.arrivalTime).getTime();
  return t1 - t2;
}

/**
 * Returns sorted list of active WAITING patients according to priority and arrival time.
 */
export function getSortedWaitingQueue(patients: Patient[], departmentFilter?: string): Patient[] {
  let waiting = patients.filter((p) => p.status === 'WAITING');

  if (departmentFilter && departmentFilter !== 'All') {
    waiting = waiting.filter((p) => p.department === departmentFilter);
  }

  return [...waiting].sort(comparePatients);
}

/**
 * Returns the highest priority waiting patient ready to be called next.
 */
export function getNextWaitingPatient(patients: Patient[], departmentFilter?: string): Patient | null {
  const sorted = getSortedWaitingQueue(patients, departmentFilter);
  return sorted.length > 0 ? sorted[0] : null;
}

/**
 * Calculates 1-based queue position for a waiting patient.
 * Returns -1 if patient is not currently in WAITING status.
 */
export function getPatientQueuePosition(tokenOrId: string, patients: Patient[]): number {
  const sorted = getSortedWaitingQueue(patients);
  const clean = tokenOrId.trim().toUpperCase();
  const index = sorted.findIndex(
    (p) => p.token.toUpperCase() === clean || p.id.toUpperCase() === clean
  );
  return index !== -1 ? index + 1 : -1;
}

/**
 * Calculates estimated wait time in minutes based on position and priority.
 */
export function calculateEstimatedWaitTime(position: number): number {
  if (position <= 0) return 0;
  // Estimated ~10 minutes per preceding patient
  return (position - 1) * 10;
}

/**
 * Automatically generates the next unique Token number (e.g. T001, T002...).
 */
export function generateNextToken(allPatients: Patient[]): string {
  let maxNumber = 0;
  for (const patient of allPatients) {
    const match = patient.token.match(/T(\d+)/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxNumber) {
        maxNumber = num;
      }
    }
  }
  const nextNum = maxNumber + 1;
  return `T${String(nextNum).padStart(3, '0')}`;
}

/**
 * Formats ISO string into clean localized time (e.g., "10:15 AM")
 */
export function formatTime(isoString?: string): string {
  if (!isoString) return '--:--';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return isoString;
  }
}

/**
 * Formats ISO string into clean date (e.g., "Oct 1, 2026")
 */
export function formatDate(isoString?: string): string {
  if (!isoString) return '--';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return isoString;
  }
}
