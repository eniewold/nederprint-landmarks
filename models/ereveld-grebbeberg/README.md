# Militair Ereveld Grebbeberg (Rhenen)

De twee centrale gedenktekens van het Nationaal Legermonument: het kruis met twee tegengesteld liggende leeuwen bij de ingang, en de luidklok met gebogen ommuring aan de overkant van de Grebbeweg. Het omliggende ereveld blijft de PDOK-reconstructie; individuele grafstenen en regimentsmonumenten zijn niet onderdeel van deze voetafdruk.

## Bestanden

- `ereveld-grebbeberg.glb`: meters, Y omhoog, twee gesloten `building:`-nodes.
- `ereveld-grebbeberg.json`: RD-plaatsing, maten en bronnen.
- `ereveld-grebbeberg-1-1000.stl`: circa 25 × 40,6 × 9,2 mm; losse volumes voor kruis, klok en muur, op de kaart verbonden door het bestaande terrein.
- `../../scripts/generate-ereveld-grebbeberg.mjs`; uitvoeren met `node scripts/generate-ereveld-grebbeberg.mjs` vanuit de landmarksrepo.

## Plaatsing en maten

Oorsprong in het ingangskruis, RD `[169662.8,440773.5]`, X-as `[0.9734,0.2291]` evenwijdig aan de Grebbeweg. De posities komen uit actuele HR-ortho; de BGT heeft hier geen apart monumentobject. De klok ligt lokaal op `[1.84,-27.55]`. PDOK-grond rond het kruis circa 86,024 m ellipsoïdisch, bij de klok circa 86,18 m. Drie grondpunten op de ingangsbestrating vermijden de lagere weg; offset −0,2 m. Klokvoet en ommuring lopen tot het modelvlak door.

AHN DTM bij de klok circa NAP 42,68 m, DSM-top circa NAP 51,48 m: circa 8,8 m totale hoogte. De Nationaal Comité-bron noemt een 7 m zuil en een klokdiameter van 0,97 m. Het RVB schrijft 12 m torenhoogte; deze conflicterende publicatie is niet als modelmaat gebruikt, omdat AHN en de renovatiefoto de lagere opstand ondersteunen. De sokkel van het leeuwenmonument is circa 6 × 2 m, bevestigd in de literatuur over Oud en afgelezen in de ortho.

## Geschat en vereenvoudigd

Kruishoogte 6,2 m, sokkelhoogte 1,5 m, leeuwlengtes/-hoogtes, klokframebreedte en muurhoogte 2 m zijn fotoschattingen. Het kruis valt in het DSM onder boomkronen; de boomtoppen zijn niet als kruishoogte gebruikt. De kromme muur is een polygonale band langs de ortho-contour, dikte 1 m. Posities kunnen circa 0,5 m afwijken door ortho-/afleesfouten.

Kruisstam en armen zijn verdikt tot 0,9 m; de armen krijgen een circa 53° onderkant om de kruisvorm vrij te houden zonder losse steun. Leeuwen hebben doorlopende liggende rompen, manen en snuiten, geen dunne losse poten. Het klokframe heeft een schuine onderkraag en een ondiepe blinde nis; de klokrand sluit met een schuine verbinding op de zuil aan. Opschriften, klokwiel, klepel, banken en fijne sculptuurdetails ontbreken. Het terras is niet opnieuw gemodelleerd, omdat PDOK de verhoging en trappen reeds bevat.

## Controle

Kaart: `http://localhost:3000/kaart/51.95528/5.60000/350/1x1/0`. In deze sessie gecontroleerd via de verse-catalogusproxy op poort 5188. Een bestaande dev-server kan herstart nodig hebben om de catalogus te verversen.

Vier renders (−35°, 55°, 145°, 235°, 30° elevatie) naast PDOK, Commons en RVB-renovatiefoto's. Volledige export: 120 × 120 m naar 120 × 120 mm, 1:1000, beide centrale gedenktekens ruim binnen de uitsnede. Alle volumes `NoError`. De 45°-printcontrole voegt 0% volume toe; doorsneden op 0,4, 1,5, 3, 5 en 7 m blijven gelijk. Permanente test controleert de verschillende plaatsen aan weerszijden van de weg, twee leeuwen, kruishoogte, kloktop en onveranderde materiaalvolumes.

Nakijken: de geschatte kruishoogte en leeuwen, de klokhoogte en de aansluiting van de gebogen muur op het bestaande terras.

## Bronnen

- https://www.4en5mei.nl/oorlogsmonumenten/zoeken/1887/rhenen-militair-ereveld-grebbeberg
- https://www.rijksvastgoedbedrijf.nl/actueel/nieuws/2024/04/30/herdenkingsplek-militair-ereveld-grebbeberg-klaar-voor-nationale-dodenherdenking
- https://www.grebbeberg.nl/index.php?page=de-centenklok-op-de-grebbeberg
- https://architecture-history.org/books/J.J.P.%20Oud.%20Architect%2C%201890-1963.pdf (sokkel 6 × 2 m)
- https://commons.wikimedia.org/wiki/Category:Grebbeberg_War_Cemetery (`Ereveld Rhenen 9.jpg`, kruis en leeuwen)
- PDOK actuele HR-ortho, AHN DSM/DTM 0,5 m en PDOK-3D, geraadpleegd 11 oktober 2026.
