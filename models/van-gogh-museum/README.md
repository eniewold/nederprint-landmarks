# Van Gogh Museum (Amsterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `van-gogh-museum.glb` | Catalogusbron in meters: node `building:museum` (het hoofdgebouw en de Kurokawavleugel als twee losse delen, uit bouwdelen, een bol- en een cilindervlak) |
| `van-gogh-museum-1-1000.stl` | Het museum op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (58 × 99 × 27 mm) |
| `van-gogh-museum.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (120520,94, 485729,13), het
zwaartepunt van het hoofdgebouw, op het maaiveld van het Museumplein (NAP +0,6
m), en de glTF-conventie Y omhoog. +X loopt langs de gevels van het
hoofdgebouw naar het noordoosten (23,25 graden tegen de klok in vanaf de
RD-X-as) en +Y loodrecht daarop naar het noordwesten, naar de Paulus
Potterstraat. De Kurokawavleugel ligt ten zuiden van het hoofdgebouw (v -72 tot
-33 m). Het maaiveld wordt op vier punten op het Museumplein bemonsterd
(`groundSamplePoints`, NAP +0,6 m). Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0363100012098679` (het hoofdgebouw) en
`NL.IMBAG.Pand.0363100012211564` (de Kurokawavleugel).

Het model is opgebouwd uit bouwdelen en dakvlakken (geen hoogteveld en geen
gestapelde lagen); de hoogtes zijn de medianen van het AHN-DSM (0,25 m) per vlak
dak, boven het maaiveld op NAP +0,6 m. Alle bouwdelen staan als kolommen vanaf
dezelfde onderkant en overlappen elkaar, de gevels zijn verticaal.

Het hoofdgebouw van Rietveld (BAG-pand 0363100012098679, u -25 tot 28,5, v -28 tot
27,8 m) is een stapeling van platte daken op de BAG-contour:

- De lage terrassen op +7,1 m over de hele contour, ook de oostelijke aanbouw. Het
  uitsteeksel van de BAG-contour aan de oostkant (u 25 tot 29, v 2,6 tot 8,4 m,
  18 m²) is weggelaten: het DSM ziet daar maaiveld, de oostgevel loopt nu recht door
  van (25,4; 2,3) naar (23,2; 12,3).
- De westvleugel op +13,0 m: u -25,3 tot -10,2 en v -7,4 tot 27,9 (15 bij 35 m), met
  een noordverlenging (u -10,2 tot -4,5, v 17,0 tot 27,9) en een kort zuidelijk been
  (u -25,3 tot -21,0, v -8,6 tot -7,0).
- Het centrale dak op +21,0 m (u -10,0 tot 17,9, v -13,3 tot 17,5; 28 bij 31 m).
- De trappenhuiskern op +24,0 m met een versprongen plattegrond: 10,6 bij 15,8 m in
  het zuiden (u -10,1 tot 0,5, v -18,3 tot -2,5) en 5,5 bij 5,0 m in het noorden
  (u -10,1 tot -4,6, v -2,5 tot 2,5); hij steekt 5 m ten zuiden van het centrale
  dak uit. Daarnaast de liftkern op +26,5 m (u -12,1 tot -9,0, v 6,8 tot 10,3; het
  hoogste punt van het model) en een verhoogde rand tegen de westgevel van het
  centrale dak (1,9 m breed, +15,3 m, naar het zuiden aflopend tot +14,0 m).
- De strook langs de oostgevel van het centrale dak op +12,0 m (1,8 bij 16 m,
  u 17,5 tot 20,4, v -3,6 tot 12,6).
- Het zuidwestelijke blok op +18,8 m (u -20,8 tot -9,3, v -26,2 tot -7,2; 11,5 bij
  19 m) met vier zaagtanden voor de lichtstraten: elke tand is 5,2 m lang
  (de zuidelijke 6,3 m), heeft een verticale noordwand van 1,2 m (nok op +20,0 m,
  bij v -13,0, -15,5, -18,0 en -20,5) en een glasvlak dat 2,2 m naar het zuiden
  afloopt; verder een dakopbouw van 2,3 bij 3,7 m op +20,4 m.

De Kurokawavleugel (BAG-pand 0363100012211564) is een exacte ellips: middelpunt
(-0,81; -51,69), halve assen 27,95 en 18,03 m, de lange as 12,52 graden gedraaid
(de 200 BAG-punten liggen binnen 0,15 m van de ellips). Het dak bestaat uit twee
delen, gescheiden door een rechte verticale snede (de wand is 7 tot 10 m hoog):

