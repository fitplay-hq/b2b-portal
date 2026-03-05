import { NextResponse } from "next/server";
import { Prisma } from "@/lib/generated/prisma";
import { ZodError } from "zod";

export function handleApiError(error: unknown) {
  console.error("API Error:", error);

  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Validation failed", details: error.errors },
      { status: 400 },
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        const target = error.meta?.target as string[];
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
