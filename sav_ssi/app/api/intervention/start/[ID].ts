import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      await prisma.intervention.update({
        where: { id: Number(id) },
        data: { statut: 'En cours' },
      });
      res.status(200).json({ message: 'Statut mis à jour avec succès.' });
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error);
      res.status(500).json({ error: 'Erreur serveur lors de la mise à jour.' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Méthode ${req.method} non autorisée.`);
  }
}
