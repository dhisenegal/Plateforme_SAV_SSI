import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { getUserByLogin } from "./data/user";
import  bcrypt from "bcryptjs";
import { LoginSchema } from "./schemas";
import {prisma} from "./prisma";

export default {
  providers: [
    Credentials(
      {
        async authorize(credentials){
          const validatedFields = LoginSchema.safeParse(credentials)
    
          if(validatedFields.success){
            const {login, password} = validatedFields.data;
          
            const user = await getUserByLogin(login);
            if(!user || !user.password) return null;
    
            const passwordsMatch = await bcrypt.compare(password,
              user.password
            ) ;
    
            if(passwordsMatch) return user;
          }
    
          return null;
        }
      }
    )
  ],
  callbacks: {
    async session({ session, user }) {
      // Fetch the user's role from the database
      const dbUser = await prisma.utilisateur.findUnique({
        where: { email: session.user.email },
        include: { Role: true },
      });
        // Add the user's role to the session object
        session.user.role = dbUser?.Role?.nom || 'guest';
        return session;
      },
    }
 } satisfies NextAuthConfig