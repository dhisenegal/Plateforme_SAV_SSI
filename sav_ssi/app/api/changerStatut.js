import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Assurez-vous que votre instance de Prisma est correctement importée

export async function POST(req: NextRequest) {
  try {
    const { id, type } = await req.json();

    if (!id || !type) {
      return NextResponse.json({ error: 'ID ou type manquant' }, { status: 400 });
    }

    // Validation de type
    if (type !== 'intervention' && type !== 'maintenance') {
      return NextResponse.json({ error: 'Type invalide' }, { status: 400 });
    }

    const updatedStatus = 'En cours';

    if (type === 'intervention') {
      await prisma.intervention.update({
        where: { id: parseInt(id) },
        data: { statut: updatedStatus },
      });
    } else if (type === 'maintenance') {
      await prisma.maintenance.update({
        where: { id: parseInt(id) },
        data: { statut: updatedStatus },
      });
    }

    return NextResponse.json({ message: 'Statut mis à jour avec succès' }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour du statut' }, { status: 500 });
  }
}
