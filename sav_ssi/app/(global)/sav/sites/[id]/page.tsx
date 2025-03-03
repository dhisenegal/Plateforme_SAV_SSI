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