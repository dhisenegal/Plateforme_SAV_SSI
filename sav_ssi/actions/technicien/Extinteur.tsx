"use client";

import { useEffect, useState } from 'react';
import { getExtincteursForSystem } from '@/actions/technicien/planning';
import { FaEye } from 'react-icons/fa';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableCell, 
  TableHead 
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Extinguisher {
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
  };
}

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'OK':
        return 'bg-green-100 text-green-800';
      case 'A_REPARER':
        return 'bg-red-100 text-red-800';
      case 'A_CHANGER':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-sm ${getStatusStyle()}`}>
      {status}
    </span>
  );
};

export default function ExtincteursPageContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [extincteurs, setExtincteurs] = useState<Extinguisher[]>([]);

  useEffect(() => {
    async function fetchExtincteurs() {
      try {
        setLoading(true);
        const response = await getExtincteursForSystem(2);
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch extinguishers');
        }

        setExtincteurs(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    
      fetchExtincteurs();
    
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Fire Extinguishers ({extincteurs.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {extincteurs.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pressure Type</TableHead>
                  <TableHead>Verification Mode</TableHead>
                  <TableHead className="w-16">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {extincteurs.map((extincteur) => (
                  <TableRow 
                    key={extincteur.id}
                    className={`
                      hover:bg-gray-50 transition-colors
                      ${extincteur.status === 'A_REPARER' ? 'bg-red-50/50' : ''}
                      ${extincteur.status === 'A_CHANGER' ? 'bg-yellow-50/50' : ''}
                    `}
                  >
                    <TableCell className="font-medium">{extincteur.number}</TableCell>
                    <TableCell>{extincteur.extinguisher.TypeExtincteur.nom}</TableCell>
                    <TableCell>{extincteur.location}</TableCell>
                    <TableCell>
                      <StatusBadge status={extincteur.status} />
                    </TableCell>
                    <TableCell>{extincteur.extinguisher.typePression}</TableCell>
                    <TableCell>{extincteur.extinguisher.modeVerification}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => alert(`Details for extinguisher ${extincteur.number}`)}
                        className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        aria-label="View details"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No extinguishers found for this installation.
          </div>
        )}
      </CardContent>
    </Card>
  );
}