import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { getUserByLogin } from "./data/user"
import bcrypt from "bcryptjs"
import { LoginSchema } from "./schemas"
import { prisma } from "./prisma"

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials)
    
        if (validatedFields.success) {
          const { login, password } = validatedFields.data
          
          const user = await getUserByLogin(login)
          if (!user || !user.password) return null
    
          const passwordsMatch = await bcrypt.compare(
            password,
            user.password
          )
    
          if (passwordsMatch) return user
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.utilisateur.findUnique({
          where: { login: user.login },
          include: { Role: true }
        })

        token.id = dbUser?.id
        token.login = dbUser?.login
        token.nom = dbUser?.nom
        token.prenom = dbUser?.prenom
        token.role = dbUser?.Role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.login = token.login as string
        session.user.nom = token.nom as string
        session.user.prenom = token.prenom as string
        session.user.role = token.role as { id: number; nom: string }
      }
      return session
    }
  }
} satisfies NextAuthConfig