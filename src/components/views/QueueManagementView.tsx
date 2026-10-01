import React, { useState } from 'react';
import { Patient, Department, Priority } from '../../types';
import { 
  ListOrdered, 
  Play, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Stethoscope, 
  Sparkles,
  Filter,
  Eye,
  Info
} from 'lucide-react';
import { 
  getSortedWaitingQueue, 
  getNextWaitingPatient, 
  calculateEstimatedWaitTime, 
  PRIORITY_COLORS, 
  STATUS_BADGES, 
  formatTime 
} from '../../utils/queueManager';

interface QueueManagementViewProps {
  patients: Patient[];
  onCallPatient: (patient: Patient) => void;
  onStartConsultation: (patient: Patient) => void;
  onCompleteConsultation: (patient: Patient) => void;
  onSkipPatient: (patient: Patient) => void;
  onCancelPatient: (patient: Patient) => void;
  onViewPatient: (patient: Patient) => void;
}

export const QueueManagementView: React.FC<QueueManagementViewProps> = ({
  patients,
  onCallPatient,
  onStartConsultation,
  onCompleteConsultation,
  onSkipPatient,
  onCancelPatient,
  onViewPatient,
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');

  // Active Waiting Queue
  let waitingQueue = getSortedWaitingQueue(patients, selectedDept);
  if (selectedPriority !== 'All') {
    waitingQueue = waitingQueue.filter((p) => p.priority === selectedPriority);
  }

  // Next patient according to global priority queue
  const nextGlobalPatient = getNextWaitingPatient(patients, selectedDept);

  // Active called or consulting patients
  const activeConsultationPatients = patients.filter(
    (p) => p.status === 'CALLED' || p.status === 'IN_CONSULTATION'
  );

  const departments: string[] = [
    'All',
    'General Medicine',
    'Cardiology',
    'Pediatrics',
    'Orthopedics',
    'Dermatology',
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ListOrdered className="w-6 h-6 text-blue-600" />
            <span>Priority Queue Dispatcher</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Dynamic ordering engine: <strong className="text-rose-600 font-semibold">Emergency (Level 1)</strong> &gt;{' '}
            <strong className="text-amber-600 font-semibold">Urgent (Level 2)</strong> &gt;{' '}
            <strong className="text-blue-600 font-semibold">Regular (Level 3)</strong>, with earlier arrival tie-breaker.
          </p>
        </div>

        {/* Call Next Button */}
        {nextGlobalPatient && (
          <button
            onClick={() => onCallPatient(nextGlobalPatient)}
            className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Call Next Patient ({nextGlobalPatient.token})</span>
          </button>
        )}
      </div>

      {/* Prominent Next Patient Spotlight Card */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-80 h-full bg-blue-500/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                Front of Queue (Position #1)
              </span>
              <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded text-slate-300">
                Determined by PatientPriorityComparator
              </span>
            </div>

            {nextGlobalPatient ? (
              <div className="flex flex-wrap items-baseline gap-4 mt-2">
                <span className="font-mono text-4xl font-black text-amber-400">
                  {nextGlobalPatient.token}
                </span>
                <div>
                  <h2 className="text-2xl font-bold text-white">{nextGlobalPatient.name}</h2>
                  <div className="text-xs text-slate-300 mt-0.5">
                    {nextGlobalPatient.age} yrs • {nextGlobalPatient.gender} • {nextGlobalPatient.department}
                  </div>
                </div>
                <span
                  className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase border ${
                    nextGlobalPatient.priority === 'EMERGENCY'
                      ? 'bg-rose-500/90 text-white border-rose-400 animate-pulse'
                      : nextGlobalPatient.priority === 'URGENT'
                      ? 'bg-amber-500/90 text-white border-amber-400'
                      : 'bg-blue-500/90 text-white border-blue-400'
                  }`}
                >
                  {nextGlobalPatient.priority} Priority
                </span>
              </div>
            ) : (
              <div className="py-2">
                <h2 className="text-xl font-bold text-slate-300">No Patients in Waiting Queue</h2>
                <p className="text-xs text-slate-400 mt-1">All registered patients have been called or served.</p>
              </div>
            )}

            {nextGlobalPatient && (
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>Arrived: <strong>{formatTime(nextGlobalPatient.arrivalTime)}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-teal-400" />
                  <span>Chief Complaint: <strong className="text-white italic">"{nextGlobalPatient.symptoms}"</strong></span>
                </div>
              </div>
            )}
          </div>

          {/* Action button in banner */}
          {nextGlobalPatient && (
            <div className="shrink-0 flex items-center gap-3">
              <button
                onClick={() => onViewPatient(nextGlobalPatient)}
                className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                View Details
              </button>
              <button
                onClick={() => onCallPatient(nextGlobalPatient)}
                className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-extrabold shadow-lg shadow-teal-500/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Call Patient Now</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Currently In-Progress / Called Patients Panel (if any) */}
      {activeConsultationPatients.length > 0 && (
        <div className="bg-white rounded-2xl border border-purple-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-ping" />
              <h3 className="font-bold text-slate-900 text-sm">
                Called & Active Consultations ({activeConsultationPatients.length})
              </h3>
            </div>
            <span className="text-xs text-slate-400">Manage patient consultation flow</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeConsultationPatients.map((patient) => {
              const isCalled = patient.status === 'CALLED';
              const isConsulting = patient.status === 'IN_CONSULTATION';

              return (
                <div
                  key={patient.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCalled
                      ? 'bg-purple-50/60 border-purple-300'
                      : 'bg-emerald-50/60 border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900 text-base">{patient.token}</span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        isCalled
                          ? 'bg-purple-200 text-purple-800 animate-pulse'
                          : 'bg-emerald-200 text-emerald-800'
                      }`}
                    >
                      {isCalled ? 'CALLED' : 'IN CONSULTATION'}
                    </span>
                  </div>

                  <div className="font-semibold text-slate-800 text-sm mt-1">{patient.name}</div>
                  <div className="text-xs text-slate-500">
                    {patient.department} • {patient.doctorAssigned || 'Attending Doctor'}
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-end gap-2">
                    {isCalled && (
                      <>
                        <button
                          onClick={() => onSkipPatient(patient)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors cursor-pointer"
                        >
                          Skip
                        </button>
                        <button
                          onClick={() => onStartConsultation(patient)}
                          className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
                        >
                          Start Consultation
                        </button>
                      </>
                    )}

                    {isConsulting && (
                      <button
                        onClick={() => onCompleteConsultation(patient)}
                        className="w-full py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Complete Consultation</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter Toolbar for Active Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Queue:</span>
          </div>

          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-700 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === 'All' ? 'All Departments' : dept}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-700 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="All">All Priorities</option>
            <option value="EMERGENCY">Emergency Only (Level 1)</option>
            <option value="URGENT">Urgent Only (Level 2)</option>
            <option value="REGULAR">Regular Only (Level 3)</option>
          </select>
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Showing <strong>{waitingQueue.length}</strong> waiting in queue
        </div>
      </div>

      {/* Main Priority Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Active Waiting Queue</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Patients are sequenced by priority weight, then by arrival timestamp.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Info className="w-3.5 h-3.5 text-blue-500" />
            <span>Estimated ~10 min per preceding patient</span>
          </div>
        </div>

        {waitingQueue.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Pos #</th>
                  <th className="py-3 px-4">Token</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Priority / Triage</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Arrival Time</th>
                  <th className="py-3 px-4">Est. Wait</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {waitingQueue.map((patient, index) => {
                  const position = index + 1;
                  const waitMinutes = calculateEstimatedWaitTime(position);
                  const color = PRIORITY_COLORS[patient.priority];

                  return (
                    <tr
                      key={patient.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        position === 1 ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      {/* Position */}
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        <span
                          className={`w-7 h-7 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                            position === 1
                              ? 'bg-amber-400 text-slate-900 shadow-xs'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          #{position}
                        </span>
                      </td>

                      {/* Token */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-extrabold text-sm text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {patient.token}
                        </span>
                      </td>

                      {/* Patient Name & Details */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">{patient.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {patient.age} yrs • {patient.gender} • {patient.phone}
                        </div>
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold border text-xs ${color.badge}`}
                        >
                          <span className={`w-2 h-2 rounded-full ${color.dot}`} />
                          <span>{patient.priority}</span>
                        </span>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {patient.department}
                      </td>

                      {/* Arrival */}
                      <td className="py-3.5 px-4 text-slate-500">
                        {formatTime(patient.arrivalTime)}
                      </td>

                      {/* Estimated wait */}
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {position === 1 ? (
                          <span className="text-emerald-600 font-bold">Next in Line</span>
                        ) : (
                          <span>~{waitMinutes} mins</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onViewPatient(patient)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="View patient details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onCallPatient(patient)}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-white" />
                            <span>Call</span>
                          </button>

                          <button
                            onClick={() => onSkipPatient(patient)}
                            className="px-2 py-1 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50 text-xs font-semibold transition-colors cursor-pointer"
                            title="Skip this patient"
                          >
                            Skip
                          </button>

                          <button
                            onClick={() => onCancelPatient(patient)}
                            className="px-2 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
                            title="Cancel patient"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Waiting Queue is Clear</h4>
            <p className="text-xs text-slate-400 mt-1">
              There are currently no patients waiting in the selected department.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
