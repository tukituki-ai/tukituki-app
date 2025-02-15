"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import ConnectButton from "./ConnectButton";

const navigation = [
  { name: "Dashboard", href: "/" },
  { name: "Reporting", href: "/reporting" },
  { name: "Settings", href: "/settings" },
];

export function Header() {
  return (
    <header className="border-b bg-background relative z-[100] pointer-events-auto">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="16" r="10" className="fill-primary" />
              <circle cx="18" cy="16" r="9" className="stroke-primary" strokeWidth="1" />
            </svg>
          </div>

          <nav className="flex gap-6">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className={cn("text-base font-mono text-muted-foreground transition-colors hover:text-foreground", "text-lg tracking-wide")}>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="pointer-events-auto">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
