import React from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

const InterventionSection = ({ form, isEditable }) => {
  return (
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
                value={field.value ?? ''} // Ensure value is not null
                readOnly={!isEditable} // Rendre le champ modifiable uniquement si isEditable est vrai
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
                value={field.value ?? ''} // Ensure value is not null
                readOnly={!isEditable} // Rendre le champ modifiable uniquement si isEditable est vrai
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default InterventionSection;