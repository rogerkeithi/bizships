"use client";

import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/shared/components/ThemeSwitcher";

export function SystemPreferences() {
  return (
    <div className="fixed bottom-4 right-4 z-[70] flex items-center gap-2">
      <ThemeSwitcher />
      <LanguageSwitcher />
    </div>
  );
}
