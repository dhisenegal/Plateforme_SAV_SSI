'use client';

import React, { useEffect, useState } from 'react';
import { fetchDetails } from '@/lib/fonctionas';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { formatDate } from '@/lib/fonction';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { getSystemIdFromInstallation, getActionsBySystem } from '@/actions/admin/maintenanceAction';
import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { updateIntervention, updateInterventionStatus,updateMaintenanceStatus,  updateMaintenanceAction,updateMaintenance, formatHeure } from '@/actions/technicien/planning';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@radix-ui/react-dialog';
import InterventionSection from '@/actions/technicien/InterventionSection';
import ExtincteursPageContent from '@/actions/technicien/Extinteur';

const formSchema = z.object({
  diagnostic: z.string().min(1, {
    message: 'Diagnostic est requis pour valider.'
  }),
  travauxRealises: z.string().min(1, {
    message: 'Travaux réalisés est requis.'
  }),
  dureeHeure: z.string().min(1, {
    message: 'La durée de l\'intervention est requise.'
  }),
  dateFinInt: z.string().min(1, {
    message: 'La date de fin de  l\'intervention est requise.'
  }),
 
  dateIntervention: z.string().min(1, {
    message: 'La date de début de  l\'intervention est requise.'
  }),
  dateFinMaint: z.string().min(1, {
    message: 'La date de début de  l\'intervention est requise.'
  }),
  dateMaintenance : z.string().min(1, {
    message: 'La date de début de  l\'intervention est requise.'
  })
});

type DetailsPageProps = {
  error: string | null;
};

const DialogHeader: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="mb-4">
    <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
    <DialogDescription className="text-sm text-gray-500">{description}</DialogDescription>
  </div>
);

interface MaintenanceAction {
  id: number;
  libeleAction: string;
  idSysteme: number;
}

const formatDateTimeForInput = (date: Date | string | null) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().slice(0, 16); // Format: "YYYY-MM-DDThh:mm"
};

