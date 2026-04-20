"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/portal/AuthContext";
import LoginPage from "@/components/portal/LoginPage";

export default function LoginRoute() {
  const { isConnected } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.replace("/portal");
    }
  }, [isConnected, router]);

  if (isConnected) return null;

  return <LoginPage />;
}
