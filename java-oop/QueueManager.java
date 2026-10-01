package com.medqueue;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.PriorityQueue;

/**
 * QueueManager: Implements QueueOperations using Java Collections PriorityQueue.
 * Demonstrates:
 * 1. Interfaces and Implementation
 * 2. Java Collections Framework (PriorityQueue, ArrayList)
 * 3. Comparator integration for priority ordering
 * 4. Exception Handling
 */
public class QueueManager implements QueueOperations {
    private final PriorityQueue<Patient> priorityQueue;
    private final List<Patient> allPatients;

    public QueueManager() {
        // PriorityQueue backed by PatientPriorityComparator
        this.priorityQueue = new PriorityQueue<>(new PatientPriorityComparator());
        this.allPatients = new ArrayList<>();
    }

    @Override
    public synchronized void addPatient(Patient patient) throws InvalidPatientException {
        if (patient == null) {
            throw new InvalidPatientException("Cannot admit null patient into queue.");
        }
        if (patient.getToken() == null || patient.getToken().trim().isEmpty()) {
            throw new InvalidPatientException("Patient token is missing.");
        }

        // Check for duplicate token among active patients
        for (Patient p : allPatients) {
            if (p.getToken().equalsIgnoreCase(patient.getToken()) && 
               !"COMPLETED".equalsIgnoreCase(p.getStatus()) &&
               !"CANCELLED".equalsIgnoreCase(p.getStatus())) {
                throw new InvalidPatientException("Active patient with token " + patient.getToken() + " already exists.");
            }
        }

        patient.setStatus("WAITING");
        priorityQueue.offer(patient);
        allPatients.add(patient);
    }

    @Override
    public synchronized Patient removePatient(String token) throws PatientNotFoundException {
        Patient target = null;
        for (Patient p : priorityQueue) {
            if (p.getToken().equalsIgnoreCase(token)) {
                target = p;
                break;
            }
        }
        if (target == null) {
            throw new PatientNotFoundException("Patient with token " + token + " is not in the waiting queue.");
        }

        priorityQueue.remove(target);
        target.setStatus("CANCELLED");
        return target;
    }

    @Override
    public synchronized Patient callNextPatient() {
        if (priorityQueue.isEmpty()) {
            return null;
        }
        Patient next = priorityQueue.poll();
        if (next != null) {
            next.setStatus("CALLED");
        }
        return next;
    }

    @Override
    public synchronized Patient peekNextPatient() {
        return priorityQueue.peek();
    }

    /**
     * Returns a sorted snapshot copy of all waiting patients according to priority and arrival.
     */
    @Override
    public synchronized List<Patient> getQueue() {
        List<Patient> snapshot = new ArrayList<>(priorityQueue);
        Collections.sort(snapshot, new PatientPriorityComparator());
        return snapshot;
    }

    @Override
    public synchronized int getPosition(String token) throws PatientNotFoundException {
        List<Patient> sortedQueue = getQueue();
        for (int i = 0; i < sortedQueue.size(); i++) {
            if (sortedQueue.get(i).getToken().equalsIgnoreCase(token)) {
                return i + 1; // 1-indexed position
            }
        }
        throw new PatientNotFoundException("Patient with token " + token + " was not found in active waiting queue.");
    }

    @Override
    public synchronized Patient searchPatient(String query) throws PatientNotFoundException {
        if (query == null || query.trim().isEmpty()) {
            throw new PatientNotFoundException("Search query cannot be empty.");
        }
        String cleanQuery = query.trim().toLowerCase();

        for (Patient p : allPatients) {
            if (p.getToken().toLowerCase().contains(cleanQuery) ||
                p.getId().toLowerCase().contains(cleanQuery) ||
                p.getName().toLowerCase().contains(cleanQuery)) {
                return p;
            }
        }
        throw new PatientNotFoundException("No patient matching query: '" + query + "'");
    }

    @Override
    public int size() {
        return priorityQueue.size();
    }

    @Override
    public boolean isEmpty() {
        return priorityQueue.isEmpty();
    }

    @Override
    public synchronized void clear() {
        priorityQueue.clear();
        allPatients.clear();
    }

    public List<Patient> getAllPatients() {
        return new ArrayList<>(allPatients);
    }
}
