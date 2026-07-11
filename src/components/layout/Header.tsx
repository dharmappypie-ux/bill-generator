"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { useAuth } from "@/components/providers/AuthProvider";
import { CATALOG, CATEGORIES } from "@/config/catalog";

export default function Header() {
  const { user, loading, openAuth, logout } = useAuth();
  const [billsOpen, setBillsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const pathname = usePathname();

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`px-3 py-2 text-sm font-semibold transition-colors hover:text-brand ${
        pathname === href ? "text-brand" : "text-ink"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <div className="container-bg flex h-16 items-center justify-between gap-4">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLink("/", "Home")}

          {/* Bills mega-dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setBillsOpen(true)}
            onMouseLeave={() => setBillsOpen(false)}
          >
            <button className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-ink transition-colors hover:text-brand">
              Bills <i className={`fa-solid fa-chevron-down text-[10px] transition-transform ${billsOpen ? "rotate-180" : ""}`} />
            </button>
            {billsOpen && (
              <div className="absolute left-1/2 top-full w-[760px] -translate-x-1/2 pt-2">
                <div className="grid grid-cols-2 gap-x-6 gap-y-5 rounded-2xl border border-line bg-white p-6 shadow-soft">
                  {CATEGORIES.map((cat) => (
                    <div key={cat}>
                      <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-brand-600">{cat}</p>
                      <ul className="space-y-1">
                        {CATALOG.filter((c) => c.category === cat).map((c) => (
                          <li key={c.slug}>
                            <Link
                              href={`/${c.slug}`}
                              className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-inkSoft transition-colors hover:bg-section hover:text-brand"
                            >
                              <i className={`fa-solid ${c.icon} w-4 text-center text-brand-400 group-hover:text-brand`} />
                              {c.name}
                              {c.ready && <span className="ml-auto rounded bg-success/10 px-1.5 py-0.5 text-[9px] font-bold text-success">LIVE</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {navLink("/tools", "Free Tools")}
          {navLink("/pricing", "Pricing")}
          {navLink("/contact", "Contact Us")}
        </nav>

        {/* Auth actions */}
        <div className="hidden items-center gap-2 lg:flex">
          {loading ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-section" />
          ) : user ? (
            <div className="relative" onMouseLeave={() => setUserMenu(false)}>
              <button
                onClick={() => setUserMenu((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 transition hover:border-brand"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand text-xs font-bold text-white">
                  {(user.name || user.email)[0]?.toUpperCase()}
                </span>
                <span className="max-w-[120px] truncate text-sm font-semibold text-ink">{user.name || user.email}</span>
                <i className="fa-solid fa-chevron-down text-[10px] text-placeholderGray" />
              </button>
              {userMenu && (
                <div className="absolute right-0 top-full w-52 pt-2">
                  <div className="rounded-xl border border-line bg-white p-1.5 shadow-soft">
                    <Link href="/account" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink hover:bg-section">
                      <i className="fa-solid fa-user w-4 text-brand-400" /> My Account
                    </Link>
                    <Link href="/dashboard" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink hover:bg-section">
                      <i className="fa-solid fa-folder-open w-4 text-brand-400" /> My Bills
                    </Link>
                    <Link href="/pricing" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink hover:bg-section">
                      <i className="fa-solid fa-crown w-4 text-accent" /> {user.plan ? `Plan: ${user.plan}` : "Upgrade"}
                    </Link>
                    <button onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-section">
                      <i className="fa-solid fa-arrow-right-from-bracket w-4 text-placeholderGray" /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={() => openAuth("login")} className="px-4 py-2 text-sm font-semibold text-ink hover:text-brand">
                Sign In
              </button>
              <button onClick={() => openAuth("signup")} className="btn-primary !py-2.5">
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
          <i className={`fa-solid ${mobileOpen ? "fa-xmark" : "fa-bars"} text-xl text-ink`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-line bg-white lg:hidden">
          <div className="container-bg max-h-[70vh] space-y-4 overflow-y-auto py-4">
            <Link href="/" className="block py-1 font-semibold text-ink" onClick={() => setMobileOpen(false)}>Home</Link>
            {CATEGORIES.map((cat) => (
              <div key={cat}>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-brand-600">{cat}</p>
                <div className="grid grid-cols-2 gap-1">
                  {CATALOG.filter((c) => c.category === cat).map((c) => (
                    <Link key={c.slug} href={`/${c.slug}`} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-inkSoft hover:bg-section" onClick={() => setMobileOpen(false)}>
                      <i className={`fa-solid ${c.icon} w-4 text-center text-brand-400`} /> {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <Link href="/tools" className="btn-ghost flex-1" onClick={() => setMobileOpen(false)}>Free Tools</Link>
              <Link href="/pricing" className="btn-ghost flex-1" onClick={() => setMobileOpen(false)}>Pricing</Link>
              <Link href="/contact" className="btn-ghost flex-1" onClick={() => setMobileOpen(false)}>Contact</Link>
            </div>
            {!user && (
              <div className="flex gap-2">
                <button onClick={() => { setMobileOpen(false); openAuth("login"); }} className="btn-outline flex-1">Sign In</button>
                <button onClick={() => { setMobileOpen(false); openAuth("signup"); }} className="btn-primary flex-1">Sign Up</button>
              </div>
            )}
            {user && (
              <div className="flex gap-2">
                <Link href="/dashboard" className="btn-outline flex-1" onClick={() => setMobileOpen(false)}>My Bills</Link>
                <button onClick={() => { setMobileOpen(false); logout(); }} className="btn-ghost flex-1">Sign out</button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
