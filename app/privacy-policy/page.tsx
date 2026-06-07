export default function PrivacyPolicyPage() {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-black">Privacy Policy</h1>
  
          <p className="mt-4 text-slate-300">
            Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}
          </p>
  
          <div className="mt-10 space-y-8 text-slate-200 leading-8">
            <section>
              <h2 className="text-2xl font-bold text-white">
                Titolare del trattamento
              </h2>
              <p>
                Il titolare del trattamento dei dati personali è{" "}
                <strong>TECNOLOGIE EVOLUTIVE S.R.L.</strong>.
              </p>
              <p>
                Email di contatto:{" "}
                <strong>tecnologieevolutiveprivacy@gmail.com</strong>
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-bold text-white">
                Tipologie di dati raccolti
              </h2>
              <p>
                Il sito può raccogliere dati personali forniti volontariamente
                dall&apos;utente tramite i moduli presenti nelle pagine del sito.
              </p>
              <p>
                Attraverso il modulo di richiesta preventivo possono essere
                raccolti dati come nome, email, telefono e messaggio.
              </p>
              <p>
                Attraverso la sezione “Lavora con noi” possono essere raccolti
                nome, cognome, data di nascita, email, telefono, messaggio di
                presentazione e curriculum vitae in formato PDF.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-bold text-white">
                Finalità del trattamento
              </h2>
              <p>I dati personali vengono trattati per le seguenti finalità:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>rispondere alle richieste di preventivo;</li>
                <li>contattare l&apos;utente in merito alla richiesta inviata;</li>
                <li>valutare candidature spontanee e curriculum vitae;</li>
                <li>gestire comunicazioni tecniche, commerciali o informative;</li>
                <li>garantire il corretto funzionamento e la sicurezza del sito.</li>
              </ul>
            </section>
  
            <section>
              <h2 className="text-2xl font-bold text-white">
                Base giuridica del trattamento
              </h2>
              <p>
                Il trattamento dei dati inviati tramite i moduli del sito si basa
                sul consenso dell&apos;utente e sull&apos;esecuzione di misure
                precontrattuali richieste dall&apos;interessato, come la
                preparazione di un preventivo o la valutazione di una candidatura.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-bold text-white">
                Modalità di trattamento
              </h2>
              <p>
                I dati sono trattati con strumenti informatici e telematici, con
                misure tecniche e organizzative adeguate a proteggerli da accessi
                non autorizzati, perdita, uso improprio o divulgazione non
                autorizzata.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-bold text-white">
                Servizi di terze parti utilizzati
              </h2>
              <p>
                Il sito utilizza servizi tecnici di terze parti necessari al suo
                funzionamento, tra cui:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>Supabase</strong>, per database, autenticazione, gestione
                  dell&apos;area amministrativa e archiviazione dei media del
                  portfolio;
                </li>
                <li>
                  <strong>Resend</strong>, per l&apos;invio delle email provenienti
                  dai moduli di contatto, preventivo e candidatura;
                </li>
                <li>
                  <strong>Vercel</strong>, per hosting e pubblicazione del sito;
                </li>
                <li>
                  <strong>Google Analytics</strong>, se attivato, per statistiche
                  aggregate sull&apos;utilizzo del sito.
                </li>
              </ul>
            </section>
  
            <section>
              <h2 className="text-2xl font-bold text-white">
                Conservazione dei dati
              </h2>
              <p>
                I dati inviati tramite il modulo preventivo sono conservati per il
                tempo necessario a gestire la richiesta e gli eventuali rapporti
                commerciali successivi.
              </p>
              <p>
                I dati e i curriculum inviati tramite la sezione “Lavora con noi”
                sono conservati per il tempo necessario alla valutazione della
                candidatura e comunque non oltre il periodo ragionevolmente
                necessario per finalità di selezione del personale.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-bold text-white">
                Comunicazione dei dati
              </h2>
              <p>
                I dati personali non vengono venduti né diffusi. Possono essere
                trattati da fornitori tecnici incaricati del funzionamento del
                sito, dell&apos;hosting, dell&apos;invio email e della gestione
                dei sistemi informatici.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-bold text-white">Cookie</h2>
              <p>
                Il sito può utilizzare cookie tecnici necessari al funzionamento
                delle pagine e dell&apos;area amministrativa.
              </p>
              <p>
                Eventuali strumenti di analisi, come Google Analytics, saranno
                configurati nel rispetto della normativa applicabile e, ove
                necessario, previo consenso dell&apos;utente.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-bold text-white">
                Diritti dell&apos;interessato
              </h2>
              <p>
                L&apos;utente può richiedere l&apos;accesso, la rettifica, la
                cancellazione, la limitazione o l&apos;opposizione al trattamento
                dei propri dati personali, nonché esercitare gli altri diritti
                previsti dalla normativa applicabile.
              </p>
              <p>
                Per esercitare tali diritti è possibile scrivere a:{" "}
                <strong>tecnologieevolutiveprivacy@gmail.com</strong>.
              </p>
              <p>
                L&apos;interessato ha inoltre il diritto di proporre reclamo
                all&apos;Autorità Garante per la protezione dei dati personali.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-bold text-white">
                Modifiche alla presente informativa
              </h2>
              <p>
                La presente Privacy Policy può essere aggiornata nel tempo per
                adeguamenti normativi, tecnici o organizzativi. Gli aggiornamenti
                saranno pubblicati su questa pagina.
              </p>
            </section>
          </div>
        </div>
      </main>
    );
  }