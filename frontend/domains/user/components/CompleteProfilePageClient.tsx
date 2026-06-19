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
import { useTranslation } from "@/i18n";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  authTokenStorage,
  type AuthUser,
} from "@/shared/lib/auth-token-storage";

type CompleteProfileStep = "personal" | "address";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : undefined));

const personalProfileSchema = z.object({
  firstName: z.string().trim().min(2, "Informe seu primeiro nome."),
  lastName: z.string().trim().min(2, "Informe seu sobrenome."),
  socialName: optionalText.optional(),
  birthDate: z.string().min(1, "Informe sua data de nascimento."),
  phone: z
    .string()
    .trim()
    .regex(/^\+\d{10,15}$/, "Use o telefone com DDI. Ex: +5511999999999."),
});

const addressProfileSchema = z.object({
  country: z.string().trim().length(2, "Use o codigo do pais com 2 letras."),
  state: z.string().trim().min(2, "Informe o estado."),
  city: z.string().trim().min(2, "Informe a cidade."),
});

const completeProfileSchema = personalProfileSchema.merge(addressProfileSchema);

type CompleteProfileForm = z.infer<typeof completeProfileSchema>;

const initialForm: CompleteProfileForm = {
  firstName: "",
  lastName: "",
  socialName: undefined,
  birthDate: "",
  phone: "",
  country: "BR",
  city: "",
  state: "",
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
  const { auth } = useTranslation();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [form, setForm] = useState<CompleteProfileForm>(initialForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState<CompleteProfileStep>("personal");

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

    if (step === "personal") {
      try {
        personalProfileSchema.parse(form);
        setStep("address");
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      }

      return;
    }

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
          postalCode: "00000000",
          city: parsed.city,
          street: "Nao informado",
          number: "S/N",
          state: parsed.state,
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
          className="mx-auto mb-7 flex w-fit items-center gap-2.5 text-sm font-bold"
        >
          <Image
            src="/t-black-logo.svg"
            alt=""
            width={34}
            height={34}
            className="size-8 dark:invert"
            aria-hidden="true"
          />
          {auth.brand}
        </Link>

        <div className="mb-7 text-center">
          <h1 className="text-[22px] font-black tracking-tight">
            {auth.completeProfile.title}
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-[11px] leading-5 text-[#64748b] dark:text-[#94a3b8]">
            {step === "personal"
              ? auth.completeProfile.personalDescription
              : auth.completeProfile.addressDescription}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <StepIndicator
            currentStep={step}
            labels={{
              personal: auth.completeProfile.personalStep,
              address: auth.completeProfile.addressStep,
            }}
          />

          {step === "personal" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <ProfileField
                id="firstName"
                label={auth.completeProfile.firstName}
                value={form.firstName}
                onChange={updateField("firstName")}
                disabled={isSubmitting}
              />
              <ProfileField
                id="lastName"
                label={auth.completeProfile.lastName}
                value={form.lastName}
                onChange={updateField("lastName")}
                disabled={isSubmitting}
              />
              <ProfileField
                id="socialName"
                label={auth.completeProfile.socialName}
                value={form.socialName ?? ""}
                onChange={updateField("socialName")}
                disabled={isSubmitting}
                optional
              />
              <ProfileField
                id="birthDate"
                label={auth.completeProfile.birthDate}
                type="date"
                value={form.birthDate}
                onChange={updateField("birthDate")}
                disabled={isSubmitting}
              />
              <div className="sm:col-span-2">
                <ProfileField
                  id="phone"
                  label={auth.completeProfile.phone}
                  value={form.phone}
                  onChange={updateField("phone")}
                  placeholder="+5511999999999"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              <ProfileField
                id="country"
                label={auth.completeProfile.country}
                value={form.country}
                onChange={updateField("country")}
                maxLength={2}
                disabled={isSubmitting}
              />
              <ProfileField
                id="state"
                label={auth.completeProfile.state}
                value={form.state}
                onChange={updateField("state")}
                disabled={isSubmitting}
              />
              <ProfileField
                id="city"
                label={auth.completeProfile.city}
                value={form.city}
                onChange={updateField("city")}
                disabled={isSubmitting}
              />
            </div>
          )}

          {errorMessage ? (
            <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-center text-[11px] text-destructive">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            {step === "address" ? (
              <Button
                type="button"
                variant="outline"
                className="h-[38px] flex-1 rounded-full"
                onClick={() => setStep("personal")}
                disabled={isSubmitting}
              >
                {auth.common.back}
              </Button>
            ) : null}

            <Button
              type="submit"
              className="h-[38px] flex-1 rounded-full bg-primary text-[10px] font-black uppercase tracking-wide text-white shadow-lg shadow-primary/25 hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : step === "personal" ? (
                auth.common.continue
              ) : (
                auth.completeProfile.submit
              )}
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}

function StepIndicator({
  currentStep,
  labels,
}: {
  currentStep: CompleteProfileStep;
  labels: Record<CompleteProfileStep, string>;
}) {
  const steps: Array<{ id: CompleteProfileStep; label: string }> = [
    { id: "personal", label: labels.personal },
    { id: "address", label: labels.address },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 rounded-full bg-[#f7f8fc] p-1 dark:bg-[#1d2d46]">
      {steps.map((step) => {
        const isActive = step.id === currentStep;

        return (
          <div
            key={step.id}
            className={`rounded-full px-3 py-2 text-center text-[10px] font-black uppercase ${
              isActive
                ? "bg-primary text-white shadow-sm"
                : "text-[#64748b] dark:text-[#94a3b8]"
            }`}
          >
            {step.label}
          </div>
        );
      })}
    </div>
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
  const { auth } = useTranslation();

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="flex items-center justify-between gap-3 text-[9px] font-black uppercase tracking-[0.08em]"
      >
        <span>{label}</span>
        {optional ? (
          <span className="text-[8px] text-[#94a3b8]">
            {auth.common.optional}
          </span>
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
