"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nuovaPassword, setNuovaPassword] = useState("");
const [modalitaResetPassword, setModalitaResetPassword] = useState(false);
const [autorizzato, setAutorizzato] = useState(false);
const [errorePassword, setErrorePassword] = useState("");
const [tipoMessaggioLogin, setTipoMessaggioLogin] = useState<"errore" | "successo">("errore");
const [mostraPassword, setMostraPassword] = useState(false);

  const [titolo, setTitolo] = useState("");
  const [categoria, setCategoria] = useState("fotovoltaico");
  const [descrizione, setDescrizione] = useState("");
  const [lavoroInModifica, setLavoroInModifica] = useState<any | null>(null);

  const [immagini, setImmagini] = useState<File[]>([]);
const [video, setVideo] = useState<File[]>([]);
const [messaggio, setMessaggio] = useState("");
const [lavori, setLavori] = useState<any[]>([]);
const [resetFileInput, setResetFileInput] = useState(0);
const [fileDaCancellare, setFileDaCancellare] = useState<string[]>([]);

async function caricaLavori() {
    const { data, error } = await supabase
      .from("lavori")
      .select("*")
      .order("created_at", { ascending: false });
  
    if (error) {
      setMessaggio(`Errore caricamento lavori: ${error.message}`);
      return;
    }
  
    setLavori(data || []);
  }

  async function loginAdmin() {
    setErrorePassword("");
  
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
        setTipoMessaggioLogin("errore");
        setErrorePassword("Email o password non corretti");
        return;
      }
  
    setAutorizzato(true);
  }

  async function recuperaPassword() {
    if (!email) {
      setErrorePassword("Inserisci prima la tua email.");
      return;
    }
  
    const { error } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/admin`,
      }
    );
  
    if (error) {
      setErrorePassword("Limite tentativi raggiunto, riprova tra 60 minuti");
      return;
    }

    setTipoMessaggioLogin("successo");
  
    setErrorePassword(
      "Ti abbiamo inviato una email per reimpostare la password."
    );
  }

  async function salvaNuovaPassword() {
    if (!nuovaPassword) {
      setTipoMessaggioLogin("errore");
      setErrorePassword("Inserisci la nuova password.");
      return;
    }
  
    const { error } = await supabase.auth.updateUser({
      password: nuovaPassword,
    });
  
    if (error) {
      setTipoMessaggioLogin("errore");
      setErrorePassword("Errore durante il cambio password.");
      return;
    }
  
    setTipoMessaggioLogin("successo");
    setErrorePassword("Password aggiornata correttamente.");
  
    setNuovaPassword("");
    setModalitaResetPassword(false);
  }

  function preparaModifica(lavoro: any) {
    setLavoroInModifica(lavoro);
    setTitolo(lavoro.titolo || "");
    setCategoria(lavoro.categoria || "fotovoltaico");
    setDescrizione(lavoro.descrizione || "");
    setMessaggio("Stai modificando un lavoro esistente.");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function mediaEsistenti(campo: string) {
    if (!lavoroInModifica) {
      return [];
    }
  
    try {
      return JSON.parse(campo || "[]");
    } catch {
      return [];
    }
  }

  function percorsoStorageDaUrl(url: string) {
    const marker = "/storage/v1/object/public/lavori/";
    const parti = url.split(marker);
  
    if (!parti[1]) {
      return "";
    }
  
    return decodeURIComponent(parti[1]);
  }

  function eliminaImmagine(urlDaEliminare: string) {
    if (!lavoroInModifica) {
      return;
    }
  
    const percorso = percorsoStorageDaUrl(urlDaEliminare);
  
    if (percorso) {
      setFileDaCancellare((prev) => [...prev, percorso]);
    }
  
    const immagini = mediaEsistenti(
      lavoroInModifica.immagini
    ).filter((url: string) => url !== urlDaEliminare);
  
    setLavoroInModifica({
      ...lavoroInModifica,
      immagini: JSON.stringify(immagini),
    });
  }

  function eliminaVideo(urlDaEliminare: string) {
    if (!lavoroInModifica) {
      return;
    }
  
    const percorso = percorsoStorageDaUrl(urlDaEliminare);
  
    if (percorso) {
      setFileDaCancellare((prev) => [...prev, percorso]);
    }
  
    const video = mediaEsistenti(
      lavoroInModifica.video
    ).filter((url: string) => url !== urlDaEliminare);
  
    setLavoroInModifica({
      ...lavoroInModifica,
      video: JSON.stringify(video),
    });
  }
  
  async function eliminaLavoro(id: number) {
    const conferma = window.confirm(
      "Vuoi eliminare questo lavoro e tutti i file collegati?"
    );
  
    if (!conferma) {
      return;
    }
  
    const lavoro = lavori.find((item) => item.id === id);
  
    if (lavoro) {
      const immagini = JSON.parse(lavoro.immagini || "[]");
      const video = JSON.parse(lavoro.video || "[]");
  
      const fileStorage = [...immagini, ...video]
        .map((url: string) => percorsoStorageDaUrl(url))
        .filter(Boolean);
  
      if (fileStorage.length > 0) {
        console.log("FILE DA ELIMINARE:", fileStorage);
        console.log("FILE STORAGE:", fileStorage);

        const { error: storageError } = await supabase.storage
          .from("lavori")
          .remove(fileStorage);
  
        if (storageError) {
          setMessaggio(`Errore cancellazione file: ${storageError.message}`);
          return;
        }
      }
    }
  
    const { error } = await supabase
      .from("lavori")
      .delete()
      .eq("id", id);
  
    if (error) {
      setMessaggio(`Errore eliminazione: ${error.message}`);
      return;
    }
  
    setMessaggio("Lavoro e file collegati eliminati correttamente.");
  
    caricaLavori();
  }

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setModalitaResetPassword(true);
        setAutorizzato(false);
      }
    });
  
    async function controllaSessione() {
      const { data } = await supabase.auth.getSession();
  
      if (data.session) {
        setAutorizzato(true);
      }
    }
  
    controllaSessione();
  
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  useEffect(() => {
    if (autorizzato) {
      caricaLavori();
    }
  }, [autorizzato]);

async function salvaLavoro() {
    setMessaggio("Salvataggio in corso...");
  
    const immaginiUrl: string[] = [];
  
    for (const file of immagini) {
      const nomeFile = `${Date.now()}-${file.name}`;
  
      const { error: uploadError } = await supabase.storage
        .from("lavori")
        .upload(`immagini/${nomeFile}`, file);
  
      if (uploadError) {
        setMessaggio(`Errore upload immagine: ${uploadError.message}`);
        return;
      }
  
      const { data } = supabase.storage
        .from("lavori")
        .getPublicUrl(`immagini/${nomeFile}`);
  
      immaginiUrl.push(data.publicUrl);
    }

    const videoUrl: string[] = [];

for (const file of video) {
  const nomeFile = `${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("lavori")
    .upload(`video/${nomeFile}`, file);

  if (uploadError) {
    setMessaggio(`Errore upload video: ${uploadError.message}`);
    return;
  }

  const { data } = supabase.storage
    .from("lavori")
    .getPublicUrl(`video/${nomeFile}`);

  videoUrl.push(data.publicUrl);
}
  
let error;

if (lavoroInModifica) {
  const immaginiEsistenti = JSON.parse(lavoroInModifica.immagini || "[]");
  const videoEsistenti = JSON.parse(lavoroInModifica.video || "[]");

  const risultato = await supabase
    .from("lavori")
    .update({
      titolo,
      categoria,
      descrizione,
      immagini: JSON.stringify([...immaginiEsistenti, ...immaginiUrl]),
      video: JSON.stringify([...videoEsistenti, ...videoUrl]),
    })
    .eq("id", lavoroInModifica.id);

  error = risultato.error;
} else {
  const risultato = await supabase
    .from("lavori")
    .insert([
      {
        titolo,
        categoria,
        descrizione,
        immagini: JSON.stringify(immaginiUrl),
        video: JSON.stringify(videoUrl),
      },
    ]);

  error = risultato.error;
}

if (error) {
  setMessaggio(`Errore: ${error.message}`);
  return;
}

if (fileDaCancellare.length > 0) {
    const { error: storageError } = await supabase.storage
      .from("lavori")
      .remove(fileDaCancellare);
  
    if (storageError) {
      setMessaggio(`Errore cancellazione file: ${storageError.message}`);
      return;
    }
  }


setMessaggio(
  lavoroInModifica
    ? "Lavoro aggiornato correttamente."
    : "Lavoro salvato nel database con immagini e video."
);

setTitolo("");
setCategoria("fotovoltaico");
setDescrizione("");
setImmagini([]);
setVideo([]);
setLavoroInModifica(null);
setFileDaCancellare([]);

setResetFileInput((prev) => prev + 1);

await caricaLavori();
  }

  if (modalitaResetPassword) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
        <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.07] p-8">
          <h1 className="text-3xl font-black text-white">
            Reimposta password
          </h1>
  
          <p className="mt-3 text-slate-300">
            Inserisci la nuova password per l&apos;area amministrazione.
          </p>
  
          <div className="relative mt-6">
  <input
    type={mostraPassword ? "text" : "password"}
    value={nuovaPassword}
    onChange={(e) => setNuovaPassword(e.target.value)}
    placeholder="Nuova password"
    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 pr-14 text-white outline-none"
  />

  <button
    type="button"
    onClick={() => setMostraPassword(!mostraPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white"
  >
    {mostraPassword ? "🙈" : "👁️"}
  </button>
</div>
  
          {errorePassword && (
            <p
              className={`mt-3 text-sm font-semibold ${
                tipoMessaggioLogin === "successo"
                  ? "text-lime-300"
                  : "text-red-400"
              }`}
            >
              {errorePassword}
            </p>
          )}
  
          <button
            type="button"
            onClick={salvaNuovaPassword}
            className="mt-6 w-full rounded-full bg-lime-400 px-6 py-3 font-black text-slate-950 hover:bg-lime-300"
          >
            Salva nuova password
          </button>
        </div>
      </main>
    );
  }

  if (!autorizzato) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
        <form
  onSubmit={(e) => {
    e.preventDefault();
    loginAdmin();
  }}
  className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.07] p-8"
