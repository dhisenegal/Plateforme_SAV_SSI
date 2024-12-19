"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaCalendarAlt, FaClock, FaFileAlt, FaArrowLeft, FaPlus } from "react-icons/fa";
import EquipementTab from "@/components/sav/EquipementTab";
import MaintenanceTab from "@/components/sav/MaintenanceTab";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DetailSiteTab from "@/components/sav/ContactSiteTab";
import { planifierMaintenance } from "@/actions/sav/maintenance";
import { getAllTechniciens } from "@/actions/sav/technicien";
import { getContactsBySite } from "@/actions/sav/contact";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

const SiteDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);
  const [activeTab, setActiveTab] = useState("interventions");
  const [numero, setNumero] = useState("");
  const [dateMaintenance, setDateMaintenance] = useState("");
  const [description, setDescription] = useState("");
  const [statut, setStatut] = useState("planifiée");
  const [typeMaintenance, setTypeMaintenance] = useState("curative");
  const [idTechnicien, setIdTechnicien] = useState(0);
  const [idContact, setIdContact] = useState(0);
  const [techniciens, setTechniciens] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [associerContact, setAssocierContact] = useState(false);

  useEffect(() => {
    const fetchTechniciens = async () => {
      try {
        const techniciens = await getAllTechniciens();
        setTechniciens(techniciens);
      } catch (error) {
        console.error("Erreur lors de la récupération des techniciens:", error);
      }
    };

    const fetchContacts = async () => {
      try {
        const contacts = await getContactsBySite(id);
        setContacts(contacts);
      } catch (error) {
        console.error("Erreur lors de la récupération des contacts:", error);
      }
    };

    fetchTechniciens();
    fetchContacts();
  }, [id]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleBackClick = () => {
    router.push("/sav/maintenances");
  };

  const handlePlanifierMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();

    const maintenanceData = {
      numero,
      dateMaintenance,
      description,
      statut,
      typeMaintenance,
      idSite: id,
      idTechnicien,
      idContact,
    };

    console.log("Données envoyées pour la planification de la maintenance:", JSON.stringify(maintenanceData, null, 2));

    try {
      await planifierMaintenance(maintenanceData);

      toast.success("Maintenance planifiée avec succès !");
      setNumero("");
      setDateMaintenance("");
      setDescription("");
      setStatut("planifiée");
      setTypeMaintenance("curative");
      setIdTechnicien(0);
      setIdContact(0);
      setAssocierContact(false);
    } catch (error) {
      toast.error("Erreur lors de la planification de la maintenance.");
      console.error("Erreur lors de la planification de la maintenance:", error);
    }
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
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center mb-4 bg-blue-500 text-white hover:bg-blue-600 p-3 rounded-lg">
                <FaPlus className="mr-2" />
                Récurrence
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Planifier une maintenance</DialogTitle>
                <DialogDescription>Remplissez les détails pour planifier une maintenance</DialogDescription>
              </DialogHeader>
              <form onSubmit={handlePlanifierMaintenance}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 gap-4">
                    <Label htmlFor="numero">Numéro</Label>
                    <Input
                      id="numero"
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                      placeholder="Numéro de maintenance"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <Label htmlFor="dateMaintenance">Date</Label>
                    <Input
                      id="dateMaintenance"
                      type="date"
                      value={dateMaintenance}
                      onChange={(e) => setDateMaintenance(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Description de la maintenance"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <Label htmlFor="typeMaintenance">Type</Label>
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
                  <div className="grid grid-cols-1 gap-4">
                    <Label htmlFor="idTechnicien">Technicien</Label>
                    <Select
                      id="idTechnicien"
                      value={idTechnicien}
                      onValueChange={(value) => setIdTechnicien(Number(value))}
                      required
                    >
                      <SelectTrigger>Choisir un technicien</SelectTrigger>
                      <SelectContent>
                        <SelectItem value={0} disabled>Choisir un technicien</SelectItem>
                        {techniciens.map((technicien) => (
                          <SelectItem key={technicien.id} value={technicien.id}>
                            {technicien.prenom} {technicien.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <Label htmlFor="associerContact">Associer un contact</Label>
                    <Input
                      id="associerContact"
                      type="checkbox"
                      checked={associerContact}
                      onChange={(e) => setAssocierContact(e.target.checked)}
                    />
                  </div>
                  {associerContact && (
                    <div className="grid grid-cols-1 gap-4">
                      <Label htmlFor="idContact">Contact</Label>
                      <Select
                        id="idContact"
                        value={idContact}
                        onValueChange={(value) => setIdContact(Number(value))}
                        required
                      >
                        <SelectTrigger>Choisir un contact</SelectTrigger>
                        <SelectContent>
                          <SelectItem value={0} disabled>Choisir un contact</SelectItem>
                          {contacts.map((contact) => (
                            <SelectItem key={contact.id} value={contact.id}>
                              {contact.prenom} {contact.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-blue-700 hover:bg-blue-600 text-white">
                    Planifier
                  </Button>
                </DialogFooter>
              </form>
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
            Détails
          </button>
        </div>

        {activeTab === "interventions" && (
          <MaintenanceTab siteId={id} />
        )}

        {activeTab === "equipments" && (
          <EquipementTab siteId={id} />
        )}

        {activeTab === "details" && (
          <div>
            {/* Contenu du tab "Détails" */}
            <DetailSiteTab siteId={id} />
          </div>
        )}
      </div>

      <ToastContainer />
    </>
  );
};

export default SiteDetailsPage;