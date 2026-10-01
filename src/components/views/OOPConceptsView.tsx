import React, { useState } from 'react';
import { 
  Code2, 
  Layers, 
  ShieldCheck, 
  GitFork, 
  Sparkles, 
  Cpu, 
  FileCode, 
  Terminal, 
  CheckCircle2, 
  BookOpen, 
  Copy, 
  Check 
} from 'lucide-react';

interface Concept {
  id: string;
  title: string;
  category: 'Core OOP' | 'Collections & Generics' | 'Error Handling';
  summary: string;
  hospitalExample: string;
  codeSnippet: string;
}

export const OOPConceptsView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string>('PatientPriorityComparator.java');
  const [copied, setCopied] = useState(false);

  const concepts: Concept[] = [
    {
      id: 'classes-objects',
      title: '1. Classes and Objects',
      category: 'Core OOP',
      summary: 'A class serves as a blueprint defining state and behavior, while an object is a distinct instance allocated in heap memory.',
      hospitalExample: 'Patient, Doctor, and Appointment are classes. Specific patients like "Ramesh Patel (Token T001)" and "Dr. Arjun Mehta" are instantiated objects.',
      codeSnippet: `// Blueprint: Class definition
public abstract class Patient {
    private String token;
    private String name;
    // ...
}

// Object Instantiation in Main.java:
Patient p1 = new RegularPatient("P-001", "T001", "Ramesh Patel", 58, ...);`,
    },
    {
      id: 'encapsulation',
      title: '2. Encapsulation',
      category: 'Core OOP',
      summary: 'Bundling state (data) and behavior into a single unit, hiding private internal state behind controlled public getters, setters, and validation guards.',
      hospitalExample: 'Fields such as id, token, name, and age are declared private in Patient.java. Getters and setters validate input preventing negative ages or null names.',
      codeSnippet: `public abstract class Patient {
    private String token; // Hidden internal state
    private int age;

    public void setAge(int age) {
        if (age < 0 || age > 130) {
            throw new IllegalArgumentException("Invalid age specified.");
        }
        this.age = age;
    }

    public int getAge() { return this.age; }
}`,
    },
    {
      id: 'inheritance',
      title: '3. Inheritance',
      category: 'Core OOP',
      summary: 'Mechanism where specialized child classes acquire common fields and methods from a parent base class using the "extends" keyword.',
      hospitalExample: 'EmergencyPatient, UrgentPatient, and RegularPatient all inherit from the common base class Patient. They reuse common fields like name and arrivalTime.',
      codeSnippet: `// Base parent class
public abstract class Patient { ... }

// Subclasses inheriting from Patient:
public class EmergencyPatient extends Patient { ... }
public class UrgentPatient extends Patient { ... }
public class RegularPatient extends Patient { ... }`,
    },
    {
      id: 'polymorphism',
      title: '4. Polymorphism',
      category: 'Core OOP',
      summary: '"Many forms" — allows treating derived objects through their superclass reference while dynamically executing overridden subclass methods at runtime.',
      hospitalExample: 'QueueManager stores all patients generically as PriorityQueue<Patient>. When calling getPriorityLevel(), the JVM executes the specific subclass override.',
      codeSnippet: `// Polymorphic references:
Patient p1 = new EmergencyPatient("P-1", "T001", "Ramesh", ...);
Patient p2 = new RegularPatient("P-2", "T002", "Aarav", ...);

// Dynamic method dispatch at runtime:
int priority = p1.getPriorityLevel(); // Returns 1 (Emergency)
int priority2 = p2.getPriorityLevel(); // Returns 3 (Regular)`,
    },
    {
      id: 'abstraction',
      title: '5. Abstraction',
      category: 'Core OOP',
      summary: 'Hiding internal implementation complexity and exposing only essential interfaces and abstract contracts to external callers.',
      hospitalExample: 'QueueOperations is an interface defining contracts (addPatient, removePatient, callNextPatient). QueueManager implements this using a PriorityQueue.',
      codeSnippet: `// Abstract Contract (Interface)
public interface QueueOperations {
    void addPatient(Patient patient) throws InvalidPatientException;
    Patient callNextPatient();
    List<Patient> getQueue();
}

public class QueueManager implements QueueOperations {
    // Hidden priority heap details
}`,
    },
    {
      id: 'constructors',
      title: '6. Constructors & super()',
      category: 'Core OOP',
      summary: 'Special initialization routines called during object instantiation. Child classes delegate common property initialization to parent using super().',
      hospitalExample: 'EmergencyPatient constructor calls super(id, token, name, age, gender, phone, department, symptoms, arrivalTime) to initialize common Patient fields.',
      codeSnippet: `public class EmergencyPatient extends Patient {
    public EmergencyPatient(String id, String token, String name, int age, ...) {
        // Explicit constructor chaining to parent class
        super(id, token, name, age, gender, phone, department, symptoms, arrivalTime);
    }
}`,
    },
    {
      id: 'method-overriding',
      title: '7. Method Overriding',
      category: 'Core OOP',
      summary: 'A subclass provides a specific implementation of a method already declared in its parent class, marked with the @Override annotation.',
      hospitalExample: 'Each patient subtype overrides getPriorityLevel() (Emergency = 1, Urgent = 2, Regular = 3) and getEstimatedConsultationMinutes().',
      codeSnippet: `// Overridden in EmergencyPatient:
@Override
public int getPriorityLevel() {
    return 1; // Highest triage priority
}

// Overridden in RegularPatient:
@Override
public int getPriorityLevel() {
    return 3; // Standard triage priority
}`,
    },
    {
      id: 'java-collections',
      title: '8. Java Collections Framework',
      category: 'Collections & Generics',
      summary: 'Unified architecture representing and manipulating groups of objects (List, Queue, Map) with type-safe Generics.',
      hospitalExample: 'QueueManager uses PriorityQueue<Patient> for waiting lines, ArrayList<Patient> for audit logging, and Collections.sort() for snapshots.',
      codeSnippet: `import java.util.PriorityQueue;
import java.util.ArrayList;
import java.util.List;

private final PriorityQueue<Patient> priorityQueue;
private final List<Patient> allPatients = new ArrayList<>();`,
    },
    {
      id: 'priority-queue',
      title: '9. PriorityQueue<E>',
      category: 'Collections & Generics',
      summary: 'An unbounded priority heap where head elements are ordered according to natural Comparable order or a custom Comparator.',
      hospitalExample: 'The hospital waiting room uses java.util.PriorityQueue to ensure critical patients are always served before routine consultations regardless of arrival.',
      codeSnippet: `// Instantiated with custom Comparator:
this.priorityQueue = new PriorityQueue<>(new PatientPriorityComparator());

// Insertion: O(log n)
priorityQueue.offer(emergencyPatient);

// Extraction of highest priority patient: O(log n)
Patient next = priorityQueue.poll();`,
    },
    {
      id: 'comparator',
      title: '10. Comparator Interface',
      category: 'Collections & Generics',
      summary: 'Implements custom comparison strategy comparing two objects: return negative if obj1 < obj2, 0 if equal, and positive if obj1 > obj2.',
      hospitalExample: 'PatientPriorityComparator enforces: Level 1 (Emergency) < Level 2 (Urgent) < Level 3 (Regular). If priorities tie, earlier arrivalTime wins.',
      codeSnippet: `public class PatientPriorityComparator implements Comparator<Patient> {
    @Override
    public int compare(Patient p1, Patient p2) {
        // Compare priority (1=Emergency, 2=Urgent, 3=Regular)
        int priorityCmp = Integer.compare(p1.getPriorityLevel(), p2.getPriorityLevel());
        if (priorityCmp != 0) return priorityCmp;

        // Tie-breaker: earlier arrival comes first (FIFO within tier)
        return p1.getArrivalTime().compareTo(p2.getArrivalTime());
    }
}`,
    },
    {
      id: 'exception-handling',
      title: '11. Exception Handling',
      category: 'Error Handling',
      summary: 'Structured mechanism for intercepting and handling anomalous runtime situations using try, catch, throw, and custom checked Exception classes.',
      hospitalExample: 'InvalidPatientException is thrown when attempting to add duplicate active tokens. PatientNotFoundException is thrown during failed token searches.',
      codeSnippet: `public class InvalidPatientException extends Exception {
    public InvalidPatientException(String message) { super(message); }
}

try {
    queueManager.addPatient(patient);
} catch (InvalidPatientException e) {
    System.err.println("Admission error: " + e.getMessage());
}`,
    },
  ];

  const javaFiles: Record<string, string> = {
    'PatientPriorityComparator.java': `package com.medqueue;

import java.util.Comparator;

/**
 * PatientPriorityComparator: Custom comparator that guarantees hospital priority order:
 * 1. EMERGENCY (Priority Level 1) is served before URGENT (2) and REGULAR (3).
 * 2. URGENT (Priority Level 2) is served before REGULAR (3).
 * 3. TIE-BREAKER: If two patients have identical priority, the one with earlier arrival time is served first.
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
}`,
    'Patient.java': `package com.medqueue;

import java.time.LocalDateTime;

/**
 * Abstract Base Class: Patient
 * Demonstrates Abstraction, Encapsulation, and Inheritance.
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
    private String status; // WAITING, CALLED, IN_CONSULTATION, COMPLETED
    private LocalDateTime arrivalTime;

    public Patient(String id, String token, String name, int age, String gender, 
                   String phone, String department, String symptoms, LocalDateTime arrivalTime) {
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

    public abstract String getPatientType();
    public abstract int getPriorityLevel(); // 1 = Emergency, 2 = Urgent, 3 = Regular

    @Override
    public int compareTo(Patient other) {
        if (this.getPriorityLevel() != other.getPriorityLevel()) {
            return Integer.compare(this.getPriorityLevel(), other.getPriorityLevel());
        }
        return this.arrivalTime.compareTo(other.arrivalTime);
    }

    // Encapsulated getters & setters...
}`,
    'EmergencyPatient.java': `package com.medqueue;

import java.time.LocalDateTime;

/**
 * EmergencyPatient: Highest clinical priority (Level 1).
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
        return 25;
    }
}`,
    'QueueManager.java': `package com.medqueue;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.PriorityQueue;

/**
 * QueueManager: Implements QueueOperations using Java PriorityQueue.
 * Demonstrates Collections, Interfaces, and Exception Handling.
 */
public class QueueManager implements QueueOperations {
    private final PriorityQueue<Patient> priorityQueue;
    private final List<Patient> allPatients;

    public QueueManager() {
        // PriorityQueue initialized with custom comparator
        this.priorityQueue = new PriorityQueue<>(new PatientPriorityComparator());
        this.allPatients = new ArrayList<>();
    }

    @Override
    public synchronized void addPatient(Patient patient) throws InvalidPatientException {
        if (patient == null) throw new InvalidPatientException("Cannot admit null patient.");
        patient.setStatus("WAITING");
        priorityQueue.offer(patient);
        allPatients.add(patient);
    }

    @Override
    public synchronized Patient callNextPatient() {
        if (priorityQueue.isEmpty()) return null;
        Patient next = priorityQueue.poll();
        if (next != null) next.setStatus("CALLED");
        return next;
    }

    @Override
    public synchronized List<Patient> getQueue() {
        List<Patient> snapshot = new ArrayList<>(priorityQueue);
        Collections.sort(snapshot, new PatientPriorityComparator());
        return snapshot;
    }
}`,
    'Main.java': `package com.medqueue;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Main Demonstration of MedQueue OOP Companion.
 */
public class Main {
    public static void main(String[] args) {
        QueueManager queue = new QueueManager();

        LocalDateTime base = LocalDateTime.now();
        // Priority Demonstration:
        // Patient A — REGULAR — 10:00
        // Patient B — EMERGENCY — 10:10
        // Patient C — URGENT — 10:05
        // Patient D — EMERGENCY — 10:15
        try {
            queue.addPatient(new RegularPatient("P-1", "T001", "Patient A", 34, "M", "555", "Medicine", "Checkup", base));
            queue.addPatient(new EmergencyPatient("P-2", "T002", "Patient B", 52, "F", "555", "Cardio", "Chest pain", base.plusMinutes(10)));
            queue.addPatient(new UrgentPatient("P-3", "T003", "Patient C", 28, "M", "555", "Ortho", "Fracture", base.plusMinutes(5)));
            queue.addPatient(new EmergencyPatient("P-4", "T004", "Patient D", 45, "F", "555", "Medicine", "Allergy", base.plusMinutes(15)));

            // Result: B (10:10) -> D (10:15) -> C (10:05) -> A (10:00)
            List<Patient> order = queue.getQueue();
            for (Patient p : order) {
                System.out.println(p);
            }
        } catch (InvalidPatientException e) {
            e.printStackTrace();
        }
    }
}`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(javaFiles[selectedFile] || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header with Academic Disclaimer */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200 mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Academic Project viva & Review Guide</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Object-Oriented Programming (OOP) Architecture
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          This system bridges software engineering principles and data structures. The <strong>React web interface</strong> acts as an interactive prototype, while the companion <strong>Java OOP codebase (`/java-oop/`)</strong> formally models the core object hierarchy, priority comparator, and collection algorithms.
        </p>
      </div>

      {/* Notice Card: Architecture Clarification */}
      <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Academic Note for Viva Reviewers:</strong> The browser application implements the exact priority queue logic in TypeScript for local demonstration. Simultaneously, a full 12-file academic Java solution resides in the <code className="bg-blue-200/80 px-1 py-0.5 rounded font-mono font-bold">/java-oop/</code> folder, fully demonstrating <em>PriorityQueue&lt;Patient&gt;</em>, inheritance, polymorphism, and custom exception handling.
        </div>
      </div>

      {/* Interactive Java Code Viewer */}
      <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-800">
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Java OOP Companion Code Viewer
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
              {Object.keys(javaFiles).map((fileName) => (
                <button
                  key={fileName}
                  onClick={() => setSelectedFile(fileName)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                    selectedFile === fileName
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {fileName}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopy}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Copy code to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="p-5 overflow-x-auto max-h-[380px] font-mono text-xs text-slate-200 leading-relaxed bg-slate-900">
          <pre>{javaFiles[selectedFile]}</pre>
        </div>
      </div>

      {/* 11 OOP Concepts Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">
          11 Core OOP & Java Collections Concepts Demonstrated
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {concepts.map((concept) => (
            <div
              key={concept.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-blue-400 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {concept.category}
                  </span>
                  <Code2 className="w-4 h-4 text-blue-500" />
                </div>

                <h3 className="text-base font-extrabold text-slate-900">{concept.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{concept.summary}</p>

                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="font-bold text-slate-700 block mb-0.5">In MedQueue:</span>
                  <span className="text-slate-600 leading-relaxed">{concept.hospitalExample}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <pre className="p-3 rounded-lg bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto">
                  {concept.codeSnippet}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
