# Watertoren De Lichtmis (De Lichtmis, Zwolle)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-lichtmis.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de toren is één omwenteling van een radiaal profiel (schacht, kraag, omgang, glasring, kegeldak, bovendak, koepel), de schijf en het trappenhuis zijn blokken, het paviljoen is de BAG-contour onder vijf dakvlakken (planvergelijkingen uit de 3D BAG), en vensters, glasvlakken en bordessen zijn nissen.

De watertoren aan de Lichtmisweg is in 1932 gebouwd naar ontwerp van Hendrik Sangster, volgens Wikipedia 29,5 m hoog met een reservoir van 400 m³. Eind jaren tachtig verviel de functie; vanaf 1990 liet Hennie van der Most hem verbouwen tot hotel en restaurant De Koperen Hoogte (2001-2022, sinds 2023 Hotel & Restaurant Infinity). De huidige vorm is die van na de verbouwing en is veel hoger dan de oorspronkelijke 29,5 m: een ronde schacht met hotelkamers, op circa 40 m een kraag met omgang en een glazen restaurantring, een breed koperen kegeldak, een kleiner bovendak met lantaarn en een witte koepel (AHN NAP +59,8, 58,6 m boven maaiveld). Aan de noordnoordoostkant staat een witte schijf met "HOTEL" en een open trappenhuis, aan de zuidoostkant een groen beklede strook met een panoramalift. Om de voet ligt een laag paviljoen met koperen dakvlakken; dat hoort bij hetzelfde BAG-pand en is daarom mee gemodelleerd.

## Bestanden

- `watertoren-lichtmis.glb`: één node `building:watertoren-kroon-trappenhuis-en-paviljoen`, op maaiveld.
- `watertoren-lichtmis.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-lichtmis-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [209509.55, 511042.16] (52,58423 N, 6,19149 O): het hart van de schacht, uit een cirkelfit op de dakrand in het AHN-DSM (straal 12,8 m; de koepel ligt erop). Op de luchtfoto's van 2021 tot 2026 valt de voet van de schacht (straal 7,45 m) precies op deze cirkel. +X is RD-oost, +Y RD-noord; de toren is rond en het paviljoen volgt de BAG-contour. Maaiveld NAP +1,15 (AHN-DTM: binnenhof 1,13-1,16, noord 1,2, zuid 1,3, oost 1,6); het plein aan de westkant ligt op NAP +0,15, daarom loopt de onderkant tot -1,2 m (NAP -0,05). `groundHeight` 43,66 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints` (binnenhof 43,71 en 43,78, zuid 43,83, noord 43,66); niet op (18, 10), waar de PDOK-tegel water heeft (42,82), en niet op het westplein (42,73). Het model vervangt BAG-pand 0193100000001220 (paviljoen en schacht, 1971 m²); PDOK maakt daarvan een kolom van 25 m doorsnede (de dakrand) tot de grond.

## Onderdeel `building:watertoren-kroon-trappenhuis-en-paviljoen`

Maten in het lokale stelsel, hoogtes boven NAP +1,15.

