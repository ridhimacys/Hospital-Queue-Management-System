import React from 'react';
import { UserRole, Patient } from '../../types';
import { 
  Activity, 
  RotateCcw, 
  UserCheck, 
  Menu, 
  Bell, 
  AlertCircle,
  Clock,
  LogOut
} from 'lucide-react';
import { getSortedWaitingQueue } from '../../utils/queueManager';

interface NavbarProps {
  currentRole: UserRole | null;
  onSwitchRole: () => void;
  onResetDemo: () => void;
  onToggleSidebar: () => void;
  patients: Patient[];
  onNavigateToQueue: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onSwitchRole,
  onResetDemo,
  onToggleSidebar,
  patients,
  onNavigateToQueue,
}) => {
  const waitingPatients = getSortedWaitingQueue(patients);
  const emergencyCount = waitingPatients.filter((p) => p.priority === 'EMERGENCY').length;

  const getRoleBadgeStyle = (role: UserRole | null) => {
    switch (role) {
      case 'Doctor':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Receptionist':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Patient':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">MEDQUEUE</span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 tracking-wider">
                  Academic
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Hospital Queue Management System</p>
            </div>
          </div>
        </div>

        {/* Center: Live Queue Status Indicator */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onNavigateToQueue}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 transition-colors text-xs font-medium text-slate-700 border border-slate-200 cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Active Queue: <strong>{waitingPatients.length} Waiting</strong></span>
          </button>

          {emergencyCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold animate-pulse">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{emergencyCount} Emergency Priority</span>
            </div>
          )}
        </div>

        {/* Right: Role info & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Reset Demo Data Button */}
          <button
            onClick={onResetDemo}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200/80 cursor-pointer"
            title="Reset system to default sample data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>

          {/* Current Role Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeStyle(
                currentRole
              )}`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{currentRole || 'Guest'}</span>
            </div>

            <button
              onClick={onSwitchRole}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Switch user role"
              aria-label="Switch Role"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
