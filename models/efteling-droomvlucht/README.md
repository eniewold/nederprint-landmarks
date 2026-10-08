# Droomvlucht (Efteling, Kaatsheuvel)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `efteling-droomvlucht.glb` | Catalogusbron in meters: nodes `building:showhal` (de showhal, de oosthal en de achtkant met lantaarn en spits), `building:wachtrij` (de gewelfde entreehal en de overdekte wachtrijgang), `building:entree` (de sprookjesgevel aan het water) en `road:brug` (de brug naar het Ton van de Venplein) |
| `efteling-droomvlucht-1-1000.stl` | Het hele model op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (116 × 63 × 26 mm, 36 cm³) |
| `efteling-droomvlucht.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

Generator: [`scripts/generate-efteling-droomvlucht.mjs`](../../scripts/generate-efteling-droomvlucht.mjs)
(gedeelde hulpfuncties in `scripts/efteling-kit.mjs`).

De GLB is in meters met de oorsprong op RD (131364, 407123), midden in de
showhal, op het maaiveld (NAP +8,1 m), en de glTF-conventie Y omhoog. +X loopt
langs de lange gevels van de hal naar het oosten (1,69 graden linksom vanaf de
RD-X-as), +Y loodrecht daarop naar het noorden. De entreemuur, de entreehal, de
gang en de brug staan in werkelijkheid precies noord-zuid/oost-west; ze zijn in
RD-richting opgebouwd en teruggedraaid. Het maaiveld wordt op vier punten rond
de hal bemonsterd (`groundSamplePoints` (-10, -35), (20, -35), (45, -5) en
(-20, 35), NAP +7,98 tot +8,2 m), niet op het water voor de entree.
`groundOffsetMetres` is 0. Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0809100000017596` (de hal); de entreemuur, de entreehal, de
gang en de brug zijn geen BAG-pand.

Onderdelen (hoogtes boven het maaiveld):

- Showhal (BAG-contour, 82 × 62,5 m): het westelijke deel met een vlak dak op
  +10,3 m, de oosthal op +5,5 m met een lager deel op +4,5 m (AHN-DSM).
- Achtkant aan de zuidwestkant (regelmatige achthoek met zijden van 10 m uit de
  BAG-contour): goten op +10,6 m, dakvlakken van 27 graden tot een plateau op
  +14 m; het oostelijke deel is plat op +14 m. Daarop een achtkantige lantaarn
  (10 m breed, dak van 53 graden tot +19 m), een trommel en een achtkantige
  spits tot +25 m (het hoogste punt), en acht pinakels op de hoeken van de
  lantaarn.
- Entree aan de oostkant, aan het water: een vrijstaande muur van 24,4 m lang
  en 1 m dik, 5,9 m hoog met een grillige stenen kap tot 6,3 m en
  afbrokkelende uiteinden; in het midden de spitse poortboog (3 m breed, 7,1 m
  hoog, als nis van 3,5 m diep) in een stenen omlijsting tot 7,75 m; op de top
  een lotuskelk met een spits van gestapelde lotusringen tot 11,9 m; op 2 m
  naast de as twee uivormige zijspitsen op een steel tot 10,1 m; daaronder
  tulpzuilen met kelk en knoppen; naast de boog de twee bladwaaiers
  ("elfenvleugels") tot 4,75 m uit de as en 7,45 m hoog, met twee nerven;
  vier bloemschalen tegen de muur; en aan beide uiteinden een grote tulp met
  bladwaaier en knop tot 6,7 m.
- Achter de muur de gewelfde entreehal (5,4 m breed, goten 5,6 m, kruin
  8,5 m, AHN-dwarsprofiel) en de overdekte wachtrijgang naar de oosthal
  (platte daken op 6,6 en 6,0 m).
- De bolle brug over het water (6,4 tot 10 m breed, 17 m lang, luchtfoto) met
  een dek op +0,15 m en borstweringen van 0,7 m breed tot +1 m.

Printbaar op 1:1000 en 1:500 zonder steun: de hal, de achtkant en de gangen
staan op de onderkant en hebben geen ondervlakken; de poortnis heeft een
spitse top van 51 graden; de bladwaaiers een onderrand van 48 tot 56 graden,
de spitsen, schalen en tulpen ondervlakken van minstens 47 graden, de
muurkap een kraag van 50 graden. Printcontrole: op 1:1000
showhal en brug 0 %, wachtrij +0,7 %, entree +4,5 %; op 1:500 wachtrij
+0,7 %, entree +7,7 % (dunne spitsen en nerven worden verdikt).

Bronnen: PDOK BAG (pand 0809100000017596), PDOK AHN (dsm en dtm 0,5 m via
WCS), PDOK luchtfoto 8 cm,
[Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Droomvlucht_(Efteling))
(entreefoto's), [Wikipedia](https://nl.wikipedia.org/wiki/Droomvlucht_(darkride))
en Eftepedia ([Droomvlucht](https://www.eftepedia.nl/lemma/Droomvlucht),
[Ton van de Venplein](https://www.eftepedia.nl/lemma/Ton_van_de_Venplein)).
Geschat zijn alle maten van de gevelornamenten (uit vooraanzichten met de
bezoekers als maat), de vorm van de lantaarn en de spits (het DSM meet
+23,7 m op 0,5 m van het hart), de diepte van de poortnis (in werkelijkheid
een open doorgang naar de overdekte wachtrij), de ligging van de wachtrijgang
(bomen erboven) en de dikte van de muur. Van de hal en de achtkant zijn geen
foto's van buiten gevonden; de gevels zijn vlak gelaten. Weggelaten: de
lantaarnpalen, de hangende lichtbollen, de beplanting en de dakinstallaties.
