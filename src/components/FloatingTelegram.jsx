import { Send } from "lucide-react";
import { TELEGRAM_LINK } from "../data/config";

export default function FloatingTelegram() {
  return (
    <a
      href={TELEGRAM_LINK}
      aria-label="Telegram orqali bog'lanish"
      className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-[#229ED9] text-white shadow-[0_10px_30px_rgba(34,158,217,0.35)] transition hover:-translate-y-1 hover:bg-[#1b8ac0] sm:bottom-7 sm:right-7"
    >
      <Send size={22} />
    </a>
  );
}
