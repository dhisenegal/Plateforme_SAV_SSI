import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
<<<<<<< HEAD
=======
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
>>>>>>> 927a10670e773b53abf9af7862fa98b5f30053b9

export const metadata: Metadata = {
  title: "Plateforme SAV SSI",
  description: "Plateforme de gestion des services aprés vente de produits SSI de l'entreprise DHI",
};

<<<<<<< HEAD
export default function RootLayout({
=======
export default async function RootLayout({
>>>>>>> 927a10670e773b53abf9af7862fa98b5f30053b9
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
<<<<<<< HEAD
  return (
    <html lang="en" suppressHydrationWarning>
        <body className="bg-gray-100">
       <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
              
              {children}
          </ThemeProvider>
          </body>
    </html>
=======
    const session = await auth();
  return (
    <SessionProvider session={session}>
       <html lang="en" suppressHydrationWarning>
            <body className="bg-gray-100">
          <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                  
                  {children}
              </ThemeProvider>
              </body>
        </html>
    </SessionProvider>
    
>>>>>>> 927a10670e773b53abf9af7862fa98b5f30053b9
  );
}
