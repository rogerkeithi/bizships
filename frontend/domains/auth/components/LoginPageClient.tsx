"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { z } from "zod";

import { authService } from "@/domains/auth/services/auth-service";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

const loginSchema = z.object({
  email: z.email("Informe um e-mail válido."),
  password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
});

const getLoginErrorMessage = (error: unknown) => {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? "Revise os dados informados.";
  }

  if (error instanceof AxiosError) {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      return "E-mail ou senha inválidos.";
    }

    if (!error.response) {
      return "Não foi possível conectar ao servidor.";
    }
  }

  return "Não foi possível entrar. Tente novamente.";
};

export function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectTo = useMemo(() => {
    const requestedRedirect = searchParams.get("redirectTo");

    if (!requestedRedirect?.startsWith("/") || requestedRedirect.startsWith("//")) {
      return "/";
    }

    return requestedRedirect;
  }, [searchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const payload = loginSchema.parse({
        email,
        password,
      });

      await authService.login(payload);
      router.replace(redirectTo);
    } catch (error) {
      setErrorMessage(getLoginErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_0.92fr]">
        <section className="flex min-h-screen flex-col px-6 py-6 sm:px-10">
          <Link
            href="/"
            className="flex w-fit items-center gap-2 text-sm font-semibold tracking-tight"
          >
            <Image
              src="/t-black-logo.svg"
              alt=""
              width={34}
              height={34}
              className="size-8 dark:invert"
              aria-hidden="true"
            />
            Bizships
          </Link>

          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
            <div className="mb-8 space-y-3">
              <p className="text-sm font-semibold text-primary">
                Acesse sua conta
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                Continue criando conexões profissionais.
              </h1>
              <p className="text-sm leading-6 text-muted-foreground">
                Entre para revisar seus matches, conversar com novas conexões e
                manter seu networking ativo.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="voce@empresa.com"
                    className="h-11 rounded-xl bg-card pl-10 text-sm"
                    aria-invalid={Boolean(errorMessage)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground"
                  >
                    Senha
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-primary hover:text-primary/80"
                  >
                    Esqueci minha senha
                  </Link>
                </div>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Digite sua senha"
                    className="h-11 rounded-xl bg-card px-10 text-sm"
                    aria-invalid={Boolean(errorMessage)}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center text-muted-foreground transition hover:text-foreground"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {errorMessage ? (
                <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {errorMessage}
                </p>
              ) : null}

              <Button
                type="submit"
                className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/85"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Ainda não tem acesso?{" "}
              <Link
                href="/#joinUs"
                className="font-semibold text-primary hover:text-primary/80"
              >
                Junte-se à rede
              </Link>
            </p>
          </div>
        </section>

        <aside className="hidden min-h-screen overflow-hidden bg-[#0f172a] text-white lg:block">
          <div className="relative flex h-full flex-col justify-between p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(37,99,235,0.35),transparent_32%),linear-gradient(135deg,#0f172a_0%,#132238_54%,#020617_100%)]" />

            <div className="relative z-10">
              <p className="text-sm font-semibold text-[#dbe8ff]">
                Networking com intenção
              </p>
              <h2 className="mt-4 max-w-md text-5xl font-bold leading-tight tracking-tight">
                Matches profissionais para transformar interesse em conversa.
              </h2>
            </div>

            <div className="relative z-10 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/60">Próxima conexão</p>
                  <p className="text-lg font-semibold">Nexa Labs</p>
                </div>
                <span className="rounded-full bg-[#dbe8ff] px-3 py-1 text-xs font-bold text-[#2563eb]">
                  88%
                </span>
              </div>

              <div className="space-y-3">
                <div className="h-3 rounded-full bg-white/30" />
                <div className="h-3 w-4/5 rounded-full bg-white/20" />
                <div className="h-3 w-2/3 rounded-full bg-white/20" />
              </div>

              <div className="mt-6 flex gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-white text-[#0f172a]">
                  <EyeOff className="size-4" />
                </div>
                <div className="flex size-10 items-center justify-center rounded-full bg-primary text-white">
                  <ArrowRight className="size-4" />
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
