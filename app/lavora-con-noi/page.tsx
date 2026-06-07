"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function LavoraConNoiPage() {
    const [dataNascita, setDataNascita] = useState("");
    const [erroreDataNascita, setErroreDataNascita] = useState("");
    const [focusDataNascita, setFocusDataNascita] = useState(false);

    const [messaggio, setMessaggio] = useState("");
    const [errore, setErrore] = useState(false);
    const [invioInCorso, setInvioInCorso] = useState(false);
    const [resetFileInput, setResetFileInput] = useState(0);
  
    return (
        
   <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      
      <div className="mx-auto max-w-3xl">
  <a
    href="/"
    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 font-bold hover:bg-white/20"
  >
    <ArrowLeft className="h-5 w-5" />
    Torna alla homepage
  </a>
</div>
<div className="mx-auto mt-10 max-w-3xl">
        <h1 className="text-4xl font-black">
          Lavora con noi
        </h1>

        <p className="mt-4 text-slate-300">
          Compila il modulo e allega il tuo curriculum vitae in formato PDF.
        </p>




        <form
  onSubmit={async (e) => {
    e.preventDefault();

    setMessaggio("");
    setErrore(false);

    const dataValida = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(
      dataNascita
    );

    if (!dataValida) {
      setErroreDataNascita("Formato corretto gg/mm/aaaa");
      return;
    }

    setInvioInCorso(true);

    const form = e.currentTarget;
const formData = new FormData(form);

    const response = await fetch("/api/candidatura", {
      method: "POST",
      body: formData,
    });

    setInvioInCorso(false);

    if (!response.ok) {
      setErrore(true);
      setMessaggio("Errore durante l'invio della candidatura.");
      return;
    }

    setErrore(false);
setMessaggio("Candidatura inviata correttamente.");
form.reset();
setDataNascita("");
setFocusDataNascita(false);
setErroreDataNascita("");
setResetFileInput((prev) => prev + 1);
setDataNascita("");
setFocusDataNascita(false);
setErroreDataNascita("");
setResetFileInput((prev) => prev + 1);
  }}
  className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.07] p-6"
>
          <div className="grid gap-6 md:grid-cols-2">
            <input
              type="text"
              name="nome"
              required
              placeholder="Nome"
              className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none"
            />

            <input
              type="text"
              name="cognome"
              required
              placeholder="Cognome"
              className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none"
            />
          </div>

          <div className="mt-6">
  <input
    type="text"
    name="dataNascita"
    value={dataNascita}
    onFocus={() => setFocusDataNascita(true)}
    onBlur={() => {
      const dataValida =
        /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(
          dataNascita
        );

      if (dataNascita && !dataValida) {
        setErroreDataNascita("Formato corretto gg/mm/aaaa");
      }
    }}
    onChange={(e) => {
      setDataNascita(e.target.value);
      setErroreDataNascita("");
    }}
    placeholder={
      focusDataNascita
        ? ""
        : "Data di nascita gg/mm/aaaa"
    }
    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none"
  />

  {erroreDataNascita && (
    <p className="mt-2 text-sm font-semibold text-red-400">
      {erroreDataNascita}
    </p>
  )}
</div>

          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            className="mt-6 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none"
          />

          <input
            type="tel"
            name="telefono"
            required
            placeholder="Telefono"
            className="mt-6 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none"
          />

          <textarea
            rows={6}
            name="messaggio"
            required
            placeholder="Presentati brevemente..."
            className="mt-6 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none"
          />

          <div className="mt-6">
            <label className="mb-2 block text-sm font-bold">
              Curriculum Vitae (PDF)
            </label>

            <input
            key={`cv-${resetFileInput}`}
            type="file"
            name="cv"
            accept=".pdf,application/pdf"
            required
            className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white"
/>
          </div>

          <div className="mt-6 flex items-start gap-3">
          <input
  type="checkbox"
  id="privacy"
  name="privacy"
  required
  className="mt-1 h-4 w-4"
/>

  <label
    htmlFor="privacy"
    className="text-sm text-slate-300"
  >
    Ho letto e accetto la{" "}
<a
  href="/privacy-policy"
  className="font-bold text-lime-300 hover:underline"
>
  Privacy Policy
</a>
.
  </label>
</div>

{messaggio && (
  <p
    className={`mt-6 text-sm font-semibold ${
      errore ? "text-red-400" : "text-lime-300"
    }`}
  >
    {messaggio}
  </p>
)}

<button
  type="submit"
  disabled={invioInCorso}
  className="mt-8 w-full rounded-full bg-lime-400 px-6 py-4 font-black text-slate-950 hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
>
  {invioInCorso ? "Invio in corso..." : "Invia candidatura"}
</button>
        </form>
      </div>
    </main>
  );
}