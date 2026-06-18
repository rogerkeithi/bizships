"use client";

import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { z } from "zod";

import { AuthCard } from "@/domains/auth/components/AuthCard";
import {
  getApiErrorCode,
  registrationService,
} from "@/domains/auth/services/registration-service";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

type Step =
  | "loading"
  | "expired-confirm"
  | "request-code"
  | "verify-code"
  | "setup-password"
  | "success"
  | "already-confirmed"
  | "invalid";

const emailSchema = z.email("Informe um e-mail valido.");
const codeSchema = z.string().length(6, "Informe o codigo de 6 numeros.");
const passwordSchema = z
  .string()
  .min(8, "A senha precisa ter pelo menos 8 caracteres.")
  .regex(/[A-Z]/, "Inclua uma letra maiuscula.")
  .regex(/[a-z]/, "Inclua uma letra minuscula.")
  .regex(/[0-9]/, "Inclua um numero.")
  .regex(/[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]/, "Inclua um simbolo.");

const getMessage = (error: unknown) => {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? "Revise os dados informados.";
  }

  if (error instanceof AxiosError && !error.response) {
    return "Nao foi possivel conectar ao servidor.";
  }

  const code = getApiErrorCode(error);

  if (code === "INVALID_CODE" || code === "CODE_NOT_FOUND") {
    return "Codigo invalido ou expirado.";
  }

  if (code === "USER_ALREADY_SET_PASSWORD") {
    return "Esta conta ja possui senha. Entre usando o login.";
  }

  return "Nao foi possivel continuar. Tente novamente.";
};

