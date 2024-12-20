'use client';

import React, { useEffect, useState } from 'react';
import { fetchDetails } from '@/lib/fonctionas'; 
import { useParams, useSearchParams } from 'next/navigation';
import { formatDate } from '@/lib/fonction';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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

const DetailsPage: React.FC<DetailsPageProps> = ({ error }) => {
  const params = useParams();  
  const searchParams = useSearchParams();  
  const [details, setDetails] = useState<any | null>(null);  
  const [loading, setLoading] = useState<boolean>(true);  
  const [isSaving, setIsSaving] = useState<boolean>(false);  

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diagnostic: '',
      travauxRealises: ''
    }
  });

  const id = params?.id;  
  const type = searchParams?.get('type');  

  const handleSave = async (data: z.infer<typeof formSchema>) => {
    setIsSaving(true);
    try {
      console.log('Sauvegarde des informations', data);
      // Logique de sauvegarde ici
    } catch (err) {
      console.error('Erreur lors de la sauvegarde', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleValidate = async () => {
    setIsSaving(true);
    try {
      console.log('Validation de l\'état');
      // Logique de validation ici
    } catch (err) {
      console.error('Erreur lors de la validation', err);
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

  // Affichage des détails pour intervention ou maintenance
  if (details) {
    return (
      <Card className="mx-auto w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Détails {type === 'maintenance' ? 'de la maintenance' : 'de l\'intervention'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-8">
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
                      <Input value={details.statut ? details.statut : 'Non défini'} readOnly className={details.statut ? "text-blue-400" : "text-gray-500"} />
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
                <>
                  <FormField
                    control={form.control}
                    name="diagnostic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Diagnostics / Observations :</FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            rows={4}
                            placeholder="Entrez les observations ou diagnostics ici"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="travauxRealises"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Travaux réalisés / Pièces fournies :</FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            rows={4}
                            placeholder="Entrez les travaux réalisés ou pièces fournies ici"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Boutons Sauvegarder et Valider */}
              <div className="flex justify-end space-x-4 mt-6">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
                <Button onClick={handleValidate} disabled={isSaving}>
                  {isSaving ? 'Validation...' : 'Valider'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  return <div>Détails non trouvés</div>;
};

export default DetailsPage;