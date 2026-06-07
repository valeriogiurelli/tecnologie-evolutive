import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const nome = String(formData.get("nome") || "");
    const cognome = String(formData.get("cognome") || "");
    const dataNascita = String(formData.get("dataNascita") || "");
    const email = String(formData.get("email") || "");
    const telefono = String(formData.get("telefono") || "");
    const messaggio = String(formData.get("messaggio") || "");
    const cv = formData.get("cv");

    if (!(cv instanceof File)) {
      return Response.json(
        { ok: false, error: "CV mancante" },
        { status: 400 }
      );
    }

    const arrayBuffer = await cv.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await resend.emails.send({
      from: "Tecnologie Evolutive <candidature@tecnologieevolutive.it>",
      to: process.env.ADMIN_EMAIL!,
      subject: `Nuova candidatura - ${nome} ${cognome}`,
      html: `
        <h2>Nuova candidatura ricevuta</h2>

        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Cognome:</strong> ${cognome}</p>
        <p><strong>Data di nascita:</strong> ${dataNascita}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefono:</strong> ${telefono}</p>

        <h3>Presentazione</h3>
        <p>${messaggio}</p>
      `,
      attachments: [
        {
          filename: cv.name,
          content: buffer,
        },
      ],
    });

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      { ok: false, error: "Errore invio candidatura" },
      { status: 500 }
    );
  }
}