- Het zuidelijke titaniumdak is een bolkap, z = 14,50 - 0,003895 ((u + 4,86)² +
  (v + 49,83)²): straal 128,4 m, top +14,50 m bij (-4,86; -49,83), aflopend tot
  +12,9 m aan de zuidrand, +12,3 m aan de westpunt en +10,6 m aan de oostpunt (het
  AHN geeft aan de westrand tot 0,7 m minder: de rand buigt iets om). Het is als
  convexe hull van punten op ringen om de top opgebouwd (ringafstand 4 m, punten
  om de 5 m): vlakke facetten van circa 5 m, afwijking van de bol onder 0,1 m. De
  bolkap is uit het AHN gefit (rest 0,075 m, 97 % van de punten binnen 0,4 m).
- De dakrand steekt aan de zuidkant tot 1,4 m, aan de westkant 0,65 m en aan de
  oostkant niet buiten de gevellijn (het AHN ziet het dak daar); de rand is een
  tweede ellips (middelpunt (-1,10; -52,60), halve assen 28,3 en 18,5 m) en 1,5 m
  dik, de enige overhang van het model.
- De snede ligt ten noorden van de bolkap: v -47,4 van u -18 tot 5,2, ten westen
  daarvan zakt hij mee met de ellips tot v -49,7 (u -26), ten oosten van u 5,2 ligt
  hij op v -49,0. Het noordelijke dak is een halve cilinder die van de snede
  opwaarts loopt, z = 18,07 + 0,3007 v + 0,007224 (u - 3,39)²: +3,8 m aan de snede
  (u 3,4), +8,5 m aan de noordrand en +9,5 m aan het westelijke uiteinde (straal
  69 m, helling 16,7 graden, rest 0,09 m). Het is een geschoren extrusie van een
  parabool met strookjes van 2 m, elk een plat vlak.
- Langs de wand: een driehoekige lichtkoker met vlak dak op +11,3 m (u -9,4 tot 4,7,
  schuine noordwand van (-9,4; -47,1) naar (3,0; -43,4)) en ten oosten ervan een
  richel van 1,85 m breed op +9,6 m (u 5,0 tot 18,0).

Vergelijking met het AHN-DSM (rastervergelijking op 0,5 m, cellen boven 3 m, zoals
bij de vorige versie): 93,0 % ligt binnen 1 m en 95,9 % binnen 2 m (voorheen 89,7 %
en 92,9 %). Op 0,25 m: 92,1 % en 95,4 %, rms 1,15 m (voorheen rms 1,71 m); op de
daken zelf, zonder 1 m rond de randen, 94,3 % en 97,0 %. De resterende afwijkingen
zitten in de gevelranden (het DSM smeert steile wanden over circa 1 m), in de
oost- en westpunt van het noordelijke dak (tot 2 m) en in een strook van 1,2 m
langs de westwand van de kern. Het rasterdak van de lichtstraten ligt in het DSM
vlak (0,1 m reliëf) en is dus niet gemodelleerd.

Printbaar op 1:1000: alle delen staan op de grond en alle vlakken wijzen omhoog of
staan verticaal, behalve de 1,5 m dikke dakrand van de Kurokawavleugel (1,4 mm
overhang op 1:1000; het script staat alleen daar een ondervlak onder 45 graden
toe en slaagt zonder `--allow-overhang`). De export vult op 1:1000 en 1:1500 0,09 %
van het volume op (alleen onder de dakrand) en op 1:2500 0,95 %. De kleinste
delen zijn de zaagtanden (5,2 bij 2,2 m, 1,2 m hoog) en de richel (1,85 m breed).
De STL is 55,6 cm³ en bestaat uit twee losse delen (het hoofdgebouw 37,3 cm³ en de
Kurokawavleugel 18,3 cm³), die in de tegel door het terrein aan elkaar zitten.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Van_Gogh_Museum), de
[ingangshal van Hans van Heeswijk Architecten](https://www.heeswijk.nl/media/pers/pers-mauritshuis/entreegebouw-van-gogh-museum&lang=en),
PDOK BAG (de twee panden), PDOK AHN (dsm en dtm 0,25 m via WCS: dakhoogtes, bol- en
cilindervlak) en de PDOK luchtfoto. Geschat zijn de dikte van de dakrand (1,5 m, de
printdikte), de ligging van de snede (circa 0,5 m) en het verloop van de dakrand.
Weggelaten: het rasterdak van de lichtstraten, de dakranden en de gevelstructuur
van het hoofdgebouw (kleiner dan 0,9 m), de glazen ingangshal van 2015 (foyer op
kelderniveau; het DSM ziet er geen volume boven het maaiveld en de BAG heeft er
geen apart pand voor), de twee kleine paviljoens van 1999 (aparte
BAG-panden 0363100012225636 en -37, niet vervangen), het blok op +6,6 m ten noorden
van het hoofdgebouw (buiten de BAG-contour) en het onderaardse deel.
