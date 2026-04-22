import { NextResponse } from "next/server";
import { API_ERROR_MESSAGES } from "@/constants/api-messages";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function badRequest(message: string, details?: unknown) {
  return NextResponse.json(
    { success: false, error: message, ...(details ? { details } : {}) },
    { status: 400 },
  );
}

export function conflict(message: string, details?: unknown) {
  return NextResponse.json(
    { success: false, error: message, ...(details ? { details } : {}) },
    { status: 409 },
  );
}

export function unauthorized(message: string = API_ERROR_MESSAGES.UNAUTHORIZED) {
  return NextResponse.json({ success: false, error: message }, { status: 401 });
}

export function tooManyRequests(message: string, retryAfterSeconds: number) {
  return NextResponse.json(
    { success: false, error: message },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSeconds) },
    },
  );
}

export function internalError(message: string = API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR, details?: unknown) {
  return NextResponse.json(
    { success: false, error: message, ...(details ? { details } : {}) },
    { status: 500 },
  );
}
