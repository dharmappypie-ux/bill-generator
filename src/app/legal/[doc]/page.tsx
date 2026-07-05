import type { Metadata } from "next";
import { notFound } from "next/navigation";

const DOCS: Record<string, { title: string; body: { h: string; p: string }[] }> = {
  privacy: {
    title: "Privacy Policy",
    body: [
      { h: "Overview", p: "We respect your privacy. Bills you generate without an account are processed in your browser and are not stored on our servers." },
      { h: "Data we store", p: "If you create an account, we store your email, optional name/mobile, and any bills you choose to save — so you can access them across devices." },
      { h: "Payments", p: "Payments are processed by Stripe. We never store your full card details." },
      { h: "Contact", p: "For privacy requests, email support@billgenerator.local." },
    ],
  },
  terms: {
    title: "Terms of Service",
    body: [
      { h: "Acceptable use", p: "Bill Generator is provided for legitimate documentation, demonstration and record-keeping. You agree not to use generated documents for fraud, forgery, or any unlawful purpose." },
      { h: "Accounts", p: "You are responsible for activity under your account and for keeping your credentials secure." },
      { h: "Plans", p: "Paid plans grant unlimited generation for the stated duration. Lifetime is a one-time purchase." },
      { h: "Liability", p: "The service is provided \"as is\" without warranties. We are not liable for misuse of generated documents." },
    ],
  },
  refund: {
    title: "Refund Policy",
    body: [
      { h: "Eligibility", p: "Quarterly and yearly plans may be refunded within 7 days of purchase if you have not generated more than 5 bills." },
      { h: "Lifetime plan", p: "Lifetime purchases are refundable within 7 days, after which they are final." },
      { h: "How to request", p: "Email support@billgenerator.local with your order details." },
    ],
  },
  disclaimer: {
    title: "Disclaimer",
    body: [
      { h: "For documentation use", p: "Documents created with this tool are templates for personal record-keeping and demonstration. They are not official tax documents unless issued by an authorized party." },
      { h: "No legal/tax advice", p: "We do not provide legal or taxation advice. Consult a professional for compliance matters in your jurisdiction." },
      { h: "Accuracy", p: "You are responsible for the accuracy of the information you enter." },
    ],
  },
};

type Props = { params: Promise<{ doc: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { doc } = await params;
  const d = DOCS[doc];
  return { title: d?.title ?? "Legal" };
}

export function generateStaticParams() {
  return Object.keys(DOCS).map((doc) => ({ doc }));
}

export default async function LegalPage({ params }: Props) {
  const { doc } = await params;
  const d = DOCS[doc];
  if (!d) notFound();

  return (
    <div className="container-bg max-w-3xl py-16">
      <h1 className="text-3xl font-extrabold text-ink">{d.title}</h1>
      <p className="mt-1 text-sm text-placeholderGray">Last updated: June 2026</p>
      <div className="mt-8 space-y-7">
        {d.body.map((s) => (
          <section key={s.h}>
            <h2 className="text-lg font-bold text-ink">{s.h}</h2>
            <p className="mt-1.5 text-[15px] leading-relaxed text-inkSoft">{s.p}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
