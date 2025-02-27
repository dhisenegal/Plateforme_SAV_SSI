"use client";

import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheckCircle, FaChartBar, FaList } from "react-icons/fa";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllEquipements, getEquipementsBySiteId, createInstallationEquipement, updateInstallationEquipement, deleteInstallationEquipement } from "@/actions/sav/equipement";
import UpdateEquipmentDialog from "@/components/sav/UpdateEquipementDialog";
import { getAllSystemes } from "@/actions/admin/equipement"; 
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EquipementTab = ({ id }) => {
  const [equipments, setEquipments] = useState([]);
  const [availableEquipments, setAvailableEquipments] = useState([]);
  const [systemes, setSystemes] = useState([]);
  const [selectedSysteme, setSelectedSysteme] = useState("");
  const [extincteurData, setExtincteurData] = useState({
    dateFabrication: "",
    datePremierChargement: "",
    dateDernierChargement: ""
  });

  const [newEquipment, setNewEquipment] = useState({
    idEquipement: "",
    idSysteme: "",
    Emplacement: "",
    HorsService: false,
    Commentaires: "",
    Numero: "",
    dateInstallation: "",
    observations: ""
  });
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [equipmentStats, setEquipmentStats] = useState([]);
  const [activeTab, setActiveTab] = useState("liste");

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const data = await getEquipementsBySiteId(parseInt(id));
        setEquipments(data);
        computeEquipmentStats(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des équipements associés au site:", error);
        toast.error("Erreur lors de la récupération des équipements associés au site");
      }
    };

    const fetchAvailableEquipments = async () => {
      try {
        const data = await getAllEquipements();
        setAvailableEquipments(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des équipements disponibles:", error);
        toast.error("Erreur lors de la récupération des équipements disponibles");
      }
    };

    const fetchSystemes = async () => {
      try {
        const data = await getAllSystemes();
        setSystemes(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des systèmes:", error);
        toast.error("Erreur lors de la récupération des systèmes");
      }
    };

    fetchEquipments();
    fetchAvailableEquipments();
    fetchSystemes();
  }, [id]);

  // Fonction pour calculer les statistiques des équipements
  const computeEquipmentStats = (equipmentData) => {
    // Crée un objet pour compter les équipements par type
    const equipmentCounts = equipmentData.reduce((acc, equipment) => {
      // Vérification que Systeme existe et a une propriété nom
      const systemName = equipment.Systeme?.nom || "Inconnu";
      const equipName = equipment.Equipement?.nom || "Inconnu";
      
      if (!acc[systemName]) {
        acc[systemName] = {};
      }
      
      if (!acc[systemName][equipName]) {
        acc[systemName][equipName] = {
          count: 1,
          serviceable: equipment.HorsService ? 0 : 1,
          outOfService: equipment.HorsService ? 1 : 0
        };
      } else {
        acc[systemName][equipName].count += 1;
        if (equipment.HorsService) {
          acc[systemName][equipName].outOfService += 1;
        } else {
          acc[systemName][equipName].serviceable += 1;
        }
      }
      
      return acc;
    }, {});
    
    // Transforme l'objet en tableau pour l'affichage
    const statsArray = Object.entries(equipmentCounts).map(([systemName, equipments]) => ({
      systemName,
      equipments: Object.entries(equipments).map(([equipName, stats]) => ({
        name: equipName,
        ...stats
      }))
    }));
    
    setEquipmentStats(statsArray);
  };

  // Mise à jour des statistiques après chaque modification des équipements
  useEffect(() => {
    computeEquipmentStats(equipments);
  }, [equipments]);

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };

  const isExtincteurSystem = (systemeId) => {
    const systeme = systemes.find(s => s.id === parseInt(systemeId));
    return systeme?.nom === "MOYENS DE SECOURS EXTINCTEURS";
  };
  
  const handleAddEquipment = async () => {
    try {
      if (!newEquipment.idEquipement) {
        toast.error("Veuillez sélectionner un équipement");
        return;
      }
      
      if (!isValidDate(newEquipment.dateInstallation)) {
        toast.error("Date d'installation invalide");
        return;
      }
  
      // Vérifier les champs d'extincteur si nécessaire
      if (isExtincteurSystem(selectedSysteme)) {
        if (!extincteurData.dateFabrication || !isValidDate(extincteurData.dateFabrication)) {
          toast.error("Date de fabrication de l'extincteur invalide");
          return;
        }
      }
      
      // S'assurer que tous les identifiants sont bien des nombres
      const payload = {
        ...newEquipment,
        idSite: parseInt(id),
        idSysteme: parseInt(selectedSysteme),
        idEquipement: parseInt(newEquipment.idEquipement),
        extincteurData: isExtincteurSystem(selectedSysteme) ? {
          dateFabrication: new Date(extincteurData.dateFabrication).toISOString(),
          datePremierChargement: extincteurData.datePremierChargement ? 
            new Date(extincteurData.datePremierChargement).toISOString() : undefined,
          dateDernierChargement: extincteurData.dateDernierChargement ? 
            new Date(extincteurData.dateDernierChargement).toISOString() : undefined
        } : undefined
      };
      
      // Vérifier que le payload est bien un objet non-null
      console.log("Payload:", payload);
      
      const newEquip = await createInstallationEquipement(payload);
      
      setEquipments([...equipments, newEquip]);
      setNewEquipment({
        idEquipement: "",
        idSysteme: "",
        Emplacement: "",
        HorsService: false,
        Commentaires: "",
        Numero: "",
        dateInstallation: "",
        observations: ""
      });
      setExtincteurData({
        dateFabrication: "",
        datePremierChargement: "",
        dateDernierChargement: ""
      });
      toast.success("Équipement ajouté avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'équipement:", error);
      toast.error("Erreur lors de l'ajout de l'équipement: " + error.message);
    }
  };
  const handleEditEquipment = (id) => {
    const equipment = equipments.find(e => e.id === id);
    setSelectedEquipment(equipment);
  };

  const handleUpdateEquipment = async (updateData) => {
    try {
      const updatedEquip = await updateInstallationEquipement(selectedEquipment.id, updateData);
      const updatedEquipments = equipments.map(e => e.id === selectedEquipment.id ? updatedEquip : e);
      setEquipments(updatedEquipments);
      computeEquipmentStats(updatedEquipments);
      setSelectedEquipment(null);
      toast.success("Équipement modifié avec succès");
    } catch (error) {
      console.error("Erreur lors de la modification de l'équipement:", error);
      toast.error("Erreur lors de la modification de l'équipement");
    }
  };

  const handleDeleteEquipment = (id) => {
    setIsDeleteDialogOpen(true);
    setEquipmentToDelete(id);
  };

  const confirmDeleteEquipment = async () => {
    try {
      if (!equipmentToDelete) {
        toast.error("Aucun équipement sélectionné pour la suppression");
        return;
      }
      
      await deleteInstallationEquipement(equipmentToDelete);
      const updatedEquipments = equipments.filter(e => e.id !== equipmentToDelete);
      setEquipments(updatedEquipments);
      computeEquipmentStats(updatedEquipments);
      setIsDeleteDialogOpen(false);
      setEquipmentToDelete(null);
      toast.success("Équipement supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression de l'équipement");
    }
  };

  const cancelDeleteEquipment = () => {
    setIsDeleteDialogOpen(false);
    setEquipmentToDelete(null);
  };

  const handleSystemeChange = (value) => {
    setSelectedSysteme(value);
    setNewEquipment({ ...newEquipment, idEquipement: "" });
  };

  const filteredEquipments = availableEquipments.filter(equip => equip.idSysteme === parseInt(selectedSysteme));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEquipments = equipments.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Tabs defaultValue="liste" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="liste" onClick={() => setActiveTab("liste")} className="flex items-center">
              <FaList className="mr-2" />
              Liste des équipements
            </TabsTrigger>
            <TabsTrigger value="stats" onClick={() => setActiveTab("stats")} className="flex items-center">
              <FaChartBar className="mr-2" />
              Statistiques
            </TabsTrigger>
          </TabsList>
          
          {activeTab === "liste" && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-500 text-white flex items-center">
                  <FaPlus className="w-3 h-3 mr-2" />
                  Associer un équipement
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[500px] max-h-[80vh] bg-white rounded-lg shadow-lg">
                <DialogHeader className="px-6 py-4 border-b">
                  <DialogTitle>Ajouter un Nouvel Équipement</DialogTitle>
                  <DialogDescription>Entrez les détails du nouvel équipement.</DialogDescription>
                </DialogHeader>

                {/* Ajout d'un conteneur scrollable */}
                <div className="px-6 py-4 overflow-y-auto max-h-[calc(80vh-160px)]">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Système et Équipement - Pleine largeur */}
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="systeme">Système</Label>
                      <Select
                        value={selectedSysteme}
                        onValueChange={handleSystemeChange}
                      >
                        <SelectTrigger className="w-full" id="systeme">
                          <SelectValue placeholder="Sélectionnez un système" />
                        </SelectTrigger>
                        <SelectContent>
                          {systemes.map((systeme) => (
                            <SelectItem key={systeme.id} value={systeme.id.toString()}>
                              {systeme.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="equipement">Équipement</Label>
                      <Select
                        value={newEquipment.idEquipement}
                        onValueChange={(value) => setNewEquipment({ ...newEquipment, idEquipement: value })}
                        disabled={!selectedSysteme}
                      >
                        <SelectTrigger className="w-full" id="equipement">
                          <SelectValue placeholder="Sélectionnez un équipement" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredEquipments.map((equip) => (
                            <SelectItem key={equip.id} value={equip.id.toString()}>
                              {equip.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Informations générales - Deux colonnes */}
                    <div className="space-y-2">
                      <Label htmlFor="dateInstallation">Date d'installation</Label>
                      <Input 
                        id="dateInstallation"
                        type="date" 
                        name="dateInstallation" 
                        onChange={(e) => setNewEquipment({ ...newEquipment, dateInstallation: e.target.value })}
                        value={newEquipment.dateInstallation}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="numero">Numéro</Label>
                      <Input
                        id="numero"
                        name="numero"
                        placeholder="Numéro"
                        onChange={(e) => setNewEquipment({ ...newEquipment, Numero: e.target.value })}
                        value={newEquipment.Numero}
                      />
                    </div>

                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="emplacement">Emplacement</Label>
                      <Input
                        id="emplacement"
                        name="emplacement"
                        placeholder="Emplacement"
                        onChange={(e) => setNewEquipment({ ...newEquipment, Emplacement: e.target.value })}
                        value={newEquipment.Emplacement}
                      />
                    </div>

                    {/* Section Extincteur conditionnelle */}
                    {isExtincteurSystem(selectedSysteme) && (
                      <div className="col-span-2 space-y-4 border-t pt-4">
                        <h3 className="font-medium text-sm">Informations Extincteur</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="dateFabrication">Date de fabrication</Label>
                            <Input
                              id="dateFabrication"
                              type="date"
                              name="dateFabrication"
                              onChange={(e) => setExtincteurData({ ...extincteurData, dateFabrication: e.target.value })}
                              value={extincteurData.dateFabrication}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="datePremierChargement">Premier chargement</Label>
                            <Input
                              id="datePremierChargement"
                              type="date"
                              name="datePremierChargement"
                              onChange={(e) => setExtincteurData({ ...extincteurData, datePremierChargement: e.target.value })}
                              value={extincteurData.datePremierChargement}
                            />
                          </div>

                          <div className="col-span-2 space-y-2">
                            <Label htmlFor="dateDernierChargement">Dernier chargement</Label>
                            <Input
                              id="dateDernierChargement"
                              type="date"
                              name="dateDernierChargement"
                              onChange={(e) => setExtincteurData({ ...extincteurData, dateDernierChargement: e.target.value })}
                              value={extincteurData.dateDernierChargement}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Commentaires - Pleine largeur */}
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="commentaires">Commentaires</Label>
                      <Input
                        id="commentaires"
                        name="commentaires"
                        placeholder="Commentaires"
                        onChange={(e) => setNewEquipment({ ...newEquipment, Commentaires: e.target.value })}
                        value={newEquipment.Commentaires}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer avec bouton - Fixe en bas */}
                <div className="px-6 py-4 border-t mt-auto">
                  <Button onClick={handleAddEquipment} className="w-full bg-blue-500 text-white hover:bg-blue-600">
                    Ajouter
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <TabsContent value="liste" className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom de l'équipement</TableHead>
                <TableHead>État</TableHead>
                <TableHead>Date d'installation</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentEquipments.map((equipment) => (
                <TableRow key={equipment.id} className="cursor-pointer">
                  <TableCell>{equipment.Equipement?.nom || "Inconnu"}</TableCell>
                  <TableCell>{equipment.HorsService ? <FaCheckCircle className="text-red-600"/> : <FaCheckCircle className="text-green-600"/>}</TableCell>
                  <TableCell>{new Date(equipment.dateInstallation).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <FaEdit className="text-blue-500 cursor-pointer" onClick={() => handleEditEquipment(equipment.id)} />
                      <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDeleteEquipment(equipment.id)} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-center mt-4">
            {Array.from({ length: Math.ceil(equipments.length / itemsPerPage) }, (_, index) => (
              <Button key={index + 1} onClick={() => paginate(index + 1)} className={`mx-1 ${currentPage === index + 1 ? 'bg-blue-700' : 'bg-blue-600'}`}>
                {index + 1}
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stats">
          <div className="mb-6">
            <h2 className="text-xl text-gray-800 font-bold mb-4">Statistiques des équipements par système</h2>
            
            {equipmentStats.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipmentStats.map((system) => (
                  <Card key={system.systemName} className="shadow">
                    <CardHeader className="bg-gray-50 border-b pb-3">
                      <CardTitle className="text-lg font-medium">Statistiques des équipements</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Équipement</TableHead>
                            <TableHead className="text-right">Quantité</TableHead>
                            <TableHead className="text-right">En service</TableHead>
                            <TableHead className="text-right">Hors service</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {system.equipments.map((equip) => (
                            <TableRow key={equip.name}>
                              <TableCell>{equip.name}</TableCell>
                              <TableCell className="text-right font-medium">{equip.count}</TableCell>
                              <TableCell className="text-right text-green-600">{equip.serviceable}</TableCell>
                              <TableCell className="text-right text-red-600">{equip.outOfService}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 border rounded bg-gray-50">
                Aucun équipement disponible pour ce site.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <UpdateEquipmentDialog
        isOpen={selectedEquipment !== null}
        onClose={() => setSelectedEquipment(null)}
        equipment={selectedEquipment}
        onUpdate={handleUpdateEquipment}
        availableEquipments={availableEquipments}
        systemes={systemes}
      />
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={cancelDeleteEquipment}>
        <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle>Confirmation de Suppression</DialogTitle>
            <DialogDescription>Êtes-vous sûr de vouloir supprimer cet équipement ?</DialogDescription>
          </DialogHeader>
          <div className="flex justify-between">
            <Button onClick={confirmDeleteEquipment} className="bg-red-500 text-white hover:bg-red-600">
              Supprimer
            </Button>
            <Button onClick={cancelDeleteEquipment} className="bg-gray-500 text-white hover:bg-gray-600">
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ToastContainer />
    </>
  );
};

export default EquipementTab;