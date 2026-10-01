package com.medqueue;

import java.time.LocalDateTime;

/**
 * UrgentPatient: Represents patients needing prioritized medical attention.
 * Medium priority level (Level 2).
 * Demonstrates Inheritance and Method Overriding.
 */
public class UrgentPatient extends Patient {

    public UrgentPatient(String id, String token, String name, int age, String gender, 
                         String phone, String department, String symptoms, LocalDateTime arrivalTime) {
        super(id, token, name, age, gender, phone, department, symptoms, arrivalTime);
    }

    @Override
    public String getPatientType() {
        return "URGENT";
    }

    @Override
    public int getPriorityLevel() {
        return 2; // Medium priority
    }

    @Override
    public int getEstimatedConsultationMinutes() {
        return 18; // Thorough urgent evaluation
    }
}
