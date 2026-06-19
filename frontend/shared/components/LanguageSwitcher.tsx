"use client";

import { Globe } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

import { useI18n } from "@/i18n";

export function LanguageSwitcher() {
  const { language, setLanguage, isReady } = useI18n();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-9 rounded-full bg-card/90 px-3 text-xs font-bold shadow-sm backdrop-blur"
        >
          <Globe className="size-4" />
          {isReady ? language.toUpperCase() : "--"}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("en")}>
          🇺🇸 English
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setLanguage("pt")}>
          🇧🇷 Português
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
