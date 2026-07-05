import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { catalogBySlug, getConfig, CATALOG } from "@/config/catalog";
import GeneratorClient from "@/components/generator/GeneratorClient";
import GeneratorFaq from "@/components/generator/GeneratorFaq";
import ComingSoon from "@/components/generator/ComingSoon";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CATALOG.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const config = getConfig(slug);
  const item = catalogBySlug(slug);
  if (config) return { title: config.title, description: config.description };
  if (item) return { title: `${item.name} Generator`, description: item.blurb };
  return { title: "Not found" };
}

export default async function GeneratorPage({ params }: Props) {
  const { slug } = await params;
  const item = catalogBySlug(slug);
  if (!item) notFound();

  const config = getConfig(slug);
  if (config) {
    return (
      <>
        <GeneratorClient config={config} />
        <GeneratorFaq config={config} />
      </>
    );
  }
  return <ComingSoon item={item} />;
}
