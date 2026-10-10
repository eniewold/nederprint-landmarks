# Effenaar (Eindhoven)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `effenaar.glb` | Catalogusbron in meters: één node `building:effenaar` met de doos, de buitentrappen en bordessen, het gevelreliëf en de installaties op het dak |
| `effenaar-1-1000.stl` | De Effenaar in één stuk op 1:1000, met de onderkant (1 m onder het maaiveld) op het printbed (30 × 43 × 25 mm) |
| `effenaar.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

Poppodium Effenaar (MVRDV, 2005) aan de Dommelstraat. De GLB is in meters
met de oorsprong op RD (161677.5, 383632.5) op het maaiveld (NAP +16,0 m) en
de glTF-conventie Y omhoog. +X loopt langs de gevels aan het plein en de
Dommelstraat (RD-richting 12,2 graden linksom vanaf het oosten), +Y naar de
Dommelstraat aan de noordkant. Het maaiveld wordt op vier punten rondom
bemonsterd (`groundSamplePoints`); `groundHeight` (59,73 m, ellipsoïdisch) is
de laagste PDOK-terreinhoogte op die punten. Het catalogusitem vervangt
BAG-pand `NL.IMBAG.Pand.0772100000354810`, waarvan de contour de stroken van
de trappen aan de noord- en zuidkant en de uitbouwen aan de west- en oostkant
omvat.

Onderdelen in het model (hoogtes boven het maaiveld, uit het AHN tenzij anders
vermeld):

- De doos van 26,55 × 39,8 m met een plat dak op 21,95 m en drie
  installatieblokken tot 23,6 m.
- Trap aan de Dommelstraat (strook van 1,8 m): vanaf de oosthoek een trapband
  van 1,5 m dik over een dichte invulling die 0,4 m terugligt, met een
  tussenbordes op 7,1 m, naar het bordesblok boven de glazen entree (10,4 m,
  onderkant 4,8 m); daarna vrije vluchten van 3 m dik via een bordes op 13,2 m
  naar het bovenste bordes op 15,8 m op de noordwesthoek.
- Langs de westgevel loopt de trap door naar een bordes op 19,7 m.
- Trap aan het plein (strook van 1,15 m): een vrije band van 1,8 m dik met
  bordessen op 6,3, 9,7, 12,1 en 14,3 m naar het bordes op de zuidoosthoek
  (17,6 m), dat langs de oostgevel doorloopt naar 20,7 m.
- Aan de oostkant een donker nooduitgangsblok van 6 m.
- Noordgevel: de glazen entree 1 m terug onder het bordesblok en de vrije
  vlucht, glazen stroken bovenin (0,35 m), geperforeerde panelen (0,2 m) en het
  grote donkere vlak met de letters (0,3 m), naar een frontale foto uitgezet.
- Oostgevel: een rij van acht kleine vierkante ramen hoog in het beton.

Geschat: de dikte van de trapvluchten, bordessen en het bordesblok, de
stroken, panelen, het donkere vlak en de entree in de noordgevel (één
frontale foto), de kleine ramen, en of de trap aan het plein vrij of dicht
is (daar is geen foto van; het AHN en de luchtfoto tonen alleen de
bovenkant). Weggelaten: de letters, de leuningen, de lampen, de zonnepanelen
op het dak en de stof- en paneelstructuur van de gevel (kleiner dan 0,9 m).

Printbaarheid: alles staat op dezelfde onderkant. Onder de vrije vluchten,
de bordessen en het bordesblok zet de export met de optie ‘Printbare
overhang’ een kraag van 45 graden; op 1:1000 vult hij 1,8 % op en op 1:1500
2,4 % (circa 1 seconde).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Effenaar) (nieuwbouw van
MVRDV, 2005), PDOK BAG (contour), PDOK AHN (dsm en dtm 0,5 m via WCS: dak NAP
+37,95 m, de hellingen en bordessen van de trappen, het nooduitgangsblok, de
installaties en het maaiveld), de PDOK luchtfoto en foto's van Wikimedia
Commons (`Effenaar - panoramio.jpg`, `Poppodium De Effenaar.jpg`,
`Effenaar.jpg`, `Stairs Effenaar Eindhoven.jpg`,
`13-06-28-eindhoven-by-RalfR-51.jpg`).

Licentie van het model: eigen werk op basis van open bronnen.
