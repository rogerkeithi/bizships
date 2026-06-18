"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Users } from "lucide-react";

import { authService } from "@/domains/auth/services/auth-service";
import { AuthenticatedNavbar } from "@/shared/components/AuthenticatedNavbar";
import { authTokenStorage, type AuthUser } from "@/shared/lib/auth-token-storage";

export function HomePageClient() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let isActive = true;
    const accessToken = authTokenStorage.getAccessToken();

    if (!accessToken) {
      router.replace("/login?redirectTo=/home");
      return;
    }

    queueMicrotask(() => {
      if (!isActive) {
        return;
      }

      setUser(authTokenStorage.getUser());
    });

    return () => {
      isActive = false;
    };
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await authService.logout();
      router.replace("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const displayName = user?.name ?? "Usuario";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <AuthenticatedNavbar
        userName={displayName}
        isLoggingOut={isLoggingOut}
        onLogout={handleLogout}
      />

      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[0.72fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm font-semibold text-primary">
            Bem-vindo, {displayName}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            Sua rede profissional começa aqui.
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Esta area ja esta protegida para usuarios autenticados e preparada
            para receber feed, matches, mensagens e configuracoes de perfil.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">Matches recentes</p>
              <p className="text-xs text-muted-foreground">
                Exemplos estaticos para estruturar a pagina inicial.
              </p>
            </div>
            <Users className="size-5 text-primary" />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {["Nexa Labs", "Mariana Alves", "Rafael Costa"].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-border bg-background p-4"
              >
                <div className="mb-3 size-9 rounded-full bg-secondary" />
                <p className="text-sm font-bold">{item}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Afinidade profissional
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
