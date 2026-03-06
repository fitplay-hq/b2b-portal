import { NextResponse } from "next/server";
import { Prisma } from "@/lib/generated/prisma";
import { ZodError } from "zod";

export function handleApiError(error: unknown) {
  console.error("API Error:", error);

  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Validation failed", details: error.issues },
      { status: 400 },
    );
  }

  // Check for Prisma errors more robustly (instanceof can fail with HMR/bundling)
  const isPrismaError =
    error instanceof Prisma.PrismaClientKnownRequestError ||
    (typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as any).constructor.name === "PrismaClientKnownRequestError");

  if (isPrismaError) {
    const prismaError = error as any;
    switch (prismaError.code) {
      case "P2002":
        const target = prismaError.meta?.target as string[];
        return NextResponse.json(
          {
            error: `A record with this ${target ? target.join(", ") : "value"} already exists.`,
          },
          { status: 409 },
        );
      case "P2025":
        return NextResponse.json(
          { error: "Record not found." },
          { status: 404 },
        );
      case "P2014":
      case "P2003":
        return NextResponse.json(
          {
            error:
              "Cannot delete or update this record because it is referenced by other records.",
          },
          { status: 409 },
        );
      default:
        return NextResponse.json(
          { error: "Database operation failed." },
          { status: 500 },
        );
    }
  }

  const errorMessage =
    error instanceof Error ? error.message : "Something went wrong";
  return NextResponse.json({ error: errorMessage }, { status: 500 });
}
