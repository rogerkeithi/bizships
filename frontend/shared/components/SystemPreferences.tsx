"use client";

import { usePathname } from "next/navigation";

import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/shared/components/ThemeSwitcher";

export function SystemPreferences() {
  const pathname = usePathname();
  const isAuthenticatedNavbarRoute =
    pathname?.startsWith("/home") || pathname?.startsWith("/profile");

  if (isAuthenticatedNavbarRoute) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[70] flex items-center gap-2">
      <ThemeSwitcher />
      <LanguageSwitcher />
    </div>
  );
}
