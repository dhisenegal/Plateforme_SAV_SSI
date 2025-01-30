'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { getExtincteursForSystem } from '@/actions/technicien/planning';

interface Extincteur {
  id: number;
  status: string;
  location: string;
  number: string;
  extinguisher: {
    typePression: string;
    modeVerification: string;
    chargeReference: string;
    TypeExtincteur: {
      nom: string;
    }
  }
}

export default function ExtincteurPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const installationId = searchParams.get('installationId');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [extincteurData, setExtincteurData] = useState<Extincteur | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // État pour les informations utilisateur avec la date et l'heure actuelles
  const [userInfo] = useState({
    currentUser: 'Narou98',
    currentDate: '2025-01-30 01:00:36'
  });

  const form = useForm({
    defaultValues: {
      number: '',
      location: '',
      status: '',
      typePression: '',
      modeVerification: '',
      chargeReference: '',
      typeExtincteur: ''
    }
  });

  useEffect(() => {
    const fetchExtincteurData = async () => {
      if (!installationId) {
        setError("ID de l'installation manquant");
        setLoading(false);
        return;
      }

      const idNumber = parseInt(installationId);
      if (isNaN(idNumber)) {
        setError("ID de l'installation invalide");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching data for Installation ID:', idNumber);
        const response = await getExtincteursForSystem(idNumber);
        
        if (!response.success) {
          throw new Error(response.message || 'Erreur lors de la récupération des données');
        }

        if (response.data.length > 0) {
          const extincteur = response.data[0];
          setExtincteurData(extincteur);
          
          form.reset({
            number: extincteur.number,
            location: extincteur.location,
            status: extincteur.status,
            typePression: extincteur.extinguisher.typePression,
            modeVerification: extincteur.extinguisher.modeVerification,
            chargeReference: extincteur.extinguisher.chargeReference,
            typeExtincteur: extincteur.extinguisher.TypeExtincteur.nom
          });
        } else {
          setError("Aucun extincteur trouvé pour cette installation");
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des données:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchExtincteurData();
  }, [installationId, form]);

  const handleSave = async (data: any) => {
    try {
      setIsSaving(true);
      console.log('Sauvegarde des données:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Ajoutez ici votre logique de sauvegarde
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleValidate = async () => {
    try {
      setIsSaving(true);
      console.log('Validation des données');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsConfirmDialogOpen(false);
      // Ajoutez ici votre logique de validation
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg">Chargement des données...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md m-4">
        <p className="text-red-600">{error}</p>
        <Button
          onClick={() => router.back()}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
        >
          Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
              <div className="border-b pb-4 mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Détails de l'extincteur</h1>
                <div className="text-sm text-gray-500 mt-2">
                  <p>Utilisateur: {userInfo.currentUser}</p>
                  <p>Date d'inspection: {userInfo.currentDate}</p>
                </div>
              </div>

              {extincteurData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h2 className="font-semibold text-gray-700">Numéro</h2>
                    <p className="text-gray-900 mt-1">{extincteurData.number}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <h2 className="font-semibold text-gray-700">Emplacement</h2>
                    <p className="text-gray-900 mt-1">{extincteurData.location}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <h2 className="font-semibold text-gray-700">Type d'extincteur</h2>
                    <p className="text-gray-900 mt-1">{extincteurData.extinguisher.TypeExtincteur.nom}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <h2 className="font-semibold text-gray-700">Statut</h2>
                    <p className="text-gray-900 mt-1">{extincteurData.status}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <h2 className="font-semibold text-gray-700">Type de pression</h2>
                    <p className="text-gray-900 mt-1">{extincteurData.extinguisher.typePression}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <h2 className="font-semibold text-gray-700">Mode de vérification</h2>
                    <p className="text-gray-900 mt-1">{extincteurData.extinguisher.modeVerification}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <h2 className="font-semibold text-gray-700">Charge de référence</h2>
                    <p className="text-gray-900 mt-1">{extincteurData.extinguisher.chargeReference}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4 mt-6">
                <Button
                  type="button"
                  onClick={() => router.back()}
                  className="bg-gray-500 hover:bg-gray-600 text-white"
                >
                  Retour
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving || isSuspended}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    form.trigger();
                    if (form.formState.isValid) {
                      setIsConfirmDialogOpen(true);
                    }
                  }}
                  disabled={isSaving || isSuspended}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  {isSaving ? 'Validation...' : 'Valider'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle>Confirmation de Validation</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir valider les informations ?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-between mt-6">
            <Button
              onClick={handleValidate}
              className="bg-green-500 text-white hover:bg-green-600"
            >
              Oui
            </Button>
            <Button
              onClick={() => setIsConfirmDialogOpen(false)}
              className="bg-gray-500 text-white hover:bg-gray-600"
            >
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}