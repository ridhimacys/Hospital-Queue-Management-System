import React, { useState } from 'react';
import { Patient, Department, Priority, PatientStatus } from '../../types';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Play, 
  CheckCircle2, 
  RotateCcw, 
  XCircle, 
  ArrowUpDown, 
  Clock, 
  UserPlus 
} from 'lucide-react';
import { 
  PRIORITY_COLORS, 
  STATUS_BADGES, 
  formatTime, 
  formatDate,
  calculateEstimatedWaitTime,
  getPatientQueuePosition
} from '../../utils/queueManager';

interface PatientsViewProps {
  patients: Patient[];
  onCallPatient: (patient: Patient) => void;
  onStartConsultation: (patient: Patient) => void;
  onCompleteConsultation: (patient: Patient) => void;
  onSkipPatient: (patient: Patient) => void;
  onCancelPatient: (patient: Patient) => void;
  onViewPatient: (patient: Patient) => void;
  onNavigateToRegister: () => void;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  patients,
  onCallPatient,
  onStartConsultation,
  onCompleteConsultation,
  onSkipPatient,
  onCancelPatient,
  onViewPatient,
  onNavigateToRegister,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'arrival' | 'priority' | 'name' | 'token'>('arrival');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const departments: string[] = [
    'All',
    'General Medicine',
    'Cardiology',
    'Pediatrics',
    'Orthopedics',
    'Dermatology',
  ];

  const statuses: string[] = [
    'All',
    'WAITING',
    'CALLED',
    'IN_CONSULTATION',
    'COMPLETED',
    'SKIPPED',
    'CANCELLED',
  ];

  // Filtering
  let filtered = patients.filter((patient) => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = patient.name.toLowerCase().includes(q);
      const matchToken = patient.token.toLowerCase().includes(q);
      const matchId = patient.id.toLowerCase().includes(q);
      const matchPhone = patient.phone.toLowerCase().includes(q);
      const matchSymptoms = patient.symptoms.toLowerCase().includes(q);
      if (!matchName && !matchToken && !matchId && !matchPhone && !matchSymptoms) {
        return false;
      }
    }

    if (selectedDept !== 'All' && patient.department !== selectedDept) {
      return false;
    }

    if (selectedPriority !== 'All' && patient.priority !== selectedPriority) {
      return false;
    }

    if (selectedStatus !== 'All' && patient.status !== selectedStatus) {
      return false;
    }

    return true;
  });

  // Sorting
  filtered.sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'arrival') {
      comparison = new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime();
    } else if (sortBy === 'priority') {
      const map: Record<Priority, number> = { EMERGENCY: 1, URGENT: 2, REGULAR: 3 };
      comparison = map[a.priority] - map[b.priority];
    } else if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'token') {
      comparison = a.token.localeCompare(b.token);
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Patient Registry & Directory</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Complete database of hospital patients with status lifecycle tracking and clinical actions.
          </p>
        </div>

        <button
          onClick={onNavigateToRegister}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, token (T001), phone, symptoms..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d === 'All' ? 'All Departments' : d}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="EMERGENCY">Emergency (High)</option>
              <option value="URGENT">Urgent (Medium)</option>
              <option value="REGULAR">Regular (Normal)</option>
            </select>
          </div>
        </div>

        {/* Secondary Filter Row: Status + Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
              Status:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedStatus(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    selectedStatus === s
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s === 'All' ? 'All' : STATUS_BADGES[s as PatientStatus]?.label || s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 cursor-pointer"
            >
              <option value="arrival">Arrival Time</option>
              <option value="priority">Priority Level</option>
              <option value="name">Patient Name</option>
              <option value="token">Token Number</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1.5 border border-slate-300 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
              title="Toggle sort direction"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Patients Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="text-xs font-semibold text-slate-500">
            Showing <strong className="text-slate-800">{filtered.length}</strong> of{' '}
            <strong className="text-slate-800">{patients.length}</strong> patients
          </div>
          {(searchQuery || selectedDept !== 'All' || selectedPriority !== 'All' || selectedStatus !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDept('All');
                setSelectedPriority('All');
                setSelectedStatus('All');
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>

        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Token</th>
                  <th className="py-3.5 px-4">Patient Name</th>
                  <th className="py-3.5 px-4">Age/Gender</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Arrival</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((patient) => {
                  const color = PRIORITY_COLORS[patient.priority];
                  const statusInfo = STATUS_BADGES[patient.status] || {
                    label: patient.status,
                    className: 'bg-slate-100 text-slate-600',
                  };

                  return (
                    <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Token */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-extrabold text-sm text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {patient.token}
                        </span>
                      </td>

                      {/* Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">{patient.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[200px]">
                          {patient.symptoms}
                        </div>
                      </td>

                      {/* Age / Gender */}
                      <td className="py-3.5 px-4 text-slate-600">
                        {patient.age} yrs • {patient.gender}
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {patient.department}
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold border text-[11px] ${color.badge}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
                          {patient.priority}
                        </span>
                      </td>

                      {/* Arrival */}
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {formatTime(patient.arrivalTime)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusInfo.className}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Modal */}
                          <button
                            onClick={() => onViewPatient(patient)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="View Patient Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Dynamic status-aware actions */}
                          {patient.status === 'WAITING' && (
                            <>
                              <button
                                onClick={() => onCallPatient(patient)}
                                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Play className="w-3 h-3 fill-white" />
                                <span>Call</span>
                              </button>
                              <button
                                onClick={() => onSkipPatient(patient)}
                                className="px-2 py-1 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50 text-xs font-semibold cursor-pointer"
                                title="Skip"
                              >
                                Skip
                              </button>
                              <button
                                onClick={() => onCancelPatient(patient)}
                                className="px-2 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold cursor-pointer"
                                title="Cancel"
                              >
                                Cancel
                              </button>
                            </>
                          )}

                          {patient.status === 'CALLED' && (
                            <>
                              <button
                                onClick={() => onStartConsultation(patient)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                              >
                                Start
                              </button>
                              <button
                                onClick={() => onSkipPatient(patient)}
                                className="px-2 py-1 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50 text-xs font-semibold cursor-pointer"
                              >
                                Skip
                              </button>
                            </>
                          )}

                          {patient.status === 'IN_CONSULTATION' && (
                            <button
                              onClick={() => onCompleteConsultation(patient)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Complete</span>
                            </button>
                          )}

                          {patient.status === 'SKIPPED' && (
                            <button
                              onClick={() => onCallPatient(patient)}
                              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                            >
                              Recall
                            </button>
                          )}
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
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-slate-800 text-sm">No Patients Found</h4>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search terms or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
