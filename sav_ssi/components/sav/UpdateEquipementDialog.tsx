import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const UpdateEquipmentDialog = ({ 
  isOpen, 
  onClose, 
  equipment, 
  onUpdate, 
  availableEquipments,
  systemes 
}) => {
  // Fonction utilitaire pour formater les dates
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error("Erreur de formatage de date:", error);
      return "";
    }
  };

  const [formData, setFormData] = useState({
    idEquipement: "",
    Emplacement: "",
    HorsService: false,
    Commentaires: "",
    Numero: "",
    dateInstallation: "",
    observations: ""
  });

  const [extincteurData, setExtincteurData] = useState({
    dateFabrication: "",
    datePremierChargement: "",
    dateDernierChargement: ""
  });

  useEffect(() => {
    if (equipment) {
      console.log("Données reçues:", equipment); // Pour le débogage
      
      setFormData({
        idEquipement: equipment.idEquipement,
        Emplacement: equipment.Emplacement || "",
        HorsService: equipment.HorsService || false,
        Commentaires: equipment.Commentaires || "",
        Numero: equipment.Numero || "",
        dateInstallation: formatDateForInput(equipment.dateInstallation),
        observations: equipment.observations || ""
      });

      // Gestion des données d'extincteur
      if (equipment.InstallationExtincteur?.[0]) {
        const extincteur = equipment.InstallationExtincteur[0];
        console.log("Données extincteur:", extincteur); // Pour le débogage
        
        setExtincteurData({
          dateFabrication: formatDateForInput(extincteur.DateFabrication),
          datePremierChargement: formatDateForInput(extincteur.DatePremierChargement),
          dateDernierChargement: formatDateForInput(extincteur.DateDerniereVerification)
        });
      }
    }
  }, [equipment]);

  const isExtincteurSystem = (systemeId) => {
    const systeme = systemes.find(s => s.id === systemeId);
    return systeme?.nom === "MOYENS DE SECOURS EXTINCTEURS";
  };

  const handleSubmit = async () => {
    const updateData = {
      ...formData,
      dateInstallation: formData.dateInstallation,
      extincteurData: isExtincteurSystem(equipment.Installation.idSysteme) ? {
        dateFabrication: new Date(extincteurData.dateFabrication),
        datePremierChargement: extincteurData.datePremierChargement ? 
          new Date(extincteurData.datePremierChargement) : undefined,
        dateDernierChargement: extincteurData.dateDernierChargement ? 
          new Date(extincteurData.dateDernierChargement) : undefined
      } : undefined
    };

    console.log("Données envoyées:", updateData); // Pour le débogage
    await onUpdate(updateData);
    onClose();
  };

  // Affichage des valeurs actuelles pour le débogage
  useEffect(() => {
    console.log("Form Data:", formData);
    console.log("Extincteur Data:", extincteurData);
  }, [formData, extincteurData]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[500px] max-h-[80vh] bg-white rounded-lg shadow-lg">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Modifier l'Équipement</DialogTitle>
          <DialogDescription>Modifiez les détails de l'équipement.</DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 overflow-y-auto max-h-[calc(80vh-160px)]">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="equipement">Équipement</Label>
              <Select
                value={formData.idEquipement?.toString()}
                onValueChange={(value) => setFormData({ ...formData, idEquipement: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez un équipement" />
                </SelectTrigger>
                <SelectContent>
                  {availableEquipments.map((equip) => (
                    <SelectItem key={equip.id} value={equip.id.toString()}>
                      {equip.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateInstallation">Date d'installation</Label>
              <Input
                id="dateInstallation"
                type="date"
                value={formData.dateInstallation}
                onChange={(e) => setFormData({ ...formData, dateInstallation: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero">Numéro</Label>
              <Input
                id="numero"
                value={formData.Numero}
                onChange={(e) => setFormData({ ...formData, Numero: e.target.value })}
                placeholder="Numéro"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="emplacement">Emplacement</Label>
              <Input
                id="emplacement"
                value={formData.Emplacement}
                onChange={(e) => setFormData({ ...formData, Emplacement: e.target.value })}
                placeholder="Emplacement"
              />
            </div>

            <div className="col-span-2 flex items-center justify-between">
              <Label htmlFor="horsService">Hors service</Label>
              <Switch
                id="horsService"
                checked={formData.HorsService}
                onCheckedChange={(checked) => setFormData({ ...formData, HorsService: checked })}
              />
            </div>

            {isExtincteurSystem(equipment?.Installation?.idSysteme) && (
              <div className="col-span-2 space-y-4 border-t pt-4">
                <h3 className="font-medium text-sm">Informations Extincteur</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateFabrication">Date de fabrication</Label>
                    <Input
                      id="dateFabrication"
                      type="date"
                      value={extincteurData.dateFabrication}
                      onChange={(e) => setExtincteurData({ 
                        ...extincteurData, 
                        dateFabrication: e.target.value 
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="datePremierChargement">Premier chargement</Label>
                    <Input
                      id="datePremierChargement"
                      type="date"
                      value={extincteurData.datePremierChargement}
                      onChange={(e) => setExtincteurData({ 
                        ...extincteurData, 
                        datePremierChargement: e.target.value 
                      })}
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="dateDernierChargement">Dernier chargement</Label>
                    <Input
                      id="dateDernierChargement"
                      type="date"
                      value={extincteurData.dateDernierChargement}
                      onChange={(e) => setExtincteurData({ 
                        ...extincteurData, 
                        dateDernierChargement: e.target.value 
                      })}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="col-span-2 space-y-2">
              <Label htmlFor="commentaires">Commentaires</Label>
              <Input
                id="commentaires"
                value={formData.Commentaires}
                onChange={(e) => setFormData({ ...formData, Commentaires: e.target.value })}
                placeholder="Commentaires"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t mt-auto">
          <div className="flex justify-end space-x-2">
            <Button onClick={onClose} variant="outline">
              Annuler
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-500 text-white hover:bg-blue-600">
              Enregistrer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateEquipmentDialog;