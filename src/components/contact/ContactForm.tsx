"use client";
import { useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function set(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Demo: no backend endpoint for contact; acknowledge locally.
    setSent(true);
  }

  if (sent) {
    return (
      <div className="grid place-items-center rounded-2xl border border-line bg-white p-10 text-center shadow-soft">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-success/10 text-2xl text-success">
          <i className="fa-solid fa-circle-check" />
        </span>
        <h3 className="mt-4 text-lg font-extrabold text-ink">Message sent!</h3>
        <p className="mt-1 text-sm text-inkSoft">Thanks, {form.name || "there"}. We&apos;ll get back to you shortly.</p>
        <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }} className="btn-outline mt-5">
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-line bg-white p-6 shadow-soft">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Name</label>
          <input className="field-input" value={form.name} onChange={(e) => set("name", e.target.value)} required />
        </div>
        <div>
          <label className="field-label">Email</label>
          <input className="field-input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
        </div>
      </div>
      <div className="mt-4">
        <label className="field-label">Subject</label>
        <input className="field-input" value={form.subject} onChange={(e) => set("subject", e.target.value)} required />
      </div>
      <div className="mt-4">
        <label className="field-label">Message</label>
        <textarea className="field-input min-h-[140px]" value={form.message} onChange={(e) => set("message", e.target.value)} required />
      </div>
      <button className="btn-primary mt-5 w-full sm:w-auto">
        <i className="fa-solid fa-paper-plane" /> Send message
      </button>
    </form>
  );
}
