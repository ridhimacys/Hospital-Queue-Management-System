package com.medqueue;

/**
 * Doctor Class: Represents a medical professional in MedQueue.
 * Demonstrates Encapsulation and Object Association.
 */
public class Doctor {
    private String id;
    private String name;
    private String department;
    private String qualification;
    private String roomNumber;
    private Patient currentPatient;

    public Doctor(String id, String name, String department, String qualification, String roomNumber) {
        this.id = id;
        this.name = name;
        this.department = department;
        this.qualification = qualification;
        this.roomNumber = roomNumber;
        this.currentPatient = null;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getDepartment() { return department; }
    public String getQualification() { return qualification; }
    public String getRoomNumber() { return roomNumber; }
    public Patient getCurrentPatient() { return currentPatient; }
    public void setCurrentPatient(Patient currentPatient) { this.currentPatient = currentPatient; }

    public boolean isAvailable() {
        return this.currentPatient == null;
    }

    @Override
    public String toString() {
        return String.format("%s (%s - %s, Room: %s)", name, department, qualification, roomNumber);
    }
}
