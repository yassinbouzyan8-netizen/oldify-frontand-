/** Cookie HttpOnly posé par les routes `/api/auth/*` (token renvoyé par ton API). */
export const AUTH_COOKIE_NAME = "oldify_access_token";
export const AUTH_COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 7;