export function ConfirmEmailPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenId = useMemo(() => searchParams.get("tokenId"), [searchParams]);
  const setupTokenFromUrl = useMemo(
    () => searchParams.get("setupPasswordToken"),
    [searchParams],
  );
  const [step, setStep] = useState<Step>("loading");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [setupPasswordToken, setSetupPasswordToken] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isActive = true;

    const run = async () => {
      setMessage("");

      try {
        if (setupTokenFromUrl) {
          const response =
            await registrationService.verifySetupPasswordToken(
              setupTokenFromUrl,
            );

          if (response.valid) {
            setSetupPasswordToken(setupTokenFromUrl);
            setStep("setup-password");
            return;
          }

          setStep("request-code");
          return;
        }

        if (!tokenId) {
          setStep("invalid");
          return;
        }

        const response = await registrationService.confirmEmail(tokenId);
        setSetupPasswordToken(response.setupPasswordToken);
        setStep("setup-password");
      } catch (error) {
        const errorCode = getApiErrorCode(error);

        if (errorCode === "EXPIRED_TOKEN") {
          setStep("expired-confirm");
          return;
        }

        if (
          errorCode === "USER_MISSING_PASSWORD" ||
          errorCode === "CONFIRM_USER_TOKEN_NOT_FOUND"
        ) {
          setStep("request-code");
          return;
        }

        if (errorCode === "USER_ALREADY_CONFIRMED") {
          setStep("already-confirmed");
          return;
        }

        setStep("invalid");
      }
    };

    queueMicrotask(() => {
      if (!isActive) {
        return;
      }

      void run();
    });

    return () => {
      isActive = false;
    };
  }, [setupTokenFromUrl, tokenId]);

  const sendConfirmAgain = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const parsedEmail = emailSchema.parse(email);
      await registrationService.resendConfirmEmail(parsedEmail);
      setMessage("Enviamos um novo link de confirmacao para seu e-mail.");
    } catch (error) {
      setMessage(getMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const parsedEmail = emailSchema.parse(email);
      await registrationService.sendSetupPasswordCode(parsedEmail);
      setEmail(parsedEmail);
      setStep("verify-code");
    } catch (error) {
      setMessage(getMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const parsedCode = codeSchema.parse(code);
      const response = await registrationService.verifySetupPasswordCode(
        email,
        parsedCode,
      );

      setSetupPasswordToken(response.setupPasswordToken);
      setStep("setup-password");
    } catch (error) {
      setMessage(getMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const setupPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const parsedPassword = passwordSchema.parse(password);

      if (parsedPassword !== confirmPassword) {
        setMessage("As senhas nao conferem.");
        return;
      }

      await registrationService.setupPassword(
        setupPasswordToken,
        parsedPassword,
      );
      setStep("success");
    } catch (error) {
      const errorCode = getApiErrorCode(error);

      if (errorCode === "EXPIRED_TOKEN" || errorCode === "INVALID_TOKEN") {
        setStep("request-code");
        setMessage("Seu token expirou. Solicite um codigo por e-mail.");
      } else {
        setMessage(getMessage(error));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === "loading") {
    return (
      <AuthCard
        title="Confirmando e-mail"
        description="Estamos validando seu link de confirmacao."
      >
        <div className="flex justify-center py-8">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      </AuthCard>
    );
  }

  if (step === "expired-confirm") {
    return (
      <AuthCard
        title="Link expirado"
        description="Informe seu e-mail para receber um novo link de confirmacao."
      >
        <form onSubmit={sendConfirmAgain} className="space-y-4">
          <EmailField
            email={email}
            setEmail={setEmail}
            disabled={isSubmitting}
          />
          <Feedback message={message} />
          <SubmitButton loading={isSubmitting}>Reenviar link</SubmitButton>
        </form>
      </AuthCard>
    );
  }

  if (step === "request-code") {
    return (
      <AuthCard
        title="Defina sua senha"
        description="Informe seu e-mail para receber um codigo de 6 numeros e gerar um novo token."
      >
        <form onSubmit={sendCode} className="space-y-4">
          <EmailField
            email={email}
            setEmail={setEmail}
            disabled={isSubmitting}
          />
          <Feedback message={message} />
          <SubmitButton loading={isSubmitting}>Enviar codigo</SubmitButton>
        </form>
      </AuthCard>
    );
  }

  if (step === "verify-code") {
    return (
      <AuthCard
        title="Codigo de verificacao"
        description="Digite o codigo de 6 numeros enviado para seu e-mail."
      >
        <form onSubmit={verifyCode} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="code"
              className="text-[9px] font-black uppercase tracking-[0.08em]"
            >
              Codigo
            </label>
            <Input
              id="code"
              inputMode="numeric"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="000000"
              maxLength={6}
              className="h-[38px] rounded-full border-[#cbd5e1] bg-[#f7f8fc] px-4 text-center text-xs tracking-[0.35em] dark:border-[#2d3c54] dark:bg-[#1d2d46]"
              disabled={isSubmitting}
            />
          </div>
          <Feedback message={message} />
          <SubmitButton loading={isSubmitting}>Validar codigo</SubmitButton>
        </form>
      </AuthCard>
    );
  }

  if (step === "setup-password") {
    return (
      <AuthCard
        title="Crie sua senha"
        description="Use uma senha forte para proteger sua conta Bizships."
      >
        <form onSubmit={setupPassword} className="space-y-4">
          <PasswordField
            id="password"
            label="Senha"
            value={password}
            onChange={setPassword}
            disabled={isSubmitting}
          />
          <PasswordField
            id="confirm-password"
            label="Confirmar senha"
            value={confirmPassword}
            onChange={setConfirmPassword}
            disabled={isSubmitting}
          />
          <Feedback message={message} />
          <SubmitButton loading={isSubmitting}>Definir senha</SubmitButton>
        </form>
      </AuthCard>
    );
  }

  if (step === "success") {
    return (
      <AuthCard
        title="Registro finalizado 🎉"
        description="Sua senha foi definida com sucesso. Agora voce ja pode entrar"
      >
        <Button
          type="button"
          className="h-[38px] w-full rounded-full bg-primary text-[10px] font-black uppercase tracking-wide text-white"
          onClick={() => router.replace("/login")}
        >
          Ir para login
        </Button>
      </AuthCard>
    );
  }

  if (step === "already-confirmed") {
    return (
      <AuthCard
        title="E-mail ja confirmado"
        description="Esta conta ja foi confirmada. Entre com sua senha para continuar."
      >
        <Link
          href="/login"
          className="block text-center text-xs font-black text-primary"
        >
          Ir para login
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Link invalido"
      description="Nao foi possivel validar este link. Solicite um novo acesso ou tente novamente."
    >
      <Link
        href="/signup"
        className="block text-center text-xs font-black text-primary"
      >
        Voltar ao cadastro
      </Link>
    </AuthCard>
  );
}

function EmailField({
  email,
  setEmail,
  disabled,
}: {
  email: string;
  setEmail: (email: string) => void;
  disabled: boolean;
}) {
  return (
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
        disabled={disabled}
      />
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-[9px] font-black uppercase tracking-[0.08em]"
      >
        {label}
      </label>
      <Input
        id={id}
        type="password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="********"
        className="h-[38px] rounded-full border-[#cbd5e1] bg-[#f7f8fc] px-4 text-xs dark:border-[#2d3c54] dark:bg-[#1d2d46]"
        disabled={disabled}
      />
    </div>
  );
}

function Feedback({ message }: { message: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="rounded-2xl border border-primary/20 bg-primary/10 px-3 py-2 text-center text-[11px] text-primary">
      {message}
    </p>
  );
}

function SubmitButton({
  loading,
  children,
}: {
  loading: boolean;
  children: string;
}) {
  return (
    <Button
      type="submit"
      className="h-[38px] w-full rounded-full bg-primary text-[10px] font-black uppercase tracking-wide text-white shadow-lg shadow-primary/25 hover:bg-primary/90"
      disabled={loading}
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : children}
    </Button>
  );
}
