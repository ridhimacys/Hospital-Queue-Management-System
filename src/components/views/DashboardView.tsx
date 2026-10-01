import React from 'react';
import { Patient, Appointment, ViewTab } from '../../types';
import { 
  Users, 
  Clock, 
  Stethoscope, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Play, 
  CalendarDays, 
  Sparkles,
  UserPlus,
  ListOrdered
} from 'lucide-react';
import { 
  getSortedWaitingQueue, 
  getNextWaitingPatient, 
  PRIORITY_COLORS, 
  formatTime 
} from '../../utils/queueManager';

interface DashboardViewProps {
  patients: Patient[];
  appointments: Appointment[];
  onNavigate: (tab: ViewTab) => void;
  onCallPatient: (patient: Patient) => void;
  onViewPatient: (patient: Patient) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  patients,
  appointments,
  onNavigate,
  onCallPatient,
  onViewPatient,
}) => {
  // Compute real-time stats
  const totalPatients = patients.length;
  const waitingPatients = getSortedWaitingQueue(patients);
  const inConsultationPatients = patients.filter((p) => p.status === 'IN_CONSULTATION');
  const completedPatients = patients.filter((p) => p.status === 'COMPLETED');
  const emergencyPatients = patients.filter((p) => p.priority === 'EMERGENCY' && p.status === 'WAITING');

  // Next patient to be called
  const nextPatient = getNextWaitingPatient(patients);

  // Department counts
  const departments = ['General Medicine', 'Cardiology', 'Pediatrics', 'Orthopedics', 'Dermatology'];
  const departmentCounts = departments.map((dept) => ({
    name: dept,
    count: patients.filter((p) => p.department === dept).length,
    waiting: patients.filter((p) => p.department === dept && p.status === 'WAITING').length,
  }));

  // Priority distribution counts
  const emergencyTotal = patients.filter((p) => p.priority === 'EMERGENCY').length;
  const urgentTotal = patients.filter((p) => p.priority === 'URGENT').length;
  const regularTotal = patients.filter((p) => p.priority === 'REGULAR').length;

  // Recent patients
  const recentPatients = [...patients]
    .sort((a, b) => new Date(b.arrivalTime).getTime() - new Date(a.arrivalTime).getTime())
    .slice(0, 5);

  // Today's appointments (first 4)
  const upcomingAppointments = appointments.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Hospital Queue Overview</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time outpatient triage, priority queue status, and OPD consultation metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('register')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Patient</span>
          </button>
          <button
            onClick={() => onNavigate('queue')}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <ListOrdered className="w-4 h-4 text-blue-600" />
            <span>View Full Queue</span>
          </button>
        </div>
      </div>

      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Patients */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Patients</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900">{totalPatients}</div>
            <div className="text-xs text-slate-400 mt-1">Logged today in system</div>
          </div>
        </div>

        {/* Card 2: Waiting in Queue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">Waiting Queue</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-sky-600">{waitingPatients.length}</div>
            <div className="text-xs text-sky-600/80 mt-1">Awaiting doctor call</div>
          </div>
        </div>

        {/* Card 3: In Consultation */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Consulting</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-emerald-600">{inConsultationPatients.length}</div>
            <div className="text-xs text-emerald-600/80 mt-1">Inside doctor cabins</div>
          </div>
        </div>

        {/* Card 4: Completed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-800">{completedPatients.length}</div>
            <div className="text-xs text-slate-400 mt-1">Consultation finished</div>
          </div>
        </div>

        {/* Card 5: Emergency Patients */}
        <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-rose-50 to-white p-5 rounded-2xl border border-rose-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Emergency Waiting</span>
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700 animate-pulse">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-rose-700">{emergencyPatients.length}</div>
            <div className="text-xs text-rose-600 mt-1">Immediate priority!</div>
          </div>
        </div>
      </div>

      {/* Row: Next Patient Spotlight + Priority & Department Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Patient Spotlight Card */}
        <div className="lg:col-span-1 bg-gradient-to-b from-blue-900 to-slate-900 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  Next Priority Patient
                </span>
              </div>
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded-md text-blue-100">
                Queue Position #1
              </span>
            </div>

            {nextPatient ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-3xl font-black text-amber-400 tracking-wider">
                      {nextPatient.token}
                    </div>
                    <div className="text-xl font-bold text-white mt-1">
                      {nextPatient.name}
                    </div>
                    <div className="text-xs text-blue-200 mt-0.5">
                      {nextPatient.age} yrs • {nextPatient.gender} • {nextPatient.department}
                    </div>
                  </div>

                  <span
                    className={`text-xs font-extrabold px-3 py-1 rounded-full border shadow-xs ${
                      nextPatient.priority === 'EMERGENCY'
                        ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                        : nextPatient.priority === 'URGENT'
                        ? 'bg-amber-500 text-white border-amber-400'
                        : 'bg-blue-500 text-white border-blue-400'
                    }`}
                  >
                    {nextPatient.priority}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                  <div className="text-slate-300 font-medium">Chief Complaint:</div>
                  <div className="text-slate-100 italic line-clamp-2">"{nextPatient.symptoms}"</div>
                  <div className="text-slate-400 pt-1 text-[11px]">
                    Arrived at: {formatTime(nextPatient.arrivalTime)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-white/10 text-blue-300 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-slate-300 font-medium text-sm">No Waiting Patients</p>
                <p className="text-xs text-slate-400 mt-1">The waiting queue is currently clear.</p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            {nextPatient ? (
              <button
                onClick={() => onCallPatient(nextPatient)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Call Patient {nextPatient.token} Now</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('register')}
                className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm transition-colors text-center cursor-pointer"
              >
                Register New Patient
              </button>
            )}
          </div>
        </div>

        {/* Priority & Department Breakdown */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Priority Distribution */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-sm">Triage Priority Distribution</h3>
                <span className="text-xs text-slate-400">Total: {totalPatients}</span>
              </div>

              {/* Multi-segment Progress Bar */}
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex mb-4">
                <div
                  style={{ width: `${totalPatients ? (emergencyTotal / totalPatients) * 100 : 0}%` }}
                  className="bg-rose-500 transition-all"
                  title={`Emergency: ${emergencyTotal}`}
                />
                <div
                  style={{ width: `${totalPatients ? (urgentTotal / totalPatients) * 100 : 0}%` }}
                  className="bg-amber-500 transition-all"
                  title={`Urgent: ${urgentTotal}`}
                />
                <div
                  style={{ width: `${totalPatients ? (regularTotal / totalPatients) * 100 : 0}%` }}
                  className="bg-blue-500 transition-all"
                  title={`Regular: ${regularTotal}`}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="font-medium text-slate-700">Emergency Priority (Level 1)</span>
                  </div>
                  <span className="font-bold text-rose-600">{emergencyTotal} patients</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="font-medium text-slate-700">Urgent Priority (Level 2)</span>
                  </div>
                  <span className="font-bold text-amber-600">{urgentTotal} patients</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="font-medium text-slate-700">Regular Priority (Level 3)</span>
                  </div>
                  <span className="font-bold text-blue-600">{regularTotal} patients</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                PriorityQueue comparator active
              </span>
              <button
                onClick={() => onNavigate('oop-concepts')}
                className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
              >
                Learn OOP Logic →
              </button>
            </div>
          </div>

          {/* Department Breakdown */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-sm">Active OPD Departments</h3>
                <span className="text-xs text-slate-400">Waiting / Total</span>
              </div>

              <div className="space-y-2.5">
                {departmentCounts.map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 truncate max-w-[140px]">{dept.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        {dept.waiting} waiting
                      </span>
                      <span className="text-slate-400">({dept.count} total)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">5 Active OPD Cabins</span>
              <button
                onClick={() => onNavigate('doctor-dashboard')}
                className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
              >
                Doctor OPDs →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Row: Live Waiting Queue Table Snippet + Today's Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Waiting Queue Snippet */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Current Priority Queue Order</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sorted strictly by Priority (Emergency &gt; Urgent &gt; Regular), then Arrival Time.
              </p>
            </div>

            <button
              onClick={() => onNavigate('queue')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {waitingPatients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Position</th>
                    <th className="py-2.5 px-3">Token</th>
                    <th className="py-2.5 px-3">Patient</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Priority</th>
                    <th className="py-2.5 px-3">Arrived</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {waitingPatients.slice(0, 5).map((patient, index) => {
                    const color = PRIORITY_COLORS[patient.priority];
                    return (
                      <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3">
                          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold inline-flex items-center justify-center text-xs">
                            #{index + 1}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">{patient.token}</td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900">{patient.name}</div>
                          <div className="text-[11px] text-slate-400">{patient.age} yrs • {patient.gender}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-600">{patient.department}</td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold border text-[11px] ${color.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
                            {patient.priority}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-500">{formatTime(patient.arrivalTime)}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => onCallPatient(patient)}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                          >
                            Call
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {waitingPatients.length > 5 && (
                <div className="text-center pt-3 text-xs text-slate-500">
                  + {waitingPatients.length - 5} more patients waiting in queue.{' '}
                  <button
                    onClick={() => onNavigate('queue')}
                    className="text-blue-600 font-semibold hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              No patients currently waiting in queue.
            </div>
          )}
        </div>

        {/* Today's Appointments Snippet */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Today's Appointments</h3>
              </div>
              <button
                onClick={() => onNavigate('appointments')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                View All →
              </button>
            </div>

            <div className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 text-xs">{apt.patientName}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        apt.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : apt.status === 'Cancelled'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {apt.doctorName} • {apt.department}
                  </div>
                  <div className="text-[11px] font-medium text-slate-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{apt.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('appointments')}
            className="mt-4 w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors text-center cursor-pointer"
          >
            Manage All Appointments
          </button>
        </div>
      </div>
    </div>
  );
};
