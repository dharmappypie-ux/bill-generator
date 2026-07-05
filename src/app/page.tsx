import Link from "next/link";
import Hero from "@/components/home/Hero";
import Benefits from "@/components/home/Benefits";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturedGenerators from "@/components/home/FeaturedGenerators";
import WhyChoose from "@/components/home/WhyChoose";
import PricingSection from "@/components/home/PricingSection";
import Testimonials from "@/components/home/Testimonials";
import Faq from "@/components/home/Faq";

export default function HomePage() {
  return (
    <>
      {/* Hero — soft section→white gradient */}
      <Hero />

      {/* Benefits — white */}
      <Benefits />

      {/* How it works — section (lavender) */}
      <HowItWorks />

      {/* Featured generators — white */}
      <FeaturedGenerators />

      {/* Why choose — section (lavender) */}
      <WhyChoose />

      {/* Pricing — white */}
      <PricingSection />

      {/* Testimonials — section (lavender) */}
      <Testimonials />

      {/* FAQ — white */}
      <Faq />

      {/* Final CTA band — brand → indigo gradient */}
      <section className="relative overflow-hidden bg-gradient-to-r from-brand-600 via-brand to-indigoBtn-deep py-16 lg:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
        />

        <div className="container-bg relative text-center">
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Ready to create your first bill?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/85">
            No login, no credit card, no watermarks. Pick a template and download a
            polished PDF in under a minute.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/fuel-bill"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-indigoBtn-deep shadow-card transition hover:bg-white/90 sm:w-auto"
            >
              <i className="fa-solid fa-file-invoice" />
              Create a Bill — it&apos;s free
            </Link>
            <Link
              href="/bills"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-white/70 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
            >
              Browse all generators
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
