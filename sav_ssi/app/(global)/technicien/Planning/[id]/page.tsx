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
import { updateIntervention, updateInterventionStatus, updateMaintenanceAction } from '@/actions/technicien/planning';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@radix-ui/react-dialog';
import InterventionSection from '@/actions/technicien/InterventionSection';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const formSchema = z.object({
  diagnostic: z.string().min(1, {
    message: 'Diagnostic is required.'
  }),
  travauxRealises: z.string().min(1, {
    message: 'Travaux réalisés are required.'
  }),
  dureeHeure: z.string().min(1, {
    message: 'La durée de l\'intervention est requise.'
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
    const fetchSystemAndActions = async () => {
      if (details?.idInstallation && type === 'maintenance') {
        setLoadingActions(true);
        try {
          const systemData = await getSystemIdFromInstallation(details.idInstallation);
          if (systemData?.idSysteme) {
            setSystemId(systemData.idSysteme);
            const fetchedActions = await getActionsBySystem(systemData.idSysteme);
            setActions(fetchedActions);
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
      console.log('Sauvegarde des informations', data);
      saveToLocalStorage(data);
      setIsEditable(false);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleValidate = async () => {
    setIsSaving(true);
    try {
      const data = form.getValues();
      console.log('Validation de l\'état', data);

      // Inclure la date du jour
      const dateIntervention = new Date();

      await handleSave(data);

      if (id && type === 'intervention') {
        const result = await updateIntervention(parseInt(id), data.diagnostic, data.travauxRealises, dateIntervention, data.dureeHeure);
        console.log('Données validées avec succès', result);
      }

      if (id && type === 'maintenance') {
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
          diagnostic: updatedDetails.diagnostic || data.diagnostic,
          travauxRealises: updatedDetails.travauxRealises || data.travauxRealises,
          dureeHeure: updatedDetails.dureeHeure || data.dureeHeure
        });
      }
    } catch (err) {
      console.error('Erreur lors de la validation', err);
    } finally {
      setIsSaving(false);
      setIsConfirmDialogOpen(false);
    }
  };

  const handleSuspendOrResume = async () => {
    setIsSaving(true);
    try {
      if (id) {
        const newStatus = isSuspended ? 'EN_COURS' : 'SUSPENDU';
        const result = await updateInterventionStatus(parseInt(id), newStatus);
        console.log('Statut mis à jour avec succès', result);
        setIsSuspended(!isSuspended);
        setDetails((prevDetails: any) => ({
          ...prevDetails,
          statut: newStatus
        }));
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut', err);
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

  const exportToPDF = () => {
    const input = document.getElementById('pdf-content');
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('export.pdf');
      });
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

  const renderMaintenanceSection = () => {
    if (type !== 'maintenance') return null;

    return (
      <div className="mt-6">
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
      <div className="flex justify-end mb-4">
        <Button onClick={exportToPDF} className="bg-blue-500 hover:bg-blue-600 text-white">
          Exporter
        </Button>
      </div>
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
                  <FormItem>
                    <FormLabel>Date de déclaration de la panne</FormLabel>
                    <FormControl>
                      <Input value={formatDate(details.dateDeclaration) || 'N/A'} readOnly />
                    </FormControl>
                  </FormItem>
                  <FormItem>
                    <FormLabel>Durée de l'intervention</FormLabel>
                    <FormControl>
                      <Input
                        {...form.register('dureeIntervention')}
                        placeholder="Durée de l'intervention"
                      />
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

              {type === 'intervention' && (
                <InterventionSection form={form} isEditable={isEditable} />
              )}

              {renderMaintenanceSection()}

              <div className="flex justify-end space-x-4 mt-6">
                <Button
                  type="button"
                  onClick={handleSuspendOrResume}
                  disabled={isSaving}
                  className={isSuspended ? 'bg-orange-500 hover:bg-orange-600' : 'bg-red-500 hover hover:bg-red-600'}
                  >
                  {isSuspended ? 'Reprendre' : 'Suspendre'}
                </Button>
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