- Schacht: straal 7,45 m tot 37,6 m; hotelvensters als nissen van 0,9 × 1,6 m in zeven kolommen (5, 25, 95, 140, 185, 230 en 275 graden vanaf oost, linksom), om de 3,3 m van 9,3 tot 34,0 m.
- Liftstrook (-35 graden, zuidoost): 5,4 m breed, 0,4 m voor de schacht, van de grond tot in de kraag, met de liftkoker als verdiepte gleuf van 1,8 m (7,0 tot 37,0 m).
- Kraag: onder 50 graden van de schacht naar straal 9,1 (37,6 tot 39,57 m), recht tot 40,3 m, dan onder 50 graden naar de omgang (straal 10,85, 42,39 tot 42,8 m).
- Restaurantring: glas van straal 10,4 op 42,8 m naar 11,0 op 45,8 m (naar buiten uitlopend), met zeventien glasvlakken als nissen van 2,3 m tussen stijlen van circa 1 m (niet achter de schijf).
- Kegeldak: onderzijde onder 49 graden van de glasring naar de boeiboord (straal 12,8, 47,9 tot 48,7 m; AHN NAP +49,85), dak onder 25 graden (AHN) naar binnen.
- Bovendak: onderzijde onder 49 graden van straal 4,9 naar de rand (straal 5,8, 53,45 tot 53,7 m; AHN NAP +54,9), dak onder 24 graden tot de tamboer (straal 1,5, tot 56,4 m), daarop de koepel (straal 1,95) tot 58,6 m.
- Trappenhuis en schijf (60 graden, noordnoordoost): trappenhuis van de schacht tot 11,6 m, 4,4 m breed, tot onder het kegeldak, met tien bordessen als verdiepte stroken (0,6 m diep) in beide zijgevels tot 36,1 m; schijf van 11,6 tot 14,4 m, 5,2 m breed, tot 51,2 m (AHN NAP +52 à +53), steekt door de boeiboord.
- Paviljoen: BAG-contour (42 hoekpunten) onder het laagste van vijf dakvlakken uit de 3D BAG (oost, zuidoost, zuid, west en noordwest, circa 11 graden, aflopend van de toren); goot van NAP +2,45 (west) tot +5,7 (oost). Glazen lens in het zuidwesten op het eigen vlak uit de 3D BAG (1,2 m boven het dakvlak). Vensters en deuren als nissen van 1,4 m om de 3 m, 0,8 tot 2,6 m boven het maaiveld langs elke gevel waar de goot minstens 3 m hoog ligt.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Lichtmis)): bouwjaar, ontwerper, 29,5 m (oorspronkelijk), 400 m³, verbouwing tot De Koperen Hoogte.
- BAG-pand 0193100000001220 en 3D BAG (PDOK, 2026-11-06): contour van paviljoen en schacht, dakvlakken van het paviljoen en de lens, maaiveld.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-06): dakrand NAP +49,85 op 12,8 m, kegeldak 25 graden, bovendak NAP +54,9 op 5,8 m en 24 graden, koepel NAP +59,8, schijf NAP +52 à +53, maaiveld. Het DSM heeft op de noordhelft van het koperen dak veel lage waarden (reflecties); de vorm komt uit de zuidhelft.
- Luchtfoto's 2021 tot 2026 (PDOK): voet van de schacht op de dakcirkel, de schijf en het trappenhuis uit de verschillende scheefstanden.
- Foto's op Wikimedia Commons: "De Koperen Hoogte, De Lichtmis.jpg" (2021, vanuit het noordoosten; hoogtes van kraag, omgang, glas en boeiboord op 25,1 px/m, geijkt op de dakrand), "KoperenHoogte-close-up0987.JPG" (2009: kroon, bovendak, koepel, lift en schijf; 27,9 px/m), "ON THE ROAD,2010 (1) - Flickr - bertknot.jpg" (lift, open trappenhuis, schijf en paviljoen) en "Koperen Hoogte.jpg".

## Geschat en weggelaten

Geschat: de straal van de schacht (14,9 m uit twee foto's met de dakrand als maat, bevestigd door de luchtfoto's), de hoogtes van kraag, omgang, glasring en boeiboordonderkant (uit één frontale foto), de uitloop van de glasring en de stralen van kraag en omgang (uit de close-up van 2009); de plaats en maat van schijf en trappenhuis (uit de scheefstand op vier luchtfoto's en de foto's; ±1 m en ±5 graden); de richting van de liftstrook (90 graden van de schijf, uit de foto's); de plaats van de vensterkolommen en de verdiepingshoogte (luifels op één foto, de overige kolommen naar het patroon); de vensters van het paviljoen (alleen op twee gevels gezien). De onderzijdes van boeiboord en bovendak lopen onder 49 graden schuin naar binnen in plaats van vlak, zodat ze zonder steun printen; daardoor is de lantaarnband onder het bovendak niet te zien.

Weggelaten: de reling van de omgang en van het dakterras op de schijf, de raamstijlen in het glas (dunner dan 0,9 m), de luifeltjes boven de hotelvensters, de liftcabine, de antennes, de witte opbouw op het trappenhuis (verdwijnt in het kegeldak), de overstekken van de paviljoendaken, de toegangsluifel in het zuidwesten en de letters op de schijf.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet (verhouding 1,0000001). Een export op 1:1000 (120 × 120 m) verbergt het PDOK-pand en zet onder het model vrijwel geen steun (0,0 mm³; met een bovenste bordes onder de kraag was dat 0,5 mm³, daarom stoppen de bordessen op 36,1 m). Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een kolom van 25 m doorsnede tot de grond onder een getrapt dak) de slanke schacht met vensters, de liftstrook, de kraag met omgang, de glazen restaurantring, de overstekende boeiboord, het bovendak met koepel, en de schijf met het open trappenhuis; het paviljoen heeft in beide dezelfde dakvlakken, het model ook vensters en de lens.

Controle-URL: http://localhost:3000/kaart/52.58423/6.19149/200/1x1/0
