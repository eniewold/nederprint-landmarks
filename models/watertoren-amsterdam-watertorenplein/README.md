# Watertoren Watertorenplein (Amsterdam)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-amsterdam-watertorenplein.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de hele toren is één omwentelingsvorm van een radiaal profiel met rechte stukken (schacht, kraag, bodemkegel, buik, schouder, omgang, kegeldak, hals en kapje).

De watertoren aan het Watertorenplein (Waterkeringweg) in Amsterdam-West staat op het voormalige terrein van de waterleiding aan de Haarlemmerweg, nu de Waterwijk. Volgens Wikipedia is hij in 1966 gebouwd, 37 m hoog en de eerste stalen watertoren van Nederland. Een slanke ronde stalen schacht draagt via een kraag met twee ringen een bolvormig reservoir. Het reservoir heeft een kegelvormige bodem, een ronde buik en een schouder die naar binnen loopt tot een omgang met een hekwerk. Op het flauwe kegeldak staat een hals met een donkere band, met daarop een kapje in de vorm van een lampenkap.

## Bestanden

- `watertoren-amsterdam-watertorenplein.glb`: één node `building:schacht-kraag-reservoir-en-kapje`, op het maaiveld.
- `watertoren-amsterdam-watertorenplein.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-amsterdam-watertorenplein-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [119671.04, 488641.48] (52,38450 N, 4,86829 O), het middelpunt van de ronde BAG-contour (cirkelfit straal 6,93 m, afwijking 1 mm), op maaiveld (AHN-DTM in een ring van 8 tot 14 m NAP +0,61 tot +0,83; gebruikt de mediaan +0,74). De toren is rond: +X loopt langs RD-oost (`xAxis` [1, 0]). `groundHeight` 43,71 is NAP +0,74 plus de NLGEO2018-geoïdehoogte (42,97). De vier `groundSamplePoints` liggen op 8 m van het hart, net buiten de buik. Het model vervangt BAG-pand 0363100012111986, zodat het PDOK-blok verdwijnt. De buurpanden (onder meer de pompgebouwen uit 1898 op 16 m en meer) hebben in PDOK de hoogte uit het AHN (binnen 0,5 m) en blijven staan.

## Onderdeel `building:schacht-kraag-reservoir-en-kapje`

Profiel als straal r bij hoogte z boven het maaiveld:

- Schacht: r 2,35 van de voet tot 18,0 m, daar een overgang van 45 graden naar de kraag (de onderste ring).
- Kraag: r 2,75 op 18,4 m, naar boven verlopend tot r 3,0 op 20,3 m (de bovenste ring).
- Bodem van het reservoir: een overgang van 45 graden naar r 3,3 op 20,6 m, daarna een kegel van 45 graden tot r 6,3 op 23,6 m, en een ronding naar de buik.
- Buik: r 7,07 van 24,7 tot 27,4 m. De schouder loopt daarna naar binnen tot r 6,65 op 29,25 m.
- Omgang: een vlakke ring van r 6,65 tot r 5,85 op 29,25 m (AHN NAP +29,99).
- Dak: een kegel met helling 0,67 (AHN) tot r 2,6 op 31,43 m. De voet van de hals loopt in tot r 2,25 op 32,3 m.
- Hals met donkere band: r 2,25 tot 32,9 m. Onder het kapje zit een kraag van 41 graden naar r 2,51 op 33,2 m.
- Kapje: een kegelstomp van r 2,51 op 33,2 m naar r 1,68 op 35,71 m (AHN NAP +36,45), met een vlakke bovenkant.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Amsterdam_Waterkeringweg)): bouwjaar, 37 m, staal.
- BAG-pand 0363100012111986 (PDOK, 2026-11-04): ronde contour van 13,86 m, het hart.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-04):
  - maaiveld NAP +0,74;
  - omgang vlak op NAP +29,99 tussen 5,9 en 6,5 m;
  - dak NAP +30,39 op 5,25 m en +31,73 op 3,25 m;
  - kapje vlak op NAP +36,45 binnen 1,7 m van het hart;
  - straal van de buik 7,0 tot 7,05 m (uit het oppervlak boven 15 tot 20 m).
- Luchtfoto (PDOK): ronde omgang en het kapje in het midden.
- Foto's op Wikimedia Commons:
  - "'Watertoren' Watertorenplein Amsterdam (5436543052)" (2011): telefoto van circa 150 m, vrijwel orthografisch. Geijkt op de buik (9,55 px/m) en gecontroleerd op het hoogteverschil tussen omgang en kapje (62 px tegen 6,46 m in het AHN). Daaruit het hele profiel boven 18 m.
  - "Watertoren Adam Waterkeringweg" (2009): schacht, kraag met ringen, buik en omgang.
  - "Centrale Markt, Amsterdam, Netherlands - panoramio" (2015): verhouding tussen schacht en kraag.

## Geschat en weggelaten

Uit één telefoto geschat:

- de hoogtes van de kraag, de bodemkegel, de buik en de schouder;
- de stralen van de schacht, de kraag, de hals en het kapje.

De bodemkegel is in het echt iets gebogen en staat in het model als een rechte kegel van 45 graden met een ronding naar de buik. Het profiel onder 18 m is op de foto's een rechte cilinder.

Weggelaten:

- het hekwerk van de omgang (een leuning, niet printbaar op 1:1000);
- de twee ringen om de kraag (minder dan 0,15 m uitstekend);
- de naden en klinknagels van de mantel;
- het kleine object op het dak naast de hals (kleiner dan 0,9 m);
- het hek en de installatiekasten rond de voet.

Een deur in de schacht is op de foto's niet te zien.

## Controle

Het model is één gesloten NoError-node met genus 0. In de webshoptest vult de 45-gradenopvulling per node vrijwel niets op: het volume groeit met minder dan 0,1 %. Alle ondervlakken lopen onder 45 graden of steiler: de overgangen naar kraag en reservoir, de bodemkegel en de kraag onder het kapje.

In een exporttest via `createModelBundle` op 1:1000 (uitsnede van 80 × 80 m) staat de toren in zijn geheel in de export, zonder ondersteuningsobject. Het PDOK-pand is verborgen. De voet staat 0 tot 0,4 m in het PDOK-maaiveld.

PDOK toont de toren als een cilinder van 13,9 m doorsnede tot 30,9 m, op de hele BAG-cirkel tot het maaiveld. Het model voegt van alle kanten toe:

- de slanke schacht met de vrije ruimte onder het reservoir;
- de kraag;
- de bodemkegel;
- de buik en de schouder;
- de omgang;
- het kegeldak;
- de hals met de donkere band;
- het kapje tot 35,7 m.

Controlebeelden blijven buiten de repo.

Controle-URL: http://localhost:3000/kaart/52.38450/4.86829/200/1x1/0
