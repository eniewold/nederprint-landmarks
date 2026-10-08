# Mevlana Moskee (Rotterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `mevlana-moskee.glb` | Catalogusbron in meters: node `building:moskee` (de gebedszaal met de tamboer en koepels, de gebogen voorgevel met galerij en terras, de twee zijtorens en de minaretten) |
| `mevlana-moskee-1-1000.stl` | De moskee op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (25 × 38 × 40 mm) |
| `mevlana-moskee.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (89956,73, 437396,58), het
zwaartepunt van het BAG-pand, op het maaiveld (NAP −1,0 m), en de
glTF-conventie Y omhoog. +X loopt naar het noordoosten (53,25 graden tegen de
klok in vanaf de RD-X-as) en +Y loodrecht daarop naar het noordwesten; de
voorgevel met de zijtorens en de minaretten staat aan de +Y-kant (noord, v
circa 14,5 tot 18,5 m), de grote koepel aan de −Y-kant. Het gebouw is
symmetrisch om u = −0,8 m. Het maaiveld wordt op vier punten rond de
moskee bemonsterd (`groundSamplePoints`, NAP −1,0 tot −0,9 m). Vervangt de
PDOK-reconstructie van `NL.IMBAG.Pand.0599100000652535`.

Onderdelen (hoogtes boven het maaiveld, uit het AHN-DSM op 0,25 m; geen
hoogteveld maar prisma's, omwentelingen, bolkappen en nissen):

- De gebedszaal (23,3 m breed, 34 m lang) met een vlak dak op +10,55 m en een
  dakrand van 0,9 m breed en 0,3 m hoog (het AHN geeft +10,5 m en +10,7 m op
  de rand). De dakrand ligt aan de west- en zuidkant 1,7 m buiten de
  BAG-contour (de AHN-dakrand is daar symmetrisch om u = −0,8 m); aan de
  achterkant zijn de hoeken onder 45 graden afgeschuind (3,4 m); de oostkant
  volgt de BAG (11,05 m, met de uitbouw naar 12,35 m).
- Een achthoekige tamboer om de grote koepel: platte vlakken op 8,4 m (kruis)
  en 8,8 m (diagonaal) van het hart (−1; −6) m, van het dak tot +11,9 m, met een
  kroonlijst (schuine onderkant, 0,4 m uit, tot +12,9 m). Daarop een ronde hals
  van 8,0 m straal tot +14,8 m met 16 vensternissen (0,9 m breed, nis onder
  48 graden) en de koepel (19,2 m aan de voet, top +21,6 m) met het gemeten
  radiale profiel; het profiel is flauwer dan een bol.
- Vier halve koepels tegen de diagonale zijden van de achthoek: bolkappen van
  2,6 m straal met hun hart op het platte vlak en de top op +11,75 m (het AHN
  geeft hier +11,1 tot +11,6 m).
- Vier kleine koepels op een lage trommel (0,5 m hoog, 0,25 m breder dan de
  koepel): bolkappen van 5,0 m doorsnee (top +13,3 m) om (−0,9; 5,3) en
  (−0,9; 12,6) m en van 3,4 m doorsnee (top +12,1 m) om (−6,1; 5,4) en
  (4,3; 5,4) m, symmetrisch om u = −0,9 m. Rond elke trommel ligt een ronde
  uitsparing in het dak (0,9 m breed, 0,5 m diep), afgesneden tegen de dakrand,
  de tamboer en de buurkoepels.
- De gebogen voorgevel: de gevel van de zaal is een boog van 26 m straal (top
  op v = 16,3 m) met zes nissen (1,1 m breed, 1 m diep, tot +8,0 m) boven de
  openingen eronder. Voor de gevel ligt een terras op +3,0 m tussen de gevel en
  de BAG-boog (13,8 m straal om (−0,75; 4,2) m, 1,0 tot 1,8 m breed), met een
  galerij van zes spitsboogopeningen (1,0 m breed, 1,5 m recht plus 48 graden
  puntdak, vloer op 0 m) tussen zeven pijlers, een balustrade (0,9 m breed,
  tot +3,45 m) en zeven bolkoepeltjes van 1,3 m doorsnee (top +4,1 m); het AHN
  geeft het terras op +3,3 m en bulten van +4,1 tot +4,2 m.
- Twee zijtorens van 3,4 m breed en circa 4 m diep (BAG-voet, naar het AHN
  0,7 m naar het westen of oosten geschoven) op u = −11,2 tot −7,8 m en 6,2 tot
  9,6 m, met een schuine voorkant (BAG) en een nis in de buitenwand (2 m breed,
  tot +13,3 m). De wanden zijn loodrecht tot +14,5 m en lopen daarboven
  schuin toe naar de minaretvoet (1,6 m straal) op +27,5 m.
- Twee minaretten van +40 m op (−9,5; 16,5) en (7,9; 16,5) m (AHN-top
  +40,8 m, symmetrisch om u = −0,8 m): een balkon op 27,5 m (onderkant helt
  onder 54 graden, 3,7 m doorsnee tot 28,75 m), een schacht van 1,9 m doorsnee, een
  tweede balkon op 33 m (2,4 m doorsnee) en een spits. Het AHN toont de dunne
  schacht en het open kantwerk lager (de schacht ligt rond 0,9 m straal).

Vergelijking met het AHN-DSM (rastervergelijking op 0,25 m, cellen boven 3 m
waar het model aanwezig is): 86,8 % ligt binnen 1 m en 93,2 % binnen 2 m
(het vorige model: 83,0 % en 92,1 % op dezelfde cellen). Gerekend over alle
cellen boven 3 m, ook waar het model ontbreekt: 79,2 % binnen 1 m en 85,1 %
binnen 2 m (vorige model 68,3 % en 75,8 %); het dak 93,4 % en 98,4 %, de
koepel 91,6 % en 97,1 %. Het ontbrekende deel (78 m² boven 3 m) is
de lagere aanbouw ten oosten van de achtergevel (+5 tot +7 m) en de strook
bomen of overkapping ten westen van de dakrand (+4,7 tot +5 m, in het AHN
mogelijk gevuld). De zijtorens liggen onder de balkons van de minaretten
verborgen voor het AHN, dus daar is geen betrouwbare vergelijking.

Printbaar op 1:1000: alle vlakken staan verticaal of hellen minder dan
45 graden (nissen en openingen hebben een puntdak van 48 graden, de balkons
een onderkant onder 54 tot 58 graden, de kroonlijst onder 51 graden); er is geen
`OVERHANG_OK` nodig. De export vult op 1:1000 maar 0,06 % bij, op 1:1500
0,07 % en op 1:2500 1,06 %. De STL is 11,2 cm³ en het model één samenhangend
deel (genus 0, 35 600 driehoeken). De kleinste onderdelen zijn de pijlers van
de galerij (0,8 tot 1,0 mm), de balustrade (0,9 mm), de ronde uitsparingen
(0,9 mm breed) en de minaretschacht (1,9 mm doorsnee).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Mevlana_Moskee) (2001,
architect Bert Toorman; Wikipedia noemt minaretten van 42 m), PDOK BAG (het
pand), PDOK AHN (dsm en dtm 0,25 m via WCS) en de PDOK luchtfoto. Geschat zijn
de hoogte van de zijtorens en hun schuine top, de galerijopeningen en
gevelnissen, de hals en de vensters, de balkons, de doorsnede van de minaretten
(40 m; het AHN geeft +40,8 m op de dunne spits, Wikipedia 42 m) en de stralen
van de halve en kleine koepels. De vijf koepeltjes in een rij die op
foto's te zien zijn, zijn in het AHN vier (drie in een rij en een voor); de twee
bultjes van +0,7 m bij (−4,3; 7,1) en (2,6; 7,1) zijn waarschijnlijk
dakunits en zijn weggelaten. Weggelaten: de zonnepanelen en installaties, het
kantwerk, het gevelreliëf en de kleuren.
