"use client";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { GeneratorConfig, BillData } from "@/types/generator";
import { THEMES } from "@/lib/themes";
import { useAuth } from "@/components/providers/AuthProvider";
import { getPreview } from "./previewRegistry";
import BillForm from "./BillForm";
import { downloadNodeAsPdf, nodeToPdfBase64 } from "@/lib/pdf";

type Toast = { kind: "ok" | "err"; msg: string } | null;

export default function GeneratorClient({ config }: { config: GeneratorConfig }) {
  const { user, openAuth } = useAuth();
  const Preview = getPreview(config.slug);

  const [values, setValues] = useState<BillData>({ ...config.defaults });
  const [template, setTemplate] = useState(config.templates[0]?.id ?? "template-1");
  const [theme, setTheme] = useState(THEMES[0]?.id ?? "theme-1");
  const [crumpled, setCrumpled] = useState(config.hasCrumple);
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [emailOpen, setEmailOpen] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  // When true, the preview renders at natural (unscaled) size so PDF/print are crisp.
  const [capturing, setCapturing] = useState(false);

  const captureRef = useRef<HTMLDivElement>(null);
  const currency = (values.currency as string) || "INR";

  // Render the preview at 1:1 while running `fn` (for full-res PDF/email capture).
  async function withCapture<T>(fn: () => Promise<T>): Promise<T> {
    setCapturing(true);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(null))));
    try {
      return await fn();
    } finally {
      setCapturing(false);
    }
  }

  // Default date/time on mount (client-only to avoid hydration mismatch),
  // and hydrate a saved bill if ?load=<id> is present.
  useEffect(() => {
    const now = new Date();
    const d = now.toISOString().slice(0, 10);
    const t = now.toTimeString().slice(0, 5);
    setValues((v) => {
      const next = { ...v };
      for (const f of config.fields) {
        if ((f.type === "date") && !next[f.name]) next[f.name] = d;
        if ((f.type === "time") && !next[f.name]) next[f.name] = t;
      }
      return next;
    });

    const params = new URLSearchParams(window.location.search);
    const loadId = params.get("load");
    if (loadId) void loadBill(loadId);
    // Deep-link to a specific template/theme, e.g. ?template=template-4
    const tpl = params.get("template");
    if (tpl && config.templates.some((x) => x.id === tpl)) setTemplate(tpl);
    const th = params.get("theme");
    if (th && THEMES.some((x) => x.id === th)) setTheme(th);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function flash(kind: "ok" | "err", msg: string) {
    setToast({ kind, msg });
    setTimeout(() => setToast(null), 3500);
  }

  function setField(name: string, value: string | boolean) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  async function loadBill(id: string) {
    try {
      const res = await fetch(`/api/bills/${id}`);
      if (!res.ok) return;
      const { bill } = await res.json();
      setValues({ ...config.defaults, ...bill.data });
      setTemplate(bill.template || template);
      setTheme(bill.theme || THEMES[0].id);
      setSavedId(bill.id);
      flash("ok", "Loaded your saved bill.");
    } catch {
      /* ignore */
    }
  }

  function fileName() {
    const base = `${config.slug}-${(values.invoiceNo || values.receiptNo || "bill") as string}`;
    return base.replace(/[^a-z0-9-]/gi, "_");
  }

  async function handleDownload() {
    if (!captureRef.current) return;
    setBusy("download");
    try {
      await withCapture(() => downloadNodeAsPdf(captureRef.current!, fileName()));
      flash("ok", "PDF downloaded.");
    } catch {
      flash("err", "Could not generate PDF.");
    } finally {
      setBusy(null);
    }
  }

  async function handleSave() {
    if (!user) {
      openAuth("login");
      return;
    }
    setBusy("save");
    try {
      const title = `${config.name} — ${(values.customerName || values.tenantName || values.stationName || "Untitled") as string}`;
      const payload = { type: config.slug, title, template, theme, currency, data: values };
      let res: Response;
      if (savedId) {
        res = await fetch(`/api/bills/${savedId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      } else {
        res = await fetch("/api/bills", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      }
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      if (json.bill?.id) setSavedId(json.bill.id);
      flash("ok", savedId ? "Bill updated." : "Bill saved to your account.");
    } catch (e) {
      flash("err", (e as Error).message || "Could not save.");
    } finally {
      setBusy(null);
    }
  }

  function clearForm() {
    setValues({ ...config.defaults });
    setSavedId(null);
    flash("ok", "Form cleared.");
  }

  return (
    <div className="container-bg py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-1">
        <nav className="text-xs text-placeholderGray">
          <a href="/" className="hover:text-brand">Home</a> /{" "}
          <a href="/bills" className="hover:text-brand">Bills</a> /{" "}
          <span className="text-ink">{config.name}</span>
        </nav>
        <h1 className="flex items-center gap-3 text-2xl font-extrabold text-ink sm:text-3xl">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand">
            <i className={`fa-solid ${config.icon}`} />
          </span>
          {config.name} Generator
        </h1>
        <p className="max-w-2xl text-sm text-inkSoft">{config.description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)]">
        {/* FORM COLUMN */}
        <div className="rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-ink">Bill details</h2>
            <button onClick={clearForm} className="text-xs font-semibold text-placeholderGray hover:text-rose-500">
              <i className="fa-solid fa-eraser mr-1" /> Clear
            </button>
          </div>
          <BillForm config={config} values={values} onChange={setField} />
        </div>

        {/* PREVIEW COLUMN */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          {/* Controls */}
          <div className="mb-3 space-y-3 rounded-2xl border border-line bg-white p-4 shadow-soft">
            <div>
              <p className="field-label">Template</p>
              <div className="flex flex-wrap gap-2">
                {config.templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setTemplate(tpl.id)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                      template === tpl.id ? "border-brand bg-brand-50 text-brand" : "border-line2 text-inkSoft hover:border-brand-300"
                    }`}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {config.hasThemes && (
              <div>
                <p className="field-label">Choose an additional background option:</p>
                <div className="flex items-center gap-2">
                  <select
                    className="field-select flex-1"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    aria-label="Theme"
                  >
                    {THEMES.map((th, i) => (
                      <option key={th.id} value={th.id}>
                        Theme {i + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setTheme(THEMES[0].id)}
                    title="Reset to Theme 1"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-line2 text-inkSoft transition hover:border-brand hover:text-brand"
                  >
                    <i className="fa-solid fa-arrows-rotate" />
                  </button>
                </div>
              </div>
            )}

            {config.hasCrumple && (
              <label className="flex w-fit items-center gap-2 text-xs font-semibold text-inkSoft">
                <input type="checkbox" checked={crumpled} onChange={(e) => setCrumpled(e.target.checked)} />
                Crumpled paper effect
              </label>
            )}
          </div>

          {/* Live preview — scaled to fit the column, captured/printed at 1:1 */}
          <div className="rounded-2xl border border-line bg-section p-4 shadow-soft">
            <div className="min-h-[420px]">
              <FitPreview capture={capturing} innerRef={captureRef}>
                {Preview ? (
                  <Preview config={config} data={values} theme={theme} template={template} crumpled={crumpled} currency={currency} />
                ) : (
                  <p className="p-10 text-sm text-placeholderGray">Preview unavailable.</p>
                )}
              </FitPreview>
            </div>
          </div>

          {/* Toolbar */}
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <button onClick={handleDownload} disabled={busy === "download"} className="btn-accent col-span-2 sm:col-span-1">
              <i className="fa-solid fa-file-arrow-down" /> {busy === "download" ? "…" : "PDF"}
            </button>
            <button onClick={() => setEmailOpen(true)} className="btn-outline">
              <i className="fa-solid fa-envelope" /> Email
            </button>
            <button onClick={handleSave} disabled={busy === "save"} className="btn-primary">
              <i className="fa-solid fa-floppy-disk" /> {busy === "save" ? "…" : savedId ? "Update" : "Save"}
            </button>
            <button onClick={() => window.print()} className="btn-ghost">
              <i className="fa-solid fa-print" /> Print
            </button>
          </div>
          {!user && (
            <p className="mt-2 text-center text-xs text-placeholderGray">
              <button onClick={() => openAuth("login")} className="font-semibold text-brand">Sign in</button> to save bills across devices.
            </p>
          )}
        </div>
      </div>

      {emailOpen && (
        <EmailModal
          defaultName={fileName()}
          onClose={() => setEmailOpen(false)}
          getPdf={() => withCapture(() => (captureRef.current ? nodeToPdfBase64(captureRef.current) : Promise.resolve("")))}
          billTitle={`${config.name}`}
          onResult={(ok, msg) => flash(ok ? "ok" : "err", msg)}
        />
      )}

      {toast && (
        <div className={`fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg ${toast.kind === "ok" ? "bg-success" : "bg-rose-500"}`}>
          <i className={`fa-solid ${toast.kind === "ok" ? "fa-circle-check" : "fa-circle-exclamation"} mr-2`} />
          {toast.msg}
        </div>
      )}
    </div>
  );
}

function EmailModal({
  defaultName,
  billTitle,
  onClose,
  getPdf,
  onResult,
}: {
  defaultName: string;
  billTitle: string;
  onClose: () => void;
  getPdf: () => Promise<string>;
  onResult: (ok: boolean, msg: string) => void;
}) {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      const pdfBase64 = await getPdf();
      const res = await fetch("/api/bills/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, title: billTitle, message, pdfBase64, filename: `${defaultName}.pdf` }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      onResult(true, json.delivered ? "Bill emailed successfully." : "Saved to dev mailbox (configure SMTP to send).");
      onClose();
    } catch (err) {
      onResult(false, (err as Error).message || "Could not send email.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/50 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <form onSubmit={send} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl" onMouseDown={(e) => e.stopPropagation()}>
        <h3 className="mb-1 text-lg font-extrabold text-ink">Email this bill</h3>
        <p className="mb-4 text-sm text-inkSoft">We&apos;ll attach the bill as a PDF.</p>
        <label className="field-label">Recipient email</label>
        <input className="field-input mb-3" type="email" value={to} onChange={(e) => setTo(e.target.value)} placeholder="name@example.com" required />
        <label className="field-label">Message (optional)</label>
        <textarea className="field-input mb-4 min-h-[70px]" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Please find your bill attached." />
        <div className="flex gap-2">
          <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button disabled={sending} className="btn-primary flex-1">{sending ? "Sending…" : "Send"}</button>
        </div>
      </form>
    </div>
  );
}

/**
 * Scales the receipt down to fit the preview column width so nothing is clipped.
 * When `capture` is true it renders at 1:1 (natural size) so PDF/print stay crisp.
 * `innerRef` is the element html2canvas captures and that print isolates.
 */
function FitPreview({
  capture,
  innerRef,
  children,
}: {
  capture: boolean;
  innerRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [natWidth, setNatWidth] = useState(0);
  const [natHeight, setNatHeight] = useState(0);

  useEffect(() => {
    const measure = () => {
      const avail = outerRef.current?.clientWidth ?? 0;
      const natW = innerRef.current?.offsetWidth ?? 0;
      const natH = innerRef.current?.offsetHeight ?? 0;
      if (natW > 0) setNatWidth(natW);
      if (natH > 0) setNatHeight(natH);
      setScale(natW > 0 && avail > 0 ? Math.min(1, avail / natW) : 1);
    };
    const raf = requestAnimationFrame(measure);
    const ro = new ResizeObserver(measure);
    if (outerRef.current) ro.observe(outerRef.current);
    if (innerRef.current) ro.observe(innerRef.current);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [innerRef]);

  const s = capture ? 1 : scale;
  return (
    <div
      ref={outerRef}
      style={{
        width: "100%",
        overflow: capture ? "visible" : "hidden",
        // Reserve the scaled height so the toolbar below doesn't get a big gap.
        height: capture || !natHeight ? undefined : Math.ceil(natHeight * s),
      }}
    >
      {/* Footprint sized to the SCALED width and centered — avoids the
          "text-align doesn't center an overflowing inline-block" quirk. */}
      <div style={{ width: capture || !natWidth ? undefined : Math.ceil(natWidth * s), margin: "0 auto" }}>
        <div
          className="bill-scaler"
          style={{ display: "inline-block", transform: `scale(${s})`, transformOrigin: "top left" }}
        >
          <div ref={innerRef} id="bill-print-area">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