const DetailsPage: React.FC<DetailsPageProps> = ({ error }) => {
  const params = useParams();
  const searchParams = useSearchParams();
  console.log("Params:", params); // Debugging line

  const [details, setDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(true);
  const [isSuspended, setIsSuspended] = useState<boolean>(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState<boolean>(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<Record<number, string>>({});
  const [observations, setObservations] = useState<Record<number, string>>({});
  const [actions, setActions] = useState<MaintenanceAction[]>([]);
  const [systemId, setSystemId] = useState<number | null>(null);
  const [loadingActions, setLoadingActions] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diagnostic: '',
      travauxRealises: '',
      dureeHeure:'',
      dateIntervention: '',
      dateFinInt: '',
      dateMaintenance: '',
      dateFinMaint: '',
    }
  });

  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  console.log("ID:", id); // Debugging line
  const router = useRouter();

  const type = searchParams?.get('type');
  console.log("Type:", type); // Debugging line

  const saveToLocalStorage = (data: z.infer<typeof formSchema>) => {
    if (id) {
      localStorage.setItem(`formData-${id}`, JSON.stringify(data));
    }
  };

  const handleValidateClick = (id, type) => {
    if (type === 'maintenance') {
      router.push(`/technicien/Maintenances/${id}`);
    } else if (type === 'intervention') {
      router.push(`/technicien/Interventions/${id}`);
    }
  };

  const loadFromLocalStorage = () => {
    if (id) {
      const savedData = localStorage.getItem(`formData-${id}`);
      if (savedData) {
        form.reset(JSON.parse(savedData));
      }
    }
  };

  useEffect(() => {
    if (id && type) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const fetchedDetails = await fetchDetails(parseInt(id), type);
          setDetails(fetchedDetails);
          
          // Format dates for form
          form.reset({
            ...form.getValues(),
            dateIntervention: formatDateTimeForInput(fetchedDetails.dateIntervention),
            dateFinInt: formatDateTimeForInput(fetchedDetails.dateFinInt),
            dateMaintenance: formatDateTimeForInput(fetchedDetails.dateMaintenance),
            dateFinMaint: formatDateTimeForInput(fetchedDetails.dateFinMaint),
          });
        } catch (err) {
          console.error('Error fetching details:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [id, type]); 
  useEffect(() => {
    const fetchSystemAndActions = async () => {
      if (details?.idInstallation && type === 'maintenance') {
        setLoadingActions(true);
        try {
          const systemData = await getSystemIdFromInstallation(details.idInstallation);
          if (systemData?.idSysteme) {
            setSystemId(systemData.idSysteme);
            const fetchedActions = await getActionsBySystem(systemData.idSysteme);
            setActions(fetchedActions);

            // If we have existing status/observations, keep them
            if (fetchedActions.length > 0 && details.actions) {
              const existingStatus = { ...selectedStatus };
              const existingObservations = { ...observations };

              details.actions.forEach((savedAction: any) => {
                const actionIndex = fetchedActions.findIndex(
                  (action: MaintenanceAction) => action.id === savedAction.idAction
                );
                if (actionIndex !== -1) {
                  existingStatus[actionIndex] = savedAction.statut ? 'valide' : 'non-valide';
                  existingObservations[actionIndex] = savedAction.observation || '';
                }
              });

              setSelectedStatus(existingStatus);
              setObservations(existingObservations);
            }
          }
        } catch (error) {
          console.error('Error fetching system and actions:', error);
          setActions([]);
        } finally {
          setLoadingActions(false);
        }
      }
    };

    if (details) {
      fetchSystemAndActions();
    }
  }, [details, type]);


  const handleSave = async (data: z.infer<typeof formSchema>) => {
    setIsSaving(true);
    try {
      console.log('Saving data:', data);
      console.log('Current type:', type);
      
      if (!id) {
        throw new Error('No ID provided');
      }

      const currentDate = new Date().toISOString().split('T')[0];

      if (type === 'intervention') {
        // Save intervention data
        const interventionData = {
          diagnostics: data.diagnostic,
          travauxRealises: data.travauxRealises,
          dureeHeure: parseInt(data.dureeHeure),
         
          dateIntervention: new Date(data.dateIntervention),
          dateFinInt: new Date(data.dateFinInt),
        };
        
        await updateIntervention(parseInt(id), interventionData);
        console.log('Intervention saved successfully');
      } 
      else if (type === 'maintenance') {
        console.log('Saving maintenance...');
        
        // Save maintenance times
        if (data.dateMaintenance && data.dateFinMaint) {
          const maintenanceData = {
            dateMaintenance: new Date(data.dateMaintenance),
            dateFinMaint: new Date(data.dateFinMaint),
          };
          
          console.log('Maintenance data to save:', maintenanceData);
          await updateMaintenance(parseInt(id), maintenanceData);
        }

        // Save maintenance actions
        if (actions.length > 0) {
          const actionUpdates = actions.map((action, idx) => ({
            idAction: action.id,
            idMaintenance: parseInt(id),
            statut: selectedStatus[idx] === 'valide',
            observation: observations[idx] || ''
          }));

          console.log('Maintenance actions to save:', actionUpdates);
          await updateMaintenanceAction(parseInt(id), actionUpdates);
        }
        
        console.log('Maintenance saved successfully');
      }

      const updatedDetails = await fetchDetails(parseInt(id), type);
        form.reset({
          ...data,
          dateIntervention: formatDateTimeForInput(updatedDetails.dateIntervention),
          dateFinInt: formatDateTimeForInput(updatedDetails.dateFinInt),
          dateMaintenance: formatDateTimeForInput(updatedDetails.dateMaintenance),
          dateFinMaint: formatDateTimeForInput(updatedDetails.dateFinMaint),
        })
      

      // Show success message
      alert('Changes saved successfully');
      
    
    } catch (err) {
      console.error('Error while saving:', err);
      alert('Error saving changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleValidate = async () => {
    setIsSaving(true);
    try {
      const data = form.getValues();
      console.log('Validation de l\'état', data);
      const currentDate = new Date();
      const currentDateString = currentDate.toISOString().split('T')[0]; // yyyy-mm-dd
      
      // Sauvegarder les données de l'intervention
      await handleSave(data);
      
      if (id && type === 'intervention') {
        // Vérifiez que les données sont un objet et non null
        if (data && typeof data === 'object') {
          const result = await updateIntervention(parseInt(id), {
            diagnostics: data.diagnostic,
            travauxRealises: data.travauxRealises,
            dureeHeure: parseInt(data.dureeHeure), // assurez-vous de convertir en nombre
            dateIntervention: new Date(data.dateIntervention),
            dateFinInt: new Date(data.dateFinInt),
          });

          console.log('Données validées avec succès', result);
   
          // Mise à jour du statut de l'intervention à 'TERMINE'
          await updateInterventionStatus(parseInt(id), 'TERMINE');
        } else {
          console.error('Les données de l\'intervention sont invalides:', data);
        }
      }
      
      if (id && type === 'maintenance') {
        // Mettre à jour la maintenance (ajout de la mise à jour des heures de début et de fin)
        const dateMaintenance = new Date(data.dateMaintenance);  // Heure de début
        const dateFinMaint = new Date(data.dateFinMaint);    // Heure de fin
      
        const result = await updateMaintenance(parseInt(id as string), {
          dateMaintenance: dateMaintenance,  // Heure de début
          dateFinMaint: dateFinMaint,    // Heure de fin
        });
        console.log('Maintenance mise à jour avec succès:', result);
  
        // Mise à jour du statut de la maintenance à 'TERMINE'
        await updateMaintenanceStatus(parseInt(id as string), 'TERMINE');
      
        const updates = actions.map((action, idx) => ({
          idAction: action.id,
          idMaintenance: parseInt(id as string),
          statut: selectedStatus[idx] === 'valide',
          observation: observations[idx] || ''
        }));
      
        await updateMaintenanceAction(parseInt(id as string), updates);
      }
      
      setIsOverlayVisible(true);
      
      if (id && type) {
        const updatedDetails = await fetchDetails(parseInt(id), type);
        setDetails(updatedDetails);
        form.reset({
          diagnostic: updatedDetails.diagnostics || data.diagnostic,
          travauxRealises: updatedDetails.travauxRealises || data.travauxRealises,
          dureeHeure: String(updatedDetails.dureeHeure || data.dureeHeure),
          dateIntervention: updatedDetails.dateIntervention || data.dateIntervention,
          dateFinInt: updatedDetails.dateFinInt || data.dateFinInt,
          dateMaintenance: updatedDetails.dateMaintenance || data.dateMaintenance, // Remettre à jour l'heure de début
          dateFinMaint: updatedDetails.dateFinMaint || data.dateFinMaint, // Remettre à jour l'heure de fin
        });
      }
    } catch (err) {
      console.error('Erreur lors de la validation', err);
    } finally {
      setIsSaving(false);
      setIsConfirmDialogOpen(false);
    }
  };

  



  
  const handleSuspendOrResume = async (type: 'intervention' | 'maintenance') => {
    setIsSaving(true);
    try {
      if (id) {
        const newStatus = isSuspended ? 'EN_COURS' : 'SUSPENDU';

        let result;
        if (type === 'intervention') {
          result = await updateInterventionStatus(parseInt(id), newStatus);
        } else if (type === 'maintenance') {
          result = await updateMaintenanceStatus(parseInt(id), newStatus);
        }

        console.log(`Statut de ${type} mis à jour avec succès`, result);
        setIsSuspended(!isSuspended);
        setDetails((prevDetails: any) => ({
          ...prevDetails,
          statut: newStatus
        }));
      }
    } catch (err) {
      console.error(`Erreur lors de la mise à jour du statut de ${type}`, err);
    } finally {
      setIsSaving(false);
    }
  };


  useEffect(() => {
    if (id && type) {
      const fetchData = async () => {
        try {
          const fetchedDetails = await fetchDetails(parseInt(id), type);
          setDetails(fetchedDetails);
          if (fetchedDetails.statut === 'SUSPENDU') {
            setIsSuspended(true);
          }
          form.reset({
            diagnostic: fetchedDetails.diagnostics || '',
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
      loadFromLocalStorage();
    } else {
      setLoading(false);
    }
  }, [id, type, form]);

  const handleStatusChange = (taskIdx: number, status: string) => {
    setSelectedStatus((prev) => ({ ...prev, [taskIdx]: status }));
  };

  const handleObservationChange = (taskIdx: number, observation: string) => {
    setObservations((prev) => ({ ...prev, [taskIdx]: observation }));
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

  const renderMaintenanceSection = () => {
    if (type !== 'maintenance') return null;
    if (details.systeme === "MOYENS DE SECOURS EXTINCTEURS") {
      // Appeler la fonction pour afficher les extincteurs si le type est "maintenance" et le système est "MOYENS DE SECOURS EXTINCTEURS"
      return <ExtincteursPageContent id={parseInt(id as string)} />;
    }
    return (
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-5">
                  <FormItem>
  <FormLabel>Date et heure de début </FormLabel>
  <FormControl>
    <Input
      type="datetime-local" // Permet de sélectionner à la fois la date et l'heure
      {...form.register('dateMaintenance')} // Adapté au nom du champ dans votre formulaire
      className="w-full p-2 border border-gray-300 rounded-md"
      
    />
  </FormControl>
</FormItem>
              </div>
              <div className="space-y-5">
              <FormItem>
  <FormLabel>Date et heure de fin </FormLabel>
  <FormControl>
    <Input
      type="datetime-local" // Permet de sélectionner à la fois la date et l'heure
      {...form.register('dateFinMaint')} // Adapté au nom du champ dans votre formulaire
      className="w-full p-2 border border-gray-300 rounded-md"
    />
  </FormControl>
</FormItem>
                    </div>
                    </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {details.systeme}
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
                <TableRow key={idx} className="border-b hover:bg-blue-100">
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
                            selectedStatus[idx] === 'valide' ? 'text-green-600' : 'text-gray-400'
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
                            selectedStatus[idx] === 'non-valide' ? 'text-red-600' : 'text-gray-400'
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
                      placeholder="Veuillez remplir vos observations ici"
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
                  {systemId ? 'Aucune action de maintenance trouvée pour ce système' : 'Chargement des actions...'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <>
      
      <Card id="pdf-content" className="mx-auto w-full max-w-4xl relative">
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
                    <FormLabel>Date {type === 'maintenance' ? 'de la maintenance' : 'de l\'intervention'}</FormLabel>
                    <FormControl>
                      <Input value={formatDate(details.datePlanifiee) || 'N/A'} readOnly />
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
                      <Input value={details.siteName || 'N/A'} readOnly />
                    
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
                 
                  
                </div>
              </div>

              {type === 'intervention' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-5">
                  <FormItem>
                    <FormLabel>Date de déclaration de la panne</FormLabel>
                    <FormControl>
                      <Input value={formatDate(details.dateDeclaration) || 'N/A'} readOnly />
                    </FormControl>
                  </FormItem>
                  <FormItem>
  <FormLabel>Date et heure de début </FormLabel>
  <FormControl>
    <Input
      type="datetime-local" // Permet de sélectionner à la fois la date et l'heure
      {...form.register('dateIntervention')} // Adapté au nom du champ dans votre formulaire
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
  <FormLabel>Date et heure de fin </FormLabel>
  <FormControl>
    <Input
      type="datetime-local" // Permet de sélectionner à la fois la date et l'heure
      {...form.register('dateFinInt')} // Adapté au nom du champ dans votre formulaire
      className="w-full p-2 border border-gray-300 rounded-md"
    />
  </FormControl>
</FormItem>
                    </div>
                  </div>
                  
                <InterventionSection form={form} isEditable={isEditable} />
                </div>
              )}

              {renderMaintenanceSection()}

              <div className="flex justify-end space-x-4 mt-6">
                <Button
                  type="button"
                  onClick={() => (type === 'intervention' || type === 'maintenance') && handleSuspendOrResume(type)}
                  disabled={isSaving}
                  className={isSuspended ? 'bg-orange-500 hover:bg-orange-600' : 'bg-red-500 hover hover:bg-red-600'}
                  >
                  {isSuspended ? 'Reprendre' : 'Suspendre'}
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving || isSuspended}
                  className="bg-blue-500 hover:bg-blue-600"
                  onClick={() => handleSave(form.getValues())}
                >
                  {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
                <Button
                type="button"
                onClick={() => {
                  form.trigger(); // Trigger validation
                  if (form.formState.isValid) {
                    setIsConfirmDialogOpen(true);
                  }
                }}
                disabled={isSaving || isSuspended}
                className="bg-green-500 hover:bg-green-600"
              >
                {isSaving ? 'Validation...' : 'Valider'}
              </Button>
              </div>
            </form>
          </Form>
        </CardContent>

        <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
            <DialogHeader
              title="Confirmation de Validation"
              description="Êtes-vous sûr de vouloir valider les informations ?"
            />
            <div className="flex justify-between">
              <Button
                onClick={() => {
                  handleValidate();
                  handleValidateClick(id, type);
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
    </>
  );
};

export default DetailsPage;