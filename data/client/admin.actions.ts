import { Prisma } from "@/lib/generated/prisma";
import { Client, MOCK_CLIENTS } from "@/lib/mockData";

export async function getClients(url: string) {
  return MOCK_CLIENTS
  // const response = await fetch(url);
  // if (!response.ok) {
  //   throw new Error("Failed to update client");
  // }
  // return await response.json() as Client[];
}

export async function createClient(url: string, clientData: Omit<Client, 'id' | 'createdAt'>) {
  // const response = await fetch(url, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(clientData),
  // });
  // if (!response.ok) {
  //   throw new Error("Failed to create client");
  // }
  // return await response.json();
}

export async function updateClient(url: string, clientData: Omit<Client, 'createdAt'>) {
  // const response = await fetch(url, {
  //   method: "PATCH",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(clientData),
  // });
  // if (!response.ok) {
  //   throw new Error("Failed to update client");
  // }
  // return await response.json();
}

export async function deleteClient(url: string, clientId: string) {
  // const response = await fetch(`url?id=${clientId}`, {
  //   method: "DELETE",
  // });
  // if (!response.ok) {
  //   throw new Error("Failed to delete client");
  // }
  // return await response.json();
}
