# Zuiderkerk (Amsterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `zuiderkerk.glb` | Catalogusbron in meters: node `building:kerk` (de kerk met de Zuidertoren, uit dakvlakken en bouwdelen) |
| `zuiderkerk-1-1000.stl` | De kerk op 1:1000 met de onderkant (0,6 m onder het maaiveld) op het printbed (44 × 34 × 65 mm) |
| `zuiderkerk.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (121805, 487050), in het middenschip,
op het maaiveld (NAP +1,2 m), en de glTF-conventie Y omhoog. +X loopt langs de
nok naar het oosten (60,3 graden linksom vanaf de RD-X-as, gemeten aan de
normalen van de LoD2.2-dakvlakken) en +Y loodrecht daarop. Het maaiveld wordt
rond de kerk bemonsterd (`groundSamplePoints`, NAP +1,1 tot +1,2 m); als geen van
die punten in de uitsnede valt, gebruikt de lader `groundHeight` 44,1 m (de
ellipsoïdische PDOK-terreinhoogte). Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0363100012171559` (kerk en toren in één pand).

Onderdelen (hoogtes boven het maaiveld op NAP +1,2 m, 44,2 bij 34 m en 65 m hoog
met de onderkant):

- Middenschip (u -22,7 tot 19 m, v -6,5 tot 7 m): zadeldak met de nok op +24 m
  (v = 0,3 m, 55 graden), topgevels aan beide kopse kanten (+24,7 m) met een
  pinakel op de oostgevel.
- Zijbeuken tot de zijgevels (v = -14,7 en +15,4 m): plat dak op +13,2 m met een
  schuine rand van 45 graden naar de goot (+10 m), zoals in het AHN; per travee
  een dwarse topgevel (4 m breed, +14,1 m) met een zadeldakje op de rand, aan
  beide kanten zes; pilasters langs de zijgevels en het zuidportaal met een
  zadeldak (+8,6 m).
- De Zuidertoren op de noordwesthoek (9,6 m in het vierkant): bakstenen
  onderbouw tot +30,5 m met een borstwering en vier hoekpinakels, een achtkant
  van 8,6 m met vier wijzerplaatnissen tot +44,2 m, een kroonlijst met acht
  pinakels, een tweede achtkant van 6,6 m tot +50,4 m, een derde van 5 m tot
  +55,8 m, een koepel en een spits tot +64,4 m (het hoogste AHN-punt).
- Vensternissen als spitsbogen, 0,5 m diep: per travee in de zijgevels, in de
  topgevels op de zijbeuken en in de oostgevel; galmgaten in de toren.

Vergelijking met het AHN-DSM (raster op 0,5 m, alleen cellen boven 3 m met een
meetwaarde): 74,7 % ligt binnen 1 m en 86,6 % binnen 2 m. De afwijkingen zitten
vooral in de toren (galmgaten, kroonlijsten en de dunne spits) en op de randen.

Printbaar op 1:1000: alle vlakken wijzen omhoog of staan verticaal, op de
spitsbogen en de kraag onder de kroonlijsten na (steiler dan 45 graden). De
export vult op 1:1000 en 1:1500 niets bij en op 1:2500 0,7 %. De STL is 23,6 cm³,
heeft 2.424 driehoeken en is één samenhangend deel (status NoError, geslacht 0).
Dunste delen op 1:1000: de pinakels 0,7 tot 0,8 mm en de spits 0,9 mm bovenin.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Zuiderkerk_%28Amsterdam%29)
en [Zuidertoren](https://nl.wikipedia.org/wiki/Zuidertoren), PDOK BAG, PDOK AHN
(dsm en dtm 0,5 m via WCS), 3D BAG LoD2.2 (api.3dbag.nl) en de PDOK luchtfoto.
Geschat zijn de dwarse topgevels op de zijbeuken (in het AHN niet hoger dan het
platte dak), de geledingen van de toren tussen de AHN-punten, de pinakels,
pilasters, het portaal en de nissen. Weggelaten: de wijzerplaten, balustrades,
beelden en het maaswerk.
