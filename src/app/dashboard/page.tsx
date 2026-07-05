"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { catalogBySlug } from "@/config/catalog";

interface SavedBill {
  id: string;
  type: string;
  title: string;
  template: string;
  theme: string;
  currency: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const { user, loading, openAuth } = useAuth();
  const [bills, setBills] = useState<SavedBill[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) {
      setFetching(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/bills", { cache: "no-store" });
        const json = await res.json();
        setBills(json.bills ?? []);
      } finally {
        setFetching(false);
      }
    })();
  }, [user]);

  async function remove(id: string) {
    if (!confirm("Delete this saved bill?")) return;
    await fetch(`/api/bills/${id}`, { method: "DELETE" });
    setBills((b) => b.filter((x) => x.id !== id));
  }

  if (loading) {
    return <div className="container-bg py-20 text-center text-inkSoft">Loading…</div>;
  }

  if (!user) {
    return (
      <div className="container-bg py-20">
        <div className="mx-auto max-w-md rounded-2xl border border-line bg-white p-10 text-center shadow-soft">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-2xl text-brand">
            <i className="fa-solid fa-folder-open" />
          </span>
          <h1 className="mt-4 text-xl font-extrabold text-ink">Your saved bills</h1>
          <p className="mt-2 text-sm text-inkSoft">Sign in to view and manage bills you&apos;ve saved across devices.</p>
          <button onClick={() => openAuth("login")} className="btn-primary mt-5">Sign In</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-bg py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">My Bills</h1>
          <p className="text-sm text-inkSoft">Signed in as {user.email}{user.plan ? ` · ${user.plan} plan` : ""}.</p>
        </div>
        <Link href="/bills" className="btn-primary"><i className="fa-solid fa-plus" /> New Bill</Link>
      </div>

      {fetching ? (
        <p className="text-inkSoft">Loading your bills…</p>
      ) : bills.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line2 bg-section p-12 text-center">
          <p className="text-inkSoft">No saved bills yet.</p>
          <Link href="/fuel-bill" className="btn-accent mt-4">Create your first bill</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bills.map((b) => {
            const item = catalogBySlug(b.type);
            return (
              <div key={b.id} className="flex flex-col rounded-2xl border border-line bg-white p-5 shadow-soft">
                <div className="mb-3 flex items-center gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand">
                    <i className={`fa-solid ${item?.icon ?? "fa-receipt"}`} />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-placeholderGray">{item?.name ?? b.type}</span>
                </div>
                <h3 className="line-clamp-2 font-bold text-ink">{b.title}</h3>
                <p className="mt-1 text-xs text-placeholderGray">
                  {b.template} · {b.currency} · {new Date(b.updatedAt).toLocaleDateString()}
                </p>
                <div className="mt-4 flex gap-2">
                  <Link href={`/${b.type}?load=${b.id}`} className="btn-outline flex-1 !py-2 !text-xs">
                    <i className="fa-solid fa-pen" /> Open
                  </Link>
                  <button onClick={() => remove(b.id)} className="btn-ghost !py-2 !text-xs text-rose-500">
                    <i className="fa-solid fa-trash" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
