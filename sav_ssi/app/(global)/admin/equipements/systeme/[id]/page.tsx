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
import { ActionMaintenance, ActionMaintenanceExtincteur } from "@prisma/client";
import { getSystemById, getActionsBySystem, updateAction, deleteAction, updateActionExtincteur, deleteActionExtincteur, getActionExtincteurs } from "@/actions/admin/maintenanceAction";

type CombinedAction = ActionMaintenance | ActionMaintenanceExtincteur;
const ActionsPage = () => {
  const router = useRouter();
  const params = useParams();
  const systemId = Number(params?.id);
  const [actions, setActions] = useState<CombinedAction[]>([]);
  const [selectedAction, setSelectedAction] = useState<CombinedAction | null>(null);
  const [isExtincteurSystem, setIsExtincteurSystem] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data for systemId:", systemId);
        
        // Fetch system info first
        const system = await getSystemById(systemId);
        console.log("System:", system);
        
        const isExtincteur = system?.nom === "MOYENS DE SECOURS EXTINCTEURS";
        setIsExtincteurSystem(isExtincteur);
        console.log("Is Extincteur System:", isExtincteur);
  
        // Fetch actions based on system type
        let fetchedActions;
        if (isExtincteur) {
          fetchedActions = await getActionExtincteurs();
          console.log("Extincteur Actions:", fetchedActions);
        } else {
          fetchedActions = await getActionsBySystem(systemId);
          console.log("Regular Actions:", fetchedActions);
        }
        
        setActions(fetchedActions || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Erreur lors du chargement des actions");
      }
    };
  
    fetchData();
  }, [systemId, isExtincteurSystem]);

  const handleEditAction = (id: number) => {
    const action = actions.find(a => a.id === id);
    if (action) {
      setSelectedAction(action);
    }
  };

  const handleUpdateAction = async () => {
    if (selectedAction) {
      try {
        const updatedAction = isExtincteurSystem 
          ? await updateActionExtincteur(selectedAction.id, selectedAction.libeleAction)
          : await updateAction(selectedAction.id, selectedAction.libeleAction);

        setActions(actions.map(a => a.id === selectedAction.id ? updatedAction : a));
        setSelectedAction(null);
        toast.success("Action modifiée avec succès");
      } catch (error) {
        toast.error("Erreur lors de la modification");
      }
    }
  };

  const handleDeleteAction = async (id: number) => {
    try {
      if (isExtincteurSystem) {
        await deleteActionExtincteur(id);
      } else {
        await deleteAction(id);
      }
      setActions(actions.filter(a => a.id !== id));
      toast.success("Action supprimée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <>
      <div className="p-6">
        <h2 className="text-xl text-gray-800 font-bold mb-4">
          {isExtincteurSystem ? "Actions de Maintenance Extincteur" : "Actions de Maintenance"}
        </h2>        
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