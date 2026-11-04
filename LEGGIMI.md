# D.Casa — prototipo homepage ordinato

Questa versione conserva l'aspetto e le funzionalità del prototipo approvato, ma usa file separati e formattati per lavorare più facilmente in Visual Studio Code.

## Avvio

1. Apri questa cartella in **Visual Studio Code** (File → Apri cartella).
2. Apri `index.html` nel browser oppure usa l'estensione **Live Server**.
3. Tieni aperti `index.html` e `style.css` affiancati.

## Dove modificare le cose

- **Testi, fotografie, link e ordine delle sezioni** → `index.html`. Cerca il commento `01 · HERO`, `03 · PRODOTTI`, `06 · SERVIZI`, ecc.
- **Colori e font** → prime righe di `style.css`, dentro `:root`.
- **Padding laterale** → la variabile `--edge` nelle prime righe di `style.css`.
- **Altezza e spazi delle sezioni** → `style.css`. Usa Ctrl/Cmd+F per il nome della classe (es. `.products`, `.showrooms`).
- **Aspetto dei link, pulsanti, frecce e hover** → `style.css`, parte finale **RIFINITURE UI**.
- **Tempo del carosello** → `script.js`, variabile `SLIDE_DURATION` (6500 ms).
- **Contenuto del menu Prodotti** → `index.html`, cerca `productsSubmenu`.
- **Logo** → `assets/logo-dcasa.png` (file originale ricavato dal prototipo).

## Come sono organizzati i file

```
DCasa_Sito_Ordinato/
├── index.html           contenuti e struttura della homepage
├── style.css            stile e regole responsive
├── script.js            slider, menu, header
├── assets/
│   └── logo-dcasa.png
├── GIORNALONE D.CASA -web.pdf
└── LEGGIMI.md
```

## Note importanti

- Le **fotografie** per il momento sono dimostrative e vengono caricate da Unsplash: serve una connessione Internet.
- Le **statistiche non confermate** restano segnaposto e non vanno pubblicate come dati reali.
- I **link alle pagine interne** sono ancora dimostrativi; li collegheremo alle pagine WordPress definitive.
- Le icone dei **Servizi** sono quelle della versione precedente: non ho ancora applicato le alternative rosse, perché la scelta non è stata finalizzata.
- Il file CSS contiene ancora alcune *rifiniture finali* introdotte durante le versioni di studio. Sono separate e commentate: per sicurezza ho mantenuto l'ordine delle regole CSS, in modo da non alterare il layout.
- **Font**: Archivo (titoli e corpo) e Instrument Serif (claim, VS e citazioni).
- Questo pacchetto è una **base di sviluppo**, non un tema WordPress da caricare direttamente.

## Preloader globale

La home include il preloader SVG originale di `DCasa_Preloader_SVG`,
con fondo avorio e freccia animata. Le altre pagine non includono un velo
né un preloader. Stile e dimensioni si modificano in
`preloader.css`; il comportamento è in `preloader.js`.

Sulla home il preloader resta visibile per almeno 1,8 secondi e scompare quando anche il
caricamento è completato. La durata minima si modifica con
`MIN_VISIBLE_DURATION` in `preloader.js` (valore in millisecondi).
Un limite di 10 secondi evita attese indefinite per risorse esterne bloccate.
Con JavaScript disattivato viene nascosto; con movimento ridotto il logo resta statico.

La navigazione usa le View Transitions native: il contenuto della nuova pagina
appare direttamente sopra quello precedente in 300 ms, senza passaggio attraverso
un fondo avorio. Lo stile è in `preloader.css`, nella regola
`::view-transition-new(root)`. Il preloader animato compare quando si apre la home.
Nei browser senza supporto alle View Transitions, o aprendo i file senza un server,
la navigazione può avvenire senza animazione: per la prova usare Live Server.
La preferenza di movimento ridotto disattiva la transizione tra pagine.
