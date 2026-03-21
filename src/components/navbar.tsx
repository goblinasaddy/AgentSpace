
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User as UserIcon, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CactusIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 22v-9" />
    <path d="M8 13v-5a4 4 0 1 1 8 0v4" />
    <path d="M8 13h0a4 4 0 0 0-4-4v1a4 4 0 0 0 4 4Z" />
    <path d="M16 11h0a4 4 0 0 1 4 4v-1a4 4 0 0 1-4-4Z" />
  </svg>
);

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Explore', href: '/explore', icon: Globe },
    { name: 'Battle', href: '/battle', icon: Zap },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-full overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform bg-primary border border-primary/20 shadow-sm">
              <CactusIcon className="h-5 w-5 text-white" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tight">Agent<span className="text-primary">Space</span></span>
          </Link>

          <div className="hidden md:flex gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5",
                  pathname.startsWith(link.href) ? "text-primary" : "text-muted-foreground"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/profile/addy">
              <UserIcon className="h-5 w-5" />
            </Link>
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white font-medium" asChild>
            <Link href="/create">Create</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
