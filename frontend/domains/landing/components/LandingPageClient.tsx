"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type PointerEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Heart,
  MessageSquare,
  Network,
  X,
  Users,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/i18n";
import { authTokenStorage } from "@/shared/lib/auth-token-storage";
import { cn } from "@/shared/lib/utils";

type MatchProfile = {
  name: string;
  role: string;
  meta: string;
  type: string;
};

function SwipeableMatchCard({
  label,
  headline,
  cardTitle,
  cardDescription,
  profiles,
  likeLabel,
  dislikeLabel,
}: {
  label: string;
  headline: string;
  cardTitle: string;
  cardDescription: string;
  profiles: MatchProfile[];
  likeLabel: string;
  dislikeLabel: string;
}) {
  const [activeProfileIndex, setActiveProfileIndex] = useState(0);
  const [dragOrigin, setDragOrigin] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const profile = profiles[activeProfileIndex % profiles.length];
  const decisionLabel =
    dragOffset.x > 28 ? likeLabel : dragOffset.x < -28 ? dislikeLabel : "";

  const resetWithNextProfile = () => {
    window.setTimeout(() => {
      setActiveProfileIndex((currentIndex) => currentIndex + 1);
      setDragOffset({ x: 0, y: 0 });
      setIsAnimating(false);
    }, 220);
  };

  const swipeProfile = (direction: "left" | "right") => {
    setDragOrigin(null);
    setIsAnimating(true);
    setDragOffset({
      x: direction === "right" ? 260 : -260,
      y: -18,
    });
    resetWithNextProfile();
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (isAnimating) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    setDragOrigin({ x: event.clientX, y: event.clientY });
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragOrigin || isAnimating) {
      return;
    }

    setDragOffset({
      x: event.clientX - dragOrigin.x,
      y: Math.max(-28, Math.min(28, event.clientY - dragOrigin.y)),
    });
  };

  const handlePointerUp = () => {
    if (!dragOrigin || isAnimating) {
      return;
    }

    if (Math.abs(dragOffset.x) > 86) {
      swipeProfile(dragOffset.x > 0 ? "right" : "left");
      return;
    }

    setDragOrigin(null);
    setDragOffset({ x: 0, y: 0 });
  };

  return (
    <div className="relative h-[430px] w-80 max-w-full overflow-visible px-4 py-3">
      <div className="absolute inset-8 rounded-[2rem] bg-[#0f172a]/20 blur-xl" />

      <div
        role="button"
        tabIndex={0}
        aria-label={`${profile.name}, ${profile.role}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative h-full touch-none cursor-grab overflow-hidden rounded-[2rem] border-4 border-card bg-[#0f172a] text-white shadow-2xl active:cursor-grabbing"
        style={{
          transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${
            dragOffset.x / 18 + 6
          }deg)`,
          transition: dragOrigin ? "none" : "transform 220ms ease",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#132238] to-[#020617]" />

        {decisionLabel ? (
          <span
            className={`absolute top-8 z-20 rounded-full border-2 bg-[#f8fafc]/95 px-4 py-2 text-xs font-black uppercase tracking-wide ${
              dragOffset.x > 0
                ? "right-6 rotate-12 border-emerald-500 text-emerald-600"
                : "left-6 -rotate-12 border-rose-500 text-rose-600"
            }`}
          >
            {decisionLabel}
          </span>
        ) : null}

        <div className="relative z-10 flex h-full flex-col justify-between p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex size-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Users className="size-7" />
              </div>

              <div className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold text-white/75">
                {activeProfileIndex + 1}/{profiles.length}
              </div>
            </div>

            <div>
              <p className="mb-1 text-xs text-white/60">{label}</p>
              <h3 className="text-2xl font-bold leading-tight">{headline}</h3>
            </div>
          </div>

          <div className="space-y-3">
            <div className="relative h-40 overflow-hidden rounded-2xl">
              <div className="absolute inset-x-4 top-4 h-28 rounded-2xl bg-white/35" />

              <div className="absolute inset-x-1 top-1 rounded-2xl bg-[#f8fafc] p-4 text-[#0f172a] shadow-xl">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-full bg-[#dbe8ff] text-[#2563eb]">
                    {profile.type.toLowerCase().includes("empresa") ||
                    profile.type.toLowerCase().includes("company") ? (
                      <Building2 className="size-5" />
                    ) : (
                      <Users className="size-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{profile.name}</p>
                    <p className="truncate text-[11px] font-medium text-[#64748b]">
                      {profile.type}
                    </p>
                  </div>
                </div>

                <p className="text-sm font-bold leading-tight">
                  {profile.role}
                </p>
                <p className="mt-1 text-[11px] leading-snug text-[#64748b]">
                  {profile.meta}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-[#f8fafc]/95 p-4 text-[#0f172a]">
              <p className="text-xs font-bold">{cardTitle}</p>
              <p className="text-[10px] text-[#64748b]">{cardDescription}</p>

              <div className="mt-3 flex justify-center gap-3">
                <button
                  type="button"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => swipeProfile("left")}
                  className="flex size-8 items-center justify-center rounded-full bg-rose-100 text-rose-600 transition hover:bg-rose-200"
                  aria-label={dislikeLabel}
                >
                  <X className="size-4" />
                </button>

                <button
                  type="button"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => swipeProfile("right")}
                  className="flex size-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition hover:bg-emerald-200"
                  aria-label={likeLabel}
                >
                  <Heart className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LandingPageClient() {
  const router = useRouter();
  const { landing } = useTranslation();
  const [activeSection, setActiveSection] = useState("howItWorks");
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const navItems = useMemo(
    () => [
      { id: "howItWorks", label: landing.nav.howItWorks },
      { id: "companies", label: landing.nav.companies },
      { id: "joinUs", label: landing.nav.joinUs },
    ],
    [landing.nav.howItWorks, landing.nav.companies, landing.nav.joinUs],
  );

  useEffect(() => {
    let isActive = true;
    const isAuthenticated = Boolean(authTokenStorage.getAccessToken());

    if (isAuthenticated) {
      router.replace("/home");
    } else {
      queueMicrotask(() => {
        if (!isActive) {
          return;
        }

        setIsCheckingSession(false);
      });
    }

    return () => {
      isActive = false;
    };
  }, [router]);

  useEffect(() => {
    if (isCheckingSession) {
      return;
    }

    const sections = navItems
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((firstEntry, secondEntry) => {
            return secondEntry.intersectionRatio - firstEntry.intersectionRatio;
          })[0];

        if (visibleEntry?.target.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-112px 0px -50% 0px",
        threshold: [0.15, 0.35, 0.6],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, [isCheckingSession, navItems]);

  if (isCheckingSession) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary selection:text-primary-foreground">
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-50">
        <nav className="flex items-center justify-between px-6 py-3 bg-card/85 backdrop-blur-md border border-border rounded-full shadow-sm dark:shadow-black/20">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-sm tracking-tight text-foreground"
          >
            <Image
              src="/t-black-logo.svg"
              alt=""
              width={28}
              height={28}
              className="size-7 shrink-0 dark:invert"
              aria-hidden="true"
            />
            <span>Bizships</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={`#${item.id}`}
                className={cn(
                  "border-b-2 border-transparent pb-0.5 transition-colors hover:text-foreground",
                  activeSection === item.id &&
                    "border-primary text-primary hover:text-primary",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {landing.nav.login}
            </Link>

            <Button
              asChild
              className="hidden bg-foreground hover:bg-foreground/85 text-background rounded-full px-5 py-2 text-xs font-semibold tracking-wide shadow-sm transition-all sm:inline-flex"
            >
              <Link href="/signup">{landing.nav.getStarted}</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="pt-40 pb-24">
        <section className="max-w-4xl mx-auto px-4 text-center flex flex-col items-center">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-secondary text-primary mb-8 tracking-wide dark:bg-primary/15 dark:text-[#dbe8ff]">
            {landing.hero.badge}
          </span>

          <h1 className="text-[4rem] md:text-[7.5rem] font-black tracking-tighter text-foreground leading-[0.85] mb-10 flex flex-col items-center">
            <span>{landing.hero.titleLine1}</span>
            <span className="mt-2">{landing.hero.titleLine2}</span>
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-muted-foreground font-normal leading-relaxed mb-12">
            {landing.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-sm">
            <Button
              asChild
              className="w-full sm:w-auto bg-primary hover:bg-primary/85 text-primary-foreground font-semibold px-8 py-6 rounded-full text-base transition-colors shadow-md shadow-primary/20"
            >
              <Link href="/signup">{landing.hero.primaryAction}</Link>
            </Button>
          </div>
        </section>

        <section
          id="howItWorks"
          className="max-w-6xl mx-auto px-6 mt-16 scroll-mt-28 md:mt-24"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
                {landing.relationships.titleLine1}
                <br />
                {landing.relationships.titleLine2}
              </h2>

              <p className="text-muted-foreground text-base max-w-md leading-relaxed">
                {landing.relationships.description}
              </p>
            </div>

            <div className="relative flex justify-center md:justify-end">
              <SwipeableMatchCard
                label={landing.relationships.mockupLabel}
                headline={landing.relationships.mockupTitle}
                cardTitle={landing.relationships.mockupCardTitle}
                cardDescription={landing.relationships.mockupCardDescription}
                profiles={landing.relationships.mockupProfiles}
                likeLabel={landing.relationships.likeLabel}
                dislikeLabel={landing.relationships.dislikeLabel}
              />
            </div>
          </div>
        </section>

        <section
          id="communities"
          className="max-w-6xl mx-auto px-6 mt-40 scroll-mt-28"
        >
          <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-sm dark:shadow-black/20 grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-5 p-8 md:p-16 space-y-6">
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
                {landing.workspace.title}
              </h3>

              <p className="text-muted-foreground text-sm leading-relaxed">
                {landing.workspace.description}
              </p>

              <ul className="space-y-3 pt-2">
                {landing.workspace.benefits.map((text) => (
                  <li
                    key={text}
                    className="flex items-center gap-3 text-sm font-medium text-card-foreground"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-7 bg-secondary p-8 md:p-16 flex items-center justify-center dark:bg-[#0f172a]">
              <div className="w-full max-w-md bg-card rounded-3xl border border-border shadow-xl p-5">
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <div className="ml-auto w-28 h-4 rounded-full bg-secondary dark:bg-primary/15" />
                </div>

                <div className="space-y-3">
                  <div className="h-8 rounded-full bg-muted" />
                  <div className="h-8 rounded-full bg-muted" />

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="h-28 rounded-2xl bg-secondary flex items-center justify-center dark:bg-primary/15">
                      <Network className="w-8 h-8 text-primary dark:text-[#dbe8ff]" />
                    </div>

                    <div className="h-28 rounded-2xl bg-accent/40 flex items-center justify-center dark:bg-[#1d2d46]">
                      <BarChart3 className="w-8 h-8 text-primary dark:text-[#dbe8ff]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="companies"
          className="max-w-6xl mx-auto px-6 mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 scroll-mt-28"
        >
          <div className="bg-card rounded-[2rem] border border-border p-8 shadow-sm dark:shadow-black/20 flex flex-col justify-between min-h-[320px]">
            <div>
              <h4 className="text-xl font-bold text-foreground mb-2">
                {landing.cards.communities.title}
              </h4>

              <p className="text-muted-foreground text-sm max-w-xs">
                {landing.cards.communities.description}
              </p>
            </div>

            <div className="my-6 flex justify-center py-6 bg-muted rounded-xl border border-dashed border-border">
              <MessageSquare className="w-10 h-10 text-muted-foreground/50" />
            </div>

            <Link
              href="/signup"
              className="inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all dark:text-[#dbe8ff]"
            >
              {landing.cards.communities.action}
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-card rounded-[2rem] border border-border p-8 shadow-sm dark:shadow-black/20 flex flex-col justify-between min-h-[320px]">
            <div>
              <h4 className="text-xl font-bold text-foreground mb-2">
                {landing.cards.companyPages.title}
              </h4>

              <p className="text-muted-foreground text-sm max-w-xs">
                {landing.cards.companyPages.description}
              </p>
            </div>

            <div className="my-6 flex justify-center py-6 bg-muted rounded-xl border border-dashed border-border">
              <Building2 className="w-10 h-10 text-muted-foreground/50" />
            </div>

            <Link
              href="/signup"
              className="inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all dark:text-[#dbe8ff]"
            >
              {landing.cards.companyPages.action}
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section
          id="joinUs"
          className="max-w-6xl mx-auto px-6 mt-16 scroll-mt-28"
        >
          <div className="grid grid-cols-1 gap-8 rounded-[2.5rem] border border-border bg-card p-8 shadow-sm dark:shadow-black/20 md:grid-cols-12 md:p-12">
            <div className="md:col-span-5">
              <h3 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {landing.cta.title}
              </h3>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {landing.cta.description}
              </p>

              <Button
                asChild
                className="mt-6 h-10 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <Link href="/signup">{landing.cta.action}</Link>
              </Button>
            </div>

            <div className="md:col-span-7">
              <div className="grid gap-3 sm:grid-cols-3">
                {["94%", "87%", "73%"].map((score, index) => (
                  <div
                    key={score}
                    className="rounded-2xl border border-border bg-background p-4"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black text-primary">
                        {score}
                      </span>
                      <Heart className="size-4 text-primary" />
                    </div>
                    <p className="text-sm font-bold">
                      {index === 0
                        ? "Product Designer"
                        : index === 1
                          ? "Front-end React"
                          : "Data Analyst"}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      {landing.cta.mockupLabel}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-card border-t border-border mt-32 py-16 text-muted-foreground text-xs">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 space-y-4">
              <span className="flex items-center gap-2 font-semibold text-foreground text-sm">
                <Image
                  src="/t-black-logo.svg"
                  alt=""
                  width={32}
                  height={32}
                  className="size-8 shrink-0 dark:invert"
                  aria-hidden="true"
                />
                Bizships
              </span>

              <p className="max-w-xs leading-relaxed">
                {landing.footer.description}
              </p>
            </div>

            <div>
              <h5 className="font-semibold text-foreground mb-4">
                {landing.footer.product.title}
              </h5>

              <ul className="space-y-2.5">
                {landing.footer.product.links.map((item) => (
                  <li key={item}>
                    <Link href="#" className="hover:text-foreground">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-foreground mb-4">
                {landing.footer.company.title}
              </h5>

              <ul className="space-y-2.5">
                {landing.footer.company.links.map((item) => (
                  <li key={item}>
                    <Link href="#" className="hover:text-foreground">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-foreground mb-4">
                {landing.footer.legal.title}
              </h5>

              <ul className="space-y-2.5">
                {landing.footer.legal.links.map((item) => (
                  <li key={item}>
                    <Link href="#" className="hover:text-foreground">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>{landing.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
