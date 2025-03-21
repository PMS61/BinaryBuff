"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  useEffect(() => {
    if (token) {
      // Store the token in localStorage
      localStorage.setItem('auth_token', token);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } else {
      // No token found, redirect to login
      router.push('/login');
    }
  }, [token, router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Successful</h1>
        <p className="mb-4">Redirecting to dashboard...</p>
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
      </div>
    </div>
  );
}
