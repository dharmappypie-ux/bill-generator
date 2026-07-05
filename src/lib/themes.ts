// The 17 "themes" on billgenerator.org are 17 crumpled-paper background photos
// (assets/img/logo/crumpled_paper1..17.webp). The receipt is printed ON the
// selected paper; text is always dark ink. The "Crumpled paper effect" toggle
// decides whether the chosen paper photo is shown (vs a clean white receipt).
export type ReceiptTheme = {
  id: string; // "theme-1" .. "theme-17"
  label: string; // "Theme 1"
  image: string; // /crumpled/crumpled_paperN.webp
  paper: string; // flat fallback color (when crumple is off)
  ink: string; // body text
  accent: string; // headings / banners / totals
  muted: string; // secondary text / rules
};

// Dark ink palette shared by every paper (all papers are light/cream).
const INK = "#1d1d1f";
const ACCENT = "#26262b";
const MUTED = "#5a5a5a";

export const THEMES: ReceiptTheme[] = Array.from({ length: 17 }, (_, i) => {
  const n = i + 1;
  return {
    id: `theme-${n}`,
    label: `Theme ${n}`,
    image: `/crumpled/crumpled_paper${n}.webp`,
    paper: "#ffffff",
    ink: INK,
    accent: ACCENT,
    muted: MUTED,
  };
});

export const THEME_MAP: Record<string, ReceiptTheme> = Object.fromEntries(
  THEMES.map((t) => [t.id, t])
);

export function themeById(id: string): ReceiptTheme {
  return THEME_MAP[id] ?? THEMES[0];
}
