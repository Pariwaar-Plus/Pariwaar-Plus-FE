import { CareAgent } from "@/features/sahara-staff/types/sahara-staff.type";
import { CareAssignment } from "@/features/care-assignment/types/care-assignment.type";

export type VisitStatus =
    | "SCHEDULED"
    | "COMPLETED"
    | "MISSED"
    | "CANCELLED";

export type Mood =
    | "HAPPY"
    | "CALM"
    | "ANXIOUS"
    | "CONFUSED"
    | "AGITATED"
    | "DEPRESSED";

export type WoundCondition =
    | "HEALING"
    | "STABLE"
    | "WORSENING"
    | "INFECTED"
    | "NOT_APPLICABLE";

export type MobilityStatus =
    | "INDEPENDENT"
    | "ASSISTED"
    | "WHEELCHAIR"
    | "BEDRIDDEN";

export interface VisitLog {
    id:           string;
    assignmentId: string;
    careAgentId:  string;

    // Joined relations (when included)
    careAgent?:   CareAgent;
    assignment?:  CareAssignment;

    // ── Timing ──
    scheduledAt: string;
    checkInAt:   string | null;
    checkOutAt:  string | null;

    // ── Status ──
    status:             VisitStatus;
    cancellationReason: string | null;

    // ── Vitals ──
    bloodPressureSystolic:  number | null;
    bloodPressureDiastolic: number | null;
    pulseRate:              number | null;
    temperature:            number | null;
    oxygenSaturation:       number | null;
    weight:                 number | null;
    bloodSugar:             number | null;
    respiratoryRate:        number | null;

    // ── Pain & Wellbeing ──
    painLevel: number | null;
    mood:      Mood | null;

    // ── Medications ──
    medicationsGiven:   string | null;
    medicationsSkipped: string | null;

    // ── Clinical ──
    symptoms:       string | null;
    woundCare:      string | null;
    woundCondition: WoundCondition | null;

    // ── Mobility ──
    mobilityAssessment: MobilityStatus | null;
    mobilityNotes:      string | null;

    // ── Notes ──
    agentNotes: string | null;
    adminNotes: string | null;

    // ── Meta ──
    createdBy: string;
    updatedBy: string | null;
    createdAt: string;
    updatedAt: string;
}