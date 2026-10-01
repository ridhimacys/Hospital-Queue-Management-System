import React from 'react';
import { ViewTab, UserRole } from '../../types';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  ListOrdered,
  Stethoscope,
  CalendarDays,
  Search,
  Code2,
  Info,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';

interface SidebarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole | null;
  waitingCount: number;
  totalPatientsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  currentRole,
  waitingCount,
  totalPatientsCount,
}) => {
  const navItems: Array<{
    id: ViewTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    badgeColor?: string;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'patients',
      label: 'Patients',
      icon: Users,
      badge: totalPatientsCount,
      badgeColor: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'register',
      label: 'Register Patient',
      icon: UserPlus,
    },
    {
      id: 'queue',
      label: 'Queue Management',
      icon: ListOrdered,
      badge: waitingCount > 0 ? waitingCount : undefined,
      badgeColor: 'bg-blue-100 text-blue-700 font-bold',
    },
    {
      id: 'doctor-dashboard',
      label: 'Doctor Dashboard',
      icon: Stethoscope,
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: CalendarDays,
    },
    {
      id: 'patient-status',
      label: 'Patient Status',
      icon: Search,
    },
    {
      id: 'oop-concepts',
      label: 'OOP Concepts',
      icon: Code2,
      badge: 'Java',
      badgeColor: 'bg-amber-100 text-amber-800 font-semibold',
    },
    {
      id: 'about',
      label: 'About',
      icon: Info,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 left-0 z-40 h-full lg:h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 lg:hidden">
          <div className="font-bold text-slate-900 text-sm">Navigation Menu</div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Hospital Operations
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-blue-50/80 text-blue-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        item.badgeColor || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-500" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom role card */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              {currentRole ? currentRole[0] : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">
                {currentRole ? `${currentRole} View` : 'Logged In'}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Session
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
