'use client';

import React, { useState, useEffect } from 'react';
import { FaPlus, FaEye, FaEdit, FaTrash, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getPlanning, formatDate, getClientName, getDescription, getType } from "@/actions/technicien/planning";

const PlanningTabContent = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPlanning, setCurrentPlanning] = useState<any[]>([]); // Renommé en currentPlanning
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    // Exemple de récupération de planning (remplacer par votre API réelle)
    const fetchPlanning = async () => {
      
      
      setTotalPages(2); // Exemple de pagination, à remplacer par la logique réelle
    };

    fetchPlanning();
  }, [currentPage]);

  const handleSelectRow = (id: number) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAllRows = () => {
    if (selectedRows.length === currentPlanning.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentPlanning.map((site) => site.id));
    }
  };

  const handleRowClick = (id: number) => {
    // Gérer le clic sur une ligne, par exemple, ouvrir une page de détails ou une fenêtre modale
    console.log(`Row clicked for planning ID: ${id}`);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold"> Planning</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 text-white flex items-center">
              <FaPlus className="w-5 h-5 mr-2" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
            <DialogHeader>
              <DialogTitle>Ajouter un Nouveau Planning</DialogTitle>
              <DialogDescription>Sélectionnez un client, une description, et un type pour ajouter un planning.</DialogDescription>
            </DialogHeader>
            <div>
              <div className="mb-4">
                <label className="block mb-2">Client</label>
                {/* Input de sélection du client */}
              </div>
              <div className="mb-4">
                <label className="block mb-2">Description</label>
                {/* Input de description */}
              </div>
              <div className="mb-4">
                <label className="block mb-2">Type</label>
                {/* Input du type */}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <input
                type="checkbox"
                checked={selectedRows.length === currentPlanning.length}
                onChange={handleSelectAllRows}
              />
            </TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentPlanning.map((plan) => (
            <TableRow
              key={plan.id}
              className={`cursor-pointer ${selectedRows.includes(plan.id) ? 'bg-blue-100' : 'hover:bg-blue-100'}`}
              onClick={() => handleRowClick(plan.id)}
            >
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(plan.id)}
                  onChange={() => handleSelectRow(plan.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </TableCell>
              <TableCell>{}</TableCell> {/* Formatage de la date */}
              <TableCell>{}</TableCell>
              <TableCell>{}</TableCell>
              <TableCell>{}</TableCell>
              <TableCell> {}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <FaEye className="text-blue-500 cursor-pointer" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end items-center mt-4 gap-2">
        <span>
          Page {currentPage} / {totalPages}
        </span>
        <Button onClick={handlePreviousPage} disabled={currentPage === 1} className="bg-blue-500">
          <FaArrowLeft />
        </Button>
        <Button onClick={handleNextPage} disabled={currentPage === totalPages} className="bg-blue-500">
          <FaArrowRight />
        </Button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default PlanningTabContent;
