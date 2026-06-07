"use client";

import { useState } from "react";

export default function MediaGallery({
  immagini,
  video,
}: {
  immagini: string[];
  video: string[];
}) {
  const [immagineAperta, setImmagineAperta] = useState<string | null>(null);
  const [videoAperto, setVideoAperto] = useState<string | null>(null);

  return (
    <>
      {immagini.length > 0 && (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {immagini.map((url) => (
            <button
              key={url}
              type="button"
              onClick={() => setImmagineAperta(url)}
              className="rounded-3xl border border-white/10 bg-white/[0.07] p-3"
            >
              <img
                src={url}
                alt="Foto lavoro"
                className="h-52 w-full rounded-2xl object-contain"
              />
            </button>
          ))}
        </div>
      )}

      {video.length > 0 && (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {video.map((url) => (
            <button
              key={url}
              type="button"
              onClick={() => setVideoAperto(url)}
              className="rounded-3xl border border-white/10 bg-white/[0.07] p-3 text-left"
            >
              <video
                src={url}
                muted
                className="h-52 w-full rounded-2xl object-cover"
              />

              <p className="mt-3 font-bold text-lime-300">
                Apri video
              </p>
            </button>
          ))}
        </div>
      )}

      {immagineAperta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <button
            type="button"
            onClick={() => setImmagineAperta(null)}
            className="absolute right-5 top-5 rounded-full bg-white px-4 py-2 font-black text-slate-950"
          >
            Chiudi
          </button>

          <img
            src={immagineAperta}
            alt="Foto ingrandita"
            className="max-h-[85vh] max-w-[95vw] rounded-3xl object-contain"
          />
        </div>
      )}

      {videoAperto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <button
            type="button"
            onClick={() => setVideoAperto(null)}
            className="absolute right-5 top-5 rounded-full bg-white px-4 py-2 font-black text-slate-950"
          >
            Chiudi
          </button>

          <video
            src={videoAperto}
            controls
            autoPlay
            className="max-h-[85vh] max-w-[95vw] rounded-3xl"
          />
        </div>
      )}
    </>
  );
}