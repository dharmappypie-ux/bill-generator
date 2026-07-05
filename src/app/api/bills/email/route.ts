import { NextRequest, NextResponse } from "next/server";
import { sendMail, billEmailHtml } from "@/lib/mail";

// Emails a generated bill PDF (sent as base64 from the client) to a recipient.
export async function POST(req: NextRequest) {
  try {
    const { to, title, message, pdfBase64, filename } = await req.json();
    if (!to || !pdfBase64) {
      return NextResponse.json({ error: "Recipient and PDF are required." }, { status: 400 });
    }

    const { delivered, preview } = await sendMail({
      to: String(to),
      subject: title ? `Your bill: ${title}` : "Your bill from Bill Generator",
      html: billEmailHtml(title || "Your Bill", message),
      text: message || "Please find your bill attached.",
      attachments: [
        {
          filename: filename || "bill.pdf",
          content: Buffer.from(pdfBase64, "base64"),
          contentType: "application/pdf",
        },
      ],
    });

    return NextResponse.json({
      ok: true,
      delivered,
      note: delivered ? undefined : `Saved to dev mailbox (${preview}). Configure SMTP_* to send for real.`,
    });
  } catch {
    return NextResponse.json({ error: "Could not send email." }, { status: 500 });
  }
}
