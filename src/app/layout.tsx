import type { Metadata } from "next";
import "./globals.css";
import { AegisFlowProvider } from "@/context/AegisFlowContext";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "AegisFlow — Disaster Response Decision Intelligence",
  description:
    "AI-assisted EOC disaster-response decision-support platform for Assam flood response.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-text-primary antialiased selection:bg-ops-cyan selection:text-background">
        <AegisFlowProvider>
          <AppShell>{children}</AppShell>
        </AegisFlowProvider>
      </body>
    </html>
  );
}
