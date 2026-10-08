# Kasteel Duurstede (Wijk bij Duurstede)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `kasteel-duurstede.glb` | Catalogusbron in meters: nodes `building:kasteel` (Bourgondische toren, donjon en muren uit bouwdelen en dakvlakken) en `road:brug` (de brug van de poort naar de zuidoever) |
| `kasteel-duurstede-1-1000.stl` | Het kasteel met de brug op 1:1000 met de onderkant (1 m onder het water van de slotgracht) op het printbed (41 × 66 × 45 mm) |
| `kasteel-duurstede-grondplaat-1-1000.stl` | Idem op een grondplaat van 1 mm, omdat de toren, de donjon, de muren en de brug los van elkaar staan |
| `kasteel-duurstede.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (151995, 442345), midden op de
binnenplaats, op het maaiveld (NAP +4,6 m), en de glTF-conventie Y omhoog. +X
loopt langs de zuidmuur en de gevels van de donjon naar het oostnoordoosten (29
graden linksom vanaf de RD-X-as, gemeten aan de dakrand van de donjon en de
BAG-zuidmuur) en +Y loodrecht daarop. De Bourgondische toren staat op (-12,3,
14,8), de donjon op (14,7, -5,8). Het maaiveld wordt op de binnenplaats
bemonsterd (`groundSamplePoints`, NAP +4,6 m); de toren, de muren en de ronde
hoektoren staan in de slotgracht (water NAP +3,3 m), daarom begint het model
1 m onder het water. Als geen van die punten in de uitsnede valt, gebruikt de
lader `groundHeight` 48,0 m (de laagste ellipsoïdische PDOK-terreinhoogte op die
punten). Vervangt de PDOK-reconstructie van `NL.IMBAG.Pand.0352100000000780`
(toren met aanbouw, kademuur, westmuur, hoektoren en zuidmuur) en
`NL.IMBAG.Pand.0352100000015442` (donjon met aanbouw); het achtkantige paviljoen
van 1978 ten noorden van de donjon is een eigen BAG-pand en blijft PDOK-model.

Onderdelen (hoogtes boven de binnenplaats op NAP +4,6 m, kasteel 41 bij 45,5 m
en 45,3 m hoog met de onderkant, met de brug 66 m lang):

- Bourgondische toren (onderste trommel 7,3 m straal): een kraag van 49 graden
  (+12,7 tot +13,4 m) onder de band met mezekouwen en de muur erboven (straal
  7,9 m) tot de dakvoet van het ringdak op +17,6 m; het ringdak loopt op naar de
  bovenste trommel (straal 6 m, +20 m), die met een kroonlijst op een kraag
  eindigt op +25,3 m. Daarop een rond kegeldak met een uitlopende voet (+26 m op
  5 m straal, +27,3 m op 3,9 m) tot +33,4 m, een achtkantige lantaarn (2,2 m) met
  een kraag tot +36,4 m en een achtkantige spits tot +43 m. Vensternissen in
  drie rijen.
- Traptorentje (straal 1,8 m) in de bovenste trommel aan de oostzuidoostkant,
  met een kraag en een kegeldak tot +33,8 m; twee schoorstenen naast het
  kegeldak (+32,5 en +32,9 m); een dakkapel met topgevel en pinakel (+22,3 m)
  op het ringdak aan de westzuidwestkant.
- Aanbouw tegen de zuidoostkant van de toren (8,5 bij 4 m, plat dak +15,4 m)
  met een spitse deur en vensters.
- Donjon (10,8 bij 11 m): muren tot +21,6 m met een borstwering van 1 m, daarbinnen
  een laag tentdak tot +22,2 m en een schoorsteen tot +23,2 m; per gevel
  vensternissen bovenin en halverwege, in de westgevel de deur op de verdieping.
  Tegen de noordgevel een lage aanbouw met een lessenaarsdak (+5,8 m aan de muur,
  37 graden).
- Muren in de gracht: de lage kademuur langs de binnenplaats (+0,3 m, 1,6 m
  boven het water), de hoge westmuur (+5,4 m), de ronde hoektoren (straal 3,5 m,
  +5,2 m) met een holle bovenkant, de zuidmuur (+5,4 m, een bres op +3,4 m en naar
  de poort aflopend van +5 naar +3,7 m) met vensternissen, en de muur naast de
  poort (BGT, +3,2 m).
- Brug (BGT overbruggingsdeel) van de poort tussen de zuidmuur en de muur naast
  de poort naar de zuidoever, 1,7 tot 3,2 m breed, dek op +0,3 m.

Vergelijking met het AHN-DSM (raster op 0,5 m in het modelstelsel, alleen
cellen boven 3 m met een meetwaarde en het model erin): 72,7 % ligt binnen 1 m en
83,8 % binnen 2 m. Het ringdak en het kegeldak zijn leien en hebben gaten in het
DSM; de afwijkingen zitten vooral aan de randen van het ringdak, rond de
schoorstenen en in de bomen op de binnenplaats.

Printbaar op 1:1000: alle vlakken wijzen omhoog of staan verticaal, op de kragen
(49 tot 51 graden) en de nissen na. De export vult op 1:1000 en 1:1500 niets bij
en op 1:2500 0,65 % (kasteel) en 4,8 % (brug). De STL is 8,9 cm³, heeft 3.068
driehoeken en bestaat uit vijf losse delen (toren, donjon, muren met hoektoren,
muur naast de poort en brug; status NoError); de grondplaat-STL is één deel.
Dunste delen op 1:1000: de spitsen bovenin, de schoorstenen (1 mm) en de
pinakel van de dakkapel (0,9 mm).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Kasteel_Duurstede) (donjon
1220 tot 1240 met muren van 2,5 m, Bourgondische toren van David van Bourgondië,
hoger dan 40 m, met mezekouwen), PDOK BAG, PDOK AHN (dsm en dtm 0,5 m via WCS,
stralenprofiel van het kegeldak per 0,5 m), PDOK BGT (brug en muur naast de
poort), de PDOK luchtfoto en foto's op Wikimedia Commons vanaf de zuid-,
zuidwest-, zuidoost- en oostkant. Geschat zijn de hoogte van de kraag en de
mezekouwen (foto's), de helling van het ringdak (leien, gat in het AHN), de vorm
van de dakkapel, de lantaarn (het AHN ziet alleen de spits) en alle vensternissen
en deuren. Weggelaten: de windvanen, de houten leuningen en het galgje van de
ophaalbrug (balken kleiner dan 0,9 m), de stalen trappen en bordessen aan de
oostkant van de toren (dunne staalconstructie), de terrastenten (tijdelijk) en
de funderingsresten op de binnenplaats (lager dan 0,9 m).
