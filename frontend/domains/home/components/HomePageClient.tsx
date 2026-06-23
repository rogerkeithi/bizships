"use client";

import {
  BriefcaseBusiness,
  GraduationCap,
  Handshake,
  Heart,
  MapPin,
  RotateCcw,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { type PointerEvent, useEffect, useMemo, useState } from "react";

import { authService } from "@/domains/auth/services/auth-service";
import {
  isProfileComplete,
  userService,
} from "@/domains/user/services/user-service";
import { AuthenticatedNavbar } from "@/shared/components/AuthenticatedNavbar";
import { useTranslation } from "@/i18n";
import { Button } from "@/shared/components/ui/button";
import { authTokenStorage, type AuthUser } from "@/shared/lib/auth-token-storage";

type DiscoveryItemBase = {
  id: string;
  imageUrl: string;
  country: string;
  city: string;
  state: string;
};

type NetworkingItem = DiscoveryItemBase & {
  type: "networking";
  name: string;
  area: string;
  education: string;
  currentJob?: string;
  biography: string;
};

type JobItem = DiscoveryItemBase & {
  type: "job";
  title: string;
  modality: "Remoto" | "Hibrido" | "Presencial";
  companyName: string;
  description: string;
  compatibility: number;
};

type DiscoveryItem = NetworkingItem | JobItem;
type SwipeDirection = "left" | "right";
type HomeLabels = ReturnType<typeof useTranslation>["app"]["home"];

const mockDiscoveryItems: DiscoveryItem[] = [
  {
    id: "job-product-designer",
    type: "job",
    title: "Product Designer Pleno",
    modality: "Hibrido",
    country: "Brasil",
    city: "Sao Paulo",
    state: "SP",
    companyName: "Nexa Labs",
    compatibility: 94,
    description:
      "Atuacao em squads de produto digital, discovery continuo, prototipacao, pesquisa com usuarios e colaboracao direta com engenharia e negocio. A pessoa selecionada vai conduzir entrevistas, organizar aprendizados em oportunidades de produto e transformar requisitos ambiguos em fluxos claros para times multifuncionais.",
    imageUrl:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "network-mariana",
    type: "networking",
    name: "Mariana Alves",
    area: "Design de Produto",
    education: "Bacharelado em Design Digital",
    currentJob: "Product Designer na Orbit",
    country: "Brasil",
    city: "Curitiba",
    state: "PR",
    biography:
      "Designer focada em produtos B2B, pesquisa qualitativa e interfaces para times de operacao. Busca trocar experiencias sobre discovery, metricas e colaboracao com engenharia. Tambem participa de comunidades de produto, mentora profissionais em transicao e gosta de discutir processos que aproximam estrategia, execucao e impacto real para clientes.",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "job-frontend",
    type: "job",
    title: "Front-end React Senior",
    modality: "Remoto",
    country: "Portugal",
    city: "Lisboa",
    state: "Lisboa",
    companyName: "Bridge Tech",
    compatibility: 88,
    description:
      "Vaga para desenvolvimento de plataformas web com React, Next.js, design system, testes automatizados e colaboracao com times distribuidos.",
    imageUrl:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "network-rafael",
    type: "networking",
    name: "Rafael Costa",
    area: "Dados e BI",
    education: "Engenharia de Producao",
    currentJob: "Analista de Dados na Flux",
    country: "Brasil",
    city: "Belo Horizonte",
    state: "MG",
    biography:
      "Profissional de dados interessado em comunidades de analytics, dashboards executivos e modelos de decisao para produto e crescimento.",
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
  },
];

export function HomePageClient() {
  const router = useRouter();
  const { app } = useTranslation();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  useEffect(() => {
    let isActive = true;

    const checkSession = async () => {
      const accessToken = authTokenStorage.getAccessToken();

      if (!accessToken) {
        router.replace("/login?redirectTo=/home");
        return;
      }

      const storedUser = authTokenStorage.getUser();

      if (!storedUser?.email) {
        router.replace("/login?redirectTo=/home");
        return;
      }

      try {
        const syncedUser = isProfileComplete(storedUser)
          ? storedUser
          : await userService.syncAuthUser(storedUser.email);

        if (!isProfileComplete(syncedUser)) {
          router.replace("/complete-profile");
          return;
        }

        if (isActive) {
          setUser(syncedUser);
          setIsCheckingProfile(false);
        }
      } catch {
        authTokenStorage.clear();
        router.replace("/login?redirectTo=/home");
      }
    };

    queueMicrotask(() => {
      if (!isActive) {
        return;
      }

      void checkSession();
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

  if (isCheckingProfile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm font-semibold text-muted-foreground">
          {app.common.loadingAccount}
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

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-8 lg:grid-cols-[0.58fr_1fr]">
        <div className="order-2 self-start lg:order-1">
          <p className="text-sm font-semibold text-primary">
            {app.home.greeting} {displayName}
          </p>
          <h1 className="mt-3 max-w-sm text-2xl font-bold tracking-tight">
            {app.home.title}
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
            {app.home.description}
          </p>

          <div className="mt-6 grid max-w-sm gap-3">
            <div className="rounded-2xl border border-border bg-card p-4">
              <BriefcaseBusiness className="size-5 text-primary" />
              <p className="mt-3 text-sm font-bold">{app.home.jobsTitle}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {app.home.jobsDescription}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <Handshake className="size-5 text-primary" />
              <p className="mt-3 text-sm font-bold">
                {app.home.networkingTitle}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {app.home.networkingDescription}
              </p>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <SwipeDeck items={mockDiscoveryItems} labels={app.home} />
        </div>
      </section>
    </main>
  );
}

function SwipeDeck({
  items,
  labels,
}: {
  items: DiscoveryItem[];
  labels: HomeLabels;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOrigin, setDragOrigin] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isLeaving, setIsLeaving] = useState(false);
  const activeItem = items[activeIndex % items.length];
  const decision =
    dragOffset.x > 40 ? "like" : dragOffset.x < -40 ? "pass" : null;
  const stackedItems = useMemo(
    () => [0, 1, 2].map((offset) => items[(activeIndex + offset) % items.length]),
    [activeIndex, items],
  );

  const finishSwipe = (direction: SwipeDirection) => {
    setDragOrigin(null);
    setIsLeaving(true);
    setDragOffset({ x: direction === "right" ? 360 : -360, y: -18 });

    window.setTimeout(() => {
      setActiveIndex((currentIndex) => currentIndex + 1);
      setDragOffset({ x: 0, y: 0 });
      setIsLeaving(false);
    }, 220);
  };

  const resetCard = () => {
    setDragOrigin(null);
    setDragOffset({ x: 0, y: 0 });
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (isLeaving) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    setDragOrigin({ x: event.clientX, y: event.clientY });
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragOrigin || isLeaving) {
      return;
    }

    setDragOffset({
      x: event.clientX - dragOrigin.x,
      y: Math.max(-30, Math.min(30, event.clientY - dragOrigin.y)),
    });
  };

  const handlePointerUp = () => {
    if (!dragOrigin || isLeaving) {
      return;
    }

    if (Math.abs(dragOffset.x) > 92) {
      finishSwipe(dragOffset.x > 0 ? "right" : "left");
      return;
    }

    resetCard();
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative h-[610px] w-full max-w-[440px] sm:h-[620px]">
        {stackedItems
          .slice()
          .reverse()
          .map((item, stackIndex) => {
            const isActive = item.id === activeItem.id;
            const depth = stackedItems.length - 1 - stackIndex;

            return (
              <DiscoveryCard
                key={`${item.id}-${activeIndex}`}
                item={item}
                isActive={isActive}
                depth={depth}
                decision={isActive ? decision : null}
                dragOffset={isActive ? dragOffset : { x: 0, y: 0 }}
                onPointerDown={isActive ? handlePointerDown : undefined}
                onPointerMove={isActive ? handlePointerMove : undefined}
                onPointerUp={isActive ? handlePointerUp : undefined}
                labels={labels}
              />
            );
          })}
      </div>

      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          className="size-12 rounded-full border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/60 dark:hover:bg-rose-950/30"
          onClick={() => finishSwipe("left")}
          aria-label={labels.pass}
        >
          <X className="size-5" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          className="size-10 rounded-full text-muted-foreground"
          onClick={resetCard}
          aria-label={labels.resetCard}
        >
          <RotateCcw className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          className="size-12 rounded-full border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900/60 dark:hover:bg-emerald-950/30"
          onClick={() => finishSwipe("right")}
          aria-label={labels.like}
        >
          <Heart className="size-5" />
        </Button>
      </div>
    </div>
  );
}

function DiscoveryCard({
  item,
  isActive,
  depth,
  decision,
  dragOffset,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  labels,
}: {
  item: DiscoveryItem;
  isActive: boolean;
  depth: number;
  decision: "like" | "pass" | null;
  dragOffset: { x: number; y: number };
  onPointerDown?: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerMove?: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerUp?: () => void;
  labels: HomeLabels;
}) {
  const Icon = item.type === "job" ? BriefcaseBusiness : Handshake;
  const badgeLabel =
    item.type === "job" ? labels.jobBadge : labels.networkingBadge;

  return (
    <div
      role={isActive ? "button" : undefined}
      tabIndex={isActive ? 0 : -1}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="absolute inset-0 touch-none select-none rounded-[2.25rem] border border-border bg-card p-5 shadow-2xl transition-transform sm:p-7"
      style={{
        transform: isActive
          ? `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${
              dragOffset.x / 22
            }deg)`
          : `translateY(${depth * 12}px) scale(${1 - depth * 0.035})`,
        zIndex: 10 - depth,
        cursor: isActive ? "grab" : "default",
      }}
      aria-label={item.type === "job" ? item.title : item.name}
    >
      {decision ? (
        <div
          className={`absolute top-8 z-20 rounded-full border-2 bg-background/95 px-4 py-2 text-xs font-black uppercase ${
            decision === "like"
              ? "right-7 rotate-12 border-emerald-500 text-emerald-600"
              : "left-7 -rotate-12 border-rose-500 text-rose-600"
          }`}
        >
          {decision === "like" ? labels.like : labels.pass}
        </div>
      ) : null}

      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <Icon className="size-3.5" />
            {badgeLabel}
          </span>
          {item.type === "job" ? (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
              {item.compatibility}% match
            </span>
          ) : null}
        </div>

        <div className="mt-6 sm:mt-9">
          {item.type === "job" ? (
            <JobCardContent item={item} labels={labels} />
          ) : null}
          {item.type === "networking" ? (
            <NetworkingCardContent item={item} labels={labels} />
          ) : null}
        </div>

        <div className="flex items-end justify-between gap-4 pt-4 sm:mt-auto sm:pt-8">
          <LocationBlock item={item} label={labels.location} />
          <div className="relative size-20 shrink-0 rounded-3xl border border-border bg-cover bg-center shadow-md sm:size-24">
            <div
              className="absolute inset-0 rounded-3xl bg-cover bg-center"
              style={{ backgroundImage: `url(${item.imageUrl})` }}
            />
            <div className="absolute -bottom-2 -right-2 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
              <Icon className="size-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function JobCardContent({
  item,
  labels,
}: {
  item: JobItem;
  labels: HomeLabels;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-muted-foreground">
        {item.companyName}
      </p>
      <h2 className="mt-2 text-2xl font-black tracking-tight">{item.title}</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
          {item.modality}
        </span>
        {item.modality !== "Remoto" ? (
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
            {item.city} - {item.state}
          </span>
        ) : null}
      </div>
      <ExpandableText
        title={labels.jobSummary}
        text={item.description}
        labels={labels}
      />
    </div>
  );
}

function NetworkingCardContent({
  item,
  labels,
}: {
  item: NetworkingItem;
  labels: HomeLabels;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-primary">{item.area}</p>
      <h2 className="mt-2 text-2xl font-black tracking-tight">{item.name}</h2>
      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <GraduationCap className="size-4 shrink-0 text-primary" />
          <span>{item.education}</span>
        </p>
        {item.currentJob ? (
          <p className="flex items-center gap-2">
            <BriefcaseBusiness className="size-4 shrink-0 text-primary" />
            <span>{item.currentJob}</span>
          </p>
        ) : null}
      </div>
      <ExpandableText
        title={labels.biography}
        text={item.biography}
        labels={labels}
      />
    </div>
  );
}

function ExpandableText({
  title,
  text,
  labels,
}: {
  title: string;
  text: string;
  labels: HomeLabels;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const preview = text.length > 220 ? `${text.slice(0, 220).trim()}...` : text;

  return (
    <div className="mt-4 min-h-[130px] rounded-2xl border border-border bg-background p-4 sm:mt-5 sm:min-h-[190px] sm:p-5">
      <p className="text-sm font-bold">{title}</p>
      <p className="mt-3 text-[13px] leading-6 text-muted-foreground">
        {isExpanded ? text : preview}
      </p>
      {text.length > 220 ? (
        <button
          type="button"
          className="mt-3 cursor-pointer text-xs font-black text-primary hover:text-primary/80"
          onClick={() => setIsExpanded((current) => !current)}
        >
          {isExpanded ? labels.showLess : labels.showMore}
        </button>
      ) : null}
    </div>
  );
}

function LocationBlock({
  item,
  label,
}: {
  item: DiscoveryItem;
  label: string;
}) {
  return (
    <div className="min-w-0">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
        <MapPin className="size-4" />
        {label}
      </div>
      <p className="text-sm font-black">{item.country}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {item.city} - {item.state}
      </p>
    </div>
  );
}
