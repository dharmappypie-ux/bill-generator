import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TOOLS, toolBySlug, toolsByCategory } from "@/config/tools";
import ToolRenderer from "@/components/tools/ToolRenderer";

type Props = { params: Promise<{ tool: string }> };

export function generateStaticParams() {
  return TOOLS.map((t) => ({ tool: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool } = await params;
  const item = toolBySlug(tool);
  if (!item) return { title: "Not found" };
  return { title: `${item.name} — Free Online Tool`, description: item.seo };
}

export default async function ToolPage({ params }: Props) {
  const { tool } = await params;
  const item = toolBySlug(tool);
  if (!item) notFound();

  const related = toolsByCategory(item.category)
    .filter((t) => t.slug !== item.slug)
    .slice(0, 6);

  return (
    <div className="container-bg py-10 sm:py-14">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-[13px] text-inkSoft">
        <Link href="/" className="transition hover:text-brand">
          Home
        </Link>
        <i className="fa-solid fa-chevron-right text-[9px]" />
        <Link href="/tools" className="transition hover:text-brand">
          Free Tools
        </Link>
        <i className="fa-solid fa-chevron-right text-[9px]" />
        <span className="font-semibold text-ink">{item.name}</span>
      </nav>

      <div className="mb-8 max-w-3xl">
        <div className="mb-3 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-lg text-brand-600">
            <i className={`fa-solid ${item.icon}`} />
          </div>
          <span className="chip">100% Free · No sign-up</span>
        </div>
        <h1 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
          {item.name}
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-inkSoft">{item.seo}</p>
      </div>

      <ToolRenderer slug={item.slug} />

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 text-lg font-extrabold text-ink">
            More {item.category} tools
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((t) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="group flex items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card"
              >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600 transition group-hover:bg-brand group-hover:text-white">
                  <i className={`fa-solid ${t.icon}`} />
                </div>
                <span className="text-[14px] font-semibold text-ink group-hover:text-brand-700">
                  {t.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
