# Lebuïnuskerk (Deventer)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `lebuinuskerk.glb` | Catalogusbron in meters: node `building:kerk` (schip, zijbeuken met dwarsdaken, dwarsschip, koor, hal en toren uit dakvlakken en bouwdelen) |
| `lebuinuskerk-1-1000.stl` | De kerk op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (132,7 × 44,9 × 67,7 mm) |
| `lebuinuskerk.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (207439,04, 474048,45), het
zwaartepunt van het BAG-pand van de kerk, op het maaiveld (NAP +7,8 m), en de
glTF-conventie Y omhoog. +X loopt langs de as van het schip naar het
noordoosten (24,75 graden tegen de klok in vanaf de RD-X-as) en +Y loodrecht
daarop naar het noordwesten. De toren staat in het zuidwesten (u −46,7 tot
−32,4 m), het koor in het noordoosten (u 30 tot 58 m) en de noordwestelijke hal
tot u = −75 m. Het maaiveld wordt op vier punten rond de kerk bemonsterd
(`groundSamplePoints`, NAP +7,4 tot +8,8 m). Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0150100000001106` (de kerk met het koor en de hal) en
`NL.IMBAG.Pand.0150100000002210` (de toren).

Het model is opgebouwd uit dakvlakken (planvergelijkingen z = a u + b v + c,
afgelezen uit de nokken en goten van het AHN-DSM) en bouwdelen, niet uit lagen:
elk dak is een prisma op de muurlijn dat met `trimByPlane` onder zijn vlakken
wordt gehouden, en het geheel wordt op de BAG-contouren begrensd (hoogtes boven
het maaiveld):

- **Schip**: steil zadeldak met vlakken van 1,67 m per m (59 graden) en een
  afgeplatte nok op +28,05 m (de vlakken komen op +28,45 m samen); de nok loopt
  van v = −0,5 m in het westen naar −1,1 m in het oosten (de as van het koor
  wijkt een halve graad af). Westelijk afgewolfd (1,67 m per m, nokeinde op
  u = −41,4 m), oostelijk met een steilere wolf (1,95 m per m, nokeinde op
  u = 40,6 m) die in de koorsluiting overgaat.
- **Zijbeuken**: een kilgootvlak dat vanaf de schipmuur (+22,9 m) met 0,46 m per m
  (zuid) en 0,45 m per m (noord) naar de vlakke goot op +18,2 m daalt, met daarop
  een dwars zadeldak per travee: horizontale nok op +22,8 m, vlakken van 1,8 m per m
  (61 graden), afgewolfd aan de buitenmuur (1,6 m per m over 2,9 m). Acht daken aan de
  zuidkant (u −26,9 tot 11,8 m), negen aan de noordkant (u −31,6 tot 12,2 m) en twee
  per zijde in het rechte koordeel (u 30,1 en 36,9 of 37,4 m): afstand 5,5 à 5,7 m.
  De twee westelijke zuidtraveeën hebben een flauwere kilgoot (0,33 m per m).
- **Dwarsschip**: nok langs v op u = 20,75 m, +28,15 m, vlakken van 1,75 m per m,
  afgewolfd (2,1 m per m) tot de goot van de zijbeuken. Het **zuidportaal** (u 14,2
  tot 27,4 m, v −17,5 tot −25,1 m) heeft een afgewolfd zadeldak met de nok langs u
  op +25,4 m (v = −21), een trappentorentje aan de oostkant en diagonale hoeksteunberen;
  op de nok staat een slanke dakruiter (2,5 m breed, tot +37 m, in het DSM duidelijk
  aanwezig).
- **Koor**: het schip gaat over in een naaf op (38,8, −0,6); daaromheen een
  kegelvormige kilgoot (0,48 m per m, tussen +22,75 m op 4,9 m van de naaf en +18,2 m
  op 14,3 m) met zes radiale, afgewolfde kapeldaken (nok +22,8 m, hoeken −70,5, −43,5,
  −16,5, 10,5, 37,5 en 64,5 graden) en de muurlijn van de kapellen uit de BAG-contour.
