import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import MediaGallery from "./MediaGallery";

export const dynamic = "force-dynamic";

export default async function LavoroDettaglioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: lavoro } = await supabase
    .from("lavori")
    .select("*")
    .eq("id", id)
    .single();

  if (!lavoro) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p>Lavoro non trovato.</p>
      </main>
    );
  }

  const immagini = JSON.parse(lavoro.immagini || "[]");
  const video = JSON.parse(lavoro.video || "[]");

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/lavori"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 font-bold hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
          Torna ai lavori
        </Link>

        <p className="mt-12 text-sm font-bold uppercase tracking-[0.25em] text-lime-300">
          {lavoro.categoria}
        </p>

        <h1 className="mt-4 text-4xl font-black md:text-6xl">
          {lavoro.titolo}
        </h1>

        <p className="mt-6 text-lg leading-8 text-slate-300">
          {lavoro.descrizione}
        </p>

        <MediaGallery immagini={immagini} video={video} />

        
      </div>
    </main>
  );
}