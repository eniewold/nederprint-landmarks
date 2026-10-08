# Amsterdam Centraal (Amsterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `amsterdam-centraal.glb` | Catalogusbron in meters: nodes `building:stationsgebouw`, `building:eerste kap`, `building:middenkap`, `building:tweede kap`, `building:busstationkap` |
| `amsterdam-centraal-1-2000.stl` | Stationsgebouw en de vier perronkappen in één stuk op 1:2000 (215 × 94 × 22 mm) |
| `amsterdam-centraal.json` | Catalogusitem met RD-georeferentie, acht vervangen BAG-panden, hoofdmaten en bronnen |

De STL is in millimeters met Z omhoog en de oorsprong in het midden van de
voorgevel van de middenpartij, tussen de torens, op NAP +2,5 m (het
Stationsplein ligt op NAP +2,8 m; de catalogus laat het model 0,3 m zakken);
de GLB gebruikt dezelfde oorsprong in meters met de glTF-conventie Y omhoog.
+X loopt langs de sporen naar het oostzuidoosten (RD-richting (0,856, -0,517),
azimut 121 graden), +Y naar het IJ; de voorgevel aan het Stationsplein ligt
richting -Y. Het maaiveld wordt op vijf punten op het Stationsplein
bemonsterd (`groundSamplePoints`), omdat de standaardpunten rond de voetafdruk
van 430 × 187 m in het IJ of op de lagere IJ-zijde (NAP +0,8 m) vallen. Alle
onderdelen lopen door tot NAP +0,5 m, zodat ze ook aan de IJ-zijde en op het
spoorviaduct in het terrein staan.

Het catalogusitem vervangt acht BAG-panden (`replacesBuildings`): het
stationspand 0363100012185598, de IJ-hal 0363100012242112, de passage
0363100012240311, 0363100012185599 onder het westeinde van de kappen en vier
kleine panden in de IJ-hal. De PDOK-reconstructie van het stationspand is een
LoD1.1-blok (`rf_extrusion_mode` `lod11_fallback`, dak `unknown`, RMSE van de
LoD2.2-poging 5,6 m): één vlakke doos van 23 m hoog over gebouw en kappen
samen, zonder torens of bogen. De andere panden hebben wel een LoD2.2-dak, maar
dat volgt de glazen kappen slecht en steekt door het model heen.

Onderdelen in het model:

- Stationsgebouw van Cuypers op de BGT-contour, 373 m lang: hoofdvleugels met
  goot op NAP +20,7 m en mansardekap tot de nok op NAP +26,0 m, vijf topgevels
  aan de voorzijde (waarvan één brede met risaliet), een lage westvleugel
  (nok NAP +15,4 m) met een hoger kopgebouw.
- Middenpartij 12,6 m naar voren, met een dwarskap tot NAP +34,2 m (achter
  afgewolfd), een voorblok op NAP +29,3 m en de grote topgevel tot NAP +38 m.
- Twee vierkante torens van 6,7 m met kroonlijst op NAP +29,5 m en spitsen tot
  NAP +43,7 m (west) en +42,8 m (oost).
- Koningspaviljoen (Koninklijke wachtkamer) met schilddak tot NAP +29,9 m en
  een naar voren stekend portaal met topgevel tot NAP +32 m; een lage
  verbinding boven de oostelijke doorgang.
- Oostvleugel, 15 m diep, goot NAP +17,9 m, nok NAP +24,2 m, met twee
  risalieten op NAP +25,4 m.
- Vier gebogen perronkappen, elk als eigen onderdeel met het boogprofiel uit
  het AHN (90e percentiel per meter dwars op de sporen, langs de hele kap
  binnen 5 cm constant) en aan beide kopse kanten een 1 m teruggelegde
  kopgevel onder een 1,2 m dikke boogrand:
  - eerste kap (L.J. Eijmer, 1889): 45 m overspanning, 309 m lang, met
    lichtstraat in de nok tot NAP +29,05 m;
  - middenkap (Jan Garvelink, 1997): 19 m, 358 m lang, tot NAP +19,45 m;
  - tweede kap (Werkspoor, 1922-1924): 38 m, 355 m lang, met lichtstraat tot
    NAP +29,1 m;
  - busstationkap (Benthem Crouwel, 2014): 53,5 m, 361 m lang, tot
    NAP +22,85 m, met de noordrand boven de IJ-zijde.

Bronnen: [Wikipedia (nl)](https://nl.wikipedia.org/wiki/Station_Amsterdam_Centraal),
[Wikipedia (en)](https://en.wikipedia.org/wiki/Amsterdam_Centraal_station),
[Rijksmonumentenregister 5681](https://monumentenregister.cultureelerfgoed.nl/monumenten/5681),
PDOK BAG en BGT (contour van het stationsgebouw, vervangen panden), PDOK AHN
(dsm en dtm 0,5 m via WCS: alle hoogtes, de boogprofielen en de uiteinden van
de kappen, plaats en hoogte van torens, topgevels en paviljoens) en de PDOK
luchtfoto. Het Mapbox Standard-landmarkmodel is alleen visueel vergeleken
(dakvormen, torens, glazen kopgevels van de kappen); er is geen geometrie uit
overgenomen. Plattegrond, hoogtes en boogprofielen komen uit BGT en AHN; namen,
jaartallen en de overspanning van de eerste kap (bijna 45 m) uit de bronnen;
de vorm van de topgevels, de torenspitsen, de kroonlijst, de teruggelegde
kopgevels en de dakranden van de kappen zijn vereenvoudigd of geschat.
Overkappingen van de perrons ten oosten van de kappen en de letters op de
busstationkap zijn niet gemodelleerd.

Licentie van het model: eigen werk op basis van open bronnen.
