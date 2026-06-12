export type CareAgentStatus = "AVAILABLE" | "ASSIGNED" | "ON_LEAVE" | "INACTIVE";
export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface CareAgent {
    id: string;              // CareAgent Profile ID
    userId: string;          // Linked User ID
    employeeId: string;      // e.g., SAH-2026-001

    // User Account Info (usually joined from User table)
    user: {
        name: string;
        email: string;
    }

    // Professional Details
    status: CareAgentStatus;
    qualification: string;
    specialization?: string; // Changed to string (per Prisma) or keep string[] if you handle it as JSON
    experience: number;
    joinedDate: string;      // ISO Date String

    // Personal & Contact
    phone: string;
    secondaryPhone: string;
    gender: Gender;
    dateOfBirth: string;     // ISO Date String

    // Address Details
    city: string;
    ward: string;
    tole: string;
    district: string;
    longitude?: number;
    latitude?: number;

    citizenshipNo: string;
    licenseNo: string;

    createdAt: string;
    updatedAt: string;
}

export interface UpdateCareAgentDTO {
    name: string;
    phone: string;
    secondaryPhone?: string;

    gender: Gender;
    dateOfBirth: string;

    qualification: string;
    specialization?: string;
    experience: number;

    city: string;
    ward: string;
    tole: string;
    district: string;

    citizenshipNo: string;
    licenseNo?: string;

    latitude?: number;
    longitude?: number;

    status?: CareAgentStatus;
}

export interface CareAgentProfile {
    // Account
    id: string;
    userId: string;
    employeeId: string;
    status: "AVAILABLE" | "ASSIGNED" | "ON_LEAVE" | "INACTIVE";
    joinedDate: string;

    // User (flattened)
    name: string;
    email: string;
    role: string;
    accountCreatedAt: string;
    accountUpdatedAt: string;

    // Personal
    gender: "MALE" | "FEMALE" | "OTHER";
    dateOfBirth: string;
    phone: string;
    secondaryPhone: string | null;

    // Professional
    qualification: string;
    specialization: string | null;
    experience: number;

    // Documents
    citizenshipNo: string | null;
    licenseNo: string | null;

    // Location
    city: string;
    district: string | null;
    ward: string;
    tole: string;
    latitude: number | null;
    longitude: number | null;

    // Computed
    stats: {
        age: number | null;
        joinedDaysAgo: number;
        totalAssignments: number;
        activeAssignments: number;
        hasCoordinates: boolean;
        hasDocuments: boolean;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}