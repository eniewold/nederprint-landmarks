# Symbolica (Efteling, Kaatsheuvel)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `efteling-symbolica.glb` | Catalogusbron in meters: node `building:paleis` (de hoofdhal, de zuidhal, het paleis aan de westkant met alle torens, gevelreliëf en het witte dakornament) en node `vegetation:daktuin` (de sedumdaktuin op de hoofdhal, met een verborgen kern binnen de hal) |
| `efteling-symbolica-1-1000.stl` | Het complex in één stuk op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (59 × 66 × 30 mm) |
| `efteling-symbolica.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

Generator: `scripts/generate-efteling-symbolica.mjs` (met de gedeelde hulpen
uit `scripts/efteling-kit.mjs`).

De GLB is in meters met de oorsprong op RD (131675, 406851), midden in de
hoofdhal, op het maaiveld (NAP +9,9 m), en de glTF-conventie Y omhoog. +X
loopt langs de gebouwas naar het oost-noordoosten (5,3 graden linksom vanaf de
RD-X-as), +Y loodrecht daarop naar het noorden (naar de Pagode); de voorgevel
met de torens ligt aan de westkant, aan het plein. Het maaiveld wordt op vijf
punten bemonsterd (`groundSamplePoints`): twee op het plein voor het paleis
(12 m voor de gevel) en drie op de paden ten noorden en oosten van de hal (PDOK
NAP +9,8 tot +9,9 m), niet op de kunstrotsen voor de gevel, de vijver ten
oosten of het hogere pad ten zuiden. `groundOffsetMetres` is -0,3. Vervangt de
PDOK-reconstructie van `NL.IMBAG.Pand.0809100000019177` (2017, 2931 m²); de
PDOK-gebouwtegel bevat binnen de contour geen andere panden.

Onderdelen (hoogtes in NAP, maaiveld +9,9 m):

- De hoofdhal (47 bij 46 m) met de afgeschuinde noordoosthoek en de
  verspringing in de oostgevel uit de BAG, dak op +19,1 m, een lichte dakrand
  van 0,8 m breed tot +19,6 m die 0,2 m overkraagt op een kraag van 50 graden,
  witte paaltjes op de hoeken en midden op de zijden, en lisenen om de 7 m.
- De daktuin (0,25 m sedum) met het witte ornament van paden, 0,2 m erboven:
  het medaillon in het midden (ring van 10,4 m, vier lobben, binnenring), het
  kruis van paden noord-zuid en oost-west met ruiten aan de uiteinden en de
  vier kleine rozetten met een vierpuntige ster. De zonnepanelen zijn
  weggelaten.
- De zuidhal (dak +15,4 m) met de afgeschuinde zuidhoeken en lisenen.
- Het paleis aan de westkant: het middendeel (dak +21,2 m) met de
  spitsboogpoort in een verhoogde omlijsting, het balkon met een dichte
  balustrade en paaltjes, een kroonlijst op een kraag, de balustrade met nissen
  en drie pinakels, en het steile leien schilddak (nok +26,6 m) met de
  dakkapel en zijn pinakel (+27,5 m); de twee vierkante voortorens met
  spitsboogvensters, lijsten en een uikoepel (+26,7 m); de hoge vierkante
  toren in het noordwesten met twee geledingen en een koepel (+34,9 m); de
  ronde klokkentoren met een kantelenkrans, de omloop met vier torentjes met
  kegeldakjes, de wijzerplaat en de koperen uikoepel (+29,6 m); de hoofdtoren
  achter het middendeel met drie spitsboogvensters per zijde, de omloop met
  arcade, het brede overstekende dak en de grote uikoepel (+38,9 m met de
  makelaar); de ronde toren op de hal met kantelen, vier torentjes en een
  koepel (+31,1 m) en twee ronde torens met een spitse kegel (+28,9 en +27,8
  m). De lagere vleugels noord- en zuidelijk (+18,2, +14,5 en +17,6 m) hebben
  een borstwering en spitsboogvensters.
- De kunstrotsen voor de voorgevel zitten in het PDOK-terrein (tot circa 5 m
  boven het plein, ook in de AHN-DTM) en zijn niet gemodelleerd: de gevels
  lopen door tot de onderkant en het terrein bedekt hun voet zoals in het
  echt. Het balkon ligt op +15,5 m, net boven de rotsen.

Bronnen: BAG-pand 0809100000019177 (contour); AHN DSM/DTM 0,5 m als raster
per 0,5 m in het gedraaide stelsel (dakhoogtes van hallen en vleugels, positie,
breedte en hoogte van elke toren en koepel, de nok van het schilddak, het
maaiveld); PDOK luchtfoto 8 cm (dakornament, dakranden, plattegrond van het
paleis); PDOK 3D-tegels (vervangen panden, terreinhoogte op de
bemonsteringspunten en de rotsen voor de gevel); Wikimedia Commons
(Symbolica (Efteling) 20170521, Symbolica voorzijde, Symbolica2018, Symbolica
Palace Efteling, Symbolica vanaf Pagode): de opbouw van de torens, de vorm van
de koepels, poort, balkon, balustrade, dakkapel en het ornament op het dak.

Geschat (uit foto's, geschaald op de AHN-maten): de hoogtes van lijsten,
vensters en geledingen, de diameters van trommels en koepels binnen de
AHN-breedte, de makelaars (het AHN ziet alleen hun voet, dus de toppen liggen
0,2 tot 0,5 m boven de AHN-maxima), de lisenen en paaltjes, de plaats van de
rozetten en de lijnbreedte van het dakornament (0,5 m, breder dan in het echt
zodat het op 1:1000 te zien is). De groene banden van de koepels en de
zonnepanelen zijn niet gemodelleerd.

Printbaar op 1:1000 en 1:500: alles staat op de onderkant of op een dak,
lijsten, omlopen, kransen en torentjes rusten op een kraag van 45 tot 50
graden, de uikoepels zwellen niet flauwer dan 45 graden uit en nissen hebben
een spitse top van 55 tot 60 graden. De export vult op 1:1000 en 1:500 0,01 %
op bij het paleis en niets bij de daktuin (die rust op zijn verborgen kern
binnen de hal, zoals de daktuin van Depot Boijmans). De STL is 28 cm³ en één
samenhangend deel; de makelaars zijn op 1:1000 0,5 mm breed.
