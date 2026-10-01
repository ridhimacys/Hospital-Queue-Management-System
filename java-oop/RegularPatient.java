package com.medqueue;

import java.time.LocalDateTime;

/**
 * RegularPatient: Represents a standard outpatient consultation.
 * Lowest priority level (Level 3).
 * Demonstrates Inheritance and Method Overriding.
 */
public class RegularPatient extends Patient {

    public RegularPatient(String id, String token, String name, int age, String gender, 
                          String phone, String department, String symptoms, LocalDateTime arrivalTime) {
        super(id, token, name, age, gender, phone, department, symptoms, arrivalTime);
    }

    @Override
    public String getPatientType() {
        return "REGULAR";
    }

    @Override
    public int getPriorityLevel() {
        return 3; // Lowest priority
    }

    @Override
    public int getEstimatedConsultationMinutes() {
        return 12; // Standard consultation duration
    }
}
