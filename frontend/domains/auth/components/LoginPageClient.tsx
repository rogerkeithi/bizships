"use client";

import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { z } from "zod";

import { authService } from "@/domains/auth/services/auth-service";
import {
  isProfileComplete,
  userService,
} from "@/domains/user/services/user-service";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

const loginSchema = z.object({
  email: z.email("Informe um e-mail valido."),
  password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
});

const getLoginErrorMessage = (error: unknown) => {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? "Revise os dados informados.";
  }

  if (error instanceof AxiosError) {
    const status = error.response?.status;

    if (status === 401 || status === 403 || status === 404) {
      return "E-mail ou senha invalidos.";
    }

    if (!error.response) {
      return "Nao foi possivel conectar ao servidor.";
    }
  }

  return "Nao foi possivel entrar. Tente novamente.";
};

export function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectTo = useMemo(() => {
    const requestedRedirect = searchParams.get("redirectTo");

    if (
      !requestedRedirect?.startsWith("/") ||
      requestedRedirect.startsWith("//")
    ) {
      return "/home";
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
      const user = await userService.syncAuthUser(payload.email);

      if (!isProfileComplete(user)) {
        router.replace("/complete-profile");
        return;
      }

      router.replace(redirectTo === "/complete-profile" ? "/home" : redirectTo);
    } catch (error) {
      setErrorMessage(getLoginErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f6fb] px-4 py-10 text-[#0f172a] dark:bg-[#0f172a] dark:text-[#f8fafc]">
      <section className="w-full max-w-[318px] rounded-[22px] border border-[#e2e8f0] bg-white px-8 py-10 shadow-sm dark:border-[#2d3c54] dark:bg-[#132238]">
        <Link
          href="/"
          className="mx-auto mb-8 flex w-fit items-center gap-2 text-xs font-bold"
        >
          <Image
            src="/t-black-logo.svg"
            alt=""
            width={28}
            height={28}
            className="size-7 dark:invert"
            aria-hidden="true"
          />
          Bizships
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-[22px] font-black tracking-tight">
            Bem-vindo de volta
          </h1>
          <p className="mt-2 text-[11px] text-[#64748b] dark:text-[#94a3b8]">
            Acesse sua conta corporativa Bizships
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-[9px] font-black uppercase tracking-[0.08em]"
            >
              E-mail corporativo
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nome@empresa.com"
              className="h-[38px] rounded-full border-[#cbd5e1] bg-[#f7f8fc] px-4 text-xs dark:border-[#2d3c54] dark:bg-[#1d2d46]"
              aria-invalid={Boolean(errorMessage)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <label
                htmlFor="password"
                className="text-[9px] font-black uppercase tracking-[0.08em]"
              >
                Senha
              </label>
              <Link
                href="/forgot-password"
                className="text-[9px] font-black text-primary hover:text-primary/80"
              >
                Esqueci a senha
              </Link>
            </div>

            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="********"
              className="h-[38px] rounded-full border-[#cbd5e1] bg-[#f7f8fc] px-4 text-xs dark:border-[#2d3c54] dark:bg-[#1d2d46]"
              aria-invalid={Boolean(errorMessage)}
              disabled={isSubmitting}
            />
          </div>

          {errorMessage ? (
            <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-center text-[11px] text-destructive">
              {errorMessage}
            </p>
          ) : null}

          <Button
            type="submit"
            className="mt-1 h-[38px] w-full rounded-full bg-primary text-[10px] font-black uppercase tracking-wide text-white shadow-lg shadow-primary/25 hover:bg-primary/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Entrar"
            )}
          </Button>
        </form>

        <div className="my-7 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#e2e8f0] dark:bg-[#2d3c54]" />
          <span className="text-[8px] font-bold uppercase tracking-[0.28em] text-[#94a3b8]">
            ou continue com
          </span>
          <div className="h-px flex-1 bg-[#e2e8f0] dark:bg-[#2d3c54]" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-[38px] rounded-full border-[#cbd5e1] bg-white text-[10px] font-bold text-[#0f172a] hover:bg-[#f7f8fc] dark:border-[#2d3c54] dark:bg-[#132238] dark:text-[#f8fafc] dark:hover:bg-[#1d2d46]"
          >
            <span className="text-sm font-black text-[#2563eb]">G</span>
            Google
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-[38px] rounded-full border-[#cbd5e1] bg-white text-[10px] font-bold text-[#0f172a] hover:bg-[#f7f8fc] dark:border-[#2d3c54] dark:bg-[#132238] dark:text-[#f8fafc] dark:hover:bg-[#1d2d46]"
          >
            <span className="text-sm font-black">GH</span>
            GitHub
          </Button>
        </div>

        <p className="mt-8 text-center text-[11px] text-[#64748b] dark:text-[#94a3b8]">
          Nao tem uma conta?{" "}
          <Link href="/signup" className="font-black text-primary">
            Cadastre-se agora
          </Link>
        </p>
      </section>
    </main>
  );
}
