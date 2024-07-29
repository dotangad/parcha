"use client";
import AuthWrapper from "@/lib/authcontext";
import { Toaster } from "@/components/ui/toaster"

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthWrapper>
      {children}
      <Toaster />
    </AuthWrapper>
  );
}
