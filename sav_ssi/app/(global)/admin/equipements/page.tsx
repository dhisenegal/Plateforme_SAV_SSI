"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import "react-toastify/dist/ReactToastify.css";
import { getAllEquipements, addEquipement, 
  getAllTypeExtincteurs, updateEquipement, deleteEquipement, getAllSystemes, getAllMarques, getAllModeles } from "@/actions/admin/equipement";
import { Equipement, Systeme, Marque, Modele } from "@/types";
import { Label } from '@/components/ui/label';
import {Checkbox} from "@/components/ui/checkbox";
import { ExtincteurData, TypeExtincteur, Equipement} from "@/types";
const EquipementPage = () => {
  const [equipements, setEquipements] = useState<Equipement[]>([]);
  const [filteredEquipements, setFilteredEquipements] = useState<Equipement[]>([]);
  const [systemes, setSystemes] = useState<Systeme[]>([]);
  const [marques, setMarques] = useState<Marque[]>([]);
  const [modeles, setModeles] = useState<Modele[]>([]);
  const [typeExtincteurs, setTypeExtincteurs] = useState<TypeExtincteur[]>([]);
  const [selectedEquipement, setSelectedEquipement] = useState<Equipement | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [equipementToDelete, setEquipementToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterSysteme, setFilterSysteme] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
   // Form states
   const [isExtincteurSystem, setIsExtincteurSystem] = useState(false);
   const [newEquipement, setNewEquipement] = useState<Equipement>({
    nom: "",
    idSysteme: 0,
    idMarqueSsi: 0,
    idModeleSsi: 1,
   });
   const [extincteurData, setExtincteurData] = useState<ExtincteurData>({
    typePression: 'PP',
    modeVerification: 'V5',
    chargeReference: 0,
    tare: 0,
    sparklet: false,
    chargeReferenceSparklet: 0,
    poidsMax: 0,
    poidsMin: 0,
    idTypeExtincteur: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          equipementsData, 
          systemesData, 
          marquesData, 
          modelesData,
          typeExtincteursData
        ] = await Promise.all([
          getAllEquipements(),
          getAllSystemes(),
          getAllMarques(),
          getAllModeles(),
          getAllTypeExtincteurs()
        ]);
        setEquipements(equipementsData);
        setFilteredEquipements(equipementsData);
        setSystemes(systemesData);
        setMarques(marquesData);
        setModeles(modelesData);
        setTypeExtincteurs(typeExtincteursData);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
        toast.error("Erreur lors du chargement des données");
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    filterEquipements();
  }, [searchTerm, filterSysteme, equipements]);

  useEffect(() => {
    const selectedSystem = systemes.find(s => s.id === parseInt(newEquipement.idSysteme.toString()));
    setIsExtincteurSystem(selectedSystem?.nom === "MOYENS DE SECOURS EXTINCTEURS");
  }, [newEquipement.idSysteme, systemes]);

  const filterEquipements = () => {
    let filtered = equipements;

    if (searchTerm) {
      filtered = filtered.filter(equipement =>
        equipement.nom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterSysteme) {
      filtered = filtered.filter(equipement => equipement.idSysteme === filterSysteme);
    }

    setFilteredEquipements(filtered);
  };

  const handleAddEquipement = async () => {
    try {
      if (!newEquipement.nom || !newEquipement.idSysteme) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }

      const equipmentData = {
        ...newEquipement,
        isExtincteur: isExtincteurSystem,
        extincteurData: isExtincteurSystem ? extincteurData : undefined
      };
      console.log('equipmentData avant envoi:', equipmentData);
      const createdEquipement = await addEquipement(equipmentData);
      setEquipements(prev => [...prev, createdEquipement]);
      toast.success("Équipement ajouté avec succès");
      // Reset forms
      setNewEquipement({
        nom: "",
        idSysteme: 0,
        idMarqueSsi: 0,
        idModeleSsi: 0
      });
      setExtincteurData({
        typePression: 'PP',
        modeVerification: 'V5',
        chargeReference: 0,
        tare: 0,
        sparklet: false,
        chargeReferenceSparklet: 0,
        poidsMax: 0,
        poidsMin: 0,
        idTypeExtincteur: 0
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'équipement :", error);
      toast.error("Erreur lors de l'ajout de l'équipement");
    }
  };

  const handleEditEquipement = (id: number) => {
    const equipement = equipements.find(e => e.id === id);
    if (equipement) {
      setSelectedEquipement(equipement);
    }
  };

  const handleUpdateEquipement = async () => {
    if (selectedEquipement && selectedEquipement.nom && selectedEquipement.idSysteme && selectedEquipement.idMarqueSsi && selectedEquipement.idModeleSsi) {
      const updatedEquipement = await updateEquipement(selectedEquipement.id, selectedEquipement);
      setEquipements(equipements.map(e => e.id === selectedEquipement.id ? updatedEquipement : e));
      setFilteredEquipements(equipements.map(e => e.id === selectedEquipement.id ? updatedEquipement : e));
      setSelectedEquipement(null);
      toast.success("Équipement modifié avec succès");
    } else {
      toast.error("Veuillez remplir tous les champs");
    }
  };

  const handleDeleteEquipement = (id: number) => {
    setIsDeleteDialogOpen(true);
    setEquipementToDelete(id);
  };

  const confirmDeleteEquipement = async () => {
    if (equipementToDelete !== null) {
      await deleteEquipement(equipementToDelete);
      setEquipements(equipements.filter(e => e.id !== equipementToDelete));
      setFilteredEquipements(equipements.filter(e => e.id !== equipementToDelete));
      setIsDeleteDialogOpen(false);
      setEquipementToDelete(null);
      toast.success("Équipement supprimé avec succès");
    }
  };

  const cancelDeleteEquipement = () => {
    setIsDeleteDialogOpen(false);
    setEquipementToDelete(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedEquipements = filteredEquipements.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Gestion des équipements</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-500">
              <FaPlus className="mr-2" /> Ajouter
            </Button>
          </DialogTrigger>
              <DialogContent className="max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Ajouter un équipement</DialogTitle>
                  <DialogDescription>Remplissez les informations de l'équipement</DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                  {/* Section Information Générale */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Informations Générales</h3>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label>Nom de l'équipement</Label>
                        <Input 
                          value={newEquipement.nom}
                          onChange={(e) => setNewEquipement({...newEquipement, nom: e.target.value})}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label>Système</Label>
                        <Select 
                          value={newEquipement.idSysteme.toString()}
                          onValueChange={(value) => setNewEquipement({...newEquipement, idSysteme: parseInt(value)})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un système" />
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

                      <div className="grid gap-2">
                        <Label>Marque</Label>
                        <Select 
                          value={newEquipement.idMarqueSsi.toString()}
                          onValueChange={(value) => setNewEquipement({...newEquipement, idMarqueSsi: parseInt(value)})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une marque" />
                          </SelectTrigger>
                          <SelectContent>
                            {marques.map((marque) => (
                              <SelectItem key={marque.id} value={marque.id.toString()}>
                                {marque.nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {!isExtincteurSystem ? (
                      <div className="grid gap-2">
                        <Label>Modèle</Label>
                        <Select 
                          value={newEquipement.idModeleSsi.toString()}
                          onValueChange={(value) => setNewEquipement({...newEquipement, idModeleSsi: parseInt(value)})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un modèle" />
                          </SelectTrigger>
                          <SelectContent>
                            {modeles.map((modele) => (
                              <SelectItem key={modele.id} value={modele.id.toString()}>
                                {modele.nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        <Label>Type d'extincteur</Label> 
                        <Select 
                          value={extincteurData.idTypeExtincteur.toString()}
                          onValueChange={(value) => setExtincteurData({
                            ...extincteurData,
                            idTypeExtincteur: parseInt(value)
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un type" />
                          </SelectTrigger>
                          <SelectContent>
                            {typeExtincteurs.map((type) => (
                              <SelectItem key={type.id} value={type.id.toString()}>
                                {type.nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  </div>
                  {/* Section Extincteur */}
                  {isExtincteurSystem && (
                    <div className="space-y-4 border-t pt-4">
                      <h3 className="text-lg font-semibold">Configuration Extincteur</h3>
                      <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label>Type Pression</Label>
                            <Select 
                              value={extincteurData.typePression}
                              onValueChange={(value) => setExtincteurData({
                                ...extincteurData,
                                typePression: value as 'PP' | 'PA'
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Type de pression" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PP">PP</SelectItem>
                                <SelectItem value="PA">PA</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                          <Label>Mode Vérification</Label>
                            <Select 
                              value={extincteurData.modeVerification}
                              onValueChange={(value) => setExtincteurData({
                                ...extincteurData,
                                modeVerification: value as 'V5' | 'V10'
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Mode de vérification" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="V5">V5</SelectItem>
                                <SelectItem value="V10">V10</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label>Charge Référence</Label>
                            <Input type='number' value={(extincteurData.chargeReference)?.toString()} 
                            onChange={(e) => setExtincteurData({
                              ...extincteurData,
                              chargeReference: parseInt((e.target.value).toString())
                            })}/>
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <Label>Tare</Label>
                          <Input type='number' value={(extincteurData.tare)?.toString()} 
                          onChange={(e) => setExtincteurData({
                            ...extincteurData,
                            tare: parseInt((e.target.value).toString())
                          })}/>
                        </div>

                        <div className="flex items-center space-x-2">
                        <Checkbox 
                          checked={extincteurData.sparklet}
                          onCheckedChange={(checked) => setExtincteurData({
                            ...extincteurData,
                            sparklet: checked as boolean
                            })}
                          />
                          <Label>Sparklet</Label>
                        </div>

                        {extincteurData.sparklet && (
                          <div className="grid gap-4 pl-6">
                            <div className="grid gap-2">
                              <Label>Charge Référence Sparklet</Label>
                              <Input type='number' value={(extincteurData.chargeReferenceSparklet)?.toString()} 
                              onChange={(e) => setExtincteurData({
                                ...extincteurData,
                                chargeReferenceSparklet: parseInt((e.target.value).toString())  
                              })}/>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label>Poids Maximum</Label>
                                <Input type='number' value={(extincteurData.poidsMax)?.toString()} 
                                onChange={(e) => setExtincteurData({
                                  ...extincteurData,
                                  poidsMax: parseInt((e.target.value).toString())
                                })}/>
                              </div>
                              <div className="grid gap-2">
                                <Label>Poids Minimum</Label>
                                <Input type='number' value={(extincteurData.poidsMin)?.toString()}
                                onChange={(e) => setExtincteurData({
                                  ...extincteurData,
                                  poidsMin: parseInt((e.target.value).toString())
                                })} />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-4 border-t">
                    <Button onClick={handleAddEquipement} className="w-[200px]">
                      Ajouter l'équipement
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
      </div>

        <div className="flex space-x-4 mb-4">
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <Select
            value={filterSysteme?.toString() || ""}
            onValueChange={(value) => setFilterSysteme(value ? parseInt(value) : null)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrer par système" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Tous les systèmes</SelectItem>
              {systemes.map((systeme) => (
                <SelectItem key={systeme.id} value={systeme.id.toString()}>
                  {systeme.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Système</TableHead>
              <TableHead>Marque</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEquipements.map((equipement) => (
              <TableRow key={equipement.id}>
                <TableCell>{equipement.nom}</TableCell>
                <TableCell>{systemes.find(systeme => systeme.id === equipement.idSysteme)?.nom}</TableCell>
                <TableCell>{marques.find(marque => marque.id === equipement.idMarqueSsi)?.nom}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <FaEdit className="text-blue-500 cursor-pointer" onClick={() => handleEditEquipement(equipement.id)} />
                    <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDeleteEquipement(equipement.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-center mt-4">
          {Array.from({ length: Math.ceil(filteredEquipements.length / itemsPerPage) }, (_, index) => (
            <Button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`mx-1 ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
            >
              {index + 1}
            </Button>
          ))}
        </div>

        {selectedEquipement && (
          <Dialog open={selectedEquipement !== null} onOpenChange={() => setSelectedEquipement(null)}>
            <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle>Modifier l'Équipement</DialogTitle>
                <DialogDescription>Modifiez les détails de l'équipement.</DialogDescription>
              </DialogHeader>
              <div>
                <Label htmlFor='nom'>Nom équipement</Label>
                <Input
                  name="nom"
                  placeholder="Nom"
                  onChange={(e) => setSelectedEquipement({ ...selectedEquipement, nom: e.target.value })}
                  value={selectedEquipement.nom}
                  className="mb-4"
                />
                <Label htmlFor='idSysteme'>Système</Label>
                <Select
                  value={selectedEquipement.idSysteme.toString()}
                  onValueChange={(value) => setSelectedEquipement({ ...selectedEquipement, idSysteme: parseInt(value) })}
                >
                  <SelectTrigger className="w-full mb-4">
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
                <Label htmlFor='idMarqueSsi'>Marque</Label>
                <Select
                  value={selectedEquipement.idMarqueSsi.toString()}
                  onValueChange={(value) => setSelectedEquipement({ ...selectedEquipement, idMarqueSsi: parseInt(value) })}
                >
                  <SelectTrigger className="w-full mb-4">
                    <SelectValue placeholder="Sélectionnez une marque" />
                  </SelectTrigger>
                  <SelectContent>
                    {marques.map((marque) => (
                      <SelectItem key={marque.id} value={marque.id.toString()}>
                        {marque.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Label htmlFor='idModeleSsi'>Modèle</Label>
                <Select
                  value={selectedEquipement.idModeleSsi.toString()}
                  onValueChange={(value) => setSelectedEquipement({ ...selectedEquipement, idModeleSsi: parseInt(value) })}
                >
                  <SelectTrigger className="w-full mb-4">
                    <SelectValue placeholder="Sélectionnez un modèle" />
                  </SelectTrigger>
                  <SelectContent>
                    {modeles.map((modele) => (
                      <SelectItem key={modele.id} value={modele.id.toString()}>
                        {modele.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleUpdateEquipement} className="w-full bg-blue-500 text-white hover:bg-blue-600">
                  Modifier
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <Dialog open={isDeleteDialogOpen} onOpenChange={cancelDeleteEquipement}>
          <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
            <DialogHeader>
              <DialogTitle>Confirmation de Suppression</DialogTitle>
              <DialogDescription>Êtes-vous sûr de vouloir supprimer cet équipement ?</DialogDescription>
            </DialogHeader>
            <div className="flex justify-between">
              <Button onClick={confirmDeleteEquipement} className="bg-red-500 text-white hover:bg-red-600">
                Supprimer
              </Button>
              <Button onClick={cancelDeleteEquipement} className="bg-gray-500 text-white hover:bg-gray-600">
                Annuler
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ToastContainer />
    </>
  );
};

export default EquipementPage;