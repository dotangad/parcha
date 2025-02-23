"use client";

import { useContext } from "react";
import { AuthContext } from '@/lib/authcontext';
import Header from '@/components/header';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

export default function AuthInfo() {
  const { token, user, logout } = useContext(AuthContext);
  const { toast } = useToast();

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto my-8 overflow-x-hidden">
        {token && (
          <>
            <pre style={{ width: "100vw", overflowX: "auto" }}>
              {JSON.stringify({ user, token }, null, 2)}
            </pre>
            <div className="flex justify-center items-center gap-4 my-6">
              <Button onMouseDown={() => logout()}>Logout</Button>
              <Button
                className="bg-purple-500 text-white hover:bg-purple-700"
                onMouseDown={() =>
                  navigator.clipboard.writeText(token as string).then(() =>
                    toast({
                      title: "Token copied to clipboard",
                    }),
                  )
                }
              >
                Copy token
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}