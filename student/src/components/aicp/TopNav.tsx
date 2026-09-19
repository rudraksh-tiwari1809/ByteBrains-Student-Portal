import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { clearAccessToken, getStoredUser } from "@/lib/auth";

const links = [
  { to: "/", label: "Dashboard" }, { to: "/skill-assessment", label: "Skill Assessment" },
  { to: "/skill-profile", label: "Skill Profile" }, { to: "/learning", label: "Learning" },
  { to: "/internships", label: "Internships" }, { to: "/jobs", label: "Jobs" },
  { to: "/resume", label: "Resume" }, { to: "/portfolio", label: "Portfolio" },
] as const;

export function TopNav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = getStoredUser();
  const name = String(user?.["name"] ?? "Student");
  const branch = String(user?.["branch"] ?? "");
  const initials = name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]?.toUpperCase()).join("") || "S";
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-[1400px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded border border-brass/60 font-display text-lg text-brass">A</span><span className="min-w-0"><span className="block font-display text-lg leading-none">AICP</span><span className="block truncate text-[11px] tracking-[0.14em] text-primary-foreground/65 uppercase">Academia–Industry Portal</span></span></Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative hidden md:block"><Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-primary-foreground/50" /><input aria-label="Search the portal" placeholder="Search internships, courses, roles..." className="w-52 rounded border border-primary-foreground/20 bg-primary-foreground/10 py-2 pr-3 pl-8 text-sm placeholder:text-primary-foreground/50 focus:border-brass focus:outline-none lg:w-72" /></div>
          <button onClick={() => { if (user) { clearAccessToken(); navigate({ to: "/login" }); } else navigate({ to: "/login" }); }} className="hidden rounded border border-brass/60 px-3 py-1.5 text-sm font-medium text-brass hover:bg-brass/10 sm:block">{user ? "Sign Out" : "Sign In"}</button>
          <button aria-label="Notifications" className="relative rounded p-2 hover:bg-primary-foreground/10"><Bell className="h-[18px] w-[18px]" /><span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brass" /></button>
          <Link to="/portfolio" className="flex shrink-0 items-center gap-2 rounded px-1 py-1 hover:bg-primary-foreground/10"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brass/20 text-sm font-semibold text-brass">{initials}</span><span className="hidden text-left leading-tight lg:block"><span className="block text-sm font-medium">{name}</span><span className="block text-[11px] text-primary-foreground/60">{branch}</span></span></Link>
          <button aria-label="Toggle navigation" onClick={()=>setOpen(v=>!v)} className="rounded p-2 hover:bg-primary-foreground/10 xl:hidden">{open ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}</button>
        </div>
      </div>
      <nav className="hidden border-t border-primary-foreground/10 xl:block"><ul className="mx-auto flex max-w-[1400px] items-stretch px-4 lg:px-8">{links.map(l=><li key={l.to}><Link to={l.to} activeOptions={{exact:l.to==="/"}} className="block border-b-2 border-transparent px-4 py-3 text-sm text-primary-foreground/75 hover:text-primary-foreground data-[status=active]:border-brass data-[status=active]:font-medium data-[status=active]:text-primary-foreground">{l.label}</Link></li>)}</ul></nav>
      {open && <nav className="border-t border-primary-foreground/10 xl:hidden"><ul className="mx-auto max-w-[1400px] px-2 pb-3">{links.map(l=><li key={l.to}><Link to={l.to} activeOptions={{exact:l.to==="/"}} onClick={()=>setOpen(false)} className="block rounded px-3 py-2.5 text-sm text-primary-foreground/80 data-[status=active]:bg-primary-foreground/10">{l.label}</Link></li>)}</ul></nav>}
    </header>
  );
}
