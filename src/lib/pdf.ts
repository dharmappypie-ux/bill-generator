"use client";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/** Renders a DOM node to a high-res canvas (shared by download + email). */
async function nodeToCanvas(node: HTMLElement): Promise<HTMLCanvasElement> {
  return html2canvas(node, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
    logging: false,
  });
}

function canvasToPdf(canvas: HTMLCanvasElement): jsPDF {
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: canvas.width >= canvas.height ? "landscape" : "portrait",
    unit: "px",
    format: [canvas.width, canvas.height],
  });
  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
  return pdf;
}

/** Triggers a browser download of the given DOM node as a PDF. */
export async function downloadNodeAsPdf(node: HTMLElement, filename: string): Promise<void> {
  const canvas = await nodeToCanvas(node);
  const pdf = canvasToPdf(canvas);
  pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}

/** Returns a base64 (no data-uri prefix) PDF for emailing via the API. */
export async function nodeToPdfBase64(node: HTMLElement): Promise<string> {
  const canvas = await nodeToCanvas(node);
  const pdf = canvasToPdf(canvas);
  const dataUri = pdf.output("datauristring");
  return dataUri.split(",")[1] ?? "";
}

/** PNG data-uri of the node — handy for previews/thumbnails. */
export async function nodeToPng(node: HTMLElement): Promise<string> {
  const canvas = await nodeToCanvas(node);
  return canvas.toDataURL("image/png");
}
