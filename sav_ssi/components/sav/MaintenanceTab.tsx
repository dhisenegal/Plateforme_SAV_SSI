import React, { useEffect, useState } from "react";
import { getMaintenancesBySite, updateMaintenanceStatus, updateMaintenance } from "@/actions/sav/maintenance";
import { getAllTechniciens } from "@/actions/sav/technicien";
import { Maintenance } from "@prisma/client";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { FaPause, FaPlay, FaEdit, FaCheck } from "react-icons/fa";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

interface MaintenanceTabProps {
  siteId: number;
}

const MaintenanceTab: React.FC<MaintenanceTabProps> = ({ siteId }) => {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [filteredMaintenances, setFilteredMaintenances] = useState<Maintenance[]>([]);
  const [techniciens, setTechniciens] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState<number>(0);
  const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | null>(null);
  const [actionType, setActionType] = useState<string>("");
  const [numero, setNumero] = useState<string>("");
  const [dateMaintenance, setDateMaintenance] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [statut, setStatut] = useState<string>("");
  const [typeMaintenance, setTypeMaintenance] = useState<string>("");
  const [idTechnicien, setIdTechnicien] = useState<number>(0);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchMaintenances = async () => {
      try {
        const maintenances = await getMaintenancesBySite(siteId);
        setMaintenances(maintenances);
        setFilteredMaintenances(maintenances);
      } catch (error) {
        console.error("Erreur lors de la récupération des maintenances:", error);
      }
    };

    const fetchTechniciens = async () => {
      try {
        const techniciens = await getAllTechniciens();
        setTechniciens(techniciens);
      } catch (error) {
        console.error("Erreur lors de la récupération des techniciens:", error);
      }
    };

    fetchMaintenances();
    fetchTechniciens();
  }, [siteId]);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredMaintenances(maintenances);
    } else {
      setFilteredMaintenances(maintenances.filter(m => m.statut === statusFilter));
    }
  }, [statusFilter, maintenances]);

  const handleStatusToggle = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "planifiée" ? "suspendue" : "planifiée";
    try {
      await updateMaintenanceStatus(id, newStatus);
      setMaintenances(maintenances.map(m => m.id === id ? { ...m, statut: newStatus } : m));
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut de la maintenance:", error);
    }
  };

  const handleAction = (maintenance: Maintenance, type: string) => {
    setSelectedMaintenance(maintenance);
    setActionType(type);
    if (type === "edit") {
      setNumero(maintenance.numero);
      setDateMaintenance(new Date(maintenance.dateMaintenance).toISOString().split("T")[0]);
      setDescription(maintenance.description);
      setStatut(maintenance.statut);
      setTypeMaintenance(maintenance.typeMaintenance);
      setIdTechnicien(maintenance.idTechnicien);
    }
  };

  const handleConfirmAction = async () => {
    if (selectedMaintenance) {
      if (actionType === "toggle") {
        await handleStatusToggle(selectedMaintenance.id, selectedMaintenance.statut);
      } else if (actionType === "close") {
        await updateMaintenanceStatus(selectedMaintenance.id, "clôturée");
      } else if (actionType === "edit") {
        const updatedMaintenance = await updateMaintenance(selectedMaintenance.id, {
          numero,
          dateMaintenance: new Date(dateMaintenance),
          description,
          statut,
          typeMaintenance,
          idTechnicien,
        });
        setMaintenances(maintenances.map(m => m.id === selectedMaintenance.id ? updatedMaintenance : m));
      }
      setSelectedMaintenance(null);
      setActionType("");
    }
  };

  const totalPages = Math.ceil(filteredMaintenances.length / rowsPerPage);

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="all">Tous</option>
          <option value="planifiée">Planifiée</option>
          <option value="suspendue">Suspendue</option>
          <option value="clôturée">Clôturée</option>
        </select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Numéro</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Statut</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Technicien</TableCell>
            <TableCell>Contact</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMaintenances.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((maintenance) => (
            <TableRow key={maintenance.id}>
              <TableCell>{maintenance.numero}</TableCell>
              <TableCell>{new Date(maintenance.dateMaintenance).toLocaleDateString()}</TableCell>
              <TableCell>{maintenance.description}</TableCell>
              <TableCell>{maintenance.statut}</TableCell>
              <TableCell>{maintenance.typeMaintenance}</TableCell>
              <TableCell>{maintenance.Technicien?.prenom} {maintenance.Technicien?.nom}</TableCell>
              <TableCell>{maintenance.Contact?.prenom} {maintenance.Contact?.nom}</TableCell>
              <TableCell className="flex space-x-2">
                <button onClick={() => handleAction(maintenance, "toggle")}>
                  {maintenance.statut === "planifiée" ? <FaPause className="text-red-500 text-xl" /> : <FaPlay className="text-green-500"/>}
                </button>
                <button onClick={() => handleAction(maintenance, "edit")}>
                  <FaEdit className="text-blue-500 text-xl" />
                </button>
                <button onClick={() => handleAction(maintenance, "close")}>
                  <FaCheck className="text-green-800 text-xl"/>
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center items-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setPage(index)}
            className={`p-2 mx-1 border rounded ${page === index ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {selectedMaintenance && (
        <Dialog open={!!selectedMaintenance} onOpenChange={() => setSelectedMaintenance(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{actionType === "edit" ? "Modifier la maintenance" : "Confirmer l'action"}</DialogTitle>
            </DialogHeader>
            {actionType === "edit" ? (
              <div>
                <div className="mb-4">
                  <label htmlFor="numero">Numéro</label>
                  <Input
                    id="numero"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="dateMaintenance">Date</label>
                  <Input
                    id="dateMaintenance"
                    type="date"
                    value={dateMaintenance}
                    onChange={(e) => setDateMaintenance(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="description">Description</label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="statut">Statut</label>
                  <Select
                    id="statut"
                    value={statut}
                    onValueChange={(value) => setStatut(value)}
                    required
                  >
                    <SelectTrigger>Choisir un statut</SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planifiée">Planifiée</SelectItem>
                      <SelectItem value="suspendue">Suspendue</SelectItem>
                      <SelectItem value="clôturée">Clôturée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="mb-4">
                  <label htmlFor="typeMaintenance">Type</label>
                  <Select
                    id="typeMaintenance"
                    value={typeMaintenance}
                    onValueChange={(value) => setTypeMaintenance(value)}
                    required
                  >
                    <SelectTrigger>Choisir un type</SelectTrigger>
                    <SelectContent>
                      <SelectItem value="curative">Curative</SelectItem>
                      <SelectItem value="preventive">Préventive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="mb-4">
                  <label htmlFor="idTechnicien">Technicien</label>
                  <Select
                    id="idTechnicien"
                    value={idTechnicien}
                    onValueChange={(value) => setIdTechnicien(Number(value))}
                    required
                  >
                    <SelectTrigger>Choisir un technicien</SelectTrigger>
                    <SelectContent>
                      {techniciens.map((technicien) => (
                        <SelectItem key={technicien.id} value={technicien.id}>
                          {technicien.prenom} {technicien.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <p>Êtes-vous sûr de vouloir {actionType === "toggle" ? "changer le statut" : "clôturer"} cette maintenance ?</p>
            )}
            <DialogFooter>
              <Button onClick={handleConfirmAction}>Confirmer</Button>
              <Button variant="secondary" onClick={() => setSelectedMaintenance(null)}>Annuler</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MaintenanceTab;