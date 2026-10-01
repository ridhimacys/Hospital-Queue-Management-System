import React from 'react';
import { Patient } from '../../types';
import { BaseModal } from '../common/Modal';
import { 
  User, 
  Phone, 
  MapPin, 
  Clock, 
  FileText, 
  Stethoscope, 
  ShieldAlert, 
  CheckCircle2, 
  Play,
  RotateCcw,
  XCircle
} from 'lucide-react';
import { 
  PRIORITY_COLORS, 
  STATUS_BADGES, 
  formatTime, 
  formatDate,
  calculateEstimatedWaitTime,
  getPatientQueuePosition
} from '../../utils/queueManager';

interface PatientDetailModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  allPatients: Patient[];
  onCallPatient?: (patient: Patient) => void;
  onStartConsultation?: (patient: Patient) => void;
  onCompleteConsultation?: (patient: Patient) => void;
}

export const PatientDetailModal: React.FC<PatientDetailModalProps> = ({
  patient,
  isOpen,
  onClose,
  allPatients,
  onCallPatient,
  onStartConsultation,
  onCompleteConsultation,
}) => {
  if (!patient) return null;

  const color = PRIORITY_COLORS[patient.priority];
  const statusInfo = STATUS_BADGES[patient.status];
  const queuePos = patient.status === 'WAITING' ? getPatientQueuePosition(patient.token, allPatients) : -1;
  const estimatedWait = calculateEstimatedWaitTime(queuePos);

  return (
    <BaseModal isOpen={isOpen} title={`Patient Dossier — ${patient.token}`} onClose={onClose} maxWidth="max-w-2xl">
      <div className="space-y-6 text-xs text-slate-700">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="font-mono text-3xl font-black text-blue-700 bg-white border border-blue-200 px-3.5 py-2 rounded-xl shadow-xs">
              {patient.token}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{patient.name}</h2>
              <div className="text-slate-500 mt-0.5">
                {patient.age} years old • {patient.gender} • ID: <span className="font-mono font-bold text-slate-700">{patient.id}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1.5">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${color.badge}`}>
              {patient.priority} Priority
            </span>
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusInfo.className}`}>
              {statusInfo.label}
            </span>
          </div>
        </div>

        {/* Live Queue Position Banner if waiting */}
        {patient.status === 'WAITING' && (
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-blue-50/60 border border-blue-200">
            <div>
              <span className="font-bold text-blue-900 text-xs uppercase tracking-wider">Queue Position</span>
              <div className="text-2xl font-black text-blue-700 mt-1">#{queuePos} in Line</div>
              <div className="text-[11px] text-blue-600 mt-0.5">
                {queuePos === 1 ? 'Next to be called by doctor' : `${queuePos - 1} patients ahead`}
              </div>
            </div>

            <div>
              <span className="font-bold text-blue-900 text-xs uppercase tracking-wider">Estimated Wait Time</span>
              <div className="text-2xl font-black text-slate-800 mt-1">~{estimatedWait} mins</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Based on ~10 min consultations</div>
            </div>
          </div>
        )}

        {/* Detailed Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>Demographic Information</span>
            </div>
            <div className="space-y-1 text-slate-600">
              <div><strong className="text-slate-800">Contact:</strong> {patient.phone}</div>
              <div><strong className="text-slate-800">Age:</strong> {patient.age} years</div>
              <div><strong className="text-slate-800">Gender:</strong> {patient.gender}</div>
              <div><strong className="text-slate-800">Arrival Time:</strong> {formatTime(patient.arrivalTime)} ({formatDate(patient.arrivalTime)})</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              <span>OPD Assignment</span>
            </div>
            <div className="space-y-1 text-slate-600">
              <div><strong className="text-slate-800">Department:</strong> {patient.department}</div>
              <div><strong className="text-slate-800">Assigned Doctor:</strong> {patient.doctorAssigned || 'Duty Doctor'}</div>
              <div><strong className="text-slate-800">Triage Type:</strong> {patient.patientType}</div>
              {patient.completedAt && (
                <div><strong className="text-slate-800">Completed At:</strong> {formatTime(patient.completedAt)}</div>
              )}
            </div>
          </div>
        </div>

        {/* Symptoms & Chief Complaint */}
        <div className="p-4 rounded-xl border border-slate-200 bg-amber-50/30">
          <div className="font-bold text-slate-900 mb-1.5 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-600" />
            <span>Chief Symptoms & Clinical Complaint</span>
          </div>
          <p className="text-sm text-slate-800 italic leading-relaxed">
            "{patient.symptoms}"
          </p>
        </div>

        {/* Clinical / Triage Notes if any */}
        {patient.notes && (
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="font-bold text-slate-900 mb-1 text-xs">
              Doctor Consultation Notes / Prescription:
            </div>
            <p className="text-slate-700 leading-relaxed">
              {patient.notes}
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {patient.status === 'WAITING' && onCallPatient && (
              <button
                onClick={() => {
                  onCallPatient(patient);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Call Patient Now</span>
              </button>
            )}

            {patient.status === 'CALLED' && onStartConsultation && (
              <button
                onClick={() => {
                  onStartConsultation(patient);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors cursor-pointer"
              >
                Start Consultation
              </button>
            )}

            {patient.status === 'IN_CONSULTATION' && onCompleteConsultation && (
              <button
                onClick={() => {
                  onCompleteConsultation(patient);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Consultation</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </BaseModal>
  );
};
