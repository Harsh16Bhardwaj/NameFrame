import type { Metadata } from "next";
import PricingPageClient from "./pricing-client";

export const metadata: Metadata = {
  title: "Pricing Plans | NameFrame Certificate Platform",
  description: "Choose the right certificate generation plan for your needs - from free personal use to enterprise solutions for large organizations.",
};

export default function PricingPage() {
  return <PricingPageClient />;
}