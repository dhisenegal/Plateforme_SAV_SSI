"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { FaEdit, FaTrash } from "react-icons/fa";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getActionsBySystem, updateAction, deleteAction } from "@/actions/admin/maintenanceAction";
import { ActionMaintenance } from "@/types";

const ActionsPage = () => {
  const router = useRouter();
  const params = useParams();
  const systemId = Number(params?.id);
  const [actions, setActions] = useState<ActionMaintenance[]>([]);
  const [selectedAction, setSelectedAction] = useState<ActionMaintenance | null>(null);
  const [newAction, setNewAction] = useState<string>("");

  useEffect(() => {
    const fetchActions = async () => {
      const actions = await getActionsBySystem(systemId);
      setActions(actions);
    };
    fetchActions();
  }, [systemId]);

  const handleEditAction = (id: number) => {
    const action = actions.find(a => a.id === id);
    if (action) {
      setSelectedAction(action);
    }
  };

  const handleUpdateAction = async () => {
    if (selectedAction) {
      const updatedAction = await updateAction(selectedAction.id, selectedAction.libeleAction);
      setActions(actions.map(a => a.id === selectedAction.id ? updatedAction : a));
      setSelectedAction(null);
      toast.success("Action modifiée avec succès");
    }
  };

  const handleDeleteAction = async (id: number) => {
    await deleteAction(id);
    setActions(actions.filter(a => a.id !== id));
    toast.success("Action supprimée avec succès");
  };

  return (
    <>
      <div className="p-6">
        <h2 className="text-xl text-gray-800 font-bold mb-4">Actions de Maintenance</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Libellé</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actions.map((action) => (
              <TableRow key={action.id}>
                <TableCell>{action.libeleAction}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <FaEdit className="text-blue-500 cursor-pointer" onClick={() => handleEditAction(action.id)} />
                    <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDeleteAction(action.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {selectedAction && (
          <Dialog open={selectedAction !== null} onOpenChange={() => setSelectedAction(null)}>
            <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle>Modifier l'Action</DialogTitle>
                <DialogDescription>Modifiez le libellé de l'action.</DialogDescription>
              </DialogHeader>
              <div>
                <Input
                  name="libeleAction"
                  placeholder="Libellé de l'action"
                  onChange={(e) => setSelectedAction({ ...selectedAction, libeleAction: e.target.value })}
                  value={selectedAction.libeleAction}
                  className="mb-4"
                />
                <Button onClick={handleUpdateAction} className="w-full bg-blue-500 text-white hover:bg-blue-600">
                  Modifier
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <ToastContainer />
    </>
  );
};

export default ActionsPage;