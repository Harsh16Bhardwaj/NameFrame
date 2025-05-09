"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const isEvents = pathname.startsWith("/events");
  const isParticipants = pathname.startsWith("/participants");
  const isTemplate = pathname.startsWith("/templates");

  const showHeaderFooter = !isDashboard && !isEvents && !isTemplate && !isParticipants;

  return (
    <>
      {showHeaderFooter && <Header />}
      {children}
      {showHeaderFooter && <Footer />}
    </>
  );
}