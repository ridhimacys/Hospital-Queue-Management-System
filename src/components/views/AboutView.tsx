import React from 'react';
import { 
  Activity, 
  ShieldAlert, 
  Clock, 
  Cpu, 
  CheckCircle2, 
  BookOpen, 
  Layers, 
  AlertCircle 
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title Card */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-8 rounded-2xl shadow-md">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">MEDQUEUE</h1>
            <p className="text-xs text-teal-300 font-medium">Hospital Queue Management System</p>
          </div>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed max-w-2xl mt-4">
          MedQueue is an academic software engineering and data structures prototype engineered to digitally organize outpatient department (OPD) patient registration, emergency triage overrides, queue dispatching, and consultation workflows.
        </p>
      </div>

      {/* Purpose & Problem Statement */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Project Purpose & Problem Statement</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600 leading-relaxed">
          <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200/80">
            <div className="font-bold text-rose-900 mb-1 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>The Problem with FIFO Queues</span>
            </div>
            <p className="text-xs text-rose-800/90 leading-relaxed">
              Standard First-In-First-Out (FIFO) lines treat every patient identically. In a clinical hospital setting, treating an emergency myocardial infarction or acute asthma attack with the same priority as a routine prescription renewal leads to catastrophic clinical delays.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200/80">
            <div className="font-bold text-teal-900 mb-1 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>The MedQueue Priority Solution</span>
            </div>
            <p className="text-xs text-teal-800/90 leading-relaxed">
              MedQueue implements a Priority Queue where clinical urgency dictates queue position. Critical emergencies immediately jump to the front of the queue, followed by urgent patients, then regular consultations. Earlier arrival time resolves ties within identical priority levels.
            </p>
          </div>
        </div>
      </div>

      {/* Queue Logic Deep Dive */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900">The Triage Priority Algorithm</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Priority Level 1</span>
            <div className="text-xl font-black text-rose-700 mt-1">EMERGENCY</div>
            <p className="text-xs text-rose-600/80 mt-1">Highest clinical priority. Immediate bypass of routine line.</p>
          </div>

          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Priority Level 2</span>
            <div className="text-xl font-black text-amber-700 mt-1">URGENT</div>
            <p className="text-xs text-amber-600/80 mt-1">Medium priority. High fevers, fractures, acute distress.</p>
          </div>

          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Priority Level 3</span>
            <div className="text-xl font-black text-blue-700 mt-1">REGULAR</div>
            <p className="text-xs text-blue-600/80 mt-1">Normal priority. Routine health checks, non-acute OPD visits.</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Deterministic Tie-Breaker:</strong> When two patients share identical priority tiers, the patient with the earlier <code className="font-mono bg-slate-200 px-1 py-0.5 rounded font-bold">arrivalTime</code> timestamp is served first (FIFO within priority tier).
          </span>
        </div>
      </div>

      {/* Architecture & Technologies */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Technology Architecture</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="space-y-2">
            <div className="font-bold text-slate-800 text-sm">Frontend Prototype</div>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>React 19 & TypeScript</li>
              <li>Tailwind CSS for clean modern medical aesthetics</li>
              <li>Lucide React iconography</li>
              <li>Browser LocalStorage for persistent demonstration state</li>
              <li>Zero backend dependency for instant portable testing</li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-800 text-sm">Academic Java Companion</div>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>Core Java 17+ OOP Design Patterns</li>
              <li><code className="font-mono font-bold">java.util.PriorityQueue&lt;Patient&gt;</code> min-heap</li>
              <li><code className="font-mono font-bold">PatientPriorityComparator</code> implementation</li>
              <li>Encapsulation, Polymorphism, Abstraction, Inheritance</li>
              <li>Checked custom exceptions (<code className="font-mono">InvalidPatientException</code>, <code className="font-mono">PatientNotFoundException</code>)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Academic Disclaimer */}
      <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs leading-relaxed">
        <div className="font-bold text-sm mb-1 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-700" />
          <span>Academic Viva / Capstone Disclaimer</span>
        </div>
        MedQueue is strictly an academic project prototype developed for undergraduate computer science and software engineering curriculum coursework. It demonstrates Data Structures (Priority Queues, Heaps, Comparators) and Object-Oriented Programming (OOP) concepts. It is not certified for actual real-world clinical or diagnostic use.
      </div>
    </div>
  );
};
