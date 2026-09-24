import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode = 500,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function apiErrorResponse(error: unknown): Response {
  if (error instanceof SyntaxError) return Response.json({ success: false, error: "Invalid JSON request body" }, { status: 400 });
  if (error instanceof ZodError) {
    return Response.json(
      {
        success: false,
        error: "Validation failed",
        details: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  if (error instanceof AppError) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: error.statusCode },
    );
  }

  console.error("Unexpected API error:", error);

  return Response.json(
    {
      success: false,
      error: "Internal server error",
    },
    { status: 500 },
  );
}
