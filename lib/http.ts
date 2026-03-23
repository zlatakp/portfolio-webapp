import { NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Returns the consistent API error payload required by the spec.
 */
export function apiError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Normalizes validation and unknown errors into the API error shape.
 */
export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    const issue = error.issues[0];

    return apiError(issue?.message ?? "Invalid request body", 400);
  }

  return apiError("Internal server error", 500);
}
