package com.medqueue;

/**
 * Custom Checked Exception: Thrown when a patient token or ID is searched but not found in the system.
 * Demonstrates Exception Handling.
 */
public class PatientNotFoundException extends Exception {
    public PatientNotFoundException(String message) {
        super(message);
    }

    public PatientNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
