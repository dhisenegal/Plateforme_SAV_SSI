"use server";
import { prisma } from "@/prisma";
import { ActionMaintenance } from "@prisma/client";

// Fetch all maintenance actions for a specific system
export const getActionsBySystem = async (systemId: number): Promise<ActionMaintenance[]> => {
  return await prisma.actionMaintenance.findMany({
    where: { idSysteme: systemId },
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