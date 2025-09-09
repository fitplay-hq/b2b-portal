import { Client, Prisma } from "@/lib/generated/prisma";

export async function getClients(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch clients");
  }
  const result = await response.json();
  return result.data as Client[]
}

export async function createClient(url: string, clientData: Prisma.ClientCreateInput) {
  const apiData = {
    name: clientData.name,
    email: clientData.email,
    companyName: clientData.companyName,
    password: clientData.password,
    phone: clientData.phone,
    address: clientData.address,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(apiData),
  });

  if (!response.ok) {
    const errorResult = await response.json();
    throw new Error(errorResult.error || "Failed to create client");
  }

  const result = await response.json()
  return result as Client;
}

export async function updateClient(url: string, clientData: Prisma.ClientUpdateInput) {
  const response = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(clientData),
  });

  if (!response.ok) {
    const errorResult = await response.json();
    throw new Error(errorResult.error || "Failed to update client");
  }

  const result = await response.json();
  return result as Client
}

export async function deleteClient(url: string, clientId: string) {
  const response = await fetch(`${url}?clientId=${clientId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorResult = await response.json();
    throw new Error(errorResult.error || "Failed to delete client");
  }

  const result = await response.json();
  return result as Client
}
