import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const MAX_TOTAL_SIZE = 25 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const nome = String(formData.get("nome") || "");
    const cognome = String(formData.get("cognome") || "");
    const indirizzo = String(formData.get("indirizzo") || "");
    const telefono = String(formData.get("telefono") || "");
    const email = String(formData.get("email") || "");
    const tipoCliente = String(formData.get("tipoCliente") || "Privato");
    const ragioneSociale = String(formData.get("ragioneSociale") || "");
    const partitaIva = String(formData.get("partitaIva") || "");
    const descrizione = String(formData.get("descrizione") || "");

    const files = formData.getAll("allegati").filter(
      (file): file is File => file instanceof File && file.size > 0
    );

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);

    if (totalSize > MAX_TOTAL_SIZE) {
      return Response.json(
        {
          success: false,
          error: "Gli allegati superano il limite massimo di 25 MB.",
        },
        { status: 413 }
      );
    }

    const attachments = await Promise.all(
      files.map(async (file) => ({
        filename: file.name,
        content: Buffer.from(await file.arrayBuffer()),
      }))
    );

    await resend.emails.send({
      from: "Preventivi <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL!,
      subject: `Nuovo preventivo - ${nome} ${cognome}`,
      html: `
        <h2>Nuova richiesta preventivo</h2>

        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Cognome:</strong> ${cognome}</p>
        <p><strong>Telefono:</strong> ${telefono}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Indirizzo lavoro:</strong> ${indirizzo}</p>
        <p><strong>Tipo cliente:</strong> ${tipoCliente}</p>

        ${
          tipoCliente === "Società"
            ? `
              <p><strong>Ragione sociale:</strong> ${ragioneSociale}</p>
              <p><strong>Partita IVA:</strong> ${partitaIva}</p>
            `
            : ""
        }

        <p><strong>Descrizione:</strong></p>
        <p>${descrizione}</p>

        <p><strong>Numero allegati:</strong> ${files.length}</p>
      `,
      attachments,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: "Errore durante l'invio della richiesta.",
      },
      { status: 500 }
    );
  }
}