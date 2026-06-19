"use client";

import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { z } from "zod";

import {
  isProfileComplete,
  userService,
  type FinishRegistrationPayload,
} from "@/domains/user/services/user-service";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { authTokenStorage, type AuthUser } from "@/shared/lib/auth-token-storage";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : undefined));

const completeProfileSchema = z.object({
  firstName: z.string().trim().min(2, "Informe seu primeiro nome."),
  lastName: z.string().trim().min(2, "Informe seu sobrenome."),
  socialName: optionalText.optional(),
  birthDate: z.string().min(1, "Informe sua data de nascimento."),
  phone: z
    .string()
    .trim()
    .regex(/^\+\d{10,15}$/, "Use o telefone com DDI. Ex: +5511999999999."),
  country: z.string().trim().length(2, "Use o codigo do pais com 2 letras."),
  postalCode: z.string().trim().min(3, "Informe o CEP."),
  city: z.string().trim().min(2, "Informe a cidade."),
  street: z.string().trim().min(2, "Informe a rua."),
  number: z.string().trim().min(1, "Informe o numero."),
  state: optionalText.optional(),
  district: optionalText.optional(),
  complement: optionalText.optional(),
});

type CompleteProfileForm = z.infer<typeof completeProfileSchema>;

const initialForm: CompleteProfileForm = {
  firstName: "",
  lastName: "",
  socialName: undefined,
  birthDate: "",
  phone: "",
  country: "BR",
  postalCode: "",
  city: "",
  street: "",
  number: "",
  state: "",
  district: "",
  complement: "",
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? "Revise os dados informados.";
  }

  if (error instanceof AxiosError && !error.response) {
    return "Nao foi possivel conectar ao servidor.";
  }

  return "Nao foi possivel finalizar seu cadastro. Tente novamente.";
};

