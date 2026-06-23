"use client";

import { Bell, Laptop, LogOut, Moon, Search, Sun, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { type Language, useI18n, useTranslation } from "@/i18n";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { type Theme, useTheme } from "@/shared/providers/theme-provider";
import { resolveAvatarUrl } from "@/shared/lib/resolve-avatar-url";

interface AuthenticatedNavbarProps {
  userName: string;
  avatarUrl?: string;
  isLoggingOut?: boolean;
  onLogout: () => void;
}

export function AuthenticatedNavbar({
  userName,
  avatarUrl,
  isLoggingOut = false,
  onLogout,
}: AuthenticatedNavbarProps) {
  const { app } = useTranslation();
  const { language, setLanguage } = useI18n();
  const { theme, setTheme } = useTheme();
  const userInitial = userName.slice(0, 1).toUpperCase();
  const resolvedAvatarUrl = resolveAvatarUrl(avatarUrl);
  const handleThemeChange = (value: string) => setTheme(value as Theme);
  const handleLanguageChange = (value: string) =>
    setLanguage(value as Language);

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
          {app.navbar.search}
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
                className="size-9 overflow-hidden rounded-full bg-primary p-0 text-sm font-black uppercase text-primary-foreground hover:bg-primary/90"
                aria-label="Abrir menu do perfil"
              >
                {resolvedAvatarUrl ? (
                  <img
                    src={resolvedAvatarUrl}
                    alt={userName}
                    className="size-full object-cover"
                  />
                ) : (
                  userInitial
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <span className="block text-xs font-semibold text-foreground">
                  {userName}
                </span>
                <span className="text-[0.7rem] text-muted-foreground">
                  {app.navbar.connected}
                </span>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="size-4" />
                  {app.navbar.viewProfile}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuLabel>{app.navbar.theme}</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={handleThemeChange}
              >
                <DropdownMenuRadioItem value="light">
                  <Sun className="size-4" />
                  {app.navbar.light}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                  <Moon className="size-4" />
                  {app.navbar.dark}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">
                  <Laptop className="size-4" />
                  {app.navbar.system}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>

              <DropdownMenuSeparator />

              <DropdownMenuLabel>{app.navbar.language}</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={language}
                onValueChange={handleLanguageChange}
              >
                <DropdownMenuRadioItem value="pt">
                  {app.navbar.portuguese}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="en">
                  {app.navbar.english}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant="destructive"
                onClick={onLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="size-4" />
                {app.navbar.logout}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
