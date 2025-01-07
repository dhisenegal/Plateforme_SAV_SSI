"use server";
import { prisma } from "@/prisma";
import { ActionMaintenance } from "@prisma/client";

// Fetch all maintenance actions for a specific system
export const getActionsBySystem = async (systemId: number): Promise<ActionMaintenance[]> => {
  console.log("Fetching actions for system ID:", systemId); // Log the system ID
  const actions = await prisma.actionMaintenance.findMany({
    where: { idSysteme: systemId },
  });
  console.log("Fetched actions:", actions); // Log the fetched actions
  return actions;
};
export const getSystemIdFromInstallation = async (installationId: number) => {
  if (!installationId) {
    throw new Error("Invalid installationId");
  }
  return await prisma.installation.findUnique({
    where: { id: installationId },
    select: {
      idSysteme: true
    }
  });
};
// Add a new maintenance action
export const addAction = async (systemId: number, libeleAction: string): Promise<ActionMaintenance> => {
  return await prisma.actionMaintenance.create({
    data: {
      libeleAction,
      idSysteme: systemId,
    },
  });
};

// Update an existing maintenance action
export const updateAction = async (id: number, libeleAction: string): Promise<ActionMaintenance> => {
  return await prisma.actionMaintenance.update({
    where: { id },
    data: { libeleAction },
  });
};

// Delete a maintenance action
export const deleteAction = async (id: number): Promise<ActionMaintenance> => {
  return await prisma.actionMaintenance.delete({
    where: { id },
  });
};