'use client';

import React, { useEffect, useState } from 'react';
import { fetchDetails } from '@/lib/fonctionas';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { useParams, useSearchParams } from 'next/navigation';
import { formatDate } from '@/lib/fonction';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FaCheckCircle, FaTimesCircle, FaEdit } from 'react-icons/fa';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { updateIntervention, updateInterventionStatus } from '@/actions/technicien/planning';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogOverlay, DialogClose } from '@radix-ui/react-dialog';
import InterventionSection from '@/actions/technicien/InterventionSection'; // Import the new component

// Schéma de validation du formulaire avec Zod
const formSchema = z.object({
  diagnostic: z.string().min(1, {
    message: 'Diagnostic is required.'
  }),
  travauxRealises: z.string().min(1, {
    message: 'Travaux réalisés are required.'
  })
});

type DetailsPageProps = {
  error: string | null;
};

// Composant personnalisé DialogHeader
const DialogHeader: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="mb-4">
    <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
    <DialogDescription className="text-sm text-gray-500">{description}</DialogDescription>
  </div>
);

// Composant principal
const DetailsPage: React.FC<DetailsPageProps> = ({ error }) => {
  const params = useParams();
  const searchParams = useSearchParams();
  const [details, setDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(true); // État pour contrôler l'édition
  const [isSuspended, setIsSuspended] = useState<boolean>(false); // État pour contrôler la suspension
  const [isOverlayVisible, setIsOverlayVisible] = useState<boolean>(false); // État pour afficher l'overlay
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false); // État pour contrôler l'ouverture de la modale de confirmation
  const [selectedStatus, setSelectedStatus] = useState({});
  const [observations, setObservations] = useState({});
  const [isObservationDialogOpen, setIsObservationDialogOpen] = useState({}); // État pour contrôler l'ouverture de la modale d'observation

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diagnostic: '',
      travauxRealises: ''
    }
  });

  const id = params?.id;
  const type = searchParams?.get('type');

  // Fonction pour sauvegarder les données dans localStorage avec clé unique
  const saveToLocalStorage = (data: z.infer<typeof formSchema>) => {
    localStorage.setItem(`formData-${id}`, JSON.stringify(data));
  };

  // Fonction pour récupérer les données depuis localStorage avec clé unique
  const loadFromLocalStorage = () => {
    const savedData = localStorage.getItem(`formData-${id}`);
    if (savedData) {
      form.reset(JSON.parse(savedData));
    }
  };

  // Fonction de sauvegarde des données
  const handleSave = async (data: z.infer<typeof formSchema>) => {
    setIsSaving(true);
    try {
      console.log('Sauvegarde des informations', data);
      // Logique de sauvegarde ici
      saveToLocalStorage(data); // Sauvegarder les données dans localStorage
      setIsEditable(false); // Rendre les champs statiques après la sauvegarde
    } catch (err) {
      console.error('Erreur lors de la sauvegarde', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Fonction de validation et d'envoi des données à l'API
  const handleValidate = async () => {
    setIsSaving(true);
    try {
      const data = form.getValues();
      console.log('Validation de l\'état', data);

      // Sauvegarder d'abord les données
      await handleSave(data);

      // Appel de la fonction de mise à jour
      const result = await updateIntervention(parseInt(id), data.diagnostic, data.travauxRealises);

      console.log('Données validées avec succès', result);

      // Afficher l'overlay après la validation réussie
      setIsOverlayVisible(true);

      // Recharger les détails depuis la base de données pour mettre à jour les champs avec les dernières valeurs
      const updatedDetails = await fetchDetails(parseInt(id), type);
      setDetails(updatedDetails);
      form.reset({
        diagnostic: updatedDetails.diagnostic || data.diagnostic,
        travauxRealises: updatedDetails.travauxRealises || data.travauxRealises
      });

    } catch (err) {
      console.error('Erreur lors de la validation', err);
    } finally {
      setIsSaving(false);
      setIsConfirmDialogOpen(false); // Ferme la modale après la validation
    }
  };

  // Fonction de suspension/reprise
  const handleSuspendOrResume = async () => {
    setIsSaving(true);
    try {
      const newStatus = isSuspended ? 'EN_COURS' : 'SUSPENDUE';
      const result = await updateInterventionStatus(parseInt(id), newStatus);
      console.log('Statut mis à jour avec succès', result);
      setIsSuspended(!isSuspended);
      // Mettre à jour le statut dans les détails
      setDetails((prevDetails: any) => ({
        ...prevDetails,
        statut: newStatus
      }));
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Effet pour récupérer les détails lors du montage du composant
  useEffect(() => {
    if (id && type) {
      const fetchData = async () => {
        try {
          const fetchedDetails = await fetchDetails(parseInt(id), type);
          setDetails(fetchedDetails);
          // Vérifier et mettre à jour l'état de suspension
          if (fetchedDetails.statut === 'SUSPENDUE') {
            setIsSuspended(true);
          }
          form.reset({
            diagnostic: fetchedDetails.diagnostic || '',
            travauxRealises: fetchedDetails.travauxRealises || ''
          });
        } catch (err) {
          console.error('Erreur lors de la récupération des détails', err);
          setDetails(null);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setLoading(false);
    }

    // Charger les données depuis localStorage
    loadFromLocalStorage();
  }, [id, type]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 bg-red-50 text-red-700 border border-red-300 rounded-lg shadow-sm">
        <p className="text-center font-medium">{error}</p>
      </div>
    );
  }

  const handleStatusChange = (taskIdx, status) => {
    setSelectedStatus((prev) => ({ ...prev, [taskIdx]: status }));
  };

  const handleObservationChange = (taskIdx, observation) => {
    setObservations((prev) => ({ ...prev, [taskIdx]: observation }));
  };

  return (
    <Card className="mx-auto w-full max-w-4xl relative">
      {isOverlayVisible && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 z-10 flex justify-center items-center">
          <div className="text-white text-xl">Les informations ont été validées avec succès</div>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          Détails {type === 'maintenance' ? 'de la maintenance' : 'de l\'intervention'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-8 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-5">
                <FormItem>
                  <FormLabel>Date de la maintenance</FormLabel>
                  <FormControl>
                    <Input value="30/12/2024" readOnly />
                  </FormControl>
                </FormItem>
                <FormItem>
                  <FormLabel>Nom du client</FormLabel>
                  <FormControl>
                    <Input value={details.clientName || 'N/A'} readOnly />
                  </FormControl>
                </FormItem>
                <FormItem>
                  <FormLabel>Site</FormLabel>
                  <FormControl>
                    <Input value={details.siteName || 'N/A'} readOnly />
                  </FormControl>
                </FormItem>
                <FormItem>
                  <FormLabel>Date de déclaration de la panne</FormLabel>
                  <FormControl>
                    <Input value={formatDate('2024-12-12')} readOnly />
                  </FormControl>
                </FormItem>
              </div>
              <div className="space-y-5">
                <FormItem>
                  <FormLabel>Système</FormLabel>
                  <FormControl>
                    <Input value={details.systeme || 'N/A'} readOnly />
                  </FormControl>
                </FormItem>
                <FormItem>
                  <FormLabel>Type de panne déclarée</FormLabel>
                  <FormControl>
                    <Input value={details.description || 'Aucune description disponible'} readOnly />
                  </FormControl>
                </FormItem>
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <FormControl>
                    <Input
                      value={details.statut ? details.statut : 'Non défini'}
                      readOnly
                      className={
                        details.statut === 'SUSPENDUE'
                          ? 'text-red-500 font-bold'
                          : details.statut === 'EN_COURS'
                          ? 'text-green-500 font-bold'
                          : ''
                      }
                    />
                  </FormControl>
                </FormItem>
                <FormItem>
                  <FormLabel>Matériel sous garantie</FormLabel>
                  <FormControl>
                    <Input value="Oui" readOnly className="text-blue-400" />
                  </FormControl>
                </FormItem>
              </div>
            </div>

            {/* Section spécifique à l'intervention */}
            {type === 'intervention' && (
              <InterventionSection form={form} isEditable={isEditable} />
            )}
            {/* Section spécifique à la maintenance */}
 {type === 'maintenance' && details.systeme === 'SYSTÈME DE DETECTION INCENDIE CONVENTIONNEL' && (
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
)}
            {/* Boutons Suspendre/Reprendre, Sauvegarder et Valider */}
            <div className="flex justify-end space-x-4 mt-6">
              <Button
                onClick={handleSuspendOrResume}
                disabled={isSaving}
                className={isSuspended ? 'bg-orange-500 hover:bg-orange-600' : 'bg-red-500 hover:bg-red-600'}
              >
                {isSuspended ? 'Reprendre' : 'Suspendre'}
              </Button>
              <Button type="submit" disabled={isSaving} className="bg-blue-500 hover:bg-blue-600">
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
              <Button onClick={() => setIsConfirmDialogOpen(true)} disabled={isSaving} className="bg-green-500 hover:bg-green-600">
                {isSaving ? 'Validation...' : 'Valider'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>

      {/* Modale de confirmation */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
          <DialogHeader title="Confirmation de Validation" description="Êtes-vous sûr de vouloir valider les informations ?" />
          <div className="flex justify-between">
            <Button
              onClick={() => {
                handleValidate();
              }}
              className="bg-green-500 text-white hover:bg-green-600"
            >
              Oui
            </Button>
            <Button onClick={() => setIsConfirmDialogOpen(false)} className="bg-gray-500 text-white hover:bg-gray-600">
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DetailsPage;