- **Hal** (noordwest, u −73 tot −32,6 m): zadeldak met vlakken van 1,95 m per m, nok
  op +21,0 m die van v = 10,2 m in het westen naar 8,6 m in het oosten schuift
  (de noordmuur loopt niet evenwijdig), afgewolfd aan de westkant (1,9 m per m), een
  gebroken goot (+13,5 m) aan de zuidkant, lage steunberen en twee lage aanbouwen aan
  de westkant (+3,4 m en +7,7 m) en een lage aanbouw (sacristie, +6,8 m) langs de
  noordzijde van het koor.
- **Toren** (u −46,7 tot −32,4 m, v −17,7 tot −4,2 m): vierkante schacht met licht
  taps toelopende wanden tot +46,4 m (de westgevel wijkt 1,7 m terug over de hoogte),
  drie steunberen met een afgeschuinde top tegen de zuidgevel, een hoekblok aan de
  zuidoosthoek (+27 m), een hoekblok aan de zuidwesthoek (+18,9 m) en een portaalstrook
  tegen de westgevel (tot +21 m); daarboven de achthoekige lantaarn (apothema 5,75 m,
  hart (−39, −11)) tot +56,4 m, de koepel (vijf achthoekige ringen tot +61,5 m, afgeleid
  uit het DSM), een schijf tot +62,4 m en de kroon als spits tot +67,2 m.
- **Steunberen** (1,3 m breed, 1,7 tot 2,3 m diep, top op +19,4 tot +19,8 m, daarna steil
  aflopend): tegen de zijbeuken, het rechte koor en rond de koorsluiting, uit de
  BAG-contour overgenomen. **Vensters**: per travee een verdiepte spitsboognis (2,6 m
  breed, ongeveer 0,9 m diep, van +3 tot +13,4 m), idem in het zuidportaal, de zes
  kapellen, de toren (vier gevels, +29,5 tot +43,5 m) en galmgaten in de lantaarn.

Vergelijking met het AHN-DSM (rastervergelijking op 0,25 m, cellen boven 3 m): 91,6 %
ligt binnen 1 m en 95,3 % binnen 2 m (voorheen 77,5 % en 94,3 %); in het binnenste
van de bouwdelen, zonder de gevelranden van één cel, 95,3 % en 97,6 %. Per bouwdeel
(binnen 1 m, binnen 2 m): schip 99,9 % en 100 %, zuidbeuk 98,0 % en 99,6 %, noordbeuk
98,1 % en 99,6 %, dwarsschip 99,7 % en 99,9 %, rechte koordeel 98,1 % en 98,8 %,
koorsluiting 88,3 % en 94,6 % (binnenste 95,9 % en 99,6 %), hal 83,4 % en 93,2 %
(binnenste 91,8 % en 99,4 %), toren 61,4 % en 71,6 % met de wanden (binnenste 84,1 %
en 90,8 %). De afwijkingen zitten in de gevelranden van één cel (de wanden en
steunberen staan verticaal, het DSM interpoleert), het zuidportaal en de koepel.

Printbaar op 1:1000: alles staat op de onderkant op −0,5 m en alle vlakken wijzen
omhoog of staan verticaal (de nissen hebben spitse toppen steiler dan 45 graden), dus
het script slaagt zonder `--allow-overhang`. De export vult op 1:1000 en 1:1500
0,01 % op, op 1:2500 0,56 %. De STL is 86,0 cm³ (3826 driehoeken) en het model één
samenhangend deel (genus 0).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Grote_of_Lebuinuskerk), PDOK
BAG (de twee panden), PDOK AHN (dsm en dtm 0,5 m via WCS), de PDOK luchtfoto en
foto's op Wikimedia Commons (lantaarn van Hendrick de Keyser, 1613, balustrade en
steunberen van de toren). Geschat zijn de ligging en maat van de vensternissen en
galmgaten, de afschuining van de steunberen, de koepelvorm en de kroon tussen de
DSM-cellen. Weggelaten: het maaswerk, pinakels en gevelreliëf onder 0,9 m, het
uurwerk, de kruisroos op de kroon en de balustrade rond de lantaarn (smaller dan
0,9 m).
