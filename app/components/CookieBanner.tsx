"use client";

import { useEffect, useState } from "react";

export function analyticsConsentGranted() {
    if (typeof window === "undefined") {
      return false;
    }
  
    return (
      localStorage.getItem("cookie-consent") === "accepted"
    );
  }

export default function CookieBanner() {
  const [visibile, setVisibile] = useState(false);

  useEffect(() => {
    const scelta = localStorage.getItem("cookie-consent");

    if (!scelta) {
      setVisibile(true);
    }
  }, []);

  function accettaCookie() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisibile(false);
  }

  function rifiutaCookie() {
    localStorage.setItem("cookie-consent", "rejected");
    setVisibile(false);
  }

  if (!visibile) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] mx-auto max-w-4xl rounded-3xl border border-white/10 bg-slate-950 p-5 text-white shadow-2xl">
      <p className="text-sm leading-6 text-slate-300">
        Questo sito utilizza cookie tecnici e, previo consenso, strumenti di
        analisi come Google Analytics per migliorare l’esperienza di navigazione.
        Puoi accettare o rifiutare i cookie non necessari.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={rifiutaCookie}
          className="rounded-full border border-white/20 bg-white/10 px-5 py-2 font-bold text-white hover:bg-white/20"
        >
          Rifiuta
        </button>

        <button
          type="button"
          onClick={accettaCookie}
          className="rounded-full bg-lime-400 px-5 py-2 font-black text-slate-950 hover:bg-lime-300"
        >
          Accetta
        </button>
      </div>
    </div>
  );
}