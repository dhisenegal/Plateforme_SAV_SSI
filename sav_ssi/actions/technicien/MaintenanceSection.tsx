import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { FaCheckCircle, FaTimesCircle, FaEdit } from 'react-icons/fa';
import { Dialog, DialogContent, DialogOverlay, DialogTitle, DialogDescription } from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';

interface MaintenanceSectionProps {
  selectedStatus: { [key: number]: string };
  handleStatusChange: (idx: number, status: string) => void;
  observations: { [key: number]: string };
  handleObservationChange: (idx: number, observation: string) => void;
  isObservationDialogOpen: { [key: number]: boolean };
  setIsObservationDialogOpen: (openState: { [key: number]: boolean }) => void;
}

const DialogHeader: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="mb-4">
    <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
    <DialogDescription className="text-sm text-gray-500">{description}</DialogDescription>
  </div>
);

const MaintenanceSection: React.FC<MaintenanceSectionProps> = ({
  selectedStatus,
  handleStatusChange,
  observations,
  handleObservationChange,
  isObservationDialogOpen,
  setIsObservationDialogOpen
}) => {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Détection Incendie</h2>
      <Table className="min-w-full bg-white border border-gray-200">
        <TableHeader>
          <TableRow>
            <TableHead className="p-3 text-left text-sm font-semibold text-gray-700 border-b w-2/5">Tâche</TableHead>
            <TableHead className="p-3 text-left text-sm font-semibold text-gray-700 border-b w-1/5">Statut</TableHead>
            <TableHead className="p-3 text-left text-sm font-semibold text-gray-700 border-b w-2/5">Observations</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            'Test fonctionnalité du système*',
            'Vérification carte électronique de la centrale',
            'Test alimentation et batterie de la centrale',
            'Dépoussiérage centrale',
            'Dépoussiérage des détecteurs',
            'Dépoussiérage déclencheurs manuel',
            'Dépoussiérage des sirènes',
            'Test fonctionnalité périphériques*',
            'Test fonctionnalité de l\'ensemble des équipements*'
          ].map((task, idx) => (
            <TableRow key={idx} className="border-b hover:bg-blue-100">
              <TableCell className="p-3">{task}</TableCell>
              <TableCell className="p-3">
                <div className="flex space-x-4">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name={`statut-${idx}`}
                      value="valide"
                      className="hidden"
                      onChange={() => handleStatusChange(idx, 'valide')}
                    />
                    <FaCheckCircle
                      className={`cursor-pointer ${selectedStatus[idx] === 'valide' ? 'text-green-600' : 'text-gray-400'}`}
                      onClick={() => handleStatusChange(idx, 'valide')}
                    />
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name={`statut-${idx}`}
                      value="non-valide"
                      className="hidden"
                      onChange={() => handleStatusChange(idx, 'non-valide')}
                    />
                    <FaTimesCircle
                      className={`cursor-pointer ${selectedStatus[idx] === 'non-valide' ? 'text-red-600' : 'text-gray-400'}`}
                      onClick={() => handleStatusChange(idx, 'non-valide')}
                    />
                  </label>
                </div>
              </TableCell>
              <TableCell className="p-3 text-center">
                <FaEdit
                  className="cursor-pointer text-blue-600"
                  onClick={() => setIsObservationDialogOpen((prev) => ({ ...prev, [idx]: true }))}
                />
                <Dialog open={isObservationDialogOpen[idx]} onOpenChange={(open) => setIsObservationDialogOpen((prev) => ({ ...prev, [idx]: open }))}>
                  <DialogOverlay className="fixed inset-0 bg-black opacity-30" />
                  <DialogContent className="fixed inset-0 flex items-center justify-center p-4">
                    <div className="bg-white p-4 rounded shadow-md w-full max-w-md">
                      <DialogHeader title="Observations" description="Entrez vos observations pour cette tâche." />
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows={4}
                        placeholder="Entrez vos observations pour cette tâche"
                        value={observations[idx] || ''}
                        onChange={(e) => handleObservationChange(idx, e.target.value)}
                      />
                      <div className="flex justify-end mt-4">
                        <Button onClick={() => setIsObservationDialogOpen((prev) => ({ ...prev, [idx]: false }))}>Fermer</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MaintenanceSection;