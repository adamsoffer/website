"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/studio/AuthContext";
import LoginPage from "@/components/studio/LoginPage";

export default function LoginRoute() {
  const { isConnected } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.replace("/studio");
    }
  }, [isConnected, router]);

  if (isConnected) return null;

  return <LoginPage />;
}
