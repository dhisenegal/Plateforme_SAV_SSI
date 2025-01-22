"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCommentairesMaintenance, getMaintenancesById } from "@/actions/sav/maintenance";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Calendar, 
  User, 
  Building2, 
  Map, 
  CheckSquare,
  AlertCircle,
  MessageSquare 
} from "lucide-react";

const MaintenanceDetails = () => {
  const params = useParams();
  const [maintenance, setMaintenance] = useState(null);
  const [commentaires, setCommentaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!params.id) return;
      
      try {
        const [maintenanceData, commentairesData] = await Promise.all([
          getMaintenancesById(parseInt(params.id)),
          getCommentairesMaintenance(parseInt(params.id))
        ]);
        
        if (!maintenanceData) {
          throw new Error("Maintenance non trouvée");
        }

        setMaintenance(maintenanceData);
        setCommentaires(commentairesData || []);
      } catch (error) {
        console.error("Erreur:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Erreur: {error}</div>;
  }

  if (!maintenance) {
    return <div className="p-4">Maintenance non trouvée</div>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "PLANIFIE": return "bg-blue-100 text-blue-800";
      case "EN_COURS": return "bg-yellow-100 text-yellow-800";
      case "TERMINE": return "bg-green-100 text-green-800";
      case "SUSPENDU": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const renderClientInfo = () => {
    const client = maintenance.Contact?.Client;
    if (!client) return "Information non disponible";
    return client.nom;
  };
  
  const renderContactInfo = () => {
    const contact = maintenance.Contact;
    if (!contact?.Utilisateur) return "Information non disponible";
    return `${contact.Utilisateur.prenom} ${contact.Utilisateur.nom}`;
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Maintenance #{maintenance.numero || 'N/A'}</h1>
          <Badge className={getStatusColor(maintenance.statut)}>
            {maintenance.statut || 'STATUT INCONNU'}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="commentaires">Commentaires</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Informations Générales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Date planifiée: {maintenance.datePlanifiee ? new Date(maintenance.datePlanifiee).toLocaleDateString() : 'Non planifiée'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>Technicien: {maintenance.Technicien ? `${maintenance.Technicien.prenom || ''} ${maintenance.Technicien.nom || ''}`.trim() : 'Non assigné'}</span>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Description:</h4>
                  <p className="text-gray-600">{maintenance.description || 'Aucune description'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Informations Client
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span>Client: {renderClientInfo()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Map className="h-4 w-4 text-gray-500" />
                  <span>Site: {maintenance.Site?.nom || 'Non spécifié'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>Contact: {renderContactInfo()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                Liste des Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenance.Actions?.length > 0 ? (
                  maintenance.Actions.map((action) => (
                    <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-2">
                        {action.statut ? 
                          <CheckSquare className="h-5 w-5 text-green-500" /> :
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        }
                        <span>{action.Action?.libeleAction || 'Action non spécifiée'}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {action.observation || "Aucune observation"}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4 text-gray-500">
                    Aucune action disponible
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commentaires">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Commentaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commentaires.length > 0 ? (
                  commentaires.map((commentaire) => (
                    <div key={commentaire.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">
                          {commentaire.Utilisateur ? `${commentaire.Utilisateur.prenom || ''} ${commentaire.Utilisateur.nom || ''}`.trim() : 'Utilisateur inconnu'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {commentaire.dateCommentaire ? new Date(commentaire.dateCommentaire).toLocaleString() : 'Date inconnue'}
                        </span>
                      </div>
                      <p className="text-gray-600">{commentaire.commentaire || 'Aucun contenu'}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4 text-gray-500">
                    Aucun commentaire disponible
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MaintenanceDetails;