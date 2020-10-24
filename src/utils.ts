import { auth } from "./firebase";
import { GeolocationError } from "./types";

export function errorReplacer(
  key: string,
  value: unknown
): unknown | Record<string, unknown> {
  if (value instanceof GeolocationError) {
    const error: Record<string, unknown> = {};

    Object.getOwnPropertyNames(value).forEach((key: string) => {
      error[key] = value[key as keyof GeolocationError];
    });

    return error;
  }

  return value;
}

export function getFromLocalStorage<T extends Record<string, unknown>>(
  key: string
): T | null {
  const item = localStorage.getItem(key);
  if (item) {
    return JSON.parse(item) as T;
  }

  return null;
}

export function isAuthenticated(): boolean {
  return !!auth.currentUser?.email;
}
