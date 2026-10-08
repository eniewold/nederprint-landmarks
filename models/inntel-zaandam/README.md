# Inntel Hotel (Zaandam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `inntel-zaandam.glb` | Catalogusbron in meters: node `building:hotel` (toren met huisgevels, mansardedak en vleugel als gesloten solid) |
| `inntel-zaandam-1-1000.stl` | Het hotel op 1:1000 met de onderkant (NAP +0,5 m) op het printbed (71 × 31 × 39,5 mm) |
| `inntel-zaandam.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (116158,79, 494630,03), in de
toren, op het maaiveld (NAP +1,0 m), en de glTF-conventie Y omhoog. +X loopt
langs de vleugel naar het oostnoordoosten (RD-richting 20,1 graden,
evenwijdig aan de gevels); +Y wijst naar het noordnoordwesten. Het maaiveld
wordt op het trottoir aan de zuidkant van de vleugel bemonsterd
(`groundSamplePoints`, AHN NAP +1 m). Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0479100000080433` (toren en vleugel).

Onderdelen (hoogtes in NAP):

- De hoteltoren op de BAG-contour (30 bij 24 m met de uitbouwen aan de
  noord- en oostkant) tot de goot op +34 m, een mansardedak rondom van 3,5 m
  diep tot +38 m en de liftopbouw tot +40 m (AHN-DSM 34, 37 tot 39 en 40 m).
- Op de gevels van de toren 78 huisgevels in vier rijen vanaf +6 m: elk zo'n
  5 m breed, een romp van 4,5 m en een puntgevel van 2,5 m (de bovenste rij
  een romp van 6 m en een puntgevel tot +37 m, voor het mansardedak), per
  rij een halve breedte verspringend en afwisselend 0,3, 0,6 of 0,9 m uit de
  gevel op een onderkant van 50 graden. De westgevel heeft pas huisgevels
  boven de vleugel.
- De lage vleugel tot de goot op +11 m met per huisje (om de 7,2 m, de
  verspringingen in de BAG-contour) een zadeldak dwars op de vleugel tot de
  nok op +15 m, met de puntgevel naar beide straten.

Vergelijking met het AHN-DSM: binnen de voetafdruk ligt 57 % van de circa
5.600 DSM-cellen binnen 1 m en 78 % binnen 2 m (mediaan -0,26 m); de
afwijkingen zitten in de dakkapellen en daken van de bovenste huisjes en in
de uitstekende huisgevels, die op het DSM als rand verschijnen.

Printbaar op 1:1000 zonder steun: de muren staan recht op, de daken en
puntgevels lopen onder 45 graden of steiler omhoog en de huisgevels rusten op
een onderkant van 50 graden; het script controleert dat geen vlak vlakker
dan 45 graden naar beneden wijst. Met overhangopvulling op 1:1000 blijft
34,2 cm³ over boven de onderplaat (recht naar beneden opgevuld 41,3 cm³). In
de kaart en in de preview van een uitsnede van 120 m staan toren en vleugel
met de puntgevels naar de straat, zonder het vervangen pand.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Inntel_Hotel_Zaandam)
(WAM Architecten, 2010, gevels van gestapelde Zaanse huisjes), PDOK BAG (het
pand met de verspringende gevels van de vleugel), PDOK AHN (dsm en dtm 0,5 m
via WCS: goot, nok en liftopbouw van de toren, nokken van de vleugel,
maaiveld), de PDOK luchtfoto en foto's op Wikimedia Commons. Geschat zijn de
indeling van de huisgevels (breedte, rijen, uitsteekdiepte; de echte gevel
is grilliger) en de diepte van het mansardedak. Vereenvoudigd: de huisgevels
hebben alle een gewone puntgevel (geen klok- en halsgevels), de dakkapellen,
de vensters en het blauwe huis ontbreken en de open plint is dicht.
