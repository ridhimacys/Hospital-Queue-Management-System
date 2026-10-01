package com.medqueue;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Appointment Class: Represents a scheduled consultation between a patient and a doctor.
 * Demonstrates Class Association and Encapsulation.
 */
public class Appointment {
    private String appointmentId;
    private String patientName;
    private String doctorName;
    private String department;
    private LocalDate date;
    private LocalTime time;
    private String status; // "Scheduled", "Completed", "Cancelled"

    public Appointment(String appointmentId, String patientName, String doctorName, 
                       String department, LocalDate date, LocalTime time, String status) {
        this.appointmentId = appointmentId;
        this.patientName = patientName;
        this.doctorName = doctorName;
        this.department = department;
        this.date = date;
        this.time = time;
        this.status = (status != null) ? status : "Scheduled";
    }

    public String getAppointmentId() { return appointmentId; }
    public String getPatientName() { return patientName; }
    public String getDoctorName() { return doctorName; }
    public String getDepartment() { return department; }
    public LocalDate getDate() { return date; }
    public LocalTime getTime() { return time; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    @Override
    public String toString() {
        return String.format("[%s] Patient: %s | Doctor: %s (%s) | %s at %s | Status: %s",
                appointmentId, patientName, doctorName, department, date, time, status);
    }
}
