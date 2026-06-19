"use client";

import { AxiosError } from "axios";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { Loader2 } from "lucide-react";
import { z } from "zod";

import { AuthCard } from "@/domains/auth/components/AuthCard";
import {
  getApiErrorCode,
  registrationService,
} from "@/domains/auth/services/registration-service";
import { useTranslation } from "@/i18n";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

const emailSchema = z.email("Informe um e-mail valido.");

const getMessage = (error: unknown) => {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? "Revise o e-mail informado.";
  }

  if (error instanceof AxiosError && !error.response) {
    return "Nao foi possivel conectar ao servidor.";
  }

  return "Nao foi possivel continuar. Tente novamente.";
};

export function SignupPageClient() {
  const { auth } = useTranslation();
  const [email, setEmail] = useState("");
  const [confirmedEmail, setConfirmedEmail] = useState("");
  const [status, setStatus] = useState<"form" | "check-email">("form");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const parsedEmail = emailSchema.parse(email);

      try {
        const user = await registrationService.findUserByEmail(parsedEmail);

        if (user.isConfirmed) {
          setMessage("Este e-mail ja possui uma conta registrada.");
          return;
        }

        setConfirmedEmail(parsedEmail);
        setStatus("check-email");
        return;
      } catch (error) {
        const code = getApiErrorCode(error);

        if (code !== "USER_NOT_FOUND") {
          throw error;
        }
      }

      await registrationService.createUser(parsedEmail);
      setConfirmedEmail(parsedEmail);
      setStatus("check-email");
    } catch (error) {
      setMessage(getMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setMessage("");
    setIsResending(true);

    try {
      await registrationService.resendConfirmEmail(confirmedEmail);
      setMessage("Enviamos um novo link de confirmacao para seu e-mail.");
    } catch (error) {
      setMessage(getMessage(error));
    } finally {
      setIsResending(false);
    }
  };

  if (status === "check-email") {
    return (
      <AuthCard
        title={auth.signup.checkEmailTitle}
        description={auth.signup.checkEmailDescription}
      >
        <div className="space-y-5 text-center">
          <p className="rounded-2xl bg-[#f7f8fc] px-4 py-3 text-xs text-[#64748b] dark:bg-[#1d2d46] dark:text-[#94a3b8]">
            {confirmedEmail}
          </p>

          {message ? (
            <p className="text-xs text-primary">{message}</p>
          ) : null}

          <Button
            type="button"
            variant="outline"
            className="h-[38px] w-full rounded-full"
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              auth.signup.resendLink
            )}
          </Button>

          <Link
            href="/login"
            className="block text-[11px] font-black text-primary"
          >
            {auth.common.goToLogin}
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title={auth.signup.title}
      description={auth.signup.description}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-[9px] font-black uppercase tracking-[0.08em]"
          >
            {auth.common.corporateEmail}
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={auth.common.emailPlaceholder}
            className="h-[38px] rounded-full border-[#cbd5e1] bg-[#f7f8fc] px-4 text-xs dark:border-[#2d3c54] dark:bg-[#1d2d46]"
            aria-invalid={Boolean(message)}
            disabled={isSubmitting}
          />
        </div>

        {message ? (
          <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-center text-[11px] text-destructive">
            {message}
          </p>
        ) : null}

        <Button
          type="submit"
          className="h-[38px] w-full rounded-full bg-primary text-[10px] font-black uppercase tracking-wide text-white shadow-lg shadow-primary/25 hover:bg-primary/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            auth.common.continue
          )}
        </Button>
      </form>

      <p className="mt-8 text-center text-[11px] text-[#64748b] dark:text-[#94a3b8]">
        {auth.signup.hasAccount}{" "}
        <Link href="/login" className="font-black text-primary">
          {auth.signup.loginNow}
        </Link>
      </p>
    </AuthCard>
  );
}
