import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Plateforme SAV SSI",
  description: "Plateforme de gestion des services aprés vente de produits SSI de l'entreprise DHI",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const session = await auth();
  return (
    <SessionProvider session={session}>
       <html lang="en" suppressHydrationWarning>
            <body className="bg-gray-100">
                  {children}
              </body>
        </html>
    </SessionProvider>
    
  );
}
