import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Check, Eye, EyeOff, GraduationCap, LoaderCircle } from "lucide-react";
import { z } from "zod";

import { registerStudent, AuthError } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create Account — ByteBrains Student Portal" },
      {
        name: "description",
        content:
          "Join ByteBrains on the Academia–Industry Collaboration Platform and build your academic and career profile.",
      },
      { property: "og:title", content: "Create Account — ByteBrains Student Portal" },
      {
        property: "og:description",
        content: "Register as a student to access assessments, learning, internships, and placements.",
      },
    ],
  }),
  component: RegisterPage,
});

const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Full name is required"),
    email: z.string().trim().email("Enter a valid email address"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string(),
    branch: z.string(),
    college: z.string(),
    year: z.string(),
    phone: z.string(),
    location: z.string(),
    enrollment: z.string(),
    about: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  branch: string;
  college: string;
  year: string;
  phone: string;
  location: string;
  enrollment: string;
  about: string;
};

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

function passwordStrength(pw: string): { score: 0 | 1 | 2 | 3; label: string } {
  if (!pw) return { score: 0, label: "" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) s++;
  return {
    score: s as 0 | 1 | 2 | 3,
    label: ["Too weak", "Weak", "Good", "Strong"][s] ?? "",
  };
}

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    branch: "",
    college: "",
    year: "",
    phone: "",
    location: "",
    enrollment: "",
    about: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const strength = passwordStrength(form.password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      const errs = parsed.error.flatten().fieldErrors;
      const next: Partial<Record<keyof FormState, string>> = {};
      for (const [k, v] of Object.entries(errs)) {
        if (v?.[0]) next[k as keyof FormState] = v[0];
      }
      setFieldErrors(next);
      setFormError(null);
      return;
    }
    setFieldErrors({});
    setFormError(null);
    setLoading(true);

    try {
      await registerStudent(parsed.data);
      setSuccess(true);
      setTimeout(() => navigate({ to: "/login" }), 2000);
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

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-10 text-center shadow-card">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
            <Check className="h-7 w-7 text-success" />
          </div>
          <h1 className="text-2xl">Account created successfully!</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your account is ready. Please sign in to continue.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Redirecting to sign in…</p>
          <Link
            to="/login"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="rounded-lg border border-border bg-card p-8 shadow-card sm:p-10">
          {/* Branding */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <p className="label-caps mb-2">ByteBrains</p>
            <h1 className="text-2xl sm:text-3xl">Create Your Account</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Join ByteBrains and build your academic and career profile.
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
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={set("name")}
                  className={inputClass(fieldErrors.name)}
                />
                {fieldErrors.name && <p className="mt-1.5 text-xs text-destructive">{fieldErrors.name}</p>}
              </div>
              <div>
                <label htmlFor="reg-email" className="mb-1.5 block text-sm font-medium">
                  Email
                </label>
                <input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={set("email")}
                  className={inputClass(fieldErrors.email)}
                />
                {fieldErrors.email && <p className="mt-1.5 text-xs text-destructive">{fieldErrors.email}</p>}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="reg-password" className="mb-1.5 block text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={set("password")}
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
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((i) => (
                        <span
                          key={i}
                          className={cn(
                            "h-1 flex-1 rounded-full",
                            strength.score >= i
                              ? strength.score === 3
                                ? "bg-success"
                                : strength.score === 2
                                  ? "bg-brass"
                                  : "bg-destructive"
                              : "bg-accent",
                          )}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{strength.label}</p>
                  </div>
                )}
                {fieldErrors.password && <p className="mt-1.5 text-xs text-destructive">{fieldErrors.password}</p>}
              </div>
              <div>
                <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={form.confirmPassword}
                    onChange={set("confirmPassword")}
                    className={cn(inputClass(fieldErrors.confirmPassword), "pr-10")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-destructive">{fieldErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="branch" className="mb-1.5 block text-sm font-medium">
                  Branch
                </label>
                <input
                  id="branch"
                  type="text"
                  placeholder="e.g. Computer Science"
                  value={form.branch}
                  onChange={set("branch")}
                  className={inputClass()}
                />
              </div>
              <div>
                <label htmlFor="college" className="mb-1.5 block text-sm font-medium">
                  College
                </label>
                <input
                  id="college"
                  type="text"
                  placeholder="Enter your college name"
                  value={form.college}
                  onChange={set("college")}
                  className={inputClass()}
                />
              </div>
              <div>
                <label htmlFor="year" className="mb-1.5 block text-sm font-medium">
                  Year
                </label>
                <select id="year" value={form.year} onChange={set("year")} className={inputClass()}>
                  <option value="">Select your year</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="e.g. 9876543210"
                  value={form.phone}
                  onChange={set("phone")}
                  className={inputClass()}
                />
              </div>
              <div>
                <label htmlFor="location" className="mb-1.5 block text-sm font-medium">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  placeholder="e.g. Delhi"
                  value={form.location}
                  onChange={set("location")}
                  className={inputClass()}
                />
              </div>
              <div>
                <label htmlFor="enrollment" className="mb-1.5 block text-sm font-medium">
                  Enrollment Number
                </label>
                <input
                  id="enrollment"
                  type="text"
                  placeholder="e.g. ENROLLMENT123"
                  value={form.enrollment}
                  onChange={set("enrollment")}
                  className={inputClass()}
                />
              </div>
            </div>

            <div>
              <label htmlFor="about" className="mb-1.5 block text-sm font-medium">
                About
              </label>
              <textarea
                id="about"
                rows={3}
                placeholder="Tell us a little about yourself"
                value={form.about}
                onChange={set("about")}
                className={cn(inputClass(), "resize-y")}
              />
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
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary underline-offset-2 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
