/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Patient, 
  Appointment, 
  UserRole, 
  ViewTab, 
  ToastMessage, 
  AppointmentStatus 
} from './types';
import { storage } from './utils/storage';
import { getSortedWaitingQueue } from './utils/queueManager';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/common/Toast';
import { ConfirmationModal } from './components/common/Modal';
import { PatientDetailModal } from './components/modals/PatientDetailModal';

// Views
import { LandingPage } from './components/views/LandingPage';
import { DashboardView } from './components/views/DashboardView';
import { PatientsView } from './components/views/PatientsView';
import { RegisterPatientView } from './components/views/RegisterPatientView';
import { QueueManagementView } from './components/views/QueueManagementView';
import { DoctorDashboardView } from './components/views/DoctorDashboardView';
import { AppointmentsView } from './components/views/AppointmentsView';
import { PatientStatusView } from './components/views/PatientStatusView';
import { OOPConceptsView } from './components/views/OOPConceptsView';
import { AboutView } from './components/views/AboutView';

export default function App() {
  // Primary state backed by localStorage
  const [patients, setPatients] = useState<Patient[]>(() => storage.getPatients());
  const [appointments, setAppointments] = useState<Appointment[]>(() => storage.getAppointments());
  const [currentRole, setCurrentRole] = useState<UserRole | null>(() => storage.getRole());
  const [currentTab, setCurrentTab] = useState<ViewTab>('dashboard');

  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    variant?: 'danger' | 'warning' | 'primary';
    onConfirm: () => void;
  } | null>(null);

  // Toast dispatch helper
  const addToast = (type: 'success' | 'info' | 'warning' | 'error', message: string, title?: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, message, title }]);

    // Auto-dismiss after 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Synchronize state changes to localStorage
  const updatePatients = (newPatients: Patient[]) => {
    setPatients(newPatients);
    storage.savePatients(newPatients);
  };

  const updateAppointments = (newAppointments: Appointment[]) => {
    setAppointments(newAppointments);
    storage.saveAppointments(newAppointments);
  };

  // Role selection
  const handleSelectRole = (role: UserRole) => {
    setCurrentRole(role);
    storage.saveRole(role);

    // Contextual initial landing tab based on role
    if (role === 'Patient') {
      setCurrentTab('patient-status');
    } else if (role === 'Doctor') {
      setCurrentTab('doctor-dashboard');
    } else {
      setCurrentTab('dashboard');
    }

    addToast('info', `Signed in as ${role}. You can switch roles anytime from the top bar.`, 'Role Switched');
  };

  const handleSwitchRole = () => {
    setCurrentRole(null);
    storage.saveRole(null);
  };

  // Patient Registration
  const handleRegisterPatient = (newPatient: Patient) => {
    const updated = [newPatient, ...patients];
    updatePatients(updated);
    addToast(
      'success',
      `Token ${newPatient.token} generated for ${newPatient.name} (${newPatient.priority} Priority). Added to queue.`,
      'Patient Registered'
    );
  };

  // Consultation Lifecycle Actions
  const handleCallPatient = (patient: Patient) => {
    const updated = patients.map((p) => {
      if (p.id === patient.id) {
        return {
          ...p,
          status: 'CALLED' as const,
          calledAt: new Date().toISOString(),
        };
      }
      return p;
    });

    updatePatients(updated);
    addToast(
      'info',
      `Patient ${patient.token} (${patient.name}) is now called to OPD cabin.`,
      'Patient Called'
    );

    // Also update viewing patient if open
    if (viewingPatient?.id === patient.id) {
      setViewingPatient({ ...patient, status: 'CALLED' });
    }
  };

  const handleStartConsultation = (patient: Patient) => {
    const updated = patients.map((p) => {
      if (p.id === patient.id) {
        return {
          ...p,
          status: 'IN_CONSULTATION' as const,
        };
      }
      return p;
    });

    updatePatients(updated);
    addToast(
      'success',
      `Consultation started for Patient ${patient.token} (${patient.name}).`,
      'Consultation Started'
    );

    if (viewingPatient?.id === patient.id) {
      setViewingPatient({ ...patient, status: 'IN_CONSULTATION' });
    }
  };

  const handleCompleteConsultation = (patient: Patient, notes?: string) => {
    const updated = patients.map((p) => {
      if (p.id === patient.id) {
        return {
          ...p,
          status: 'COMPLETED' as const,
          completedAt: new Date().toISOString(),
          notes: notes || p.notes,
        };
      }
      return p;
    });

    updatePatients(updated);
    addToast(
      'success',
      `Consultation finished for Patient ${patient.token}. Record archived.`,
      'Consultation Completed'
    );

    if (viewingPatient?.id === patient.id) {
      setViewingPatient({ ...patient, status: 'COMPLETED', notes: notes || patient.notes });
    }
  };

  const handleSkipPatient = (patient: Patient) => {
    setConfirmModal({
      isOpen: true,
      title: `Skip Patient ${patient.token}?`,
      message: `Patient ${patient.name} (${patient.token}) will be marked as SKIPPED and removed from active priority dispatch. You can recall them later if they return.`,
      confirmLabel: 'Skip Patient',
      variant: 'warning',
      onConfirm: () => {
        const updated = patients.map((p) =>
          p.id === patient.id ? { ...p, status: 'SKIPPED' as const } : p
        );
        updatePatients(updated);
        setConfirmModal(null);
        addToast('warning', `Patient ${patient.token} marked as Skipped.`, 'Patient Skipped');
      },
    });
  };

  const handleCancelPatient = (patient: Patient) => {
    setConfirmModal({
      isOpen: true,
      title: `Cancel Patient ${patient.token}?`,
      message: `Are you sure you want to cancel the registration for ${patient.name} (${patient.token})? This action removes them from the waiting queue.`,
      confirmLabel: 'Cancel Patient',
      variant: 'danger',
      onConfirm: () => {
        const updated = patients.map((p) =>
          p.id === patient.id ? { ...p, status: 'CANCELLED' as const } : p
        );
        updatePatients(updated);
        setConfirmModal(null);
        addToast('error', `Patient ${patient.token} cancelled.`, 'Patient Cancelled');
      },
    });
  };

  // Reset Demo Data
  const handleResetDemoData = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset Demo Data to Default?',
      message: 'This will restore the original ~10 sample patients with varied emergency and regular priorities, reset appointments, and refresh all queue statistics.',
      confirmLabel: 'Reset Everything',
      variant: 'warning',
      onConfirm: () => {
        const { patients: resetP, appointments: resetA } = storage.resetToDemoData();
        setPatients(resetP);
        setAppointments(resetA);
        setConfirmModal(null);
        addToast('info', 'Demo data successfully reset to initial factory state.', 'Demo Reset');
      },
    });
  };

  // Appointment actions
  const handleUpdateAppointmentStatus = (id: string, newStatus: AppointmentStatus) => {
    const updated = appointments.map((apt) =>
      apt.id === id ? { ...apt, status: newStatus } : apt
    );
    updateAppointments(updated);
    addToast('success', `Appointment ${id} marked as ${newStatus}.`, 'Appointment Updated');
  };

  const handleAddAppointment = (newApt: Appointment) => {
    const updated = [newApt, ...appointments];
    updateAppointments(updated);
    addToast('success', `Appointment booked for ${newApt.patientName} with ${newApt.doctorName}.`, 'Appointment Scheduled');
  };

  // If user hasn't selected a role, display the Landing / Role Selection screen
  if (!currentRole) {
    return (
      <div className="font-sans antialiased text-slate-800 bg-slate-50 min-h-screen">
        <LandingPage onSelectRole={handleSelectRole} />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </div>
    );
  }

  const waitingQueue = getSortedWaitingQueue(patients);

  return (
    <div className="font-sans antialiased text-slate-800 bg-slate-50 min-h-screen flex flex-col">
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onSwitchRole={handleSwitchRole}
        onResetDemo={handleResetDemoData}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        patients={patients}
        onNavigateToQueue={() => setCurrentTab('queue')}
      />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          currentRole={currentRole}
          waitingCount={waitingQueue.length}
          totalPatientsCount={patients.length}
        />

        {/* Main Workspace Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              patients={patients}
              appointments={appointments}
              onNavigate={setCurrentTab}
              onCallPatient={handleCallPatient}
              onViewPatient={setViewingPatient}
            />
          )}

          {currentTab === 'patients' && (
            <PatientsView
              patients={patients}
              onCallPatient={handleCallPatient}
              onStartConsultation={handleStartConsultation}
              onCompleteConsultation={handleCompleteConsultation}
              onSkipPatient={handleSkipPatient}
              onCancelPatient={handleCancelPatient}
              onViewPatient={setViewingPatient}
              onNavigateToRegister={() => setCurrentTab('register')}
            />
          )}

          {currentTab === 'register' && (
            <RegisterPatientView
              patients={patients}
              onRegister={handleRegisterPatient}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'queue' && (
            <QueueManagementView
              patients={patients}
              onCallPatient={handleCallPatient}
              onStartConsultation={handleStartConsultation}
              onCompleteConsultation={handleCompleteConsultation}
              onSkipPatient={handleSkipPatient}
              onCancelPatient={handleCancelPatient}
              onViewPatient={setViewingPatient}
            />
          )}

          {currentTab === 'doctor-dashboard' && (
            <DoctorDashboardView
              patients={patients}
              appointments={appointments}
              onCallPatient={handleCallPatient}
              onStartConsultation={handleStartConsultation}
              onCompleteConsultation={handleCompleteConsultation}
              onViewPatient={setViewingPatient}
            />
          )}

          {currentTab === 'appointments' && (
            <AppointmentsView
              appointments={appointments}
              onUpdateStatus={handleUpdateAppointmentStatus}
              onAddAppointment={handleAddAppointment}
            />
          )}

          {currentTab === 'patient-status' && (
            <PatientStatusView patients={patients} />
          )}

          {currentTab === 'oop-concepts' && <OOPConceptsView />}

          {currentTab === 'about' && <AboutView />}
        </main>
      </div>

      {/* Global Confirmation Dialog */}
      {confirmModal && (
        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmLabel={confirmModal.confirmLabel}
          variant={confirmModal.variant}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}

      {/* Global Patient Detail Dossier Modal */}
      <PatientDetailModal
        patient={viewingPatient}
        isOpen={Boolean(viewingPatient)}
        onClose={() => setViewingPatient(null)}
        allPatients={patients}
        onCallPatient={handleCallPatient}
        onStartConsultation={handleStartConsultation}
        onCompleteConsultation={handleCompleteConsultation}
      />

      {/* Non-intrusive Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
