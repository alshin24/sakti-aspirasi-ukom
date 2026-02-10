"use client";

import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MenuItem {
  title: string;
  url: string;
}

interface Navbar1Props {
  className?: string;
}

const menu: MenuItem[] = [
  { title: "About Us", url: "/about" },
  { title: "Team", url: "/team" },
  { title: "Contact Us", url: "/contact" },
];

const Navbar1 = ({ className }: Navbar1Props) => {
  return (
    <header className={cn("border-b bg-background", className)}>
      <div className="container flex h-16 items-center justify-between px-6">
        {/* LEFT: Logo + Menu */}
        <div className="flex items-center gap-10">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <img
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
              alt="logo"
              className="h-7 dark:invert"
            />
            <span className="text-lg font-semibold">SAKTI</span>
          </a>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-6">
            {menu.map((item) => (
              <a
                key={item.title}
                href={item.url}
                className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                {item.title}
              </a>
            ))}
          </nav>
        </div>

        {/* RIGHT: Auth */}
        <div className="hidden md:flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <a href="/login">Login</a>
          </Button>
          <Button asChild size="sm">
            <a href="/signup">Sign Up</a>
          </Button>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>

            <SheetContent>
              <SheetHeader>
                <SheetTitle>SAKTI</SheetTitle>
              </SheetHeader>

              <nav className="mt-6 flex flex-col gap-4">
                {menu.map((item) => (
                  <a
                    key={item.title}
                    href={item.url}
                    className="text-sm font-medium"
                  >
                    {item.title}
                  </a>
                ))}
              </nav>

              <div className="mt-6 flex flex-col gap-3">
                <Button asChild variant="outline">
                  <a href="/login">Login</a>
                </Button>
                <Button asChild>
                  <a href="/signup">Sign Up</a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export { Navbar1 };
