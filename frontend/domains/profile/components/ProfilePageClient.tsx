"use client";

import { BriefcaseBusiness, Calendar, Mail, Phone, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { authService } from "@/domains/auth/services/auth-service";
import {
  isProfileComplete,
  userService,
} from "@/domains/user/services/user-service";
import { useI18n, useTranslation } from "@/i18n";
import { AuthenticatedNavbar } from "@/shared/components/AuthenticatedNavbar";
import { authTokenStorage, type AuthUser } from "@/shared/lib/auth-token-storage";

export function ProfilePageClient() {
  const router = useRouter();
  const { app } = useTranslation();
  const { language } = useI18n();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadProfile = async () => {
      const accessToken = authTokenStorage.getAccessToken();
      const storedUser = authTokenStorage.getUser();

      if (!accessToken || !storedUser?.email) {
        router.replace("/login?redirectTo=/profile");
        return;
      }

      try {
        const syncedUser = await userService.syncAuthUser(storedUser.email);

        if (!isProfileComplete(syncedUser)) {
          router.replace("/complete-profile");
          return;
        }

        if (isActive) {
          setUser(syncedUser);
          setIsLoading(false);
        }
      } catch {
        authTokenStorage.clear();
        router.replace("/login?redirectTo=/profile");
      }
    };

    queueMicrotask(() => {
      if (!isActive) {
        return;
      }

      void loadProfile();
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

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm font-semibold text-muted-foreground">
          {app.profile.loading}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <AuthenticatedNavbar
        userName={displayName}
        isLoggingOut={isLoggingOut}
        onLogout={handleLogout}
      />

      <section className="mx-auto max-w-4xl px-5 py-8">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex size-20 items-center justify-center rounded-3xl bg-primary text-2xl font-black uppercase text-primary-foreground">
              {displayName.slice(0, 1)}
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-primary">
                {app.profile.eyebrow}
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight">
                {displayName}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {app.profile.description}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <ProfileInfo
              icon={User}
              label={app.profile.firstName}
              value={user?.firstName}
              fallback={app.common.unavailable}
            />
            <ProfileInfo
              icon={User}
              label={app.profile.lastName}
              value={user?.lastName}
              fallback={app.common.unavailable}
            />
            <ProfileInfo
              icon={Mail}
              label={app.profile.email}
              value={user?.email}
              fallback={app.common.unavailable}
            />
            <ProfileInfo
              icon={Calendar}
              label={app.profile.birthDate}
              value={formatBirthDate(user?.birthDate, language)}
              fallback={app.common.unavailable}
            />
            <ProfileInfo
              icon={Phone}
              label={app.profile.phone}
              value={user?.phone}
              fallback={app.common.unavailable}
            />
            <ProfileInfo
              icon={BriefcaseBusiness}
              label={app.profile.status}
              value={user?.isConfirmed ? app.profile.confirmed : app.profile.pending}
              fallback={app.common.unavailable}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function ProfileInfo({
  icon: Icon,
  label,
  value,
  fallback,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string;
  fallback: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
        <Icon className="size-4 text-primary" />
        {label}
      </div>
      <p className="text-sm font-semibold">{value || fallback}</p>
    </div>
  );
}

function formatBirthDate(value: string | undefined, language: string) {
  if (!value) {
    return undefined;
  }

  const [year, month, day] = value.slice(0, 10).split("-");

  if (!year || !month || !day) {
    return value;
  }

  return language === "pt"
    ? `${day}/${month}/${year}`
    : `${month}/${day}/${year}`;
}
