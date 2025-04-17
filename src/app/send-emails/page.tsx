"use client";
import React from "react";
import SendEmailForm from "@/components/SendEmailForm";
import { UserButton } from "@clerk/nextjs";

export default function SendEmailsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-teal-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">NameFrame</h1>
          <UserButton />
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Send Certificates</h1>
        <SendEmailForm />
      </main>
    </div>
  );
}