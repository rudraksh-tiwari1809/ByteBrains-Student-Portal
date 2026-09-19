import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Eye, EyeOff, GraduationCap, LoaderCircle } from "lucide-react";
import { z } from "zod";

import { login, AuthError } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — ByteBrains Student Portal" },
      {
        name: "description",
        content:
          "Sign in to the ByteBrains student portal on the Academia–Industry Collaboration Platform.",
      },
      { property: "og:title", content: "Sign In — ByteBrains Student Portal" },
      {
        property: "og:description",
        content: "Access your ByteBrains student dashboard, assessments, learning, and placements.",
      },
    ],
  }),
  component: LoginPage,
});

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const errs = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        ...(errs.email?.[0] ? { email: errs.email[0] } : {}),
        ...(errs.password?.[0] ? { password: errs.password[0] } : {}),
      });
      setFormError(null);
      return;
    }
    setFieldErrors({});
    setFormError(null);
    setLoading(true);

    try {
      await login(parsed.data.email, parsed.data.password, remember);
      navigate({ to: "/" });
    } catch (err) {
      setFormError(
        err instanceof AuthError ? err.message : "Unable to connect to server. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass = (invalid?: string) =>
    cn(
      "w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none transition-colors",
      "placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/20 focus:border-ring",
      invalid ? "border-destructive" : "border-input",
    );

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-border bg-card p-8 shadow-card sm:p-10">
          {/* Branding */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <p className="label-caps mb-2">ByteBrains</p>
            <h1 className="text-2xl sm:text-3xl">Welcome Back</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to continue to your ByteBrains student portal.
            </p>
          </div>

          {formError && (
            <div
              role="alert"
              className="mb-5 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
            >
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass(fieldErrors.email)}
              />
              {fieldErrors.email && (
                <p className="mt-1.5 text-xs text-destructive">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(inputClass(fieldErrors.password), "pr-10")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1.5 text-xs text-destructive">{fieldErrors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-input accent-[var(--primary)]"
                />
                Remember me
              </label>
              <span
                className="cursor-not-allowed text-muted-foreground"
                title="Password reset is not available yet"
              >
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors",
                loading ? "cursor-not-allowed opacity-70" : "hover:bg-primary/90",
              )}
            >
              {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-medium text-primary underline-offset-2 hover:underline">
              Create Account
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Part of the Academia–Industry Collaboration Platform ·{" "}
          <Link to="/" className="underline underline-offset-2 hover:text-foreground">
            Back to dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
