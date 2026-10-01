package com.medqueue;

import java.util.List;

/**
 * QueueOperations Interface: Defines contracts for managing the hospital queue.
 * Demonstrates Abstraction and Interface Segregation.
 */
public interface QueueOperations {
    void addPatient(Patient patient) throws InvalidPatientException;
    Patient removePatient(String token) throws PatientNotFoundException;
    Patient callNextPatient();
    Patient peekNextPatient();
    List<Patient> getQueue();
    int getPosition(String token) throws PatientNotFoundException;
    Patient searchPatient(String query) throws PatientNotFoundException;
    int size();
    boolean isEmpty();
    void clear();
}
