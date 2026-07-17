import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agenda | Área de Lazer Guarujá",
  description: "Painel interno de reservas da Área de Lazer Guarujá.",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
