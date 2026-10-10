# Rijnbrug bij Rhenen (Rhenen)

Het huidige N233-brugdek, met twee fietspaden, stalen plaatliggers en de rivier- en uiterwaardpijlers. De voorgenomen verbreding is niet opgenomen.

## Bestanden

- `rijnbrug-rhenen.glb`: meters, Y omhoog, 16 gesloten nodes; vijftien wegdelen met hun eigen BGT-attributen en één constructienode.
- `rijnbrug-rhenen.json`: RD-plaatsing en twee te vervangen BGT-dekvlakken.
- `rijnbrug-rhenen-1-1000.stl`: verbonden los printmodel met geïntegreerde printvoet; ongeveer 535,7 × 17,8 × 18,2 mm.
- `scripts/generate-rijnbrug-rhenen.mjs`: reproduceerbare contouren, hoogteknooppunten en benoemde bouwdelen; `--out` wijst naar een catalogusmap.

## Plaatsing en opbouw

RD-oorsprong `[167993.0835, 440403.083]`, hoofdas `[0.1726559794, 0.9849821891]` naar noord/noordoost. De lokale +Y wijst naar west/noordwest. De vaste PDOK-waterterugval is ellipsoïdisch 49,5394 m; vier bemonsteringspunten liggen in de rivier naast het hoofdveld. Geschatte waterbasis NAP +6,1 m, afgestemd op de zuidelijke aansluiting.

De volledige huidige BGT-contour is circa 534,7 m lang en 14,7 m breed. De vaak genoemde 523 m is een afgeronde bronmaat. Het AHN-wegprofiel stijgt van NAP 18,29 naar 24,30 m en daalt naar 22,30 m. Noordelijke DSM-gaten zijn lineair geïnterpoleerd tussen herkenbare wegvlakken op x=150, 170, 200, 220, 240 en 260 m; lage grondhits zijn uitgesloten. De dekplaat volgt dit profiel met doorlopende vlakken, niet met hoogtelagen.

Onder het dek liggen twee stalen plaatliggers van 0,95 m modelbreedte. De geschatte diepte is 2,6 m bij de aanbruggen, circa 4,1 m midden in het rivierhoofdveld en 4,8 m boven de rivierpijlers. Het hoofdveld ligt tussen x=27 en 170,5 m, overeenkomstig de gepubliceerde overspanning van 143,5 m. De Sweco-notitie beschrijft voor de huidige brug een onderkant op NAP +20,15 m over 101,5 m vaargeulbreedte; die maat ondersteunt de orde van grootte van de liggerdiepte, maar bepaalt niet het volledige profiel.

Zes aanwezige BGT-pijler-/landhoofdcontouren zijn gebruikt, inclusief de uitstekende rivierpijlerneuzen. Ontbrekende pijlers op x=-217, 170,5 en 219 m en het noordelijke landhoofd op x=266 m zijn geschat uit de regelmatige veldindeling, ortho en schuine foto's. De pijlers zijn schematische prisma's; hun ondersnijvlakken en tapering zijn niet nauwkeurig opgemeten.

De dekdikte van 1,5 m en de onderbouw zijn schattingen. Acht fietspaden en zeven regionale-rijbaanpolygonen zijn afzonderlijke 0,5 m gesloten bovenlagen met `bgt_functie`, `bgt_fysiekvoorkomen` en `plus_fysiekvoorkomen`. Overige dekranden blijven constructie. De snijstrook loopt 1 m boven het dek door om samenvallende vlakken te vermijden.

## Print en controle

De losse STL bevat twee doorlopende wanden met 43° schouders en brede eindankers. Alle volumestatussen zijn `NoError`; de STL bestaat uit één verbonden lichaam en heeft geen vrije ondervlakken steiler dan 45°. De GLB bevat deze printvoet niet; de kaart-/exportopvulling maakt de steun gezamenlijk en rekent deze toe aan de constructie.

De directe `shareModelSupport`-/`supportedSolid`-controle op werkelijke printschaal 1:1000 slaagt: horizontale rivierdoorsneden op 0,5, 2 en 4 mm bevatten doorlopende wanden van minstens 0,8 mm, geen lamellen. Wegdelen krijgen geen eigen constructiesteun. De volledige 650 × 650 m preview-export slaagt met een uniforme 1:1000-matrix van vier tegels. De model-/API-tests controleren plaatsing, AHN-profiel, classes, attributen en dekafstand. Bij 7.987 verticale dekstralen is de kleinste afstand tot constructie 0,49976 m; volumepartitieverschil 0,00712 m³, minder dan 10⁻⁶ van het totaal.

GLB en PDOK zijn vanuit vier gelijke schuine hoeken vergeleken met moderne Commons-foto's. Het model voegt het verhoogde wegprofiel, plaatliggers, grote hoofdoverspanning, pijlerverdeling en afzonderlijke fietspaden toe. Kaart en volledige preview zijn bekeken met rode fietspaden. De grijze PDOK-dekplaat wordt vervangen zonder het water of de uiterwaard te verwijderen.

**Beperking:** de noordelijke PDOK-aanloop ligt bij het landhoofd tot circa 5 m lager dan het wel meetbare AHN-wegvlak; verder noordelijk neemt dit verschil af. De bronhoogte is behouden, het landhoofd loopt door tot de waterbasis en is in het terrein verankerd. Controleer bij review vooral deze aansluiting en de geschatte liggeronderzijde.

## Weggelaten

Dunne hekwerken, verkeersborden, lichtmasten, losse vangrails, staalflenzen en tussenliggers kleiner dan 0,9 m zijn op 1:1000 niet afzonderlijk printbaar. Het afzonderlijke N233-viaduct verder noordelijk hoort niet bij dit brugdek. Geen talud, rivierbodem, geplande verbreding of historische spoorbrug in de GLB.

## Bronnen

- [Sweco, verbreding Rijnbrug, 2019, p. 16](https://repository.officiele-overheidspublicaties.nl/externebijlagen/exb-2019-48859/1/bijlage/exb-2019-48859.pdf): bestaande breedte en onderkant van het dek.
- [Rijnbrug bij Rhenen](https://nl.wikipedia.org/wiki/Rijnbrug_bij_Rhenen): hoofdoverspanning, huidige constructie en context.
- [BGT OGC API](https://api.pdok.nl/lv/bgt/ogc/v1/): overbruggingsdelen, pijlers en wegdeelattributen, geraadpleegd 11 oktober 2026.
- [AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0), DSM 0,5 m; [PDOK luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0).
- [Wikimedia Commons, Rijnbrug Rhenen](https://commons.wikimedia.org/wiki/Category:Rijnbrug_Rhenen): Joop van Houdt luchtfoto's; Steven L, Rhenen–2011–panoramio (1) en (13), CC BY-SA 3.0; Pimvantend, Verkeersbrug vanaf Cuneratoren, CC BY-SA 4.0. Foto's dienen alleen als visuele referentie en staan niet in deze repository.
