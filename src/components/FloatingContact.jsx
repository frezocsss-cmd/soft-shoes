import { Send } from "lucide-react";
import { TELEGRAM_LINK } from "../data/config";

function FloatingContact() {
  return (
    <a
      href={TELEGRAM_LINK}
      target="_blank"
      rel="noreferrer"
      className="floating"
      aria-label="Telegram"
    >
      <Send size={22} />
      <span className="floating__pulse" />
    </a>
  );
}

export default FloatingContact;