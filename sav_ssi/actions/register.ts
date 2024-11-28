"use server";

import { RegisterSchema } from "@/schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/prisma";
import { getUserByEmail } from "@/data/user";
import { getUserByLogin } from "@/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) =>{
  const validatedFields = RegisterSchema.safeParse(values);

  if(!validatedFields.success){
    return {error: "Champs invalides"}
  }
  const {email, prenom, nom, password, numero, login} = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingEmail = await getUserByEmail(email);
  const existingLogin = await getUserByLogin(login);
  if(existingEmail){
    return {error: "un compte est déja lié à cet email"}
  }
  if(existingLogin){
    return {error: "un compte est déja lié à cet login"}
  }

  await prisma.utilisateur.create({
    data:{
      email,
      prenom,
      password: hashedPassword,
      nom,
      numero,
      login,
      idRole: 1,
    },
  });

  return {succes: "utilisateur créé avec succés"}
}