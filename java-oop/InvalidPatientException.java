package com.medqueue;

/**
 * Custom Checked Exception: Thrown when patient details are invalid, incomplete, or duplicate.
 * Demonstrates Exception Handling and Custom Exception Hierarchy.
 */
public class InvalidPatientException extends Exception {
    public InvalidPatientException(String message) {
        super(message);
    }

    public InvalidPatientException(String message, Throwable cause) {
        super(message, cause);
    }
}
