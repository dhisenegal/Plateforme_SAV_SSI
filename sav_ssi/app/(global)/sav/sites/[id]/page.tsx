"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaCalendarAlt, FaClock, FaFileAlt, FaArrowLeft, FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { planifierMaintenance } from '@/actions/sav/maintenance';
import { getAllTechniciens } from '@/actions/sav/technicien';
import { getContactsBySite } from '@/actions/sav/contact';
import { getInstallationsBySite } from '@/actions/sav/installation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import dynamic from 'next/dynamic';
const SiteDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);
  const [activeTab, setActiveTab] = useState("interventions");
  const [isOpen, setIsOpen] = useState(false);
  const [installations, setInstallations] = useState<any[]>([]);
  const [selectedInstallation, setSelectedInstallation] = useState<any>(null);
  const [techniciens, setTechniciens] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    numero: '',
    dateMaintenance: '',
    description: '',
    typeMaintenance: '',
    idTechnicien: 0,
    idContact: 0,
    idInstallation: 0
  });
  const MaintenanceTab = dynamic(() => import('@/components/sav/MaintenanceTab'),
   { ssr: false });
  const EquipementTab = dynamic(() => import('@/components/sav/EquipementTab'), { ssr: false });
  const DetailSiteTab = dynamic(() => import('@/components/sav/ContactSiteTab'), { ssr: false });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [installationsData, techniciensData, contactsData] = await Promise.all([
          getInstallationsBySite(id),
          getAllTechniciens(),
          getContactsBySite(id)
        ]);

        setInstallations(installationsData);
        setTechniciens(techniciensData);
        setContacts(contactsData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };

    if (isOpen) {
      loadInitialData();
    }
  }, [id, isOpen]);

  const handleInstallationSelect = (installationId: string) => {
    const installation = installations.find(i => i.id === parseInt(installationId));
    setSelectedInstallation(installation);
    setFormData(prev => ({ ...prev, idInstallation: parseInt(installationId) }));
  };

  const handleSubmit = async () => {
    try {
      await planifierMaintenance({
        ...formData,
        idSite: id,
        statut: 'PLANIFIE',
        dateMaintenance: new Date(formData.dateMaintenance).toISOString()
      });
      toast.success("Maintenance planifiée avec succès");
      setIsOpen(false);
      // Vous pouvez ajouter ici un callback pour rafraîchir la liste des maintenances
    } catch (error) {
      console.error("Erreur lors de la planification:", error);
    }
  };


  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleBackClick = () => {
    router.push("/sav/sites");
  };

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleBackClick}
            className="flex items-center mb-4 text-gray-800 hover:underline"
          >
            <FaArrowLeft className="mr-2" />
            Retour
          </button>
          <Button onClick={() => setIsOpen(true)} 
          className="mb-4 bg-blue-500 text-white hover:bg-blue-600">
            Planifier une maintenance
          </Button>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Planifier une nouvelle maintenance</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Installation</label>
                <Select onValueChange={handleInstallationSelect}>
                  <SelectTrigger>
                    Sélectionner une installation
                  </SelectTrigger>
                  <SelectContent>
                    {installations.map((installation) => (
                      <SelectItem key={installation.id} value={installation.id.toString()}>
                        {`${installation.Systeme.nom} - Installé le ${new Date(installation.dateInstallation).toLocaleDateString()}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedInstallation && (
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Détails de l'installation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Système: {selectedInstallation.Systeme.nom}</p>
                      <p>Date d'installation: {new Date(selectedInstallation.dateInstallation).toLocaleDateString()}</p>
                      {selectedInstallation.dateMaintenance && (
                        <p>Dernière maintenance: {new Date(selectedInstallation.dateMaintenance).toLocaleDateString()}</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Numéro</label>
                <Input
                  value={formData.numero}
                  onChange={(e) => setFormData(prev => ({ ...prev, numero: e.target.value }))}
                  placeholder="Numéro de maintenance"
                />
              </div>

              <div>
                <label className="block mb-2">Date prévue</label>
                <Input
                  type="date"
                  value={formData.dateMaintenance}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateMaintenance: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block mb-2">Description</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description des travaux à effectuer"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block mb-2">Type de maintenance</label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, typeMaintenance: value }))}>
                  <SelectTrigger>
                    Sélectionner un type
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preventive">Préventive</SelectItem>
                    <SelectItem value="curative">Curative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block mb-2">Technicien</label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, idTechnicien: parseInt(value) }))}>
                  <SelectTrigger>
                    Sélectionner un technicien
                  </SelectTrigger>
                  <SelectContent>
                    {techniciens.map((tech) => (
                      <SelectItem key={tech.id} value={tech.id.toString()}>
                        {`${tech.prenom} ${tech.nom}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block mb-2">Contact sur site</label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, idContact: parseInt(value) }))}>
                  <SelectTrigger>
                    Sélectionner un contact
                  </SelectTrigger>
                  <SelectContent>
                    {contacts.map((contact) => (
                      <SelectItem key={contact.id} value={contact.id.toString()}>
                        {`${contact.prenom} ${contact.nom}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              Planifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col items-center p-4 bg-white shadow rounded-lg">
            <div className="bg-blue-500 p-3 rounded-full mb-2">
              <FaCalendarAlt className="text-white w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-center">Prochaine maintenance</h3>
            <p className="text-lg font-semibold text-center mt-2">12/12/2023</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-white shadow rounded-lg">
            <div className="bg-blue-500 p-3 rounded-full mb-2">
              <FaClock className="text-white w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-center">Dernière maintenance</h3>
            <p className="text-lg font-semibold text-center mt-2">10/10/2023</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-white shadow rounded-lg">
            <div className="bg-blue-500 p-3 rounded-full mb-2">
              <FaFileAlt className="text-white w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-center">Rapports générés</h3>
            <p className="text-lg font-semibold text-center mt-2">5 Rapports</p>
          </div>
        </div>

        <div className="flex space-x-4 mb-6 border-b-2 border-gray-200">
          <button
            className={`py-2 px-4 ${activeTab === "interventions" ? "border-b-4 border-blue-500 text-blue-500" : "border-b-4 border-transparent text-gray-500"}`}
            onClick={() => handleTabChange("interventions")}
          >
            Maintenances
          </button>
          <button
            className={`py-2 px-4 ${activeTab === "equipments" ? "border-b-4 border-blue-500 text-blue-500" : "border-b-4 border-transparent text-gray-500"}`}
            onClick={() => handleTabChange("equipments")}
          >
            Équipements
          </button>
          <button
            className={`py-2 px-4 ${activeTab === "details" ? "border-b-4 border-blue-500 text-blue-500" : "border-b-4 border-transparent text-gray-500"}`}
            onClick={() => handleTabChange("details")}
          >
            Contacts
          </button>
        </div>

        {activeTab === "interventions" && (
          <MaintenanceTab id={id} />
        )}

        {activeTab === "equipments" && (
          <EquipementTab id={id} />
        )}

        {activeTab === "details" && (
          <div>
            {/* Contenu du tab "Détails" */}
            <DetailSiteTab id={id} />
          </div>
        )}
      </div>

      <ToastContainer />
    </>
  );
};

export default SiteDetailsPage;