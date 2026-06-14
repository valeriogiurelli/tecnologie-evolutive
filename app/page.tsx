"use client";

import { useEffect, useState, type ReactNode, type FormEvent } from "react";
import {
  Sun,
  BatteryCharging,
  ThermometerSun,
  Upload,
  Phone,
  Mail,
  MapPin,
  User,
  Building2,
  ArrowRight,
  Star,
  ExternalLink,
} from "lucide-react";

const googleReviewsUrl =
  "https://www.google.com/search?q=Tecnologie+Evolutive+S.r.l.+Roma+recensioni";

const descrizioneSocieta = [
  "Siamo fortemente impegnati e coordinati per assecondare la nostra clientela affinché l'obiettivo prefissato sia raggiunto nel migliore dei modi.",
  "Ci occupiamo di installazione di sistemi volti al risparmio energetico attraverso tecnologie affidabili e comprovate, selezionate tra le migliori offerte del mercato, cercando di trovare il giusto rapporto qualità/prezzo.",
  "Sistemi di climatizzazione, di Ventilazione Meccanica Controllata, caldaie a condensazione, sistemi ibridi ed in pompa di calore, solari termici, impianti fotovoltaici tradizionali o da balcone.",
  "La nostra esperienza nel settore della ristrutturazione è consolidata da decenni, ed è il frutto di condivisione con gruppi di lavoro affidabili e dalle indubbie qualità professionali.",
  "Il giudizio insindacabile dei nostri clienti è di fondamentale importanza, per questo ci dedichiamo al lavoro con passione, senza indugi, con lo scopo di ottenere il massimo in ogni occasione. Il riscontro che abbiamo ottenuto ci conforta e ci sprona a dare sempre il meglio.",
  "Siamo in grado di operare anche in situazioni lavorative difficili, o dove altri hanno trovato sconveniente intervenire.",
  "Interveniamo spesso su lavori dove il cliente non ha un grosso budget a disposizione, questo per non discriminare o sminuire le possibilità del committente.",
];

const statoInizialeForm = {
  nome: "",
  cognome: "",
  indirizzo: "",
  telefono: "",
  email: "",
  ragioneSociale: "",
  partitaIva: "",
  descrizione: "",
};

export default function Home() {
  const [tipoCliente, setTipoCliente] = useState("Privato");
  const [messaggio, setMessaggio] = useState("");
  const [messaggioSuccesso, setMessaggioSuccesso] = useState("");
  const [allegati, setAllegati] = useState<File[]>([]);
  const [errori, setErrori] = useState<Record<string, boolean>>({});
  const [privacyAccettata, setPrivacyAccettata] = useState(false);

  const [formData, setFormData] = useState(statoInizialeForm);

  useEffect(() => {
    try {
      const datiSalvati = window.localStorage.getItem("preventivoTecnologieEvolutive");
      const tipoSalvato = window.localStorage.getItem("tipoClienteTecnologieEvolutive");

      if (datiSalvati) {
        setFormData(JSON.parse(datiSalvati));
      }

      if (tipoSalvato === "Privato" || tipoSalvato === "Società") {
        setTipoCliente(tipoSalvato);
      }
    } catch {
      // Se localStorage non è disponibile, il form funziona comunque.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "preventivoTecnologieEvolutive",
        JSON.stringify(formData)
      );
      window.localStorage.setItem("tipoClienteTecnologieEvolutive", tipoCliente);
    } catch {
      // Se localStorage non è disponibile, il form funziona comunque.
    }
  }, [formData, tipoCliente]);

  function aggiornaCampo(nome: keyof typeof statoInizialeForm, valore: string) {
    setFormData((prev) => ({
      ...prev,
      [nome]: valore,
    }));
  
    setErrori((prev) => ({
      ...prev,
      [nome]: false,
    }));
  }

  async function inviaPreventivo(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    const nuoviErrori: Record<string, boolean> = {};

if (!formData.nome.trim()) {
  nuoviErrori.nome = true;
}

if (!formData.cognome.trim()) {
  nuoviErrori.cognome = true;
}

const telefonoPulito = formData.telefono.replace(/\D/g, "");

if (telefonoPulito.length < 8) {
  nuoviErrori.telefono = true;
}

const emailValida = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());

