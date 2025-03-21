import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

export function MainNav({ user, onSignOut, showAuthButtons = true }) {
  return (
    <header className="border-b border-border py-4 px-6 sm:px-10 bg-gradient-to-r from-background via-primary/5 to-background">
      <nav className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold flex items-center">
            <div className="w-8 h-8 rounded-md bg-primary text-white flex items-center justify-center mr-2.5 shadow-md shadow-primary/20">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              >
                <path d="m22 8-6 4 6 4V8Z"></path>
                <rect x="2" y="6" width="14" height="12" rx="2"></rect>
              </svg>
            </div>
            <span className="text-primary font-extrabold mr-0.5">Binary</span>
            <span>Buff</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          
          {showAuthButtons && !user && (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-primary hover:bg-primary/90">Sign Up</Button>
              </Link>
            </>
          )}
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 rounded-full">
                  {user.avatar_url ? (
                    <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-colors">
                      <Image 
                        src={user.avatar_url} 
                        alt={user.email} 
                        width={32} 
                        height={32} 
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary/10 text-primary font-medium text-sm border-2 border-primary/20 hover:border-primary/50 transition-colors">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2 border-b border-border">
                  <p className="text-sm font-medium">{user.name || "User"}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account" className="cursor-pointer">Account Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSignOut} className="text-destructive cursor-pointer">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
    </header>
  );
}
