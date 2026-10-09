# Doornroosje (Nijmegen)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `doornroosje.glb` | Catalogusbron in meters: één node `building:doornroosje` met de sokkel van het poppodium, de bakstenen band met het dek, de hoge L-vormige woonschijf, de balkontoren en de woonvleugel langs het spoor |
| `doornroosje-1-1000.stl` | Het complex in één stuk op 1:1000, vanaf 1 m onder het Stationsplein (61 × 80 × 46 mm) |
| `doornroosje.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

Poppodium Doornroosje (2014, ontwerp Sjoerd Soeters) en de studentenwoningen
Talia erboven zijn samen één BAG-pand, `NL.IMBAG.Pand.0268100000086018`, dat
het catalogusitem vervangt. De GLB is in meters met de oorsprong op RD
(187150, 428545) op het Stationsplein (NAP +24,3 m) en de glTF-conventie Y
omhoog. +X loopt langs de gevel aan het Stationsplein (RD-richting 16,9 graden
rechtsom vanaf het oosten), +Y langs het spoor naar het noordnoordoosten. Aan
de noordoostkant ligt de weg naar de spoortunnel 9 m lager (NAP +15 m); de
onderkant van de GLB ligt daarom op -9,6 m, en de STL om los te printen begint
pas 1 m onder het plein. Het maaiveld wordt op drie punten op het
Stationsplein bemonsterd (`groundSamplePoints`), niet op de lage weg of het
spoor (NAP +29 m); `groundHeight` (67,74 m, ellipsoïdisch) is de laagste
PDOK-terreinhoogte op die punten.

Onderdelen in het model (hoogtes boven het Stationsplein, uit het AHN tenzij
anders vermeld):

- Witte sokkel van het poppodium tot 8,6 m, die 1,2 m (Stationsplein), 3 m
  (oostkant) en 2 m (noordkant) terugligt onder de band; daarboven een glazen
  strook tot 10 m die nog 0,5 m verder terugligt (uit foto's geschat). In de
  sokkel de glazen entree van Talia, een lage raamstrook, zes driehoekige ramen
  met de punt naar beneden en twee schuine glazen puien (de hoek van
  Doornroosje en de pui met de trap naar de fietsenstalling) als nissen met
  een plafond van 45 graden; aan het spoor een glazen pui tot 4,2 m.
- Donkere bakstenen band van 10 m tot het dek op 13,9 m over de hele
  BAG-contour, met een bakstenen laadtoren aan het noordeinde van de oostgevel
  en een opbouw tot 16,5 m aan de noordkant van het dek.
- Hoge L-vormige woonschijf van 13,8 m diep tot 44,2 m langs het
  Stationsplein en de zuidhoek aan het spoor. In de gevel aan het plein drie
  raamvelden van 0,35 m diep met elk drie witte vierkante kaders van 5 × 6 m
  (vol, met een raam in het midden), een gekleurde strook aan de spoorkant, twee
  smalle raamkolommen en een inham onderaan bij de oostkop (uit één foto,
  perspectief rechtgezet). Aan de oostkop een balkontoren van 2,8 m die vanaf
  21 m op een kraag van 45 graden uitkraagt boven een smallere kolom.
- Woonvleugel langs het spoor van 13,3 m breed tot 35,2 m, met de noordkop
  65 m van de zuidgevel en een inham aan de spoorkant.
- Galerijen en balkons aan de hofzijde van beide schijven en aan de
  balkontoren: per verdieping (3,03 m) een band van 1 m diep met een plafond
  van 45 graden tussen dichte vloerranden.
- Wit gefacetteerde spoorgevel: een raster van vakken van circa 7 × 6 m met
  knopen die 0, 0,45 of 0,9 m uitsteken, van de glazen pui tot de borstwering
  (36 m bij de vleugel, 45 m bij de hoge schijf).

Weggelaten: de lijnen in de witte tegels, de leuningen en dunne balkonplaten,
de gekleurde panelen (één materiaalklasse), de lampen, de daktuin met bomen en
de zonnepanelen; ze zijn kleiner dan 0,9 m of horen niet bij de vorm.

Printbaarheid: alles staat op dezelfde onderkant; nissen en kragen hebben een
bovenkant van 45 graden. De band kraagt horizontaal uit boven de sokkel; de
export zet daar met de optie ‘Printbare overhang’ een kraag onder. Op 1:1000
vult de export 1,0 % op en op 1:1500 1,4 % (circa 0,4 seconde).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Doornroosje_(Nijmegen))
(nieuwbouw aan het Stationsplein, geopend 1 oktober 2014), PDOK BAG (contour),
PDOK AHN (dsm en dtm 0,5 m via WCS: dek NAP +38,2 m, hoge schijf +68,5 m,
woonvleugel +59,5 m, borstwering +60,3 en +69,3 m, opbouw +40,8 m, plein
+24,3 m, lage weg +15 m en spoor +29 m), de PDOK luchtfoto en foto's van
Wikimedia Commons (`Doornroosje Talia 2016.jpg`,
`Doornroosje Nijmegen SSHN Talia.jpg`,
`Talia-Doornroosje, Stationsplein, Nijmegen.jpg`,
`Station Nijmegen Spoor 35.jpg`).

Licentie van het model: eigen werk op basis van open bronnen.
