// Config-driven generator model. Adding a new bill type = adding a config +
// a preview component to the registry; the form UI is generated from `fields`.

export type FieldType =
  | "text"
  | "number"
  | "date"
  | "time"
  | "select"
  | "currency"
  | "toggle"
  | "textarea"
  | "logo"
  | "items";

export interface FieldOption {
  value: string;
  label: string;
}

/** A column in an `items` (line-item) field. */
export interface ItemColumn {
  key: string;
  label: string;
  type?: "text" | "number";
  /** flex grow weight for the column width (default 1) */
  grow?: number;
}

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: FieldOption[];
  /** Form section heading this field belongs to. */
  group: string;
  /** Half-width on desktop (two per row). */
  half?: boolean;
  /** logo-type fields carry selectable image choices. */
  logos?: { id: string; label: string; src: string }[];
  /** items-type fields: the editable columns. Value is JSON-stringified rows. */
  columns?: ItemColumn[];
  /** items-type: label for the "add row" button. */
  addLabel?: string;
}

export interface TemplateDef {
  id: string;
  label: string;
}

export interface GeneratorConfig {
  slug: string;
  name: string; // short, e.g. "Fuel Bill"
  /** SEO/page title */
  title: string;
  description: string;
  /** Font Awesome icon class, e.g. "fa-gas-pump" */
  icon: string;
  category: string;
  popular?: boolean;
  templates: TemplateDef[];
  /** Show the 17-theme picker. */
  hasThemes: boolean;
  /** Show the Normal/Crumpled paper toggle. */
  hasCrumple: boolean;
  fields: FieldDef[];
  defaults: Record<string, string | boolean>;
}

export type BillData = Record<string, string | boolean>;

export interface PreviewProps {
  config: GeneratorConfig;
  data: BillData;
  theme: string;
  template: string;
  crumpled: boolean;
  currency: string;
}
