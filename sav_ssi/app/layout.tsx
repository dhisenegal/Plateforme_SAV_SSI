import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Plateforme SAV SSI",
  description: "Plateforme de gestion des services aprés vente de produits SSI de l'entreprise DHI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
  );
}
