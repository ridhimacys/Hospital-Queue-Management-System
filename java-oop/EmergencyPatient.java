package com.medqueue;

import java.time.LocalDateTime;

/**
 * EmergencyPatient: Represents critical, life-threatening, or emergency conditions.
 * Highest priority level (Level 1).
 * Always jumps to the front of the queue ahead of Urgent and Regular patients.
 * Demonstrates Inheritance and Method Overriding.
 */
public class EmergencyPatient extends Patient {

    public EmergencyPatient(String id, String token, String name, int age, String gender, 
                            String phone, String department, String symptoms, LocalDateTime arrivalTime) {
        super(id, token, name, age, gender, phone, department, symptoms, arrivalTime);
    }

    @Override
    public String getPatientType() {
        return "EMERGENCY";
    }

    @Override
    public int getPriorityLevel() {
        return 1; // Highest priority!
    }

    @Override
    public int getEstimatedConsultationMinutes() {
        return 25; // Immediate intensive care triage
    }
}
