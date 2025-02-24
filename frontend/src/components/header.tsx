"use client";

import React from "react";
import Link from "next/link";
import { AuthContext } from "@/lib/authcontext.tsx";
import LoginWithGoogle from "@/components/loginWithGoogle";
import { User } from "backend/src/db/models.ts";

export default function Header() {
  const { token, user } = React.useContext(AuthContext);

  return (
    <div className="flex justify-between items-center pt-8 w-full mx-auto max-w-[880px]">
      <div className="flex justify-center items-center gap-4">
        <Link href="/">
          <span className="text-lime-500 text-2xl tracking-wider font-semibold font-mono">parcha</span>
        </Link>
      </div>
      <div className="flex items-center justify-center">
        {token ? (
          <Link href="/auth">
            <img src={(user as User).picture} className="h-10 w-10 rounded-full bg-lime-500" />
          </Link>
        ) : (
          <LoginWithGoogle />
        )}
      </div>
    </div>
  );
}