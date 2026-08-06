import type { Metadata } from "next";
import { Suspense } from "react";

import { NavigationFeedback } from "@/components/navigation-feedback";

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
      <body>
        <Suspense fallback={null}>
          <NavigationFeedback />
        </Suspense>

        {children}
      </body>
    </html>
  );
}