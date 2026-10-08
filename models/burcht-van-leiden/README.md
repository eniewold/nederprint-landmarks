# Burcht van Leiden (Leiden)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `burcht-van-leiden.glb` | Catalogusbron in meters, zonder motte: nodes `road:binnenplaats, pad en trap`, `building:ringmuur en poorten`, `building:voorpoort` |
| `burcht-van-leiden-1-100.stl` | Ringmuur met kantelen, spaarbogen en poorten, binnenplaats met middenplateau en waterput, zonder heuvel (372 × 378 × 86 mm) |
| `burcht-van-leiden-heuvel-1-250.stl` | Alles inclusief motte, rondpad, trap en voorpoort op 1:250 (300 × 324 × 73 mm) |
| `burcht-van-leiden.json` | Catalogusitem met RD-georeferentie, hoofdmaten en bronnen |

De STL's zijn in millimeters met Z omhoog en de oorsprong in het hart van de
ringmuur op het niveau van de muurvoet (het plateau van de motte, circa
NAP +11,45 m); de GLB gebruikt dezelfde oorsprong in meters met de
glTF-conventie Y omhoog. De hoofdpoort uit 1651 met de trap ligt richting -Y
(in RD azimut 329 graden, zuidoost; in de GLB richting +Z), de kleine
noordpoort op azimut 85 graden. De trap loopt vanaf de poort 17 graden gedraaid
(azimut 312 graden) naar de voorpoort aan de Burgsteeg, volgens de
betonvlakken in de BGT. Omdat het PDOK-terrein de heuvel al bevat, bemonstert
de catalogus het maaiveld via `groundSamplePoints` op het rondpad (straal
20 m), zodat de muurvoet op het plateau staat.

De motte zit alleen in de STL met heuvel, niet in de GLB: in de app komt de
heuvel uit het PDOK-terrein. Een meegemodelleerd talud stak op de plateaurand
(tot 0,3 m) en aan de heuvelvoet (tot 0,9 m) boven dat terrein uit. Onder de
muurvoet ligt het PDOK-terrein 0,1-0,5 m boven het bemonsterde rondpad, dus
zonder motte ontstaan daar geen gaten; het rondpad loopt 0,5 m door onder het
plateau, omdat het terrein daar plaatselijk tot 0,3 m lager ligt.

Onderdelen in het model:

- Motte (alleen in de STL met heuvel) als omwentelingslichaam met het
  AHN-profiel, 0,3 m verlaagd en aan de voet steiler afgesneden (plateau tot
  straal 21,5 m, voet op straal 37,5 m, 9,75 m lager).
- Ringmuur met binnendoorsnede 35,5 m, dikte 0,85 m, borstwering tot 5,4 m en
  44 kantelen tot 6,6 m; aan de binnenzijde twintig spaarbogen onder een
  weergang op 4,2 m.
- Hoger, iets uitspringend poortvak van 8,6 m aan de zuidzijde met boogdoorgang
  en natuurstenen omlijsting; kleine boogdoorgang aan de noordzijde.
- Binnenplaats met verhoogd middenplateau van 1,1 m en vijf halfronde treden
  naar de poort, plus de bakstenen waterput.
- Rondpad om de muur, trap van 27 treden met lage zijmuren over de
  zuidoosthelling (hoogteverloop uit het AHN langs de traplijn, 0,8 m boven het
  maaiveld zodat hij boven het PDOK-terrein uitkomt) en de voorpoort met twee
  pijlers aan de voet.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Burcht_van_Leiden),
[Rijksmonumentenregister 532258](https://monumentenregister.cultureelerfgoed.nl/monumenten/532258),
PDOK BGT (`wegdeel`, `onbegroeidterreindeel`; cirkels rond het rondpad en de
binnenplaats), PDOK AHN (dtm en dsm 0,5 m: plateau, muurtop en heuvelprofiel)
en de PDOK luchtfoto, plus Wikimedia Commons-foto's
(Category:Burcht van Leiden) voor kantelen, spaarbogen, poort, binnenplaats,
trap en voorpoort. Doorsnede, muurhoogte, muurdikte en heuvelhoogte zijn
gedocumenteerd; muurpositie, trap, voorpoort en heuvelprofiel komen uit BGT en
AHN (de poortrichting uit het verlengde van de trap); aantal kantelen en bogen, poorthoogte, plateau, trap en voorpoort zijn uit
foto's geschat.

Licentie van het model: eigen werk op basis van open bronnen.
