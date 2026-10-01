import React, { useState } from 'react';
import { Patient, Priority, Department, Gender, ViewTab } from '../../types';
import { generateNextToken, PRIORITY_COLORS } from '../../utils/queueManager';
import { 
  UserPlus, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  FileText
} from 'lucide-react';

interface RegisterPatientViewProps {
  patients: Patient[];
  onRegister: (patient: Patient) => void;
  onNavigate: (tab: ViewTab) => void;
}

export const RegisterPatientView: React.FC<RegisterPatientViewProps> = ({
  patients,
  onRegister,
  onNavigate,
}) => {
  const departments: Department[] = [
    'General Medicine',
    'Cardiology',
    'Pediatrics',
    'Orthopedics',
    'Dermatology',
  ];

  const nextPredictedToken = generateNextToken(patients);

  // Form states
  const [name, setName] = useState('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<Gender>('Male');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState<Department>('General Medicine');
  const [symptoms, setSymptoms] = useState('');
  const [patientType, setPatientType] = useState<Priority>('REGULAR');
  const [notes, setNotes] = useState('');

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastRegistered, setLastRegistered] = useState<Patient | null>(null);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!name.trim()) {
      errs.name = 'Patient full name is required.';
    } else if (name.trim().length < 2) {
      errs.name = 'Please provide a valid full name.';
    }

    const numAge = parseInt(age, 10);
    if (!age || isNaN(numAge)) {
      errs.age = 'Age is required.';
    } else if (numAge < 0 || numAge > 125) {
      errs.age = 'Please enter a valid age between 0 and 125.';
    }

    if (!phone.trim()) {
      errs.phone = 'Contact number is required.';
    } else if (phone.trim().length < 7) {
      errs.phone = 'Please provide a valid phone number.';
    }

    if (!symptoms.trim()) {
      errs.symptoms = 'Please enter chief symptoms or reason for visit.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const token = generateNextToken(patients);
    const newId = `P-${Date.now().toString().slice(-4)}`;

    const newPatient: Patient = {
      id: newId,
      token,
      name: name.trim(),
      age: parseInt(age, 10),
      gender,
      phone: phone.trim(),
      department,
      symptoms: symptoms.trim(),
      patientType,
      priority: patientType,
      status: 'WAITING',
      arrivalTime: new Date().toISOString(),
      notes: notes.trim() || undefined,
    };

    onRegister(newPatient);
    setLastRegistered(newPatient);

    // Reset form
    setName('');
    setAge('');
    setGender('Male');
    setPhone('');
    setDepartment('General Medicine');
    setSymptoms('');
    setPatientType('REGULAR');
    setNotes('');
    setErrors({});
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <UserPlus className="w-6 h-6 text-blue-600" />
          <span>Patient Registration & Triage</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Admit walk-in patients, evaluate priority triage level, and automatically issue an active queue token.
        </p>
      </div>

      {/* Success Banner if just registered */}
      {lastRegistered && (
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-emerald-900 text-base">
                Patient Registered Successfully!
              </div>
              <div className="text-emerald-700 text-sm mt-0.5">
                Token <strong className="font-mono text-emerald-950 font-bold bg-emerald-200/70 px-1.5 py-0.5 rounded">{lastRegistered.token}</strong> generated for <strong>{lastRegistered.name}</strong> ({lastRegistered.priority} Priority).
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('queue')}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>View In Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLastRegistered(null)}
              className="px-3 py-2 rounded-xl bg-white hover:bg-emerald-100/50 text-emerald-800 text-xs font-semibold border border-emerald-300 transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Registration Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Top Info Ribbon */}
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Next Generated Token Preview:</span>
            <strong className="font-mono text-sm font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded">
              {nextPredictedToken}
            </strong>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Arrival Time: Stamped on Submission</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Priority / Triage Selection First */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Clinical Priority Level (Triage) <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-3">
              Higher priority patients will automatically jump ahead in the waiting line based on the MedQueue comparator.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Emergency */}
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  patientType === 'EMERGENCY'
                    ? 'border-rose-500 bg-rose-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="priority"
                  value="EMERGENCY"
                  checked={patientType === 'EMERGENCY'}
                  onChange={() => setPatientType('EMERGENCY')}
                  className="mt-1 text-rose-600 focus:ring-rose-500"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-rose-800 text-sm">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>EMERGENCY (Level 1)</span>
                  </div>
                  <div className="text-xs text-rose-700/80 mt-1 leading-relaxed">
                    Highest Priority. Immediate care: chest pain, respiratory distress, acute trauma.
                  </div>
                </div>
              </label>

              {/* Urgent */}
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  patientType === 'URGENT'
                    ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="priority"
                  value="URGENT"
                  checked={patientType === 'URGENT'}
                  onChange={() => setPatientType('URGENT')}
                  className="mt-1 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-amber-800 text-sm">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>URGENT (Level 2)</span>
                  </div>
                  <div className="text-xs text-amber-700/80 mt-1 leading-relaxed">
                    Medium Priority. High fever, acute fractures, severe persistent pain.
                  </div>
                </div>
              </label>

              {/* Regular */}
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  patientType === 'REGULAR'
                    ? 'border-blue-500 bg-blue-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="priority"
                  value="REGULAR"
                  checked={patientType === 'REGULAR'}
                  onChange={() => setPatientType('REGULAR')}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-blue-800 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>REGULAR (Level 3)</span>
                  </div>
                  <div className="text-xs text-blue-700/80 mt-1 leading-relaxed">
                    Standard Priority. Routine checkups, refills, non-acute conditions.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Patient Personal Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Full Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Patel"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Age (Years) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="125"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 45"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  errors.age ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {errors.age && <p className="text-xs text-rose-600 mt-1">{errors.age}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Gender <span className="text-rose-500">*</span>
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 98765-43210"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  errors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                OPD Department <span className="text-rose-500">*</span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Chief Complaints / Symptoms */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Chief Symptoms & Complaints <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe symptoms, duration, intensity (e.g. Sharp chest pain radiating to left shoulder for 30 minutes with sweating)..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                errors.symptoms ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
              }`}
            />
            {errors.symptoms && <p className="text-xs text-rose-600 mt-1">{errors.symptoms}</p>}
          </div>

          {/* Optional Triage Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Triage Notes / Vital Signs (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. BP: 140/90, SpO2: 95%, Pulse: 88 bpm"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setName('');
                setAge('');
                setPhone('');
                setSymptoms('');
                setNotes('');
                setErrors({});
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition-colors cursor-pointer"
            >
              Clear Form
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Patient & Generate Token</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
