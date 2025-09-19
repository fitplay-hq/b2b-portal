import { Company } from "@/lib/generated/prisma";

// Create company
export async function createCompany(url: string, data: { name: string; address: string }) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create company");
  }

  return response.json();
}

// Get companies
export async function getCompanies(url: string) {
  const response = await fetch(url, { credentials: "include" });

  if (!response.ok) {
    throw new Error("Failed to fetch companies");
  }

  return response.json();
}

// Update company
export async function updateCompany(data: { id: string; name: string; address: string }) {
  const response = await fetch(`/api/admin/companies/${data.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name: data.name, address: data.address }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update company");
  }

  return response.json();
}

// Delete company
export async function deleteCompany(companyId: string) {
  const response = await fetch(`/api/admin/companies/${companyId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete company");
  }

  return response.json();
}