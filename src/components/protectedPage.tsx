'use client';

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AuthModal from "./AuthModal";

interface ProtectedPageProps {
  children: React.ReactNode;
}

export default function ProtectedPage({ children }: ProtectedPageProps) {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setShowAuthModal(true);
    }
  }, [isLoaded, isSignedIn]);

  const handleClose = () => {
    setShowAuthModal(false);
    router.push('/');
  };

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <AuthModal isOpen={showAuthModal} onClose={handleClose} />;
  }

  return <>{children}</>;
} 