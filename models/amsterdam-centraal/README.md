# Amsterdam Centraal (Amsterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `amsterdam-centraal.glb` | Catalogusbron in meters: nodes `building:stationsgebouw`, `building:eerste kap`, `building:middenkap`, `building:tweede kap`, `building:busstationkap`, `building:spoorplateau`, `road:spoor`, `separation:perrons`, `building:IJ-hal en busplatform`, `road:busbanen` en `road:busperrons` |
| `amsterdam-centraal-1-2000.stl` | Alle onderdelen in één stuk op 1:2000 (219 × 94 × 22 mm), met open kappen op kolommen |
| `amsterdam-centraal.json` | Catalogusitem met RD-georeferentie, acht vervangen BAG-panden, het vervangen busplatform uit de BGT, hoofdmaten en bronnen |

Gegenereerd met `node scripts/generate-amsterdam-centraal.mjs` (1:2000 is de
standaard; het complex is 438 m lang en past op 1:1000 niet op een printbed).

De STL is in millimeters met Z omhoog en de oorsprong in het midden van de
voorgevel van de middenpartij, tussen de torens, op NAP +2,5 m (het
Stationsplein ligt op NAP +2,8 m; de catalogus laat het model 0,3 m zakken);
de GLB gebruikt dezelfde oorsprong in meters met de glTF-conventie Y omhoog.
+X loopt langs de sporen naar het oostzuidoosten (RD-richting (0,856, -0,517),
azimut 121 graden), +Y naar het IJ; de voorgevel aan het Stationsplein ligt
richting -Y. Het maaiveld wordt op vijf punten op het Stationsplein
bemonsterd (`groundSamplePoints`), omdat de standaardpunten rond de voetafdruk
in het IJ of op de lagere IJ-zijde (NAP +0,8 m) vallen. Alle onderdelen lopen
door tot NAP +0,5 m, zodat ze ook aan de IJ-zijde in het terrein staan.

Het catalogusitem vervangt acht BAG-panden (`replacesBuildings`): het
stationspand 0363100012185598 (in PDOK een LoD1.1-blok van 23 m hoog over
gebouw en kappen samen), de IJ-hal 0363100012242112, de passage
0363100012240311, 0363100012185599 onder het westeinde van de kappen en vier
kleine panden in de IJ-hal. Daarnaast vervangt het het BGT-overbruggingsdeel
van het busplatform (`replacesTerrain`), dat PDOK plat op maaiveld legt.

## Waarom open kappen en een eigen spoorplateau

Het vorige model (2026-09-29) had dichte kappen: een volle boog van het
perron tot de nok. Volgens de huidige werkwijze toont het model de echte
vorm en vult de export op wat een print nodig heeft. De kappen zijn daarom
schalen van 1,2 m dik op kolommen van 1 m in de goten, met de glazen
kopgevels alleen boven de treinen (tot NAP +12,5 m). Onder de kappen ziet het
AHN het spoor niet; het PDOK-terrein zakt daar door tot NAP +2,4 m, en het
busplatform ligt in PDOK plat op maaiveld. Het model brengt daarom zelf het
spoorplateau mee (spoor NAP +5,6 m en perrons NAP +6,6 m, gemeten in het AHN
waar het spoor buiten de kappen ligt) en het busplatform boven de IJ-hal
(NAP +6,7 m), met de oprit van de busbaan naar de kade aan de oostkant.
Spoor, perrons, busbanen en busperrons zijn aparte onderdelen met hun
BGT-attributen, zodat ze in de export de kleur van weg en perron krijgen.

Printvolume op 1:1000 (overhangopvulling, 45°): het model zelf 0,39 dm³,
met ondersteuning v2 1,06 dm³ en met v1 1,11 dm³; het vorige, dichte model
kwam op 1,14 dm³. Onder de oprit en naast de kolommen op de perrons laat v2
openingen van circa 1 mm, die de printer overbrugt.

## Onderdelen

- Stationsgebouw van Cuypers op de BGT-contour: hoofdvleugels met de goot op
  NAP +21,3 m, steile mansarde en nok op NAP +26,0 m, vier topgevels en een
  rij dakkapellen om de 3,6 m in de voorste mansarde; vensters als nissen van
  0,35 m (drie lagen in de vleugels van Cuypers, vier in de oostvleugel).
- Westpaviljoen (risaliet van 8,5 × 10,2 m, schilddak tot NAP +32 m) en de
  lage westvleugel (nok NAP +15,4 m) met een hoger kopgebouw.
- Middenpartij met een voorblok, de grote dwarskap tot NAP +34,2 m, de
  topgevel tot NAP +38 m met twee hoektorentjes en drie poorten.
- Twee torens van 9,3 × 9,0 m tot de kroonlijst op NAP +29 m met
  hoekpinakels, een kap in twee geledingen, lantaarn en naald tot NAP +43,7 m
  (west) en +44,0 m (oost); de wijzerplaten als ronde nissen.
- Koningspaviljoen met schilddak tot NAP +29,9 m en portaal met topgevel,
  de open oostelijke doorgang en de luifel voor de oostelijke hoofdvleugel.
- Oostvleugel met mansarde (goot NAP +18 m), glazen kap, twee risalieten,
  drie smalle topgevels en een hoekblok met kantelen.
- Vier perronkappen met het boogprofiel uit het AHN (90e percentiel per
  meter dwars op de sporen):
  - eerste kap (L.J. Eijmer, 1889): 45 m overspanning, met lichtstraat tot
    NAP +29,05 m, aan de zuidkant op de achtergevel van het stationsgebouw;
  - middenkap (Jan Garvelink, 1997): 19 m, tot NAP +19,45 m, kopse kanten open;
  - tweede kap (Werkspoor, 1922-1924): 38 m, met lichtstraat tot NAP +29,1 m;
  - busstationkap (Benthem Crouwel, 2014): 53,5 m, tot NAP +22,85 m, met de
    noordrand boven de kade aan het IJ, kopse kanten open.
- Spoorplateau, sporen en zes perrons volgens de BGT (perron 4 tot 6 buigen
  aan het oosteinde af naar het noorden).
- IJ-hal en busplatform met busbanen langs beide randen, de busperrons
  ertussen, kolommen waar geen IJ-hal onder ligt en de oprit naar de kade.

Bronnen: [Wikipedia (nl)](https://nl.wikipedia.org/wiki/Station_Amsterdam_Centraal),
[Wikipedia (en)](https://en.wikipedia.org/wiki/Amsterdam_Centraal_station),
[Rijksmonumentenregister 5681](https://monumentenregister.cultureelerfgoed.nl/monumenten/5681),
PDOK BAG en BGT (contour van het stationsgebouw, perrons, overkappingen,
wegdelen, het overbruggingsdeel van het busplatform), PDOK AHN (dsm en dtm
0,5 m via WCS: alle hoogtes, de omhullende van torens en paviljoens, de
boogprofielen van de kappen, spoor en perrons), de PDOK-luchtfoto
(dakkapellen, topgevels, glasdak van de oostvleugel) en foto's op Wikimedia
Commons (torens, gevels, kopgevels van de kappen). De vorm van de topgevels,
de torenspitsen, de kroonlijsten en de kopgevels zijn vereenvoudigd of
geschat. De perronoverkappingen ten oosten van de kappen en de letters op de
busstationkap zijn niet gemodelleerd.

Licentie van het model: eigen werk op basis van open bronnen.
