import Link from "next/link";

export default function WhatsAppButton() {
  return (
    <Link
      href="https://wa.me/910000000000?text=Hi%2C%20I%20need%20help%20with%20Bill%20Generator"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-2xl text-white shadow-lg transition-transform hover:scale-110"
    >
      <i className="fa-brands fa-whatsapp" />
      <span className="absolute -inset-1 -z-10 animate-ping rounded-full bg-[#25D366]/40" />
    </Link>
  );
}
