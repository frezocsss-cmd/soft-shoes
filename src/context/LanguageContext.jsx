/* eslint-disable react/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext(null);

const STORAGE_KEY = "soft-shoes-lang";

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === "ru" || saved === "uz" ? saved : "uz";
    } catch {
      return "uz";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* no-op */
    }
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}