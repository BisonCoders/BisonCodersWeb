import { Geist, Geist_Mono } from "next/font/google";

import AuthProvider from "../components/AuthProvider";
import Header from "../components/Header";


export const metadata = {
  title: "BisonCoders - Club de Desarrollo",
  description: "Plataforma colaborativa de desarrollo para la comunidad BisonCoders",
};

export default function RootLayout({ children }) {
  return (
  
        <AuthProvider>
        <Header/>
          {children}
        </AuthProvider>

  );
}
