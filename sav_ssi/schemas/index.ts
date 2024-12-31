import * as z from "zod";

export const LoginSchema = z.object({
  login: z.string().min(1, {
    message: "Email invalide",
  }),
  
  password: z.string().min(1, {
    message: "Le mot de passe est requis",
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email invalide",
  }),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au minimum 6 caractères",
  }),
  nom: z.string().min(1, {
    message: "Le nom est requis",
  }),
  prenom: z.string().min(1, {
    message: "Le prénom est requis",
  }),
  numero: z.string().min(7, {
    message: "Veuillez vérifier le numéro de téléphone",
  }),
  login: z.string().min(1, {
    message: "Le login est requis",
  }),

});
