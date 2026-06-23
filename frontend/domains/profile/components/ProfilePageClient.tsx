"use client";

import {
  BriefcaseBusiness,
  Calendar,
  Camera,
  Loader2,
  Mail,
  Phone,
  Upload,
  User,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import { authService } from "@/domains/auth/services/auth-service";
import {
  isProfileComplete,
  userService,
} from "@/domains/user/services/user-service";
import { useI18n, useTranslation } from "@/i18n";
import { AuthenticatedNavbar } from "@/shared/components/AuthenticatedNavbar";
import { Button } from "@/shared/components/ui/button";
import { authTokenStorage, type AuthUser } from "@/shared/lib/auth-token-storage";
import { resolveAvatarUrl } from "@/shared/lib/resolve-avatar-url";

const MAX_SOURCE_IMAGE_BYTES = 8 * 1024 * 1024;
const PROFILE_IMAGE_SIZE = 512;

export function ProfilePageClient() {
  const router = useRouter();
  const { app } = useTranslation();
  const { language } = useI18n();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cropImageSrc, setCropImageSrc] = useState("");
  const [imageError, setImageError] = useState("");
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [positionX, setPositionX] = useState(50);
  const [positionY, setPositionY] = useState(50);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
  const avatarUrl = resolveAvatarUrl(user?.avatarUrl);

  const resetCrop = () => {
    setCropImageSrc("");
    setImageError("");
    setZoom(1);
    setPositionX(50);
    setPositionY(50);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setImageError(app.profile.invalidImage);
      return;
    }

    if (file.size > MAX_SOURCE_IMAGE_BYTES) {
      setImageError(app.profile.imageTooLarge);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setCropImageSrc(String(reader.result));
      setImageError("");
      setZoom(1);
      setPositionX(50);
      setPositionY(50);
    };

    reader.onerror = () => setImageError(app.profile.imageReadError);
    reader.readAsDataURL(file);
  };

  const uploadProfilePicture = async () => {
    if (!cropImageSrc || !user) {
      return;
    }

    setImageError("");
    setIsUploadingPicture(true);

    try {
      const imageBase64 = await createCroppedProfileImage({
        imageSrc: cropImageSrc,
        zoom,
        positionX,
        positionY,
      });
      const response = await userService.uploadProfilePicture({
        imageBase64,
        mimeType: "image/jpeg",
      });
      const nextUser = {
        ...user,
        avatarUrl: response.avatarUrl,
      };

      authTokenStorage.setUser(nextUser);
      setUser(nextUser);
      resetCrop();
    } catch {
      setImageError(app.profile.uploadError);
    } finally {
      setIsUploadingPicture(false);
    }
  };

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
        avatarUrl={user?.avatarUrl}
        isLoggingOut={isLoggingOut}
        onLogout={handleLogout}
      />

      <section className="mx-auto max-w-4xl px-5 py-8">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative size-24 shrink-0">
              <div className="flex size-24 items-center justify-center overflow-hidden rounded-3xl bg-primary text-3xl font-black uppercase text-primary-foreground">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="size-full object-cover"
                  />
                ) : (
                  displayName.slice(0, 1)
                )}
              </div>
              <button
                type="button"
                className="absolute -bottom-2 -right-2 flex size-9 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-primary shadow-sm hover:bg-secondary"
                onClick={() => fileInputRef.current?.click()}
                aria-label={app.profile.changePhoto}
              >
                <Camera className="size-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleImageSelect}
              />
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

          {imageError ? (
            <p className="mt-5 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {imageError}
            </p>
          ) : null}

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

      {cropImageSrc ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-primary">
                  {app.profile.cropTitle}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {app.profile.cropDescription}
                </p>
              </div>
              <button
                type="button"
                className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-secondary"
                onClick={resetCrop}
                aria-label={app.profile.cancelPhoto}
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mx-auto size-64 overflow-hidden rounded-3xl border border-border bg-background">
              <img
                src={cropImageSrc}
                alt=""
                className="size-full object-cover"
                style={{
                  transform: `translate(${50 - positionX}%, ${
                    50 - positionY
                  }%) scale(${zoom})`,
                  transformOrigin: `${positionX}% ${positionY}%`,
                }}
              />
            </div>

            <div className="mt-5 space-y-4">
              <CropSlider
                label={app.profile.zoom}
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={setZoom}
              />
              <CropSlider
                label={app.profile.positionX}
                min={0}
                max={100}
                step={1}
                value={positionX}
                onChange={setPositionX}
              />
              <CropSlider
                label={app.profile.positionY}
                min={0}
                max={100}
                step={1}
                value={positionY}
                onChange={setPositionY}
              />
            </div>

            {imageError ? (
              <p className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {imageError}
              </p>
            ) : null}

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={resetCrop}
                disabled={isUploadingPicture}
              >
                {app.profile.cancelPhoto}
              </Button>
              <Button
                type="button"
                className="rounded-full"
                onClick={uploadProfilePicture}
                disabled={isUploadingPicture}
              >
                {isUploadingPicture ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    <Upload className="size-4" />
                    {app.profile.savePhoto}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function CropSlider({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase text-muted-foreground">
        {label}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full cursor-pointer accent-primary"
      />
    </label>
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

function loadImage(imageSrc: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = imageSrc;
  });
}

async function createCroppedProfileImage({
  imageSrc,
  zoom,
  positionX,
  positionY,
}: {
  imageSrc: string;
  zoom: number;
  positionX: number;
  positionY: number;
}) {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas context unavailable.");
  }

  const sourceSize = Math.min(image.naturalWidth, image.naturalHeight) / zoom;
  const centerX = (positionX / 100) * image.naturalWidth;
  const centerY = (positionY / 100) * image.naturalHeight;
  const sourceX = Math.max(
    0,
    Math.min(image.naturalWidth - sourceSize, centerX - sourceSize / 2),
  );
  const sourceY = Math.max(
    0,
    Math.min(image.naturalHeight - sourceSize, centerY - sourceSize / 2),
  );

  canvas.width = PROFILE_IMAGE_SIZE;
  canvas.height = PROFILE_IMAGE_SIZE;
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceSize,
    sourceSize,
    0,
    0,
    PROFILE_IMAGE_SIZE,
    PROFILE_IMAGE_SIZE,
  );

  return canvas.toDataURL("image/jpeg", 0.86);
}
