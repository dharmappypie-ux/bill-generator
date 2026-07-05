"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { PLAN_LIST, type PlanId } from "@/config/plans";

/* ----------------------------- types ----------------------------- */

interface AccountUser {
  id: string;
  email: string;
  name: string | null;
  mobile: string | null;
  image: string | null;
  provider: string;
  emailVerified: boolean;
  createdAt: string;
  hasPassword: boolean;
}

interface AccountSubscription {
  plan: string;
  status: string;
  currentPeriodEnd: string | null;
}

interface AccountPayment {
  id: string;
  plan: string;
  amount: number; // paise
  currency: string;
  status: string;
  createdAt: string;
}

interface AccountData {
  user: AccountUser;
  subscription: AccountSubscription | null;
  payments: AccountPayment[];
}

type Tab = "profile" | "security" | "billing";

/* ----------------------------- helpers ----------------------------- */

function formatMonthYear(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatFullDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function formatAmount(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* ----------------------------- component ----------------------------- */

export default function AccountClient() {
  const { user, loading: authLoading, refresh, openAuth, logout } = useAuth();
  const router = useRouter();

  const [account, setAccount] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("profile");

  const loadAccount = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/account", { cache: "no-store" });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Couldn't load your account.");
      }
      const json = (await res.json()) as AccountData;
      setAccount(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't load your account.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    loadAccount();
  }, [authLoading, user, loadAccount]);

  async function handleSignOut() {
    await logout();
    router.push("/");
  }

  /* -------- gating states -------- */

  if (authLoading || (user && loading)) {
    return <div className="container-bg py-20 text-center text-inkSoft">Loading…</div>;
  }

  if (!user) {
    return (
      <div className="container-bg py-20">
        <div className="mx-auto max-w-md rounded-2xl border border-line bg-white p-10 text-center shadow-soft">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-2xl text-brand">
            <i className="fa-solid fa-circle-user" />
          </span>
          <h1 className="mt-4 text-xl font-extrabold text-ink">Your account</h1>
          <p className="mt-2 text-sm text-inkSoft">
            Sign in to manage your profile, security and billing.
          </p>
          <button onClick={() => openAuth("login")} className="btn-primary mt-5">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="container-bg py-20">
        <div className="mx-auto max-w-md rounded-2xl border border-line bg-white p-10 text-center shadow-soft">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-2xl text-accent-700">
            <i className="fa-solid fa-triangle-exclamation" />
          </span>
          <h1 className="mt-4 text-xl font-extrabold text-ink">Something went wrong</h1>
          <p className="mt-2 text-sm text-inkSoft">{error || "Couldn't load your account."}</p>
          <button
            onClick={() => {
              setLoading(true);
              loadAccount();
            }}
            className="btn-primary mt-5"
          >
            <i className="fa-solid fa-rotate-right" /> Try again
          </button>
        </div>
      </div>
    );
  }

  /* -------- signed-in hub -------- */

  const au = account.user;
  const initial = (au.name?.trim()?.[0] || au.email?.[0] || "U").toUpperCase();

  const navItems: { id: Tab; label: string; icon: string }[] = [
    { id: "profile", label: "Profile", icon: "fa-user" },
    { id: "security", label: "Security", icon: "fa-shield-halved" },
    { id: "billing", label: "Plan & Billing", icon: "fa-credit-card" },
  ];

  return (
    <div className="container-bg py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-ink">My Account</h1>
        <p className="text-sm text-inkSoft">Manage your profile, security and billing.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        {/* ---------------- sidebar ---------------- */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
            {/* identity */}
            <div className="flex items-center gap-3 border-b border-line pb-4">
              {au.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={au.image}
                  alt={au.name || au.email}
                  className="h-12 w-12 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand text-lg font-bold text-white">
                  {initial}
                </span>
              )}
              <div className="min-w-0">
                {au.name && <p className="truncate font-bold text-ink">{au.name}</p>}
                <p className="truncate text-xs text-inkSoft">{au.email}</p>
              </div>
            </div>

            {/* nav */}
            <nav className="mt-4 flex gap-2 overflow-x-auto lg:flex-col lg:gap-1 lg:overflow-visible">
              {navItems.map((item) => {
                const active = tab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition lg:w-full ${
                      active
                        ? "bg-brand-50 text-brand-700"
                        : "text-inkSoft hover:bg-section hover:text-ink"
                    }`}
                  >
                    <i className={`fa-solid ${item.icon} w-4 text-center`} />
                    {item.label}
                  </button>
                );
              })}

              <Link
                href="/dashboard"
                className="flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-inkSoft transition hover:bg-section hover:text-ink lg:w-full"
              >
                <i className="fa-solid fa-folder-open w-4 text-center" />
                My Bills
              </Link>
            </nav>

            <div className="mt-4 border-t border-line pt-4">
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-rose-500 transition hover:bg-rose-50"
              >
                <i className="fa-solid fa-right-from-bracket w-4 text-center" />
                Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* ---------------- content ---------------- */}
        <section className="min-w-0">
          {tab === "profile" && (
            <ProfileSection
              au={au}
              onSaved={async () => {
                await refresh();
                await loadAccount();
              }}
            />
          )}
          {tab === "security" && <SecuritySection au={au} />}
          {tab === "billing" && (
            <BillingSection subscription={account.subscription} payments={account.payments} />
          )}
        </section>
      </div>
    </div>
  );
}

/* ============================ PROFILE ============================ */

function ProfileSection({ au, onSaved }: { au: AccountUser; onSaved: () => Promise<void> }) {
  const [name, setName] = useState(au.name ?? "");
  const [mobile, setMobile] = useState(au.mobile ?? "");
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setOk(false);
    setErr(null);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), mobile: mobile.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Couldn't save changes.");
      setOk(true);
      await onSaved();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Couldn't save changes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* account info */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
        <h2 className="text-lg font-extrabold text-ink">Account details</h2>
        <p className="mt-1 text-sm text-inkSoft">Your sign-in identity and membership.</p>

        <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-placeholderGray">
              Email
            </dt>
            <dd className="mt-1 flex flex-wrap items-center gap-2">
              <span className="break-all font-semibold text-ink">{au.email}</span>
              {au.emailVerified ? (
                <span className="chip !bg-brand-50 text-success">
                  <i className="fa-solid fa-circle-check" /> Verified
                </span>
              ) : (
                <span className="chip">{capitalize(au.provider)}</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-placeholderGray">
              Provider
            </dt>
            <dd className="mt-1 font-semibold text-ink">{capitalize(au.provider)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-placeholderGray">
              Member since
            </dt>
            <dd className="mt-1 font-semibold text-ink">{formatMonthYear(au.createdAt)}</dd>
          </div>
        </dl>
      </div>

      {/* editable form */}
      <form onSubmit={save} className="rounded-2xl border border-line bg-white p-6 shadow-soft">
        <h2 className="text-lg font-extrabold text-ink">Edit profile</h2>
        <p className="mt-1 text-sm text-inkSoft">Update your name and contact number.</p>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="acc-name" className="field-label">
              Full name
            </label>
            <input
              id="acc-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="field-input"
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="acc-mobile" className="field-label">
              Mobile
            </label>
            <input
              id="acc-mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="+91 98765 43210"
              className="field-input"
              autoComplete="tel"
              inputMode="tel"
            />
          </div>
        </div>

        {ok && (
          <p className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-success">
            <i className="fa-solid fa-circle-check" /> Profile updated.
          </p>
        )}
        {err && (
          <p className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-accent-700">
            <i className="fa-solid fa-circle-exclamation" /> {err}
          </p>
        )}

        <div className="mt-5">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? (
              <>
                <i className="fa-solid fa-spinner animate-spin" /> Saving…
              </>
            ) : (
              <>
                <i className="fa-solid fa-floppy-disk" /> Save changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ============================ SECURITY ============================ */

function SecuritySection({ au }: { au: AccountUser }) {
  const hasPassword = au.hasPassword;
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setOk(false);
    setErr(null);

    if (next.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }
    if (next !== confirm) {
      setErr("New passwords don't match.");
      return;
    }

    setSaving(true);
    try {
      const body: { newPassword: string; currentPassword?: string } = { newPassword: next };
      if (hasPassword) body.currentPassword = current;

      const res = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Couldn't update password.");

      setOk(true);
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Couldn't update password.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
      <h2 className="text-lg font-extrabold text-ink">
        {hasPassword ? "Change password" : "Set a password"}
      </h2>
      <p className="mt-1 text-sm text-inkSoft">
        {hasPassword
          ? "Choose a strong password you don't use elsewhere."
          : `Your account uses ${capitalize(au.provider)} sign-in. Set a password to also log in with email.`}
      </p>

      <form onSubmit={submit} className="mt-5 max-w-md space-y-5">
        {hasPassword && (
          <div>
            <label htmlFor="cur-pw" className="field-label">
              Current password
            </label>
            <input
              id="cur-pw"
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="••••••••"
              className="field-input"
              autoComplete="current-password"
            />
          </div>
        )}

        <div>
          <label htmlFor="new-pw" className="field-label">
            New password
          </label>
          <input
            id="new-pw"
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            placeholder="At least 6 characters"
            className="field-input"
            autoComplete="new-password"
          />
        </div>

        <div>
          <label htmlFor="confirm-pw" className="field-label">
            Confirm new password
          </label>
          <input
            id="confirm-pw"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Re-enter new password"
            className="field-input"
            autoComplete="new-password"
          />
        </div>

        {ok && (
          <p className="flex items-center gap-1.5 text-sm font-semibold text-success">
            <i className="fa-solid fa-circle-check" />{" "}
            {hasPassword ? "Password changed." : "Password set."}
          </p>
        )}
        {err && (
          <p className="flex items-center gap-1.5 text-sm font-semibold text-accent-700">
            <i className="fa-solid fa-circle-exclamation" /> {err}
          </p>
        )}

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? (
            <>
              <i className="fa-solid fa-spinner animate-spin" /> Saving…
            </>
          ) : (
            <>
              <i className="fa-solid fa-lock" /> {hasPassword ? "Update password" : "Set password"}
            </>
          )}
        </button>
      </form>
    </div>
  );
}

/* ============================ BILLING ============================ */

function BillingSection({
  subscription,
  payments,
}: {
  subscription: AccountSubscription | null;
  payments: AccountPayment[];
}) {
  const [checkoutFor, setCheckoutFor] = useState<PlanId | null>(null);
  const [checkoutMsg, setCheckoutMsg] = useState<string | null>(null);

  const isActive = subscription?.status?.toLowerCase() === "active";

  async function upgrade(planId: PlanId) {
    setCheckoutMsg(null);
    setCheckoutFor(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const json = await res.json();
      if (json.url) {
        window.location.href = json.url;
        return;
      }
      setCheckoutMsg(json.error || "Payments are not configured yet.");
    } catch {
      setCheckoutMsg("Something went wrong. Please try again.");
    } finally {
      setCheckoutFor(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* current plan */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
        <h2 className="text-lg font-extrabold text-ink">Current plan</h2>

        {subscription ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-section p-5">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xl font-extrabold text-ink">
                  {capitalize(subscription.plan)}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                    isActive
                      ? "bg-green-50 text-success"
                      : "bg-line text-inkSoft"
                  }`}
                >
                  <i className={`fa-solid ${isActive ? "fa-circle-check" : "fa-circle"}`} />
                  {capitalize(subscription.status)}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-inkSoft">
                {subscription.currentPeriodEnd
                  ? `Renews / valid till ${formatFullDate(subscription.currentPeriodEnd)}`
                  : "Lifetime — no expiry"}
              </p>
            </div>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-2xl text-brand">
              <i className="fa-solid fa-crown" />
            </span>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-section p-5">
            <div>
              <span className="text-xl font-extrabold text-ink">Free plan</span>
              <p className="mt-1.5 text-sm text-inkSoft">
                You&apos;re on the free plan — upgrade for unlimited bills.
              </p>
            </div>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-2xl text-brand">
              <i className="fa-solid fa-seedling" />
            </span>
          </div>
        )}
      </div>

      {/* upgrade cards */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
        <h2 className="text-lg font-extrabold text-ink">
          {subscription ? "Change plan" : "Upgrade your plan"}
        </h2>
        <p className="mt-1 text-sm text-inkSoft">
          Unlock unlimited bills, saved history and advanced customization.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {PLAN_LIST.map((plan) => {
            const isPopular = "popular" in plan && plan.popular;
            const loading = checkoutFor === plan.id;
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl p-5 transition ${
                  isPopular
                    ? "ring-2 ring-brand"
                    : "border border-line hover:shadow-soft"
                }`}
              >
                {isPopular && (
                  <span className="absolute -top-2.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-gradient-to-r from-brand to-indigoBtn px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-card">
                    <i className="fa-solid fa-crown" /> Popular
                  </span>
                )}
                <h3 className="font-bold text-ink">{plan.name}</h3>
                <div className="mt-2 flex items-end gap-1.5">
                  <span className="text-2xl font-extrabold text-ink">{plan.priceLabel}</span>
                  <span className="mb-1 text-xs text-placeholderGray">/ {plan.duration}</span>
                </div>

                <ul className="mt-4 flex-1 space-y-2">
                  {plan.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-inkSoft">
                      <i className="fa-solid fa-check mt-0.5 text-brand-600" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => upgrade(plan.id)}
                  disabled={loading}
                  className={`mt-5 w-full !py-2.5 !text-xs ${isPopular ? "btn-accent" : "btn-outline"}`}
                >
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner animate-spin" /> Starting…
                    </>
                  ) : (
                    <>
                      Upgrade <i className="fa-solid fa-arrow-right text-[10px]" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {checkoutMsg && (
          <p className="mt-5 flex items-center gap-1.5 rounded-xl bg-section px-4 py-3 text-sm font-semibold text-inkSoft">
            <i className="fa-solid fa-circle-info text-indigoBtn" /> {checkoutMsg}
          </p>
        )}
      </div>

      {/* payment history */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
        <h2 className="text-lg font-extrabold text-ink">Payment history</h2>

        {payments.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-line2 bg-section p-10 text-center">
            <p className="text-sm text-inkSoft">No payments yet.</p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs font-semibold uppercase tracking-wide text-placeholderGray">
                  <th className="pb-3 pr-4 font-semibold">Date</th>
                  <th className="pb-3 pr-4 font-semibold">Plan</th>
                  <th className="pb-3 pr-4 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {payments.map((p) => {
                  const paid = p.status?.toLowerCase() === "paid" || p.status?.toLowerCase() === "succeeded";
                  return (
                    <tr key={p.id} className="text-ink">
                      <td className="py-3 pr-4 text-inkSoft">{formatFullDate(p.createdAt)}</td>
                      <td className="py-3 pr-4 font-semibold">{capitalize(p.plan)}</td>
                      <td className="py-3 pr-4 font-semibold">{formatAmount(p.amount)}</td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            paid ? "bg-green-50 text-success" : "bg-line text-inkSoft"
                          }`}
                        >
                          <i className={`fa-solid ${paid ? "fa-circle-check" : "fa-clock"}`} />
                          {capitalize(p.status)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
