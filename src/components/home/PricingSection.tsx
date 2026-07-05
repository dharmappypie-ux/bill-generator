"use client";
import { useState } from "react";
import { PLAN_LIST, type PlanId } from "@/config/plans";
import { useAuth } from "@/components/providers/AuthProvider";

interface CouponState {
  code: string;
  percent: number;
}

export default function PricingSection() {
  const { user, openAuth } = useAuth();

  const [couponInput, setCouponInput] = useState("");
  const [applying, setApplying] = useState(false);
  const [coupon, setCoupon] = useState<CouponState | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const [checkoutFor, setCheckoutFor] = useState<PlanId | null>(null);
  const [checkoutMsg, setCheckoutMsg] = useState<string | null>(null);

  async function applyCoupon() {
    const code = couponInput.trim();
    if (!code) return;
    setApplying(true);
    setCouponError(null);
    setCoupon(null);
    try {
      const res = await fetch("/api/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const json = await res.json();
      if (json.valid) {
        setCoupon({ code: json.code, percent: json.percent });
      } else {
        setCouponError(json.error || "Invalid or expired coupon.");
      }
    } catch {
      setCouponError("Couldn't validate coupon. Try again.");
    } finally {
      setApplying(false);
    }
  }

  async function getStarted(planId: PlanId) {
    setCheckoutMsg(null);
    if (!user) {
      openAuth("signup");
      return;
    }
    setCheckoutFor(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, coupon: coupon?.code }),
      });
      const json = await res.json();
      if (json.url) {
        window.location.href = json.url;
        return;
      }
      setCheckoutMsg(json.error || "Payments not configured yet.");
    } catch {
      setCheckoutMsg("Something went wrong. Please try again.");
    } finally {
      setCheckoutFor(null);
    }
  }

  function discounted(amountPaise: number) {
    if (!coupon) return null;
    const value = Math.round((amountPaise * (1 - coupon.percent / 100)) / 100);
    return `₹${value.toLocaleString("en-IN")}`;
  }

  return (
    <section className="py-16 lg:py-20">
      <div className="container-bg">
        <p className="section-eyebrow">Pricing</p>
        <h2 className="section-title">Simple, transparent pricing</h2>
        <p className="section-sub">
          Generate bills free, forever. Upgrade only when you want unlimited bills,
          saved history and advanced customization.
        </p>

        {/* Coupon */}
        <div className="mx-auto mt-8 max-w-md">
          <div className="flex items-stretch gap-2">
            <input
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
              placeholder="Have a coupon code?"
              className="field-input flex-1 uppercase placeholder:normal-case"
              aria-label="Coupon code"
            />
            <button
              onClick={applyCoupon}
              disabled={applying || !couponInput.trim()}
              className="btn-primary !px-5"
            >
              {applying ? (
                <i className="fa-solid fa-spinner animate-spin" />
              ) : (
                "Apply"
              )}
            </button>
          </div>
          {coupon && (
            <p className="mt-2 flex items-center justify-center gap-1.5 text-sm font-semibold text-success">
              <i className="fa-solid fa-circle-check" />
              {coupon.code} applied — {coupon.percent}% off all plans
            </p>
          )}
          {couponError && (
            <p className="mt-2 flex items-center justify-center gap-1.5 text-sm font-semibold text-accent-700">
              <i className="fa-solid fa-circle-exclamation" />
              {couponError}
            </p>
          )}
        </div>

        {/* Plans */}
        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-3">
          {PLAN_LIST.map((plan) => {
            const isPopular = "popular" in plan && plan.popular;
            const disc = discounted(plan.amount);
            const loading = checkoutFor === plan.id;
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl bg-white p-7 transition-all duration-300 ${
                  isPopular
                    ? "shadow-card ring-2 ring-brand lg:-translate-y-2"
                    : "border border-line shadow-soft hover:-translate-y-1 hover:shadow-card"
                }`}
              >
                {isPopular && (
                  <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-gradient-to-r from-brand to-indigoBtn px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-card">
                    <i className="fa-solid fa-crown" />
                    Most Popular
                  </span>
                )}

                <h3 className="text-lg font-bold text-ink">{plan.name}</h3>

                <div className="mt-4 flex items-end gap-2">
                  {disc ? (
                    <>
                      <span className="text-4xl font-extrabold text-ink">{disc}</span>
                      <span className="mb-1.5 text-lg font-semibold text-placeholderGray line-through">
                        {plan.priceLabel}
                      </span>
                    </>
                  ) : (
                    <span className="text-4xl font-extrabold text-ink">
                      {plan.priceLabel}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-inkSoft">
                  for {plan.duration}
                  {disc && (
                    <span className="ml-1.5 font-semibold text-success">
                      ({coupon?.percent}% off)
                    </span>
                  )}
                </p>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-inkSoft">
                      <span
                        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                          isPopular ? "bg-brand text-white" : "bg-brand-50 text-brand-600"
                        }`}
                      >
                        <i className="fa-solid fa-check text-[10px]" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => getStarted(plan.id)}
                  disabled={loading}
                  className={`mt-7 w-full ${isPopular ? "btn-accent" : "btn-outline"}`}
                >
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner animate-spin" />
                      Starting…
                    </>
                  ) : (
                    <>
                      Get Started
                      <i className="fa-solid fa-arrow-right text-xs" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {checkoutMsg && (
          <p className="mx-auto mt-6 flex max-w-md items-center justify-center gap-1.5 rounded-xl bg-section px-4 py-3 text-center text-sm font-semibold text-inkSoft">
            <i className="fa-solid fa-circle-info text-indigoBtn" />
            {checkoutMsg}
          </p>
        )}

        <p className="mt-8 text-center text-xs text-placeholderGray">
          Prices in INR. Cancel anytime. Generating bills is always free.
        </p>
      </div>
    </section>
  );
}
