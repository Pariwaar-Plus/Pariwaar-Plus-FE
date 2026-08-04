// ── Types ────────────────────────────────────

export interface VisitLogEntry {
  id:          string;
  scheduledAt: string;
  checkInAt:   string | null;
  checkOutAt:  string | null;
  status:      "COMPLETED" | "MISSED" | "SCHEDULED" | "CANCELLED";

  // Vitals
  bloodPressureSystolic:  number | null;
  bloodPressureDiastolic: number | null;
  pulseRate:              number | null;
  temperature:            number | null;
  oxygenSaturation:       number | null;
  weight:                 number | null;
  bloodSugar:             number | null;
  respiratoryRate:        number | null;

  // Wellbeing
  painLevel: number | null;
  mood:      string | null;

  // Clinical
  symptoms:           string | null;
  woundCondition:     string | null;
  mobilityAssessment: string | null;

  // Notes
  agentNotes: string | null;
  adminNotes: string | null;

  // Agent
  careAgentName:       string;
  careAgentEmployeeId: string;
}

export interface LatestVitals {
  bloodPressureSystolic:  number | null;
  bloodPressureDiastolic: number | null;
  pulseRate:              number | null;
  oxygenSaturation:       number | null;
  bloodSugar:             number | null;
  temperature:            number | null;
  weight:                 number | null;
  recordedAt:             string;
}

export interface ReceiverHealthData {
  id:              string;
  name:            string;
  gender:          string;
  city:            string;
  dateOfBirth:     string;
  mobilityStatus:  string;
  medicalCondition: string | null;
  assignments:     { id: string; visitFrequency: string }[];
  visitLogs:       VisitLogEntry[];
  latestVitals:    LatestVitals | null;
}

export interface ClientHealthDashboard {
  clientId:   string;
  clientName: string;
  receivers:  ReceiverHealthData[];
}


// ── API ──────────────────────────────────────

import api from "@/lib/axios";
import { handleApiError } from "@/lib/handle-api-error";

interface ApiResponse<T> {
  success: boolean;
  data:    T;
}

// Admin: fetch any client's health dashboard
export const getClientHealthDashboard = async (): Promise<ClientHealthDashboard> => {
  try {
    const response = await api.get<ApiResponse<ClientHealthDashboard>>(
      `/client/health-dashboard`
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch health dashboard");
  }
};

// Client: fetch own health dashboard
export const getMyHealthDashboard =
  async (): Promise<ClientHealthDashboard> => {
    try {
      const response = await api.get<ApiResponse<ClientHealthDashboard>>(
        "/visit-logs/dashboard/me"
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch your health dashboard");
    }
  };