export function CompleteProfilePageClient() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [form, setForm] = useState<CompleteProfileForm>(initialForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadUser = async () => {
      const accessToken = authTokenStorage.getAccessToken();
      const storedUser = authTokenStorage.getUser();

      if (!accessToken || !storedUser?.email) {
        router.replace("/login?redirectTo=/complete-profile");
        return;
      }

      try {
        const syncedUser = await userService.syncAuthUser(storedUser.email);

        if (isProfileComplete(syncedUser)) {
          router.replace("/home");
          return;
        }

        if (!isActive) {
          return;
        }

        setUser(syncedUser);
        setForm((currentForm) => ({
          ...currentForm,
          firstName: syncedUser.firstName ?? "",
          lastName: syncedUser.lastName ?? "",
          socialName: syncedUser.socialName ?? "",
          birthDate: syncedUser.birthDate?.slice(0, 10) ?? "",
          phone: syncedUser.phone ?? "",
        }));
        setIsLoading(false);
      } catch {
        authTokenStorage.clear();
        router.replace("/login?redirectTo=/complete-profile");
      }
    };

    queueMicrotask(() => {
      if (!isActive) {
        return;
      }

      void loadUser();
    });

    return () => {
      isActive = false;
    };
  }, [router]);

  const updateField =
    (field: keyof CompleteProfileForm) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((currentForm) => ({
        ...currentForm,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      if (!user?.email) {
        router.replace("/login?redirectTo=/complete-profile");
        return;
      }

      const parsed = completeProfileSchema.parse(form);
      const payload: FinishRegistrationPayload = {
        email: user.email,
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        socialName: parsed.socialName,
        phone: parsed.phone,
        birthDate: parsed.birthDate,
        address: {
          country: parsed.country.toUpperCase(),
          postalCode: parsed.postalCode,
          city: parsed.city,
          street: parsed.street,
          number: parsed.number,
          state: parsed.state,
          district: parsed.district,
          complement: parsed.complement,
        },
      };

      await userService.finishRegistration(payload);
      await userService.syncAuthUser(user.email);
      router.replace("/home");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f6fb] px-4 py-10 text-[#0f172a] dark:bg-[#0f172a] dark:text-[#f8fafc]">
        <Loader2 className="size-6 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f6fb] px-4 py-10 text-[#0f172a] dark:bg-[#0f172a] dark:text-[#f8fafc]">
      <section className="w-full max-w-[660px] rounded-[22px] border border-[#e2e8f0] bg-white px-6 py-8 shadow-sm dark:border-[#2d3c54] dark:bg-[#132238] sm:px-8">
        <Link
          href="/home"
          className="mx-auto mb-7 flex w-fit items-center gap-2 text-xs font-bold"
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

        <div className="mb-7 text-center">
          <h1 className="text-[22px] font-black tracking-tight">
            Finalize seu cadastro
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-[11px] leading-5 text-[#64748b] dark:text-[#94a3b8]">
            Complete seus dados pessoais para liberar sua pagina principal e
            comecar a construir seu networking.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <ProfileField
              id="firstName"
              label="Primeiro nome"
              value={form.firstName}
              onChange={updateField("firstName")}
              disabled={isSubmitting}
            />
            <ProfileField
              id="lastName"
              label="Sobrenome"
              value={form.lastName}
              onChange={updateField("lastName")}
              disabled={isSubmitting}
            />
            <ProfileField
              id="socialName"
              label="Nome social"
              value={form.socialName ?? ""}
              onChange={updateField("socialName")}
              disabled={isSubmitting}
              optional
            />
            <ProfileField
              id="birthDate"
              label="Data de nascimento"
              type="date"
              value={form.birthDate}
              onChange={updateField("birthDate")}
              disabled={isSubmitting}
            />
            <ProfileField
              id="phone"
              label="Telefone"
              value={form.phone}
              onChange={updateField("phone")}
              placeholder="+5511999999999"
              disabled={isSubmitting}
            />
            <ProfileField
              id="country"
              label="Pais"
              value={form.country}
              onChange={updateField("country")}
              maxLength={2}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-[0.8fr_1.2fr_0.55fr]">
            <ProfileField
              id="postalCode"
              label="CEP"
              value={form.postalCode}
              onChange={updateField("postalCode")}
              disabled={isSubmitting}
            />
            <ProfileField
              id="street"
              label="Rua"
              value={form.street}
              onChange={updateField("street")}
              disabled={isSubmitting}
            />
            <ProfileField
              id="number"
              label="Numero"
              value={form.number}
              onChange={updateField("number")}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <ProfileField
              id="city"
              label="Cidade"
              value={form.city}
              onChange={updateField("city")}
              disabled={isSubmitting}
            />
            <ProfileField
              id="state"
              label="Estado"
              value={form.state ?? ""}
              onChange={updateField("state")}
              disabled={isSubmitting}
              optional
            />
            <ProfileField
              id="district"
              label="Bairro"
              value={form.district ?? ""}
              onChange={updateField("district")}
              disabled={isSubmitting}
              optional
            />
          </div>

          <ProfileField
            id="complement"
            label="Complemento"
            value={form.complement ?? ""}
            onChange={updateField("complement")}
            disabled={isSubmitting}
            optional
          />

          {errorMessage ? (
            <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-center text-[11px] text-destructive">
              {errorMessage}
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
              "Finalizar cadastro"
            )}
          </Button>
        </form>
      </section>
    </main>
  );
}

function ProfileField({
  id,
  label,
  optional = false,
  ...inputProps
}: {
  id: string;
  label: string;
  optional?: boolean;
} & React.ComponentProps<typeof Input>) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="flex items-center justify-between gap-3 text-[9px] font-black uppercase tracking-[0.08em]"
      >
        <span>{label}</span>
        {optional ? (
          <span className="text-[8px] text-[#94a3b8]">Opcional</span>
        ) : null}
      </label>
      <Input
        id={id}
        className="h-[38px] rounded-full border-[#cbd5e1] bg-[#f7f8fc] px-4 text-xs dark:border-[#2d3c54] dark:bg-[#1d2d46]"
        {...inputProps}
      />
    </div>
  );
}
