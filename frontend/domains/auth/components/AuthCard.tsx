import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f6fb] px-4 py-10 text-[#0f172a] dark:bg-[#0f172a] dark:text-[#f8fafc]">
      <section className="w-full max-w-[340px] rounded-[22px] border border-[#e2e8f0] bg-white px-8 py-10 shadow-sm dark:border-[#2d3c54] dark:bg-[#132238]">
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
          <h1 className="text-[22px] font-black tracking-tight">{title}</h1>
          <p className="mt-2 text-[11px] leading-5 text-[#64748b] dark:text-[#94a3b8]">
            {description}
          </p>
        </div>

        {children}
      </section>
    </main>
  );
}