if (!emailValida) {
  nuoviErrori.email = true;
}

if (!/[a-zA-Z0-9]{2,}/.test(formData.descrizione)) {
  nuoviErrori.descrizione = true;
}

if (Object.keys(nuoviErrori).length > 0) {
  setErrori(nuoviErrori);
  setMessaggio("Compila i campi obbligatori evidenziati.");
  return;
}

setErrori({});

if (!privacyAccettata) {
  setMessaggio("Devi accettare la Privacy Policy per inviare la richiesta.");
  return;
}

setMessaggio("Invio richiesta in corso...");
setMessaggioSuccesso("");
  
    const form = e.currentTarget;
    const dati = new FormData(form);

    allegati.forEach((file) => {
      dati.append("allegati", file);
    });
  
    dati.set("tipoCliente", tipoCliente);
    dati.set("nome", formData.nome);
    dati.set("cognome", formData.cognome);
    dati.set("indirizzo", formData.indirizzo);
    dati.set("telefono", formData.telefono);
    dati.set("email", formData.email);
    dati.set("ragioneSociale", formData.ragioneSociale);
    dati.set("partitaIva", formData.partitaIva);
    dati.set("descrizione", formData.descrizione);
  
    const totalSize = allegati.reduce((sum, file) => sum + file.size, 0);
    const maxSize = 25 * 1024 * 1024;
  
    if (totalSize > maxSize) {
      setMessaggio(
        "File troppo pesanti. La dimensione massima totale consentita è 25 MB."
      );
      return;
    }
  
    const response = await fetch("/api/preventivo", {
      method: "POST",
      body: dati,
    });
  
    if (response.ok) {
      setMessaggio("");
      setMessaggioSuccesso("Richiesta inviata correttamente.");
    
      setFormData(statoInizialeForm);
    
      setAllegati([]);
    
      setTipoCliente("Privato");
    
      setErrori({});
    } else {
      setMessaggio("Errore durante l'invio. Controlla gli allegati e riprova.");
    }

  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/35 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3 px-4 py-3 md:grid md:grid-cols-[auto_1fr_auto] md:items-center md:px-8">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="rounded-2xl bg-white/10 p-2 backdrop-blur-sm">
  <img
    src="/images/logo-tecnologie-evolutive.png"
    alt="Logo Tecnologie Evolutive"
    className="h-14 w-auto md:h-20"
  />
</div>
            <div className="block">
  <p className="text-lg font-black md:text-xl">
    Tecnologie Evolutive
  </p>

  <p className="hidden text-sm text-slate-300 sm:block">
    Fotovoltaico · Accumulo · Termo Impiantistica
  </p>
</div>
          </div>

          <nav className="flex gap-3 text-sm font-bold text-white md:justify-center md:gap-5 md:text-base">
            <a
              href="#servizi"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-center leading-tight hover:bg-white/20 md:px-7 md:py-3"
            >
              I nostri servizi
            </a>
            <a
              href="/lavori"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-center leading-tight hover:bg-white/20 md:px-7 md:py-3"
            >
              I nostri lavori
            </a>
            <a
  href="/lavora-con-noi"
  className="hidden md:inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-center leading-tight hover:bg-white/20 md:px-7 md:py-3"
>
  Lavora con noi
