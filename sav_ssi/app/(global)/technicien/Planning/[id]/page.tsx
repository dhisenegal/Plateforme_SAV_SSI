'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { fetchDetails } from '@/lib/fonctionas';
import { formatDate } from '@/lib/fonction';
import {
  getSystemIdFromInstallation,
  getActionsBySystem
} from '@/actions/admin/maintenanceAction';
import {
  updateIntervention,
  updateInterventionStatus,
  updateMaintenanceStatus,
  updateMaintenanceAction,
  updateMaintenance
} from '@/actions/technicien/planning';

import InterventionSection from '@/actions/technicien/InterventionSection';
import ExtincteursPageContent from '@/actions/technicien/Extinteur';

import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@radix-ui/react-dialog';

const formSchema = z.object({
  diagnostic: z.string().min(1, { message: 'Diagnostic is required.' }),
  travauxRealises: z.string().min(1, { message: 'Travaux réalisés are required.' }),
  dureeHeure: z.string().min(1, { message: 'La durée de l\'intervention est requise.' }),
  Heureint: z.string().min(1, { message: 'L\'heure de l\'intervention est requise.' }),
  dateIntervention: z.string().min(1, { message: 'Date of intervention is required.' }),
  Heuredebut: z.string().min(1, { message: 'Heure de début is required.' }),
  Heuredefin: z.string().min(1, { message: 'Heure de fin is required.' })
});

interface MaintenanceAction {
  id: number;
  libeleAction: string;
  idSysteme: number;
}

const DialogHeader: React.FC<{ title: string; description: string }> = ({
  title,
  description
}) => (
  <div className="mb-4">
    <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
    <DialogDescription className="text-sm text-gray-500">{description}</DialogDescription>
  </div>
);

type DetailsPageProps = {
  error?: string | null;
};

