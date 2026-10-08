# Sint-Janskerk (Maastricht)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `sint-janskerk-maastricht.glb` | Catalogusbron in meters: node `building:kerk` (de kerk met de rode toren, uit dakvlakken en bouwdelen) |
| `sint-janskerk-maastricht-1-1000.stl` | De kerk op 1:1000 met de onderkant (1,8 m onder het maaiveld) op het printbed (55 × 21 × 74 mm) |
| `sint-janskerk-maastricht.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (176160, 317660), in het schip, op
het maaiveld (NAP +52,3 m), en de glTF-conventie Y omhoog. +X loopt langs de
nokken naar het koor (14,3 graden linksom vanaf de RD-X-as, gemeten aan de
normalen van de LoD2.2-dakvlakken) en +Y loodrecht daarop naar het noorden. Het
terrein daalt van NAP +54,3 m aan het Vrijthof (west) naar +51,1 m achter het
koor; het maaiveld wordt aan de zuid- en noordkant van het schip bemonsterd
(`groundSamplePoints`, NAP +52,3 tot +53,3 m) en het model begint 1,8 m onder het
maaiveld, zodat de voet achter het koor niet zweeft. Als geen van die punten in
de uitsnede valt, gebruikt de lader `groundHeight` 97,91 m (de ellipsoïdische
PDOK-terreinhoogte). Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0935100000017447`; de Sint-Servaasbasiliek ten noorden is een
eigen landmarkmodel.

Onderdelen (hoogtes boven het maaiveld op NAP +52,3 m, 54,9 bij 21,3 m en 73,6 m
hoog met de onderkant):

- Schip (u -20,5 tot 8,4 m): lichtbeuk tussen v = -4,4 en +6,2 m met een zadeldak
  (nok +19,3 m, 39 graden) en lage vensternissen boven de zijbeuken; zijbeuken
  onder lessenaarsdaken (zuid +11,9 naar +9,7 m tot v = -9,3 m, noord +12,2 naar
  +9,6 m tot v = 11 m) met vensternissen en vier steunberen aan de zuidkant.
- Koor: hoger dan het schip, nok +25,8 m (58 graden), 10,2 m breed, met een
  3/8-sluiting rond (16,5, 0,85) en een schild over de nok van het schip;
  steunberen met een punt tot +18,3 m op de hoeken van de sluiting en langs het
  koor, drie hoge vensternissen in de sluiting en een stenen plint (+4,5 m) tot
  de rooilijn achter het koor.
- De rode toren (u -30,5 tot -20,4 m): een onderbouw van 10,1 bij 10,7 m tot de
  eerste omgang op +41 m met getrapte hoeksteunberen, een hoge blinde boog met
  galmgaten en een spitsboognis per zijde; de borstwering van de eerste omgang
  (tot +42,2 m) met vier achtkantige hoekspitsen tot +49 m; een bovenbouw van 8 m
  tot +58 m met hoeksteunbeertjes en twee galmgaten per zijde; de tweede omgang
  tot +59 m met vier pinakels; en een achtkantige spits van 6,6 m tot +71,8 m
  (NAP +124,1 m, het hoogste AHN-punt) met vier wimbergen aan de voet.

Vergelijking met het AHN-DSM (raster op 0,5 m, alleen cellen boven 3 m met een
meetwaarde): 70,3 % ligt binnen 1 m en 78,5 % binnen 2 m. De afwijkingen zitten
vooral in de toren (galmgaten, spitsen en borstweringen) en op de gevelranden.

Printbaar op 1:1000: alle vlakken wijzen omhoog of staan verticaal, op de
spitsbogen na (steiler dan 45 graden). De export vult op 1:1000 en 1:1500 niets
bij en op 1:2500 0,6 %. De STL is 20,1 cm³, heeft 2.356 driehoeken en is één
samenhangend deel (status NoError). Dunste delen op 1:1000: de pinakels 0,8 mm
en de spitsen 0,9 mm bovenin.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Sint-Janskerk_%28Maastricht%29)
(basilicaal schip, koor uit de late 14e eeuw, toren van bijna 80 m), PDOK BAG,
PDOK AHN (dsm en dtm 0,5 m via WCS), 3D BAG LoD2.2 (api.3dbag.nl), de PDOK
luchtfoto en foto's op Wikimedia Commons. Geschat zijn de hoogtes van de
steunberen, de hoekspitsen en wimbergen, de vensternissen en galmgaten.
Weggelaten: maaswerk, de wijzerplaten, de open balustrades (dicht) en de
doopkapel als apart bouwdeel.