</a>
          </nav>

          <a
            href="#preventivo"
            className="hidden rounded-full bg-lime-400 px-6 py-3 font-black text-slate-950 hover:bg-lime-300 md:block"
          >
            Richiedi preventivo
          </a>
        </div>
      </header>

      <section className="relative min-h-[820px] overflow-hidden bg-slate-950 md:h-screen md:min-h-[760px]">
        <img
          src="/images/fotovoltaico-roma-casa-accumulatore.png"
          alt="Fotovoltaico Roma con accumulatore, condizionatori e impianto energia green"
          className="absolute inset-0 h-full w-full object-cover object-[68%_center] md:object-cover md:object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/25" />

        <div className="relative z-10 mx-auto flex min-h-[820px] max-w-7xl items-center px-6 pb-8 pt-32 md:h-full md:min-h-0 md:pb-12 md:pt-32">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-black leading-tight tracking-tight md:text-7xl">
              Energia green per la tua casa, oggi e domani.
            </h1>

            <div className="custom-scrollbar mt-5 max-h-[230px] max-w-3xl overflow-y-auto rounded-[2rem] border border-white/5 bg-black/10 p-5 text-sm leading-7 text-slate-100 shadow-xl backdrop-blur-[2px] md:mt-7 md:max-h-[330px] md:p-6 md:text-lg md:leading-8">
              <div className="space-y-4 pr-3">
                {descrizioneSocieta.map((testo) => (
                  <p key={testo}>{testo}</p>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap md:mt-8 md:gap-6">
  <a
    href="#preventivo"
    className="rounded-full bg-lime-400 px-7 py-3 text-center font-black text-slate-950 hover:bg-lime-300 md:px-8 md:py-4"
  >
    Ottieni un preventivo
  </a>

  <a
    href="/lavori"
    className="rounded-full border border-white/30 bg-white/10 px-7 py-3 text-center font-bold text-white backdrop-blur hover:bg-white/20 md:px-8 md:py-4"
  >
    Guarda i nostri lavori
  </a>

  <a
    href="/lavora-con-noi"
    className="rounded-full bg-lime-400 px-7 py-3 text-center font-black text-slate-950 hover:bg-lime-300 md:px-8 md:py-4"
  >
    Invia candidatura
  </a>
</div>
          </div>
        </div>
      </section>

      <section
        id="servizi"
        className="scroll-mt-32 mx-auto max-w-7xl px-6 py-24"
      >
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-lime-300">
          I nostri servizi
        </p>
        <h2 className="mt-4 max-w-4xl text-4xl font-black md:text-5xl">
          Fotovoltaico, accumulo, climatizzazione, caldaie e VMC.
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Service
            icon={<Sun />}
            title="Impianti fotovoltaici Roma"
            text="Installazione di pannelli fotovoltaici per case, ville, condomìni, aziende e locali commerciali a Roma e provincia."
          />
          <Service
            icon={<BatteryCharging />}
            title="Fotovoltaico con accumulo"
            text="Accumulatori per usare l’energia prodotta durante il giorno anche la sera, la notte o nei momenti di maggiore consumo."
          />
          <Service
            icon={<ThermometerSun />}
            title="Clima, caldaie e VMC"
            text="Condizionatori, pompe di calore, caldaie, impianti termici e ventilazione meccanica controllata."
          />
        </div>
      </section>

      <section className="bg-white py-24 text-slate-950">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">
            Recensioni Google
          </p>
          <h2 className="mt-4 text-4xl font-black">
            Qualità e affidabilità certificate da chi ci ha già scelto. Esplora
            le nostre recensioni.
          </h2>

          <div className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <a
              href={googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[2rem] border border-slate-200 bg-slate-50 p-7 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-2xl font-black">
                    Tecnologie Evolutive S.r.l.
                  </p>
                  <p className="mt-2 text-slate-500">
                    Installatore di impianti di condizionamento a Roma
                  </p>
                </div>
                <ExternalLink className="h-6 w-6 text-slate-400" />
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="text-3xl font-black">5,0</span>
                <div className="flex text-yellow-500">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className="h-6 w-6 fill-current" />
                  ))}
                </div>
                <span className="font-bold text-blue-700">151 recensioni</span>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <span className="rounded-full border border-slate-200 bg-white px-5 py-3 font-bold">
                  Indicazioni
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-5 py-3 font-bold">
                  Recensioni
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-5 py-3 font-bold">
                  +3
                </span>
              </div>

              <p className="mt-6 text-sm leading-6 text-slate-500">
                Clicca per aprire la scheda Google e leggere le recensioni reali.
              </p>
            </a>

            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-7">
              <div className="flex items-start gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-lime-400 text-slate-950">
                  <BatteryCharging className="h-8 w-8" />
                </div>

                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">
                    Incentivi Statali
                  </p>

                  <h3 className="mt-2 text-2xl font-black">
                    Risparmia grazie alle agevolazioni disponibili.
                  </h3>

                  <p className="mt-4 leading-7 text-slate-600">
                    Tecnologie Evolutive ti supporta nella valutazione delle
                    agevolazioni disponibili per interventi di efficientamento
                    energetico, fotovoltaico, accumulo, climatizzazione, pompe
                    di calore e ventilazione meccanica controllata.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 font-semibold">
                  Fotovoltaico e sistemi di accumulo
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 font-semibold">
                  Pompe di calore e climatizzazione
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 font-semibold">
                  Caldaie ad alta efficienza
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 font-semibold">
                  Ventilazione Meccanica Controllata
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-lime-200 bg-lime-50 p-5">
                <p className="font-bold text-emerald-900">
                  Consulenza dedicata
                </p>

                <p className="mt-2 text-sm leading-6 text-emerald-900">
                  Durante il sopralluogo e la fase di preventivazione
                  verifichiamo insieme le opportunità disponibili e la
                  documentazione necessaria. Le agevolazioni possono variare nel
                  tempo e saranno sempre valutate in base al caso specifico.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="preventivo"
        className="scroll-mt-32 mx-auto max-w-7xl px-6 py-24"
      >
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-lime-300">
          Ottieni un preventivo
        </p>
        <h2 className="mt-4 text-4xl font-black">
          Invia una richiesta con foto o video.
        </h2>

        <form
          onSubmit={inviaPreventivo}
          noValidate
          className="mt-10 grid gap-6 rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 md:p-10"
        >
          <div className="grid gap-5 md:grid-cols-2">
          <Field
  icon={<User />}
  label="Nome"
  placeholder="Mario"
  value={formData.nome}
  onChange={(value) => aggiornaCampo("nome", value)}
  required
  errore={errori.nome}
/>
            <Field
              icon={<User />}
              label="Cognome"
              placeholder="Rossi"
              value={formData.cognome}
              onChange={(value) => aggiornaCampo("cognome", value)}
              required
              errore={errori.cognome}
            />
            <Field
              icon={<MapPin />}
              label="Indirizzo lavoro"
              placeholder="Via, numero civico, città"
              value={formData.indirizzo}
              onChange={(value) => aggiornaCampo("indirizzo", value)}
            />
            <Field
              icon={<Phone />}
              label="Telefono"
              placeholder="+39 333 000 0000"
              value={formData.telefono}
              onChange={(value) => aggiornaCampo("telefono", value)}
              required
              errore={errori.telefono}
            />
            <Field
              icon={<Mail />}
              label="Email"
              placeholder="nome@email.it"
              value={formData.email}
              onChange={(value) => aggiornaCampo("email", value)}
              required
              errore={errori.email}
            />

            <fieldset>
              <legend className="mb-2 block text-sm font-medium text-slate-200">
                Tipo cliente
              </legend>

              <div className="grid grid-cols-2 gap-3">
                {["Privato", "Società"].map((tipo) => (
                  <label
                    key={tipo}
                    className={`cursor-pointer rounded-2xl border px-4 py-3 text-center font-semibold transition ${
                      tipoCliente === tipo
                        ? "border-lime-300 bg-lime-300 text-slate-950"
                        : "border-white/15 bg-white/5 text-white hover:bg-white/10"
                    }`}
                  >
                    <input
                      type="radio"
                      name="tipoCliente"
                      value={tipo}
                      checked={tipoCliente === tipo}
                      onChange={() => setTipoCliente(tipo)}
                      className="sr-only"
                    />
                    {tipo}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          {tipoCliente === "Società" && (
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                icon={<Building2 />}
                label="Ragione sociale"
                placeholder="Nome società"
                value={formData.ragioneSociale}
                onChange={(value) => aggiornaCampo("ragioneSociale", value)}
              />
              <Field
                icon={<Building2 />}
                label="Partita IVA"
                placeholder="00000000000"
                value={formData.partitaIva}
                onChange={(value) => aggiornaCampo("partitaIva", value)}
              />
            </div>
          )}

          <textarea
            rows={5}
            value={formData.descrizione}
            onChange={(e) => aggiornaCampo("descrizione", e.target.value)}
            placeholder="Descrivi il lavoro: fotovoltaico, accumulo, condizionatori, caldaia, VMC, consumi, tipo di tetto..."
            className={`w-full rounded-2xl border px-4 py-3 text-white outline-none ${
              errori.descrizione
                ? "border-red-500 bg-red-500/10"
                : "border-white/15 bg-white/5"
            }`}
          />

<div className="rounded-3xl border border-dashed border-lime-300/40 bg-lime-300/10 p-8 text-center">
  <Upload className="mx-auto h-10 w-10 text-lime-300" />

  <p className="mt-4 text-lg font-bold">Allegati</p>

  <input
    type="file"
    accept="image/*,video/*,.pdf"
    className="hidden"
    id="allegati-input"
    onChange={(e) => {
      const nuoviFile = Array.from(e.target.files || []);

      setAllegati((prev) => [...prev, ...nuoviFile]);

      e.currentTarget.value = "";
    }}
  />

  <label
    htmlFor="allegati-input"
    className="mt-5 inline-flex cursor-pointer rounded-full bg-lime-400 px-6 py-3 font-black text-slate-950 hover:bg-lime-300"
  >
    Aggiungi allegato
  </label>

  <div className="mt-6 space-y-3 text-left">
    {allegati.map((file, index) => (
      <div
        key={`${file.name}-${index}`}
        className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
      >
        <div className="min-w-0">
        <p className="max-w-full truncate break-all font-semibold">{file.name}</p>
          <p className="text-xs text-slate-400">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setAllegati((prev) => prev.filter((_, i) => i !== index))
          }
          className="shrink-0 rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white"
        >
          Elimina
        </button>
      </div>
    ))}
  </div>

  <p className="mt-4 text-sm leading-6 text-lime-100">
    Puoi aggiungere più allegati: foto, video o PDF.
    Dimensione massima totale: 25 MB.
  </p>
</div>

{messaggio && (
  <p className="rounded-2xl border border-lime-300/30 bg-lime-300/10 p-4 text-sm font-semibold text-lime-200">
    {messaggio}
  </p>
)}

{messaggioSuccesso && (
  <p className="rounded-2xl border border-green-500/40 bg-green-500/10 p-4 text-sm font-semibold text-green-300">
    {messaggioSuccesso}
  </p>
)}

<div className="flex items-start gap-3">
  <input
    type="checkbox"
    id="privacy-preventivo"
    checked={privacyAccettata}
    onChange={(e) => setPrivacyAccettata(e.target.checked)}
    className="mt-1 h-4 w-4"
  />

  <label
    htmlFor="privacy-preventivo"
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

          <button
            type="submit"
            className="w-fit rounded-full bg-lime-400 px-8 py-4 font-black text-slate-950 hover:bg-lime-300"
          >
            Invia richiesta <ArrowRight className="ml-2 inline h-5 w-5" />
          </button>
        </form>
      </section>

      <footer className="border-t border-white/10 bg-black px-6 py-10 text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          <div>
            <p className="font-black text-white">Tecnologie Evolutive S.R.L.</p>
            <p className="mt-2 text-sm">
              Fotovoltaico e termo impiantistica a Roma.
            </p>
          </div>
          <p>
            Via Ispica, 65 - 00133 Roma
            <br />
            P.IVA 11404931005
          </p>
          <p className="md:text-right">
            Tel: 3928450625
            <br />
            Email: tecnologieevolutive@libero.it
          </p>
        </div>
      </footer>
    </main>
  );
}

function Service({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 transition hover:-translate-y-1 hover:bg-white/[0.09]">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400/15 text-lime-300 [&>svg]:h-7 [&>svg]:w-7">
        {icon}
      </div>
      <h3 className="text-xl font-black">{title}</h3>
      <p className="mt-3 leading-7 text-slate-300">{text}</p>
    </div>
  );
}

function Field({
  icon,
  label,
  placeholder,
  value,
  onChange,
  required = false,
  errore = false,
}: {
  icon: ReactNode;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  errore?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-200">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 [&>svg]:h-5 [&>svg]:w-5">
          {icon}
        </div>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-2xl border py-3 pl-12 pr-4 text-white outline-none ${
            errore
              ? "border-red-500 bg-red-500/10"
              : "border-white/15 bg-white/5"
          }`}
        />
      </div>
    </div>
  );
}