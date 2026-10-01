import React, { useState } from 'react';
import { Patient, Doctor, Appointment } from '../../types';
import { INITIAL_DOCTORS } from '../../data/mockData';
import { 
  Stethoscope, 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  Play, 
  AlertCircle, 
  FileText, 
  CalendarDays,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { 
  getSortedWaitingQueue, 
  getNextWaitingPatient, 
  PRIORITY_COLORS, 
  formatTime 
} from '../../utils/queueManager';

interface DoctorDashboardViewProps {
  patients: Patient[];
  appointments: Appointment[];
  onCallPatient: (patient: Patient) => void;
  onStartConsultation: (patient: Patient) => void;
  onCompleteConsultation: (patient: Patient, notes?: string) => void;
  onViewPatient: (patient: Patient) => void;
}

export const DoctorDashboardView: React.FC<DoctorDashboardViewProps> = ({
  patients,
  appointments,
  onCallPatient,
  onStartConsultation,
  onCompleteConsultation,
  onViewPatient,
}) => {
  const doctors = INITIAL_DOCTORS;
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctors[0].id);
  const [consultationNotes, setConsultationNotes] = useState<string>('');

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

  // Patients in consultation with this doctor or in this department
  const currentConsultation = patients.find(
    (p) =>
      p.status === 'IN_CONSULTATION' &&
      (p.doctorAssigned === selectedDoctor.name || p.department === selectedDoctor.department)
  );

  // Patient currently called for this department
  const calledPatient = patients.find(
    (p) =>
      p.status === 'CALLED' &&
      (p.doctorAssigned === selectedDoctor.name || p.department === selectedDoctor.department)
  );

  // Department waiting queue sorted by MedQueue priority rules
  const departmentWaitingQueue = getSortedWaitingQueue(patients, selectedDoctor.department);
  const nextDeptPatient = getNextWaitingPatient(patients, selectedDoctor.department);

  // Completed consultations for this doctor/department
  const completedCount = patients.filter(
    (p) =>
      p.status === 'COMPLETED' &&
      (p.doctorAssigned === selectedDoctor.name || p.department === selectedDoctor.department)
  ).length;

  // Doctor's appointments
  const doctorAppointments = appointments.filter(
    (apt) => apt.doctorName === selectedDoctor.name || apt.department === selectedDoctor.department
  );

  return (
    <div className="space-y-6">
      {/* Header & Doctor Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl ${selectedDoctor.avatarColor} text-white flex items-center justify-center font-bold text-xl shadow-md`}>
            {selectedDoctor.name.replace('Dr. ', '').split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">{selectedDoctor.name}</h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {selectedDoctor.roomNumber}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {selectedDoctor.department} • {selectedDoctor.qualification}
            </p>
          </div>
        </div>

        {/* Doctor Selection Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Switch Doctor:
          </span>
          <select
            value={selectedDoctorId}
            onChange={(e) => {
              setSelectedDoctorId(e.target.value);
              setConsultationNotes('');
            }}
            className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 shadow-xs focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name} ({doc.department})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* OPD Cabin Quick Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Department Waiting</div>
          <div className="text-2xl font-black text-sky-600 mt-1">
            {departmentWaitingQueue.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">{selectedDoctor.department} OPD</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Active Cabin Status</div>
          <div className="text-sm font-bold text-slate-800 mt-2">
            {currentConsultation ? (
              <span className="text-emerald-600 flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                In Consultation
              </span>
            ) : calledPatient ? (
              <span className="text-purple-600 flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                Patient Called
              </span>
            ) : (
              <span className="text-slate-400">Available / Free</span>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Completed Today</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{completedCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Consultations closed</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Scheduled Appointments</div>
          <div className="text-2xl font-black text-blue-600 mt-1">{doctorAppointments.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">For this doctor</div>
        </div>
      </div>

      {/* Main Grid: Active Consultation Workspace & Upcoming Department Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: CURRENT CONSULTATION or CALLED PATIENT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Consultation Box */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-base">CURRENT CONSULTATION</h3>
              </div>
              <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full font-mono text-teal-300 font-bold">
                {selectedDoctor.roomNumber}
              </span>
            </div>

            <div className="p-6">
              {currentConsultation ? (
                <div className="space-y-6">
                  {/* Patient Info Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-4">
                      <div className="font-mono text-3xl font-black text-blue-700 bg-white border border-blue-200 px-3 py-1.5 rounded-xl shadow-2xs">
                        {currentConsultation.token}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">{currentConsultation.name}</h4>
                        <div className="text-xs text-slate-500">
                          {currentConsultation.age} yrs • {currentConsultation.gender} • Contact: {currentConsultation.phone}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {currentConsultation.priority} Priority
                      </span>
                      <button
                        onClick={() => onViewPatient(currentConsultation)}
                        className="px-3 py-1 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        Patient Profile
                      </button>
                    </div>
                  </div>

                  {/* Clinical Symptoms */}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Chief Complaint & Symptoms:
                    </div>
                    <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/80 text-sm text-slate-800 italic">
                      "{currentConsultation.symptoms}"
                    </div>
                  </div>

                  {/* Consultation Notes Textarea */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Doctor Clinical Notes & Prescription:
                    </label>
                    <textarea
                      rows={4}
                      value={consultationNotes}
                      onChange={(e) => setConsultationNotes(e.target.value)}
                      placeholder="Enter clinical examination notes, provisional diagnosis, advised lab investigations, and prescribed medications..."
                      className="w-full p-3.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* Action */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      onClick={() => onCompleteConsultation(currentConsultation, consultationNotes)}
                      className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Complete Consultation & Close Visit</span>
                    </button>
                  </div>
                </div>
              ) : calledPatient ? (
                /* Patient is called, waiting to enter cabin */
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto animate-pulse">
                    <Clock className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-purple-700">
                      Patient Token Called & Waiting at Cabin Door
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 mt-1">
                      {calledPatient.token} — {calledPatient.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      Patient has been paged. Click "Start Consultation" as soon as the patient enters {selectedDoctor.roomNumber}.
                    </p>
                  </div>

                  <button
                    onClick={() => onStartConsultation(calledPatient)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-colors cursor-pointer"
                  >
                    Start Consultation Now
                  </button>
                </div>
              ) : (
                /* No patient currently in consultation */
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <UserCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800">Cabin is Currently Free</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      Ready to examine next waiting patient for {selectedDoctor.department}.
                    </p>
                  </div>

                  {nextDeptPatient && (
                    <button
                      onClick={() => onCallPatient(nextDeptPatient)}
                      className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Call Next Patient: {nextDeptPatient.token} ({nextDeptPatient.name})</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Today's Appointments for this Doctor */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Today's Scheduled Appointments ({doctorAppointments.length})
                </h3>
              </div>
            </div>

            {doctorAppointments.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {doctorAppointments.map((apt) => (
                  <div key={apt.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">{apt.patientName}</div>
                      <div className="text-slate-400 mt-0.5">{apt.time} • {apt.notes || 'Routine consultation'}</div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full font-semibold ${
                        apt.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : apt.status === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-400">
                No direct scheduled appointments for {selectedDoctor.name} today.
              </div>
            )}
          </div>
        </div>

        {/* Right Col: UPCOMING PATIENTS FOR THIS DEPARTMENT */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {selectedDoctor.department} Waiting Line
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Priority sorted</p>
              </div>
              <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                {departmentWaitingQueue.length} Waiting
              </span>
            </div>

            {departmentWaitingQueue.length > 0 ? (
              <div className="space-y-3">
                {departmentWaitingQueue.map((patient, index) => {
                  const color = PRIORITY_COLORS[patient.priority];
                  const isTop = index === 0;

                  return (
                    <div
                      key={patient.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isTop
                          ? 'bg-blue-50/50 border-blue-200'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold inline-flex items-center justify-center text-[10px]">
                            #{index + 1}
                          </span>
                          <span className="font-mono font-bold text-sm text-slate-900">
                            {patient.token}
                          </span>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${color.badge}`}
                        >
                          {patient.priority}
                        </span>
                      </div>

                      <div className="font-semibold text-slate-800 text-xs mt-2">
                        {patient.name} ({patient.age}y, {patient.gender})
                      </div>

                      <div className="text-[11px] text-slate-500 mt-1 line-clamp-1 italic">
                        "{patient.symptoms}"
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Arrived: {formatTime(patient.arrivalTime)}</span>
                        <button
                          onClick={() => onCallPatient(patient)}
                          className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Call Now
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                No patients waiting in {selectedDoctor.department}.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
