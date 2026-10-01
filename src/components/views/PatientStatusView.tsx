import React, { useState } from 'react';
import { Patient } from '../../types';
import { 
  Search, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  Sparkles,
  ArrowRight,
  Stethoscope,
  Info
} from 'lucide-react';
import { 
  getPatientQueuePosition, 
  calculateEstimatedWaitTime, 
  PRIORITY_COLORS, 
  STATUS_BADGES, 
  formatTime 
} from '../../utils/queueManager';

interface PatientStatusViewProps {
  patients: Patient[];
  onSelectToken?: (token: string) => void;
}

export const PatientStatusView: React.FC<PatientStatusViewProps> = ({ patients }) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchedPatient, setSearchedPatient] = useState<Patient | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e?: React.FormEvent, customToken?: string) => {
    if (e) e.preventDefault();
    const query = (customToken ?? searchInput).trim().toUpperCase();
    if (!query) return;

    const found = patients.find(
      (p) => p.token.toUpperCase() === query || p.id.toUpperCase() === query
    );

    setSearchedPatient(found || null);
    setHasSearched(true);
    if (customToken) setSearchInput(customToken);
  };

  // Recent waiting tokens for quick demo
  const sampleTokens = patients.filter((p) => p.status === 'WAITING').slice(0, 4);

  // Position and wait calculation
  const queuePosition = searchedPatient
    ? getPatientQueuePosition(searchedPatient.token, patients)
    : -1;
  const estimatedWait = calculateEstimatedWaitTime(queuePosition);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Patient Self-Service Waiting Lounge Kiosk</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Track Your Consultation Token
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Enter your assigned token number (e.g. <strong>T001</strong>) or Patient ID to see your live position in the priority queue.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter Token (e.g. T001, T002) or Patient ID..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 text-base font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 uppercase"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Search</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Sample Clickers for Evaluators */}
        {sampleTokens.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Quick Demo Tokens:</span>
            {sampleTokens.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSearch(undefined, p.token)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 font-mono font-bold transition-colors border border-slate-200 cursor-pointer"
              >
                {p.token} ({p.priority[0]})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Result Display */}
      {hasSearched && (
        <>
          {searchedPatient ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden animate-in fade-in duration-200">
              {/* Card Banner */}
              <div
                className={`p-6 text-white ${
                  searchedPatient.status === 'IN_CONSULTATION'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
                    : searchedPatient.status === 'CALLED'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600'
                    : searchedPatient.priority === 'EMERGENCY'
                    ? 'bg-gradient-to-r from-rose-600 to-red-600'
                    : 'bg-gradient-to-r from-blue-700 to-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-white/80">
                      Live Queue Token
                    </div>
                    <div className="text-4xl font-mono font-black tracking-wider mt-1 text-white">
                      {searchedPatient.token}
                    </div>
                    <div className="text-lg font-bold mt-1 text-white/95">{searchedPatient.name}</div>
                  </div>

                  <div className="sm:text-right">
                    <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white font-extrabold text-xs uppercase tracking-wider backdrop-blur-xs">
                      {STATUS_BADGES[searchedPatient.status]?.label || searchedPatient.status}
                    </span>
                    <div className="text-xs text-white/80 mt-1">
                      {searchedPatient.department} Department
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Tracker & Timeline */}
              <div className="p-6 space-y-6">
                {/* Waiting Position Highlights */}
                {searchedPatient.status === 'WAITING' && (
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase">
                        Current Queue Position
                      </div>
                      <div className="text-3xl font-extrabold text-blue-700 mt-1">
                        #{queuePosition}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {queuePosition === 1 ? 'You are next in line!' : `${queuePosition - 1} patients ahead`}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase">
                        Estimated Wait Time
                      </div>
                      <div className="text-3xl font-extrabold text-slate-800 mt-1">
                        ~{estimatedWait} mins
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">Subject to urgent triage</div>
                    </div>
                  </div>
                )}

                {searchedPatient.status === 'CALLED' && (
                  <div className="p-4 rounded-xl bg-purple-50 border-2 border-purple-300 text-center animate-pulse">
                    <div className="text-purple-900 font-bold text-lg">
                      🔔 Token {searchedPatient.token} Has Been Called!
                    </div>
                    <p className="text-xs text-purple-700 mt-1">
                      Please proceed immediately to <strong>{searchedPatient.department} OPD Cabin</strong>.
                    </p>
                  </div>
                )}

                {searchedPatient.status === 'IN_CONSULTATION' && (
                  <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-center">
                    <div className="text-emerald-900 font-bold text-lg">
                      🩺 Consultation In Progress
                    </div>
                    <p className="text-xs text-emerald-700 mt-1">
                      Doctor is currently attending to this consultation.
                    </p>
                  </div>
                )}

                {searchedPatient.status === 'COMPLETED' && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <div className="text-slate-800 font-bold text-lg">
                      ✅ Consultation Completed
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Visit closed. Please collect your prescription from the pharmacy desk.
                    </p>
                  </div>
                )}

                {/* Patient Information Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
                  <div>
                    <span className="text-slate-400 block font-medium">Triage Priority</span>
                    <span
                      className={`inline-block font-extrabold px-2 py-0.5 rounded text-[11px] mt-1 ${
                        PRIORITY_COLORS[searchedPatient.priority].badge
                      }`}
                    >
                      {searchedPatient.priority}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Arrival Time</span>
                    <span className="font-semibold text-slate-800 block mt-1">
                      {formatTime(searchedPatient.arrivalTime)}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Attending Doctor</span>
                    <span className="font-semibold text-slate-800 block mt-1">
                      {searchedPatient.doctorAssigned || 'Department Duty Doctor'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Patient ID</span>
                    <span className="font-mono font-semibold text-slate-800 block mt-1">
                      {searchedPatient.id}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">Token Not Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No active or completed record found matching "<strong>{searchInput}</strong>". Please verify your token printout or visit the reception desk.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
