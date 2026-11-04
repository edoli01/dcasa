# Ottimizzazione fotografica responsive D.Casa

## Risultato

123 fotografie rigenerate dagli originali in 451 varianti WebP, qualità 87, metodo 5. Profili ICC e orientamento EXIF preservati. Nessun ritaglio fisico né ingrandimento: il ridimensionamento usa sempre l’intero fotogramma e il rapporto originale, con il normale arrotondamento al pixel intero. Loghi e icone invariati. Le 123 fotografie originali sono state rimosse dopo la verifica delle conversioni e dell’assenza di riferimenti residui nel sito. Restano recuperabili dalla cronologia Git precedente a questa rimozione. Il CSV conserva i percorsi e i pesi originali come inventario storico.

- Originali fotografici: **165.32 MB**.
- Una versione principale alla massima risoluzione prevista per fotografia: **26.93 MB**, risparmio **138.39 MB (83.7%)**.
- Tutte le varianti insieme: **73.35 MB**, presenti nel repository dopo la rimozione degli originali. Il browser seleziona le varianti necessarie; non le scarica tutte. Il trasferimento effettivo dipende da viewport, DPR, cache e navigazione. MB decimali.

## Risoluzioni e limiti degli originali

Larghezze indicative: 640, 960, 1200, 1600, 1920, 2560 e 3200 px. Si aggiunge la massima larghezza nativa quando inferiore al limite della categoria. Nessuna variante supera la risoluzione originale.

- Hero e gallerie: fino alla risoluzione originale disponibile, con limite di 3200 px. Le hero esistenti arrivano solo a 1920–2048 px: nessuna consente una vera variante 2560/3200. Su 4K il browser carica la migliore fonte disponibile, ma il dettaglio resta limitato dall’originale. Per dettaglio fotografico nativo a piena larghezza 4K servono nuovi originali più grandi; nessuna immagine è stata artificialmente ingrandita. Anche la copertina EIKO è limitata dal suo originale di 1024 px.
- Team: fino a 3200 px, utile per le grandi card su monitor ampi ad alta densità, quando il sorgente lo permette.
- Prodotti: fino a 2560 px; foto dell’articolo EIKO fino a 2528 px nativi.
- Archivio blog: fino a 960 px, spesso limitato da sorgenti già più piccoli.

| Larghezza effettiva | File | Peso totale |
| ---: | ---: | ---: |
| 640 px | 123 | 6.28 MB |
| 768 px | 36 | 1.80 MB |
| 800 px | 1 | 0.05 MB |
| 900 px | 6 | 0.47 MB |
| 901 px | 3 | 0.29 MB |
| 902 px | 2 | 0.16 MB |
| 960 px | 75 | 8.48 MB |
| 1024 px | 1 | 0.06 MB |
| 1033 px | 1 | 0.43 MB |
| 1200 px | 73 | 11.81 MB |
| 1280 px | 6 | 2.85 MB |
| 1480 px | 1 | 0.20 MB |
| 1600 px | 48 | 12.19 MB |
| 1787 px | 1 | 0.28 MB |
| 1920 px | 47 | 16.28 MB |
| 2045 px | 1 | 0.21 MB |
| 2048 px | 14 | 4.93 MB |
| 2160 px | 4 | 2.17 MB |
| 2528 px | 3 | 1.55 MB |
| 2560 px | 3 | 1.73 MB |
| 3200 px | 2 | 1.13 MB |

L’inventario completo di ogni file, dimensioni originali, variante e peso in byte è in [OTTIMIZZAZIONE-IMMAGINI.csv](OTTIMIZZAZIONE-IMMAGINI.csv).

## Selezione e caricamento

Le immagini HTML usano srcset e sizes. Le misure iniziali sono ricavate dai contenitori; ResizeObserver aggiorna sizes sulla larghezza realmente dipinta anche tra i breakpoint, considerando altezza e rapporto del sorgente quando object-fit è cover. Le immagini mobile ad alta densità sono limitate a 1920 px; verificate anche densità frazionarie. Non cambiano object-fit, object-position, proporzioni dei riquadri, tipografia o dimensioni delle sezioni. La copertina del magazine conserva il rapporto nativo anche quando le dimensioni di una variante sono arrotondate.

La prima hero della homepage ha un preload responsive ad alta priorità, con candidati distinti per mobile/desktop. Le altre foto del carosello non hanno sfondi applicati prima del loro caricamento. La successiva viene preparata 2 secondi prima dell’intervallo esistente di 6,5 secondi e decodificata prima della transizione. Stessa preparazione graduale per la hero Azienda; il carosello showroom carica la foto richiesta alla selezione. Le gallerie aprono le versioni grandi; le immagini fuori schermo mantengono lazy loading. La prima hero resta disponibile anche senza JavaScript.

Gli sfondi statici della categoria pavimenti usano image-set e media query, conservando esattamente gli strati dei gradienti e background-size/position.

## Verifiche

- Tutte le 11 pagine a 390, 768, 1440, 1920, 2560 e 3840 px (altezza 900 px). Nessun errore JavaScript o overflow orizzontale. Confronto con la versione precedente caricata completamente: geometria delle sezioni invariata, salvo arrotondamenti inferiori a un pixel.
- 88 controlli pagina/viewport/DPR su mobile 390 e 768 px, densità 1x, 2x, 2,625x e 3x: nessuna foto selezionata oltre 1920 px.
- Rete e transizioni dei tre caroselli: una sola fotografia hero richiesta all’avvio; passaggio alla seconda verificato. Intervalli e durate CSS conservati; rispettata la preferenza di movimento ridotto.
- 83 controlli su menu, lightbox, filtri e archivio blog, carosello showroom.
- Tutte le 451 varianti decodificate e verificate rispetto alla proporzione del sorgente, senza upscale e con ICC preservato. Prima della pulizia, originali invariati rispetto a Git; dopo la pulizia, tutte le varianti sono state decodificate nuovamente e nessun riferimento del sito usa le 123 fotografie rimosse. Sintassi JavaScript e diff check validi.
- Tutte le varianti e `.nojekyll` restituiscono HTTP 200 sotto il prefisso `/dcasa/`, con corrispondenza dei byte e dei percorsi, inclusi maiuscole, spazi e underscore. Percorsi relativi compatibili con GitHub Pages. Il file `.nojekyll` è ancora presente e invariato.
- I font esterni sono esclusi dalle prove locali. Il controllo locale non equivale a una verifica sul dominio pubblico: i nuovi file non sono ancora distribuiti. Nessun merge in main, push o pubblicazione effettuati.

## Pulizia degli originali

Rimosse esclusivamente le 123 fotografie elencate nella colonna `originale` del CSV, per 165,32 MB. Conservati tutti i 451 WebP, loghi e icone PNG/SVG, PDF e `.nojekyll`. Il contenuto fotografico sul filesystem passa da 238,67 MB (originali + varianti) a 73,35 MB; la cronologia Git continua a contenere gli originali. Nessuna modifica a layout, testi o comportamento delle pagine.
