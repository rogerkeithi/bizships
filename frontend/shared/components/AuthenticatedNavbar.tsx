"use client";

import { Bell, LogOut, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

interface AuthenticatedNavbarProps {
  userName: string;
  isLoggingOut?: boolean;
  onLogout: () => void;
}

export function AuthenticatedNavbar({
  userName,
  isLoggingOut = false,
  onLogout,
}: AuthenticatedNavbarProps) {
  const userInitial = userName.slice(0, 1).toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/home" className="flex items-center gap-2 font-bold">
          <Image
            src="/t-black-logo.svg"
            alt=""
            width={30}
            height={30}
            className="size-8 dark:invert"
            aria-hidden="true"
          />
          <span className="hidden sm:inline">Bizships</span>
        </Link>

        <div className="hidden w-full max-w-sm items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm text-muted-foreground md:flex">
          <Search className="size-4" />
          Buscar conexoes, empresas e comunidades
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="hidden size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground sm:flex"
            aria-label="Notificacoes"
          >
            <Bell className="size-4" />
          </button>

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                size="icon"
                className="size-9 rounded-full bg-primary text-sm font-black uppercase text-primary-foreground hover:bg-primary/90"
                aria-label="Abrir menu do perfil"
              >
                {userInitial}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <span className="block text-xs font-semibold text-foreground">
                  {userName}
                </span>
                <span className="text-[0.7rem] text-muted-foreground">
                  Conectado
                </span>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant="destructive"
                onClick={onLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="size-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
