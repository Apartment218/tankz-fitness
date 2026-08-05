import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Tankz Fitness",
    template: "%s | Tankz Fitness",
  },
  description:
    "Expert coaching, high-energy classes and a community that pushes you forward.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}