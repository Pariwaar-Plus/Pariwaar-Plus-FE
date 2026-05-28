export type UserRole = "ADMIN" | "CLIENT" | "CARE_AGENT";

export interface User {
    id: string;
    name: string;
    email: string;

    role: UserRole;

    phone?: string;

    createdAt?: string;
    updatedAt?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    user: User;
}

export interface RefreshResponse {
    accessToken: string;
    user?: User;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;

    isLoading: boolean;
    isHydrating: boolean;
    hasHydrated: boolean;

    login: (data: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
    hydrate: () => Promise<void>;
}