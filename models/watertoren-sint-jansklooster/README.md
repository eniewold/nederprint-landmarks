# Watertoren Sint Jansklooster (Sint Jansklooster)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-sint-jansklooster.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is een verjongend vierkant prisma (convexe omhullende), de sleuven, hoekblokken, het plafond van de recessie en de goten zijn prisma's die met vlakken (`trimByPlane`) zijn afgesneden, de staande band een achtkant prisma en de tentkap de omhullende van die achthoek en de top; vensters, uitkijkramen en de portiek zijn blinde nissen.

De watertoren aan de Barsbeek werd in 1931-1932 gebouwd door de Waterleiding Maatschappij Overijssel (W.M.O.); rijksmonument 507463, volgens het register 45,5 m hoog (Wikipedia 45,7 m) met een betonnen holbodemreservoir van 400 m³. Hij is verwant aan de torens van Steenwijkerwold en Raalte en is sinds 2011 van BOEi, die hem tot uitkijktoren met vier ramen in het dak herbestemde. Het register beschrijft een toren van gewapend beton (glijbekisting) met baksteenbekleding die vanuit de basis verjongt, met uit- en inspringende hoeken met bovenin overhoekse invullingen, smalle vensters, een octogonaal gebroken tentdak met geglazuurde pannen en verspringende randen aan de staande dakschilden, en een voorgevel met een keperboogportiek met dubbele deur. De linker gevelpartij is vernieuwd in lichte baksteen.

## Bestanden

- `watertoren-sint-jansklooster.glb`: één node, `building:watertoren-schacht-hoekblokken-band-en-tentdak`.
- `watertoren-sint-jansklooster.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-sint-jansklooster-1-1000.stl`: het model op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [197294.38, 521134.22] (52,67601 N, 6,01255 O), het hart van BAG-pand 1708100000028702 (achthoek: een vierkant van 11,1 m met afschuiningen van 3,4 m; de top in het AHN-DSM ligt 0,2 m ernaast), op het maaiveld: AHN-DTM NAP +4,9 (4,85 tot 5,0 tot 12 m eromheen). +X wijst naar RD-richting 26,5 graden (oost-noordoost, de gevelnormaal uit de BAG-zijden): de voorgevel met de portiek. +Y wijst naar 116,5 graden (noord-noordwest). De voorgevel is afgeleid uit de foto's: de lichte, vernieuwde gevel (de "linker gevelpartij") ligt dan naar -Y, en zo passen de zonstand en belichting op de foto van 28 april 2013, 10.44 uur, en de verharding aan de oostkant op de luchtfoto.

`groundSamplePoints` liggen op 8 m in de vier gevelrichtingen; `groundHeight` 47,08 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (47,08 tot 47,41, gemeten 2026-11-06; het PDOK-pand begint op 47,09). `groundOffsetMetres` is -0,1.

## Onderdelen

Hoogtes boven het maaiveld (NAP +4,9), maten vanaf het hart.

- Schacht: vierkant met halve breedte 5,68 m aan de voet tot 5,55 m op 40,0 m (verjongend).
- Hoeken: in elke hoek een sleuf vanaf 3,25 m van het hart (2,43 m aan de voet, 2,35 m bovenin) met een penant van 0,9 bij 0,9 m in de binnenhoek, van de voet tot de band.
- Overhoekse hoekblokken: voorvlak op de diagonaal op 6,0 m van het hart, 2,6 m breed, van 31,1 m (voorkant van de onderzijde, die onder 50 graden naar binnen zakt) tot 37,6 m. Daarboven de recessie tot de band, met een plafond dat vanaf de voorkant van de band (39,5 m) onder 50 graden naar binnen zakt.
- Vensters: smalle vensters (glazen bouwstenen) als nissen van 0,35 m breed en 0,25 m diep; bovenin per gevel drie (36,4 tot 38,1 m, aan de voorgevel twee op 1,5 m uit het midden), daaronder in het midden van elke gevel één per geleding: 30,9–32,5, 25,2–26,8, 19,5–21,1 en 13,8–15,4 m.
- Portiek in de voorgevel: keperboog van 2,4 m breed, 0,6 m diep, aanzet 2,5 m, top 3,95 m (50 graden), met daarin de deur (1,8 m, nog 0,3 m dieper, top 3,3 m).
- Staande band: achthoek met gevels op 5,58 m en afschuiningen op 6,24 m (over de volle breedte van de sleuven), boven de gevels vanaf 40,0 m en boven de hoeken vanaf 39,5 m (de verspringende randen), tot 41,75 m. Goten 0,18 m uit met een onderkant van 50 graden op die hoogtes. Vier uitkijkramen (nis van 1,9 m breed, 39,9 tot 41,15 m) in de afschuiningen.
- Tentkap: achtkante piramide van de band (41,75 m, AHN NAP +46,6) tot de top op 45,55 m (AHN NAP +50,45), helling circa 35 graden.