>
          <h1 className="text-3xl font-black text-white">
            Accesso amministrazione
          </h1>
  
          <p className="mt-3 text-slate-300">
            Inserisci la password per accedere.
          </p>

          <input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Email"
  className="mt-6 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none"
/>
  
<div className="relative mt-6">
  <input
    type={mostraPassword ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Password"
    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 pr-14 text-white outline-none"
  />

  <button
    type="button"
    onClick={() => setMostraPassword(!mostraPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white"
  >
    {mostraPassword ? "🙈" : "👁️"}
  </button>
</div>
  
  {errorePassword && (
  <p
    className={`mt-3 text-sm font-semibold ${
      tipoMessaggioLogin === "successo"
        ? "text-lime-300"
        : "text-red-400"
    }`}
  >
    {errorePassword}
  </p>
)}
  
  <button
  type="submit"
  className="mt-6 w-full rounded-full bg-lime-400 px-6 py-3 font-black text-slate-950 hover:bg-lime-300"
>
  Accedi
</button>

<button
  type="button"
  onClick={recuperaPassword}
  className="mt-4 w-full rounded-full border border-white/20 bg-white/10 px-6 py-3 font-bold text-white hover:bg-white/20"
>
  Recupera password
  </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-black">
          Area amministrazione portfolio
        </h1>

        <button
  type="button"
  onClick={async () => {
    await supabase.auth.signOut();
    setAutorizzato(false);
    setEmail("");
    setPassword("");
  }}
  className="mt-5 rounded-full border border-white/20 bg-white/10 px-6 py-3 font-bold text-white hover:bg-white/20"
>
  Esci
</button>

        <p className="mt-4 text-slate-300">
          Da qui potrai caricare foto, video e descrizioni dei lavori.
        </p>

        <form className="mt-10 grid gap-6 rounded-[2rem] border border-white/10 bg-white/[0.07] p-6">
          <div>
            <label className="mb-2 block text-sm font-bold">Titolo lavoro</label>
            <input
              value={titolo}
              onChange={(e) => setTitolo(e.target.value)}
              placeholder="Esempio: Impianto fotovoltaico con accumulo - Roma"
              className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">Categoria</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-slate-900 px-4 py-3 text-white outline-none"
            >
              <option value="fotovoltaico">Fotovoltaico</option>
              <option value="condizionatori">Condizionatori</option>
              <option value="caldaie">Caldaie</option>
              <option value="vmc">Ventilazione Meccanica Controllata</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">Descrizione</label>
            <textarea
              rows={5}
              value={descrizione}
              onChange={(e) => setDescrizione(e.target.value)}
              placeholder="Descrivi il lavoro eseguito..."
              className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none"
            />
          </div>

          {lavoroInModifica && (
  <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
    <p className="font-black text-lime-300">
      Media già caricati
    </p>

    {mediaEsistenti(lavoroInModifica.immagini).length > 0 && (
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {mediaEsistenti(lavoroInModifica.immagini).map((url: string) => (
  <div key={url}>
    <img
      src={url}
      alt="Immagine lavoro"
      className="h-28 w-full rounded-2xl object-cover"
    />

    <button
      type="button"
      onClick={() => eliminaImmagine(url)}
      className="mt-2 w-full rounded-full bg-red-500 px-3 py-2 text-xs font-bold text-white hover:bg-red-400"
    >
      Elimina foto
    </button>
  </div>
))}

      </div>
    )}

    {mediaEsistenti(lavoroInModifica.video).length > 0 && (
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {mediaEsistenti(lavoroInModifica.video).map((url: string) => (
  <div key={url}>
    <video
      src={url}
      controls
      className="w-full rounded-2xl"
    />

    <button
      type="button"
      onClick={() => eliminaVideo(url)}
      className="mt-2 w-full rounded-full bg-red-500 px-3 py-2 text-xs font-bold text-white hover:bg-red-400"
    >
      Elimina video
    </button>
  </div>
))}
      </div>
    )}
  </div>
)}

          <div>
  <label className="mb-2 block text-sm font-bold">
    Immagini
  </label>

  <input
  key={`immagini-${resetFileInput}`}
  type="file"
  accept="image/*"
  multiple
  onChange={(e) => {
    setImmagini(Array.from(e.target.files || []));
  }}
  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white"
/>
{immagini.length > 0 && (
  <p className="mt-2 text-sm text-lime-300">
    {immagini.length} immagine/i selezionata/e
  </p>
)}
</div>

<div>
  <label className="mb-2 block text-sm font-bold">
    Video
  </label>

  <input
  key={`video-${resetFileInput}`}
  type="file"
  accept="video/*"
  multiple
  onChange={(e) => {
    setVideo(Array.from(e.target.files || []));
  }}
  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white"
/>

{video.length > 0 && (
  <p className="mt-2 text-sm text-lime-300">
    {video.length} video selezionato/i
  </p>
)}
</div>

<div className="flex flex-wrap gap-3">
  <button
    type="button"
    onClick={salvaLavoro}
    className="w-fit rounded-full bg-lime-400 px-8 py-4 font-black text-slate-950 hover:bg-lime-300"
  >
    {lavoroInModifica ? "Aggiorna lavoro" : "Salva lavoro"}
  </button>

  {lavoroInModifica && (
    <button
      type="button"
      onClick={() => {
        setLavoroInModifica(null);
        setTitolo("");
        setCategoria("fotovoltaico");
        setDescrizione("");
        setImmagini([]);
        setVideo([]);
        setResetFileInput((prev) => prev + 1);
        setMessaggio("");
      }}
      className="rounded-full border border-white/20 bg-white/10 px-8 py-4 font-black text-white hover:bg-white/20"
    >
      Annulla modifica
    </button>
  )}
</div>
{messaggio && (
  <p className="rounded-2xl border border-lime-300/30 bg-lime-300/10 p-4 text-sm font-semibold text-lime-200">
    {messaggio}
  </p>
)}
        </form>

        <div className="mt-12">
  <h2 className="text-3xl font-black">
    Lavori caricati
  </h2>

  <div className="mt-6 grid gap-4">
    {lavori.map((lavoro) => (
      <div
        key={lavoro.id}
        className="rounded-2xl border border-white/10 bg-white/[0.07] p-5"
      >
        <h3 className="text-xl font-black">
          {lavoro.titolo}
        </h3>

        <p className="mt-2 text-lime-300">
          {lavoro.categoria}
        </p>

        <p className="mt-3 text-slate-300">
          {lavoro.descrizione}
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
  <button
    type="button"
    onClick={() => preparaModifica(lavoro)}
    className="rounded-full bg-lime-400 px-5 py-2 text-sm font-bold text-slate-950 hover:bg-lime-300"
  >
    Modifica
  </button>

  <button
    type="button"
    onClick={() => eliminaLavoro(lavoro.id)}
    className="rounded-full bg-red-500 px-5 py-2 text-sm font-bold text-white hover:bg-red-400"
  >
    Elimina
  </button>
</div>

      </div>
    ))}
  </div>
</div>

      </div>
    </main>
  );
}