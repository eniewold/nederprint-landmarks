# Melkweg (Amsterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `melkweg.glb` | Catalogusbron in meters: één node `building:melkweg` met de grachtpanden aan de Marnixstraat, de lange hal, het pand met de topgevel, de glazen entree, het middendeel en de zaaldoos van The Max en de Rabozaal |
| `melkweg-1-1000.stl` | Het complex in één stuk op 1:1000, met de onderkant (2,5 m onder de Marnixstraat) op het printbed (84 × 52 × 38 mm) |
| `melkweg.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

Poppodium Melkweg in de voormalige zuivelfabriek aan de Lijnbaansgracht. De
GLB is in meters met de oorsprong op RD (120540, 486440) op het maaiveld van
de Marnixstraat (NAP +1,85 m) en de glTF-conventie Y omhoog. +X loopt langs
de Lijnbaansgracht naar de Stadsschouwburg (RD-richting 50,5 graden rechtsom
vanaf het oosten), +Y naar de gracht. De onderkant ligt op -2,5 m, onder het
dek en de kade aan de gracht. Het maaiveld wordt op drie punten op de
Marnixstraat bemonsterd (`groundSamplePoints`); `groundHeight` (44,75 m,
ellipsoïdisch) is de laagste PDOK-terreinhoogte op die punten.

Het catalogusitem vervangt de BAG-panden `NL.IMBAG.Pand.0363100012168735`
(de Melkweg, met de grachtpanden aan de Marnixstraat (nummers 405 en 407) en het
westdeel van de zaaldoos) en `NL.IMBAG.Pand.0363100012173457` (de noordhelft
van de zaaldoos met de strook langs de gracht). Het deel van de zaaldoos op
het pand van de Stadsschouwburg (`0363100012168738`) blijft een
PDOK-reconstructie; de PDOK-hoogtes van de buurpanden kloppen binnen 2 m met
het AHN.

Onderdelen in het model (hoogtes boven de Marnixstraat, uit het AHN tenzij
anders vermeld):

- Grachtpanden aan de Marnixstraat tot 12,8 m diep: een pand met plat dak
  (20,05 m), drie panden met een zadeldak met de nok dwars op de straat
  (nokken 21,05, 21,15 en 20,55 m), het brede pand met plat dak (22,25 m) en
  een smal pand met een lessenaar; daarachter lage aanbouwen op 4,35 m. In de
  straatgevels per verdieping ramen van 1 × 1,8 m als nissen van 0,35 m
  (geschat).
- Lange hal langs de gracht onder een schilddak met een vlakke kam op 8,75 m
  en goten op 4,15 en 4,65 m, met vijf spitse vensters aan de gracht.
- Het pand met de topgevel aan de gracht: zadeldak met de nok dwars op de
  gracht op 13,75 m en goten op 9,15 m, drie grote ramen in de topgevel
  (geschat), en de glazen entree op het dek ervoor (3,1 m).
- Middendeel met een plat dak op 9,4 m, een lager deel aan de zuidkant en
  installaties tot 12 m.
- Zaaldoos: de rode doos op 30,45 m, de hoge doos met een dak dat van 33,55 m
  naar 35,6 m oploopt, het westblok op 18,15 m en langs de gracht de strook
  met de uitkragende glazen doos (bovenkant 18,15 m, onderkant geschat op 7 m,
  glazen band van 12,5 tot 17,6 m), een glazen benedenverdieping onder het
  westblok en een rij smalle ramen hoog in de doos.

Weggelaten: de stalen brugconstructie en het houten dek op de gracht (niet in
de BAG-contour, te dun), de neonletters en sterren, de gevelribbels en de
stalen kruisen achter het glas (kleiner dan 0,9 m).

Printbaarheid: alles staat op dezelfde onderkant; nissen hebben een plafond
van 45 graden of een spitse bovenkant. Onder de uitkragende glazen doos zet
de export met de optie ‘Printbare overhang’ een kraag; op 1:1000 vult hij
2,0 % op en op 1:1500 2,7 % (circa 0,4 seconde).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Melkweg_(Amsterdam)),
PDOK BAG (contouren), PDOK AHN (dsm en dtm 0,5 m via WCS: daken, nokken,
goten, installaties, zalen, de glazen strook en het maaiveld), de PDOK
luchtfoto en foto's van Wikimedia Commons (`Melkweg en Rabozaal.jpg`,
`Amsterdam, Stadsschouwburg en Melkweg, Rabo Zaal.jpg`,
`Amsterdam, Rabozaal Stadsschouwburg vanaf hoek Lijnbaansgracht-Leidsegracht01.JPG`,
`Overzicht voorzijde aan de Lijnbaansgracht - Amsterdam - 20002717 - RCE.jpg`).

Licentie van het model: eigen werk op basis van open bronnen.
