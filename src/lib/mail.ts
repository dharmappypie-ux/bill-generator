import "server-only";
import nodemailer from "nodemailer";
import { promises as fs } from "fs";
import path from "path";

type MailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: { filename: string; content: Buffer | string; contentType?: string }[];
};

const hasSmtp = () => Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);

let transporter: nodemailer.Transporter | null = null;
function getTransport() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

/**
 * Sends an email. With SMTP configured it goes out for real; otherwise it is
 * written to ./.mailbox/*.html and logged to the console so the flow stays
 * fully testable in local dev (OTP codes appear in the console).
 */
export async function sendMail(input: MailInput): Promise<{ delivered: boolean; preview?: string }> {
  const from = process.env.MAIL_FROM || "Bill Generator <no-reply@billgenerator.local>";

  if (hasSmtp()) {
    await getTransport().sendMail({ from, ...input });
    return { delivered: true };
  }

  // Dev fallback: persist to a local mailbox + console.
  const dir = path.join(process.cwd(), ".mailbox");
  await fs.mkdir(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const safeTo = input.to.replace(/[^a-z0-9@._-]/gi, "_");
  const file = path.join(dir, `${stamp}__${safeTo}.html`);
  await fs.writeFile(file, input.html, "utf8");

  // eslint-disable-next-line no-console
  console.log(
    `\n📧 [dev-mail] To: ${input.to}\n   Subject: ${input.subject}\n   Saved: ${file}\n   (Set SMTP_* env vars to send for real)\n`
  );
  return { delivered: false, preview: file };
}

export function otpEmailHtml(code: string): string {
  return `<!doctype html><html><body style="font-family:Montserrat,Arial,sans-serif;background:#f4f5fc;padding:32px">
  <div style="max-width:480px;margin:auto;background:#fff;border-radius:16px;padding:32px;box-shadow:0 10px 30px -12px rgba(65,84,185,.18)">
    <h2 style="color:#4154b9;margin:0 0 8px">Your verification code</h2>
    <p style="color:#5a5a5a;margin:0 0 24px">Use this code to sign in to Bill Generator. It expires in 10 minutes.</p>
    <div style="font-size:34px;letter-spacing:10px;font-weight:800;color:#3f3f3f;text-align:center;background:#f4f5fc;border-radius:12px;padding:18px">${code}</div>
    <p style="color:#929292;font-size:12px;margin:24px 0 0">If you didn't request this, you can ignore this email.</p>
  </div></body></html>`;
}

export function billEmailHtml(billTitle: string, message?: string): string {
  return `<!doctype html><html><body style="font-family:Montserrat,Arial,sans-serif;background:#f4f5fc;padding:32px">
  <div style="max-width:520px;margin:auto;background:#fff;border-radius:16px;padding:32px;box-shadow:0 10px 30px -12px rgba(65,84,185,.18)">
    <h2 style="color:#4154b9;margin:0 0 8px">${billTitle}</h2>
    <p style="color:#5a5a5a">${message || "Please find your bill attached as a PDF."}</p>
    <p style="color:#929292;font-size:12px;margin-top:24px">Generated with Bill Generator.</p>
  </div></body></html>`;
}
