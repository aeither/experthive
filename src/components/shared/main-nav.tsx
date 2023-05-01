import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "~/lib/utils";
import { useAccount } from "wagmi";

export function MainNav() {
  const pathname = usePathname();
  const { isConnected, address } = useAccount();

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        Home
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/booking"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/booking" ? "text-foreground" : "text-foreground/60"
          )}
        >
          Booking
        </Link>
        {isConnected && (
          <Link
            href={`/user/${address}`}
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/user" ? "text-foreground" : "text-foreground/60"
            )}
          >
            Profile
          </Link>
        )}
      </nav>
    </div>
  );
}
