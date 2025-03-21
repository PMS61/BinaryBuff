"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav showAuthButtons={false} />
      
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md text-center">
          <div className="rounded-full bg-primary/10 w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <rect width="16" height="13" x="4" y="5" rx="2" />
              <path d="m22 5-8 5-8-5" />
              <path d="m22 19-8-5-8 5" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Check your email</h1>
          
          <p className="text-muted-foreground mb-6">
            We've sent a verification link to <span className="font-medium text-foreground">{email}</span>
          </p>
          
          <p className="text-muted-foreground mb-8 text-sm">
            Please check your email and click the verification link to complete your registration.
            If you don't see the email, check your spam folder.
          </p>
          
          <Button asChild variant="outline" className="mx-auto">
            <Link href="/login">
              Return to login
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
