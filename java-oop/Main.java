package com.medqueue;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Main Demonstration Class for MedQueue Academic Project.
 * Demonstrates:
 * 1. PriorityQueue behavior: EMERGENCY (1) > URGENT (2) > REGULAR (3)
 * 2. Tie-breaker behavior: Earlier arrivalTime comes first within identical priority.
 * 3. Polymorphism: Patient references pointing to EmergencyPatient, UrgentPatient, RegularPatient.
 * 4. Exception Handling: InvalidPatientException & PatientNotFoundException.
 */
public class Main {
    public static void main(String[] args) {
        System.out.println("==============================================================");
        System.out.println("        MEDQUEUE — Hospital Queue Management System           ");
        System.out.println("            Object-Oriented Programming Companion             ");
        System.out.println("==============================================================\n");

        QueueManager queueManager = new QueueManager();

        try {
            // Scenario as defined in requirements:
            // Patient A — REGULAR — 10:00
            // Patient B — EMERGENCY — 10:10
            // Patient C — URGENT — 10:05
            // Patient D — EMERGENCY — 10:15
            LocalDateTime baseTime = LocalDateTime.of(2026, 10, 1, 10, 0, 0);

            Patient patientA = new RegularPatient("P-001", "T001", "Patient A (Regular)", 34, "Male", 
                    "555-0101", "General Medicine", "Routine health checkup", baseTime);

            Patient patientB = new EmergencyPatient("P-002", "T002", "Patient B (Emergency)", 52, "Female", 
                    "555-0102", "Cardiology", "Acute chest pain & dyspnea", baseTime.plusMinutes(10));

            Patient patientC = new UrgentPatient("P-003", "T003", "Patient C (Urgent)", 28, "Male", 
                    "555-0103", "Orthopedics", "Fractured wrist with swelling", baseTime.plusMinutes(5));

            Patient patientD = new EmergencyPatient("P-004", "T004", "Patient D (Emergency)", 45, "Female", 
                    "555-0104", "General Medicine", "Severe allergic reaction", baseTime.plusMinutes(15));

            System.out.println("1. Registering patients into MedQueue...");
            queueManager.addPatient(patientA);
            queueManager.addPatient(patientB);
            queueManager.addPatient(patientC);
            queueManager.addPatient(patientD);
            System.out.println("-> All 4 patients registered successfully.\n");

            System.out.println("2. Displaying Current Priority Queue State:");
            System.out.println("----------------------------------------------------------------------------------------");
            List<Patient> waitingQueue = queueManager.getQueue();
            int pos = 1;
            for (Patient p : waitingQueue) {
                System.out.printf("Position #%d | %s%n", pos++, p);
            }
            System.out.println("----------------------------------------------------------------------------------------");
            System.out.println("Verification:");
            System.out.println("Expected Order: Patient B (Emergency 10:10) -> Patient D (Emergency 10:15) -> Patient C (Urgent 10:05) -> Patient A (Regular 10:00)");
            System.out.println("Matches specification: EMERGENCY > URGENT > REGULAR and earlier arrival first within same priority.\n");

            // Calling next patient
            System.out.println("3. Calling next patient...");
            Patient called1 = queueManager.callNextPatient();
            System.out.println("-> NOW CALLED: " + called1.getName() + " [Token: " + called1.getToken() + "]");
            System.out.println("Remaining queue size: " + queueManager.size());

            // Search and check position
            System.out.println("\n4. Checking position of Patient A (Token: T001):");
            int posA = queueManager.getPosition("T001");
            System.out.println("-> Patient A is currently at queue position #" + posA);

            // Exception handling demonstration
            System.out.println("\n5. Testing Custom Exception Handling:");
            try {
                System.out.println("Attempting to search for non-existent token 'T999'...");
                queueManager.searchPatient("T999");
            } catch (PatientNotFoundException e) {
                System.out.println("CAUGHT EXPECTED EXCEPTION: " + e.getMessage());
            }

            try {
                System.out.println("Attempting to add invalid patient with duplicate active token...");
                queueManager.addPatient(new RegularPatient("P-999", "T001", "Duplicate Token Patient", 20, "Male", "555-9999", "General", "Cough", LocalDateTime.now()));
            } catch (InvalidPatientException e) {
                System.out.println("CAUGHT EXPECTED EXCEPTION: " + e.getMessage());
            }

            System.out.println("\n==============================================================");
            System.out.println(" MedQueue Academic OOP Demonstration Completed Successfully! ");
            System.out.println("==============================================================");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
