# Watertoren Stadskanaal

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-stadskanaal.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht, kroonlijst en opbouw zijn één omwentelingsprofiel, de steunberen een hull met een teruglopend buitenvlak en twee sleuven, de luifels sikkelvormige schijven met een schuine onderkant; deur en vensters zijn nissen.

De watertoren van Stadskanaal is in 1935 gebouwd; de constructie is van de Waprog, de vormgeving in de stijl van de Amsterdamse School van ir. H.F. Mertens. Hij is 42,76 m hoog, heeft een reservoir van 900 m³ en is sinds 2005 rijksmonument (516263), samen met het naastgelegen Huize Ter Marse. De toren lijkt sterk op die van Oude Pekela (1938), ook van Mertens.

## Bestanden

- `watertoren-stadskanaal.glb`: één node van klasse `building`, op het maaiveld. De export vult elke node apart op; losse luifels of een losse opbouw zouden een eigen voet tot de grondplaat krijgen.
- `watertoren-stadskanaal.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-stadskanaal-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [261661.62, 555096.81], het hart van de cirkel die op de ronde delen van de BAG-contour van pand 0037100000008106 past (r 5,63 m, afwijking ≤ 0,2 m), op maaiveld (NAP +7,25 m, AHN-DTM rond de voet; Wikipedia noemt +7,10). Assen in RD-richting (`xAxis` [1, 0]): de vier steunberen staan in de BAG op 45, 135, 225 en 315 graden (binnen 0,6 graad), de vlakken ertussen op het oosten, noorden, westen en zuiden. De ingang staat op het zuiden (luchtfoto). `groundHeight` 48,6 = NAP 7,25 + 41,35 (NLGEO2018-geoïde op de oorsprong). Vervangt alleen het BAG-pand van de toren; de dichtstbijzijnde andere panden liggen 44 en 55 m verderop.

## Onderdeel `building:schacht-steunberen-luifels-en-opbouw`

- Ronde bakstenen schacht van 11,26 m tot +39,0, met een kroonlijst tot r 5,93 (schuine onderkant onder 56 graden) tot +39,85.
- Iets terugliggende opbouw van 10,2 m tot de dakrand op +42,65, plat dak op +42,2 binnen r 4,75 en een dakluik van 1,3 × 1,3 m tot +42,85.
- Vier steunberen op de diagonalen, 2,44 m breed, met het buitenvlak op 8,28 m uit het hart aan de voet en 7,34 m bij de kap (2,6 cm per meter terug). Elke steunbeer bestaat uit drie schijven van 0,65 m met twee sleuven van 0,25 m breed en 0,8 m diep; de kap loopt van +36,2 tegen de schacht naar +35,8 aan de buitenkant.
- Op elk van de vier vlakken een sikkelvormige betonnen luifel tussen de steunberen, bovenkant +26,8, in het midden 0,9 m en aan de steunberen 0,25 m uitstekend, voorkant 0,3 m hoog en onderkant onder 56 graden terug naar de gevel.
- Per vlak een rond venster (⌀ 1,6 m als zeshoek met de punt omhoog) op +21,5 en twee smalle vensters (0,5 × 1,5 m) op +27,6 en +32,5. Op het zuiden ook de ingang (2,6 × 3,0 m) en een groot venster (2,0 × 4,0 m) van +12,8 tot +16,8.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Stadskanaal)): bouwjaar, architect, 42,76 m, voet op NAP +7,10, 900 m³, rijksmonument.
- BAG-pand 0037100000008106 (PDOK, status ‘Verbouwing pand’, 129 m², 72 hoekpunten): straal van de schacht, stand, breedte en uitsteek van de steunberen aan de voet.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +7,25 rond de voet, plat dak NAP +49,42 (mediaan), dakrand en luik tot NAP +50,08, kroonlijst rond 39,8 m, steunberen tot ongeveer 36 m en hun teruglopende buitenvlak per sector. De zuidkant van het DSM is door een schaduw in de puntenwolk opgevuld en niet gebruikt.
- Luchtfoto 8 cm (PDOK): schuin beeld van de zuidgevel (0,32 m verschuiving per meter hoogte): ingang, groot venster, rond venster, luifel, twee smalle vensters, kroonlijst, opbouw met kleine vensters en het dakluik.
- Foto [Watertoren van Stadskanaal](https://commons.wikimedia.org/wiki/File:Watertoren_van_Stadskanaal.jpg): vlak met luifel, rond venster en twee smalle vensters, steunberen met kappen.
- Foto [Stadskanaal Watertoren 2006](https://commons.wikimedia.org/wiki/File:Stadskanaal_Watertoren_2006.JPG): steunbeer van drie schijven, kappen ongeveer 3,7 m onder de kroonlijst, opbouw.
- Foto [Watertoren+museum](https://commons.wikimedia.org/wiki/File:Watertoren%2Bmuseum.jpg): steunbeer van voren met sleuven en luifels op twee vlakken.

## Geschat en weggelaten

Geschat: de hoogtes van luifel, vensters en kappen (uit de luchtfoto en twee schuine foto's, die tot 1,5 m van elkaar afwijken), de terugsprong van de opbouw (het AHN geeft een dakrand rond r 5,0 à 5,5, de foto's een grotere terugsprong; gekozen 0,53 m achter de schacht), de uitsteek en vorm van de luifels, de breedte en diepte van de sleuven, de helling van de kappen en het grote venster boven de ingang (alleen op de luchtfoto, mogelijk van de verbouwing). Alle vier de vlakken hebben dezelfde luifel en vensters; de foto's tonen er drie, de luchtfoto alleen de zuidkant.

Weggelaten (kleiner dan 0,9 m of te dun): de kleine vensters in de opbouw en de traplichten in de sleuven van de steunberen, het hekwerk op het dak en de vlaggenmast, de holle aansluiting van de steunberen op de schacht aan de voet (in de BAG-contour, op 1:1000 kleiner dan een halve millimeter) en het metselwerk.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet (ratio 1,00000): de kroonlijst en de luifels hebben een schuine onderkant onder 56 graden, de nissen een plafond dat onder 56 graden naar binnen oploopt en het ronde venster is een zeshoek met de punt omhoog. De doorsneden op 1,5, 15, 21,5, 26, 28,5, 33, 37 en 41 m blijven gelijk. Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2) komt geen steun. Op de kaart staat de toren op het verborgen PDOK-blok met de voet 0,08–0,19 m in het maaiveld.

Controle-URL: http://localhost:3000/kaart/52.97229/6.97505/200/1x1/0
