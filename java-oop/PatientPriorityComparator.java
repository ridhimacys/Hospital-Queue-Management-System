package com.medqueue;

import java.util.Comparator;

/**
 * PatientPriorityComparator: Custom comparator that guarantees hospital priority order:
 * 1. EMERGENCY (Priority Level 1) is served before URGENT (2) and REGULAR (3).
 * 2. URGENT (Priority Level 2) is served before REGULAR (3).
 * 3. TIE-BREAKER: If two patients have identical priority, the one with earlier arrival time is served first (FIFO).
 *
 * Demonstrates Java Comparator interface, Functional Programming, and Collections sorting.
 */
public class PatientPriorityComparator implements Comparator<Patient> {

    @Override
    public int compare(Patient p1, Patient p2) {
        if (p1 == null && p2 == null) return 0;
        if (p1 == null) return 1;
        if (p2 == null) return -1;

        // Compare priority levels (1 = Emergency, 2 = Urgent, 3 = Regular)
        // Lower numeric value = higher clinical priority
        int priorityComparison = Integer.compare(p1.getPriorityLevel(), p2.getPriorityLevel());
        if (priorityComparison != 0) {
            return priorityComparison;
        }

        // Tie-breaker: earlier arrival time comes first (FIFO within same tier)
        return p1.getArrivalTime().compareTo(p2.getArrivalTime());
    }
}
