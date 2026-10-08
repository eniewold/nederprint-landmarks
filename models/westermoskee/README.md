# Westermoskee (Amsterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `westermoskee.glb` | Catalogusbron in meters: node `building:westermoskee` met de gebedszaal, de koepel, de minaret, de noordwestvleugel en de twee zuilengangen |
| `westermoskee-1-1000.stl` | De moskee in één stuk op 1:1000, met de onderkant (1 m onder het maaiveld) op het printbed (34 × 47 × 43 mm) |
| `westermoskee.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong onder het hart van de koepel op RD
(119135,7, 486609,86), op het maaiveld (NAP +0,65 m) en de glTF-conventie Y
omhoog. +X loopt naar het noordoosten (RD-richting 51,84 graden), +Y naar het
noordwesten, het Piri Reisplein; de Kostverlorenvaart ligt aan de -Y-kant.
Het maaiveld wordt op vier punten op het plein en de straten rondom
bemonsterd (`groundSamplePoints`, NAP +0,6 tot +0,8 m), niet op de lagere kade.
Het catalogusitem vervangt BAG-pand `NL.IMBAG.Pand.0363100012241498`.

De moskee heeft één minaret.

Onderdelen in het model (hoogtes in NAP, uit het AHN-DSM in een stelsel langs
de gevels):

- De vierkante gebedszaal op de BAG-contour (28,3 × 28,3 m) tot de goot op
  +9,6 m, met de getrapte hoeken op +12,2 m en de kruisvormige onderbouw met de
  grote bogen op +18,5 m.
- De koepel als bolkap: voetstraal 11,5 m op +18,5 m, top op +26,8 m (binnen
  0,3 m van het DSM-profiel); de halve maan op de top is weggelaten.
- De minaret op de oosthoek: een vierkante voet tot de goot van de zaal en een
  schacht die taps toeloopt van 4,2 m doorsnede aan de voet naar 2,7 m op
  +36,5 m, met een spits tot +42,9 m (Wikipedia: 43 m). De tapsheid is
  geschat; de twee balkons zijn weggelaten.
- De noordwestvleugel aan het Piri Reisplein (+7,8 m) met het verhoogde portaal
  (+10,5 m).
- De twee zuilengangen als dichte blokken tot +8,3 m met een rij koepeltjes tot
  +9,9 m: aan de noordwestkant en schuin langs de vaart, waar de gang van de
  zaal wegloopt naar de westhoek. De verdeling van de koepeltjes (om de 3,6 m)
  is geschat.

Printbaar op 1:1000 zonder steun: alles staat recht op of wordt naar boven toe
smaller, en het script controleert dat geen vlak boven de onderkant naar
beneden wijst. De export vult recht naar beneden op. De export van een
uitsnede van 110 m op 1:1000 duurt circa 1 seconde.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Westermoskee) (Marc en Nada
Breitman, geopend in 2016; minaret van 43 m), PDOK BAG (contour), PDOK AHN (dsm
en dtm 0,5 m via WCS), de PDOK luchtfoto en foto's van Wikimedia Commons
(`Westermoskee Aya Sofya (Amsterdam, The Netherlands 2017).jpg`,
`Westermoskee - Amsterdam (26579109769).jpg`, `Westermoskee @ Schinkel canal
@ Amsterdam - 23743717542.jpg` en `Minaret @ Westermoskee Ayasofya Camii @
Amsterdam West (21947158531).jpg`). Geschat zijn de tapsheid van de minaret en
de koepeltjes van de zuilengangen; de bogen en zuilen, de balkons en de naald
van de minaret, de halve koepels op de bogen en de gevelindeling zijn niet
gemodelleerd.

Licentie van het model: eigen werk op basis van open bronnen.
