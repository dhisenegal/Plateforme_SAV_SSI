import { prisma } from "@/prisma";

export const getUserByEmail = async (email: string) =>{
  try {
    const utilisateur = await prisma.utilisateur.findUnique({
      where:{
        email,
      }
    })
    return utilisateur;
  } catch (error) {
    console.log(error)
    return null
  }
}

export const getUserByLogin = async (login: string) =>{
  try {
    const utilisateur = await prisma.utilisateur.findUnique({
      where:{
        login,
      }
    })
    return utilisateur;
  } catch (error) {
    console.log(error)
    return null
  }
}

export const getUserById = async (id: number) =>{
  try {
    const utilisateur = await prisma.utilisateur.findUnique({
      where:{
        id,
      }
    })
    return utilisateur;
  } catch (error) {
    console.log(error)
    return null
  }
}