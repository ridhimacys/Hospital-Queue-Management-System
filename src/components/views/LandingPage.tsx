import React from 'react';
import { UserRole } from '../../types';
import { 
  Activity, 
  UserCheck, 
  Stethoscope, 
  Users, 
  ShieldAlert, 
  Clock, 
  Cpu, 
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface LandingPageProps {
  onSelectRole: (role: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20 flex flex-col justify-between">
      {/* Top Banner */}
      <header className="px-6 py-5 max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-slate-900">MEDQUEUE</span>
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              Academic Project
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium hidden sm:flex items-center gap-1.5">
          <Cpu className="w-4 h-4 text-blue-600" />
          <span>PriorityQueue & OOP Simulation</span>
        </div>
      </header>

      {/* Main Hero & Role Selection */}
      <main className="max-w-5xl mx-auto w-full px-6 py-8 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Priority-Based Triage System</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Hospital Queue Management <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
              Reimagined with Priority Triage
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            MedQueue digitally coordinates patient admissions, emergency overrides, and OPD consultation flow. 
            Replacing naive FIFO queues with clinical priority ordering: 
            <strong className="text-rose-600 font-semibold"> Emergency</strong>, 
            <strong className="text-amber-600 font-semibold"> Urgent</strong>, and 
            <strong className="text-blue-600 font-semibold"> Regular</strong>.
          </p>
        </div>

        {/* 3 Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Role 1: Receptionist */}
          <div
            onClick={() => onSelectRole('Receptionist')}
            className="group relative bg-white rounded-2xl p-6 border-2 border-slate-200/80 hover:border-blue-500 shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UserCheck className="w-6 h-6" />
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Receptionist
                </h3>
                <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                  Full Access
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Register arriving patients, assign triage priority, auto-generate tokens, and dispatch the waiting line.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>Register & triage walk-in patients</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>Call next priority patient</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>Manage today's appointments</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
              <span>Enter as Receptionist</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Role 2: Doctor */}
          <div
            onClick={() => onSelectRole('Doctor')}
            className="group relative bg-white rounded-2xl p-6 border-2 border-slate-200/80 hover:border-teal-500 shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-6 h-6" />
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                  Doctor
                </h3>
                <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-700">
                  Clinical OPD
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Review assigned department queues, conduct patient consultations, write medical notes, and complete visits.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
                  <span>Department patient prioritization</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
                  <span>Active consultation timer & notes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
                  <span>Track completed consultations</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-teal-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
              <span>Enter as Doctor</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Role 3: Patient */}
          <div
            onClick={() => onSelectRole('Patient')}
            className="group relative bg-white rounded-2xl p-6 border-2 border-slate-200/80 hover:border-purple-500 shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                  Patient Kiosk
                </h3>
                <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-purple-50 text-purple-700">
                  Self Service
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Check real-time queue position, estimated consultation wait time, and track token status on waiting hall screens.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
                  <span>Search by Token (e.g. T001)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
                  <span>Real-time queue place tracker</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
                  <span>Estimated wait time updates</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-purple-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
              <span>Track Token Status</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Algorithm Highlights Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-white/80 border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Priority Hierarchy</div>
              <div className="text-xs text-slate-500">Emergency (1) &gt; Urgent (2) &gt; Regular (3)</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Arrival Tie-Breaker</div>
              <div className="text-xs text-slate-500">Earlier arrival time served first within tier</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Java OOP Companion</div>
              <div className="text-xs text-slate-500">PriorityQueue, Comparator, Custom Exceptions</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200/60">
        MEDQUEUE Hospital Queue Management System • Academic Frontend Prototype with LocalStorage Persistence
      </footer>
    </div>
  );
};
