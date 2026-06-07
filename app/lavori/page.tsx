import Link from "next/link";

import {
    Sun,
    Wind,
    Flame,
    Snowflake,
    ImagePlus,
    Video,
    ArrowLeft,
  } from "lucide-react";

  import { supabase } from "@/lib/supabase";
  export const dynamic = "force-dynamic";
  
  
  const categories = [
    {
      title: "Installazioni fotovoltaico",
      icon: <Sun />,
      description:
        "Galleria dedicata agli impianti fotovoltaici realizzati: pannelli, inverter, accumulatori e dettagli dell’installazione.",
    },
    {
      title: "Installazioni condizionatori",
      icon: <Snowflake />,
      description:
        "Foto, video e descrizioni di installazioni di condizionatori per abitazioni, uffici e locali commerciali.",
    },
    {
      title: "Installazioni caldaie",
      icon: <Flame />,
      description:
        "Sezione dedicata alle installazioni e sostituzioni caldaie, con descrizione tecnica del lavoro eseguito.",
    },
    {
      title: "Installazioni ventilazione meccanica controllata",
      icon: <Wind />,
      description:
        "Lavori di VMC con immagini, video, descrizioni e dettagli delle soluzioni installate.",
    },
  ];
  
  export default async function LavoriPage() {
    const { data } = await supabase
  .from("lavori")
  .select("*")
  .order("created_at", { ascending: false });

const lavori = data ?? [];
  

    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="relative min-h-[520px] overflow-hidden">
          <img
            src="/images/fotovoltaico-roma-casa-accumulatore.png"
            alt="Sfondo lavori Tecnologie Evolutive"
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-slate-950/75" />
  
          <div className="relative z-10 mx-auto max-w-7xl px-6 py-10">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 font-bold hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
              Torna alla homepage
            </a>
  
            <div className="mt-24 max-w-4xl">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-lime-300">
                I nostri lavori
              </p>
              <h1 className="mt-4 text-5xl font-black leading-tight md:text-7xl">
                Portfolio lavori realizzati.
              </h1>
              <p className="mt-6 text-xl leading-9 text-slate-200">
                In questa pagina verranno inseriti immagini, video e descrizioni
                degli interventi effettuati da Tecnologie Evolutive.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pt-12">
  <h2 className="text-3xl font-black">
    Lavori caricati da amministrazione
  </h2>

  <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {lavori.map((lavoro: any) => (
    
      <Link
      href={`/lavori/${lavoro.id}`}
      key={lavoro.id}
      className="block rounded-3xl border border-white/10 bg-white/[0.07] p-6 transition hover:border-lime-300/40 hover:bg-white/[0.10]"
    >
        {JSON.parse(lavoro.immagini || "[]")[0] && (
  <img
    src={JSON.parse(lavoro.immagini || "[]")[0]}
    alt={lavoro.titolo}
    className="h-44 w-full rounded-2xl object-cover md:h-48"
  />
)}

<h3 className="mt-5 text-2xl font-black">
  {lavoro.titolo}
</h3>

<p className="mt-2 text-lime-300">
  {lavoro.categoria}
</p>

      </Link>
    ))}
  </div>
</section>

  
      </main>
    );
  }
  
  function Placeholder({ type }: { type: "image" | "video" }) {
    return (
      <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-6">
        {type === "image" ? (
          <ImagePlus className="h-8 w-8 text-lime-300" />
        ) : (
          <Video className="h-8 w-8 text-lime-300" />
        )}
  
        <p className="mt-5 font-black">
          {type === "image" ? "Spazio foto" : "Spazio video"}
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Qui potrai inserire materiale reale del lavoro, descrizione, zona e
          dettagli tecnici.
        </p>
      </div>
    );
  }