## Bronnen en maten

- [Rijksmonumentenregister 507463](https://monumentenregister.cultureelerfgoed.nl/monumenten/507463): 1931, W.M.O., 45,5 m, 400 m³, vormbeschrijving (zie boven).
- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Sint_Jansklooster)): 1931-1932, 45,7 m, uitkijktoren met vier ramen.
- BAG-pand 1708100000028702 (PDOK, 2026-11-06): achthoekige contour, gevels op 5,51 tot 5,57 m, afschuiningen van 3,4 m.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld NAP +4,9, top NAP +50,45 (45,55 m), tentkap met helling 0,7 over 5 m in alle richtingen, rand op circa NAP +46,6 tot 47,0.
- Foto's op Wikimedia Commons: "Watertoren Sint Jansklooste.jpg" (vanuit het zuid-zuidwesten; de zichtbare gevelbreedtes en de hoekzone passen bij een vierkant van 11,1 m met sleuven van 2,35 m, schaal 38 px/m: sleuven, penant, hoekblok, recessie, band en tentkap, hoogtes verankerd op de top), "Sint Jansklooster, de watertoren RM507463 foto4 2013-04-28 10.44.jpg" (vanuit het oosten: hoekblok, uitkijkraam, vensters, portiek), "Watertoren, Barsbeek 6, Sint Jansklooster.JPG" en "20131030 Belterwijde met watertoren Sint Jansklooster.jpg" (silhouet, uitkijkramen).

## Geschat en weggelaten

Geschat: de sleufbreedte (2,35 m) en de penant (0,9 m) uit gevelbreedtes op één foto; de verjonging (0,13 m per zijde, het register noemt hem zonder maat); de hoogtes van band, recessie en hoekblokken uit twee foto's (circa 0,5 m onzeker); de breedte en diepte van de hoekblokken; de plaats en hoogtes van de smalle vensters (patroon van twee foto's, voor alle gevels gelijk gehouden); de portiek (afmetingen en vorm uit het register en een foto die de onderkant half toont); de voorgevel uit zonstand en lichte gevel, niet uit een foto van de ingang zelf.

Weggelaten: de tweede penant en het glazen-bouwsteenvenster in de recessie (achter het hoekblok, kleiner dan 0,9 m), de kleine consoles onder de hoekblokken, de vlaggenmast met betonnen houder en de bliksemafleider (te dun), de poeren en drempel van de portiek, de knik in de pannen tussen band en kap (vloeiend overgang op de foto's), en de kleur van de vernieuwde gevel.

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling het volume niet. Een export op 1:1000 (90 bij 90 m rond de toren) verbergt het PDOK-pand en geeft geen ondersteuningsobject. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een gladde achthoekige zuil tot 45,8 m met een vlakke achtkante kap) de verjongende vierkante schacht, de sleuven met penanten in de hoeken, de overhoekse hoekblokken met de recessie erboven, de smalle vensters, de portiek, de staande band met verspringende goten en uitkijkramen en de tentkap.

Controle-URL: http://localhost:3000/kaart/52.67596/6.01248/200/1x1/0
