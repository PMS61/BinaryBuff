import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  if (code) {
    try {
      console.log("Got auth code:", code.substring(0, 5) + "...");
      // Exchange the code for a token with our backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/auth/google/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Auth failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Redirect to success page with token
      if (data.token) {
        return NextResponse.redirect(new URL(`/auth/success?token=${data.token}`, request.url));
      }
    } catch (error) {
      console.error('Error in auth callback:', error);
      // Redirect to error page or login with error parameter
      return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
    }
  }

  // Fallback redirect to dashboard
  return NextResponse.redirect(new URL('/login', request.url));
}