const DetailsPage: React.FC<DetailsPageProps> = ({ error }) => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Récupère l'id (en tant que string) et le type depuis l'URL
  const idParam = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const type = searchParams?.get('type') || '';

  const [details, setDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSuspended, setIsSuspended] = useState<boolean>(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState<boolean>(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);

  // Actions de maintenance
  const [actions, setActions] = useState<MaintenanceAction[]>([]);
  const [loadingActions, setLoadingActions] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<Record<number, string>>({});
  const [observations, setObservations] = useState<Record<number, string>>({});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diagnostic: '',
      travauxRealises: '',
      dureeHeure: '',
      Heureint: '',
      dateIntervention: '',
      Heuredebut: '',
      Heuredefin: ''
    }
  });

  // Charge les détails ET les actions si nécessaire
  const loadData = useCallback(async () => {
    if (!idParam || !type) return;

    setLoading(true);
    try {
      const fetchedDetails = await fetchDetails(parseInt(idParam), type);
      setDetails(fetchedDetails);

      // SI l'élément est suspendu, on le signale
      if (fetchedDetails.statut === 'SUSPENDU') {
        setIsSuspended(true);
      }

      // Initialise le formulaire
      form.reset({
        diagnostic: fetchedDetails.diagnostics || '',
        travauxRealises: fetchedDetails.travauxRealises || '',
        dureeHeure: fetchedDetails.dureeHeure?.toString() || '',
        dateIntervention: fetchedDetails.dateIntervention
          ? new Date(fetchedDetails.dateIntervention).toISOString().split('T')[0]
          : '',
        Heureint: fetchedDetails.Heureint
          ? new Date(fetchedDetails.Heureint).toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit'
            })
          : '',
        Heuredebut: fetchedDetails.Heuredebut
          ? new Date(fetchedDetails.Heuredebut).toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit'
            })
          : '',
        Heuredefin: fetchedDetails.Heuredefin
          ? new Date(fetchedDetails.Heuredefin).toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit'
            })
          : ''
      });

      // Si c'est une maintenance, charger les actions
      if (type === 'maintenance' && fetchedDetails.idInstallation) {
        setLoadingActions(true);
        try {
          const systemData = await getSystemIdFromInstallation(fetchedDetails.idInstallation);
          if (systemData?.idSysteme) {
            const fetchedActions = await getActionsBySystem(systemData.idSysteme);
            setActions(fetchedActions);

            // Fusionne l'état existant (si "actions déjà remplies") pour pré-remplir
            if (fetchedActions.length > 0 && fetchedDetails.actions) {
              const existingStatus: Record<number, string> = {};
              const existingObservations: Record<number, string> = {};

              fetchedDetails.actions.forEach((saved: any) => {
                const idx = fetchedActions.findIndex((a) => a.id === saved.idAction);
                if (idx !== -1) {
                  existingStatus[idx] = saved.statut ? 'valide' : 'non-valide';
                  existingObservations[idx] = saved.observation || '';
                }
              });
              setSelectedStatus(existingStatus);
              setObservations(existingObservations);
            }
          }
        } catch (err) {
          console.error('Erreur lors du chargement des actions:', err);
          setActions([]);
        } finally {
          setLoadingActions(false);
        }
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des détails:', err);
      setDetails(null);
    } finally {
      setLoading(false);
    }
  }, [idParam, type, form]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Modifie la sélection "valide/non-valide" pour une action de maintenance
  const handleStatusChange = (taskIdx: number, status: string) => {
    setSelectedStatus((prev) => ({ ...prev, [taskIdx]: status }));
  };

  // Modifie l'observation saisie sur l'action de maintenance
  const handleObservationChange = (taskIdx: number, observation: string) => {
    setObservations((prev) => ({ ...prev, [taskIdx]: observation }));
  };

  // Au clic, gère la validation et la redirection
  const handleValidateClick = (paramId: string, currentType: string) => {
    if (currentType === 'maintenance') {
      // Si le système = moyens de secours extincteurs => PDF
      if (details?.systeme === 'MOYENS DE SECOURS EXTINCTEURS') {
        router.push(`/technicien/Maintenances/ExtincteursRecapPDF/${paramId}`);
      } else {
        router.push(`/technicien/Maintenances/${paramId}`);
      }
    } else if (currentType === 'intervention') {
      router.push(`/technicien/Interventions/${paramId}`);
    }
  };

  // Sauvegarde le formulaire (sans valider le statut)
  const handleSave = async (data: z.infer<typeof formSchema>) => {
    if (!idParam || !type) return;
    setIsSaving(true);

    try {
      if (type === 'intervention') {
        const currentDate = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
        const interventionData = {
          diagnostics: data.diagnostic,
          travauxRealises: data.travauxRealises,
          dureeHeure: parseInt(data.dureeHeure),
          Heureint: new Date(`${currentDate}T${data.Heureint}:00`),
          dateIntervention: new Date(data.dateIntervention)
        };
        await updateIntervention(parseInt(idParam), interventionData);
      } else {
        // Maintenance
        const currentDate = new Date().toISOString().split('T')[0];
        if (data.Heuredebut && data.Heuredefin) {
          await updateMaintenance(parseInt(idParam), {
            Heuredebut: new Date(`${currentDate}T${data.Heuredebut}:00`),
            Heuredefin: new Date(`${currentDate}T${data.Heuredefin}:00`)
          });
        }
        // Mettre à jour les actions
        if (actions.length > 0) {
          const actionUpdates = actions.map((action, idx) => ({
            idAction: action.id,
            idMaintenance: parseInt(idParam),
            statut: selectedStatus[idx] === 'valide',
            observation: observations[idx] || ''
          }));
          await updateMaintenanceAction(parseInt(idParam), actionUpdates);
        }
      }

      // Recharge les détails après la sauvegarde
      await loadData();

      alert('Modifications sauvegardées avec succès.');
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      alert('Erreur: la sauvegarde a échoué.');
    } finally {
      setIsSaving(false);
    }
  };

  // Finalise la validation (met le statut à TERMINE + enregistre)
  const handleValidate = async () => {
    if (!idParam || !type) return;
    setIsSaving(true);

    try {
      // Sauvegarde du formulaire
      const currentData = form.getValues();
      await handleSave(currentData);

      // Mettre le statut à TERMINE
      if (type === 'intervention') {
        await updateInterventionStatus(parseInt(idParam), 'TERMINE');
      } else {
        // Maintenance
        const currentDateString = new Date().toISOString().split('T')[0];
        // Mettre "Heuredefin" à maintenant
        await updateMaintenance(parseInt(idParam), {
          Heuredebut: new Date(`${currentDateString}T${currentData.Heuredebut}:00`),
          Heuredefin: new Date()
        });
        await updateMaintenanceStatus(parseInt(idParam), 'TERMINE');

        // Ressaisir les actions (redondant mais sûre pour aligner la fin)
        const updates = actions.map((action, idx) => ({
          idAction: action.id,
          idMaintenance: parseInt(idParam),
          statut: selectedStatus[idx] === 'valide',
          observation: observations[idx] || ''
        }));
        await updateMaintenanceAction(parseInt(idParam), updates);
      }

      setIsOverlayVisible(true);
      await loadData();
    } catch (err) {
      console.error('Erreur lors de la validation:', err);
    } finally {
      setIsSaving(false);
      setIsConfirmDialogOpen(false);
    }
  };

  // Gère la suspension ou la reprise
  const handleSuspendOrResume = async (currentType: 'intervention' | 'maintenance') => {
    if (!idParam) return;
    setIsSaving(true);

    try {
      const newStatus = isSuspended ? 'EN_COURS' : 'SUSPENDU';

      if (currentType === 'intervention') {
        await updateInterventionStatus(parseInt(idParam), newStatus);
      } else {
        await updateMaintenanceStatus(parseInt(idParam), newStatus);
      }
      setIsSuspended(!isSuspended);

      // MàJ local
      setDetails((prev: any) => ({ ...prev, statut: newStatus }));
    } catch (err) {
      console.error('Erreur lors de la suspension/reprise:', err);
    } finally {
      setIsSaving(false);
    }
  };

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

  // Rendu conditionnel du bloc Maintenance
  const renderMaintenanceSection = () => {
    if (type !== 'maintenance' || !details) return null;

    // Cas extincteurs
    if (details.systeme === 'MOYENS DE SECOURS EXTINCTEURS') {
      return <ExtincteursPageContent id={parseInt(idParam as string)} />;
    }

    return (
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-5">
            <FormItem>
              <FormLabel>Heure début</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  {...form.register('Heuredebut')}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </FormControl>
            </FormItem>
          </div>
          <div className="space-y-5">
            <FormItem>
              <FormLabel>Heure fin</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  {...form.register('Heuredefin')}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </FormControl>
            </FormItem>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {details.systeme || 'Système non spécifié'}
        </h2>

        <Table className="min-w-full bg-white border border-gray-200">
          <TableHeader>
            <TableRow>
              <TableHead className="p-3 text-left text-sm font-semibold text-gray-700 border-b w-2/5">
                Tâche
              </TableHead>
              <TableHead className="p-3 text-left text-sm font-semibold text-gray-700 border-b w-1/5">
                Statut
              </TableHead>
              <TableHead className="p-3 text-left text-sm font-semibold text-gray-700 border-b w-2/5">
                Observations
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingActions ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  Chargement des actions...
                </TableCell>
              </TableRow>
            ) : actions.length > 0 ? (
              actions.map((action, idx) => (
                <TableRow key={action.id} className="border-b hover:bg-blue-100">
                  <TableCell className="p-3">{action.libeleAction}</TableCell>
                  <TableCell className="p-3">
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`statut-${idx}`}
                          value="valide"
                          className="hidden"
                          onChange={() => handleStatusChange(idx, 'valide')}
                          disabled={isSuspended}
                        />
                        <FaCheckCircle
                          className={`cursor-pointer ${
                            selectedStatus[idx] === 'valide'
                              ? 'text-green-600'
                              : 'text-gray-400'
                          }`}
                          onClick={() => !isSuspended && handleStatusChange(idx, 'valide')}
                        />
                      </label>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`statut-${idx}`}
                          value="non-valide"
                          className="hidden"
                          onChange={() => handleStatusChange(idx, 'non-valide')}
                          disabled={isSuspended}
                        />
                        <FaTimesCircle
                          className={`cursor-pointer ${
                            selectedStatus[idx] === 'non-valide'
                              ? 'text-red-600'
                              : 'text-gray-400'
                          }`}
                          onClick={() => !isSuspended && handleStatusChange(idx, 'non-valide')}
                        />
                      </label>
                    </div>
                  </TableCell>
                  <TableCell className="p-3">
                    <textarea
                      className="w-full max-w-xs p-2 border border-gray-300 rounded-md"
                      rows={2}
                      placeholder="Observations"
                      value={observations[idx] || ''}
                      onChange={(e) => handleObservationChange(idx, e.target.value)}
                      disabled={isSuspended}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  Aucune action disponible.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Card id="pdf-content" className="mx-auto w-full max-w-4xl relative">
      {/* Overlay de validation */}
      {isOverlayVisible && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 z-10 flex justify-center items-center">
          <div className="text-white text-xl">
            Les informations ont été validées avec succès
          </div>
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          Détails {type === 'maintenance' ? 'de la maintenance' : "de l'intervention"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-8 relative">
            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-5">
                <FormItem>
                  <FormLabel>
                    Date {type === 'maintenance' ? 'de la maintenance' : "de l'intervention"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      value={
                        details?.datePlanifiee
                          ? formatDate(details.datePlanifiee)
                          : 'Non défini'
                      }
                      readOnly
                    />
                  </FormControl>
                </FormItem>
                <FormItem>
                  <FormLabel>Nom du client</FormLabel>
                  <FormControl>
                    <Input value={details?.clientName || 'Non défini'} readOnly />
                  </FormControl>
                </FormItem>
                <FormItem>
                  <FormLabel>Site</FormLabel>
                  <FormControl>
                    <Input value={details?.siteName || 'Non défini'} readOnly />
                  </FormControl>
                </FormItem>
              </div>
              <div className="space-y-5">
                <FormItem>
                  <FormLabel>Système</FormLabel>
                  <FormControl>
                    <Input value={details?.systeme || 'Non défini'} readOnly />
                  </FormControl>
                </FormItem>
                <FormItem>
                  <FormLabel>Type de panne déclarée</FormLabel>
                  <FormControl>
                    <Input
                      value={details?.description || 'Aucune description disponible'}
                      readOnly
                    />
                  </FormControl>
                </FormItem>
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <FormControl>
                    <Input
                      value={details?.statut || 'Non défini'}
                      className={
                        details?.statut === 'SUSPENDU'
                          ? 'text-red-500 font-bold'
                          : details?.statut === 'EN_COURS'
                          ? 'text-green-500 font-bold'
                          : ''
                      }
                      readOnly
                    />
                  </FormControl>
                </FormItem>
              </div>
            </div>

            {/* Si intervention, affiche ses champs spécifiques */}
            {type === 'intervention' && details && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-5">
                    <FormItem>
                      <FormLabel>Date de déclaration de la panne</FormLabel>
                      <FormControl>
                        <Input
                          value={
                            details?.dateDeclaration
                              ? formatDate(details.dateDeclaration)
                              : 'N/A'
                          }
                          readOnly
                        />
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormLabel>Date de l'intervention</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...form.register('dateIntervention')}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </FormControl>
                    </FormItem>
                  </div>
                  <div className="space-y-5">
                    <FormItem>
                      <FormLabel>Matériel sous garantie</FormLabel>
                      <FormControl>
                        <Input value="Oui" readOnly className="text-blue-400" />
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormLabel>Heure de l'intervention (HH:MM)</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...form.register('Heureint')}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </FormControl>
                    </FormItem>
                  </div>
                </div>
                <InterventionSection form={form} isEditable />
              </div>
            )}

            {/* Section maintenance si on est en maintenance */}
            {renderMaintenanceSection()}

            {/* Boutons d'action */}
            <div className="flex justify-end space-x-4 mt-6">
              {(type === 'intervention' || type === 'maintenance') && (
                <Button
                  type="button"
                  onClick={() => handleSuspendOrResume(type as 'intervention' | 'maintenance')}
                  disabled={isSaving}
                  className={
                    isSuspended
                      ? 'bg-orange-500 hover:bg-orange-600'
                      : 'bg-red-500 hover:bg-red-600'
                  }
                >
                  {isSuspended ? 'Reprendre' : 'Suspendre'}
                </Button>
              )}

              <Button
                type="submit"
                disabled={isSaving || isSuspended}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>

              <Button
                type="button"
                onClick={() => setIsConfirmDialogOpen(true)}
                disabled={isSaving || isSuspended}
                className="bg-green-500 hover:bg-green-600"
              >
                {isSaving ? 'Validation...' : 'Valider'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>

      {/* Dialog de confirmation */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
          <DialogHeader
            title="Confirmation de Validation"
            description="Êtes-vous sûr de vouloir valider les informations ?"
          />
          <div className="flex justify-between mt-4">
            <Button
              onClick={() => {
                handleValidate();
                if (idParam && type) {
                  handleValidateClick(idParam, type);
                }
              }}
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
    </Card>
  );
};

export default DetailsPage;