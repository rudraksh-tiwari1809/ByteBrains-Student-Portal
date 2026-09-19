import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Page({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto max-w-[1400px] px-4 py-8 lg:px-8 lg:py-10">{children}</main>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:justify-between">
      <div className="min-w-0">
        <h1 className="rule-brass text-2xl sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-3 text-sm text-muted-foreground sm:text-base">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({
  title,
  action,
  className,
  children,
}: {
  title?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("min-w-0", className)}>
      {(title || action) && (
        <div className="mb-3 flex min-w-0 items-baseline justify-between gap-3">
          {title && <h2 className="truncate text-lg">{title}</h2>}
          {action}
        </div>
      )}
      <div className="rounded-lg border border-border bg-card shadow-card">{children}</div>
    </section>
  );
}

export function Chip({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "brass" | "success" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-medium",
        tone === "muted" && "border-border bg-secondary text-secondary-foreground",
        tone === "brass" && "border-brass/40 bg-brass/10 text-brass",
        tone === "success" && "border-success/30 bg-success/10 text-success",
      )}
    >
      {children}
    </span>
  );
}

export function SkillBar({
  name,
  value,
  right,
  tone = "primary",
}: {
  name: string;
  value: number;
  right?: ReactNode;
  tone?: "primary" | "brass";
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="min-w-0 truncate">{name}</span>
        <span className="shrink-0 text-muted-foreground">{right ?? `${value}%`}</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-accent">
        <div
          className={cn("h-full rounded-full", tone === "brass" ? "bg-brass" : "bg-primary")}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  suffix,
  note,
}: {
  label: string;
  value: string;
  suffix?: string;
  note?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-card">
      <p className="label-caps">{label}</p>
      <p className="mt-3 font-display text-3xl leading-none">
        {value}
        {suffix && <span className="text-base text-muted-foreground">{suffix}</span>}
      </p>
      {note && <p className="mt-3 text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}
