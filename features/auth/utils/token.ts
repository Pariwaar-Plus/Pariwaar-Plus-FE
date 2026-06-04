const ACCESS_TOKEN_KEY = "access_token";

/**
 * Save access token to localStorage
 */
export const setAccessToken = (token: string): void => {
    // if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

/**
 * Get access token from localStorage
 */
export const getAccessToken = (): string | null => {
    // if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Remove access token (logout)
 */
export const clearAccessToken = (): void => {
    // if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
};