package com.medqueue;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Abstract Base Class: Patient
 * Demonstrates:
 * 1. Abstraction - declares common attributes and abstract method getPriorityLevel()
 * 2. Encapsulation - private fields with public getters and setters
 * 3. Inheritance - base class for RegularPatient, UrgentPatient, EmergencyPatient
 */
public abstract class Patient implements Comparable<Patient> {
    private String id;
    private String token;
    private String name;
    private int age;
    private String gender;
    private String phone;
    private String department;
    private String symptoms;
    private String status; // WAITING, CALLED, IN_CONSULTATION, COMPLETED, SKIPPED, CANCELLED
    private LocalDateTime arrivalTime;

    // Standard constructor
    public Patient(String id, String token, String name, int age, String gender, 
                   String phone, String department, String symptoms, LocalDateTime arrivalTime) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Patient name cannot be null or empty.");
        }
        if (age < 0 || age > 130) {
            throw new IllegalArgumentException("Invalid age specified: " + age);
        }
        this.id = id;
        this.token = token;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.phone = phone;
        this.department = department;
        this.symptoms = symptoms;
        this.status = "WAITING";
        this.arrivalTime = (arrivalTime != null) ? arrivalTime : LocalDateTime.now();
    }

    // Abstract methods demonstrating Polymorphism
    public abstract String getPatientType(); // "EMERGENCY", "URGENT", or "REGULAR"
    public abstract int getPriorityLevel();  // 1 = Emergency, 2 = Urgent, 3 = Regular
    public abstract int getEstimatedConsultationMinutes();

    // Default natural ordering based on Priority first, then arrival time
    @Override
    public int compareTo(Patient other) {
        if (this.getPriorityLevel() != other.getPriorityLevel()) {
            return Integer.compare(this.getPriorityLevel(), other.getPriorityLevel());
        }
        return this.arrivalTime.compareTo(other.arrivalTime);
    }

    // Encapsulated Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(LocalDateTime arrivalTime) { this.arrivalTime = arrivalTime; }

    public String getFormattedArrivalTime() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");
        return this.arrivalTime.format(formatter);
    }

    @Override
    public String toString() {
        return String.format("[%s] Token: %-5s | %-16s | Priority: %-10s (Level %d) | Dept: %-15s | Status: %s | Arrived: %s",
                id, token, name, getPatientType(), getPriorityLevel(), department, status, getFormattedArrivalTime());
    }
}
