# Watertoren Bergen op Zoom (Bergen op Zoom)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-bergen-op-zoom.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: onderbouw, schacht, fries en reservoirzone zijn cilinders, de waterlijst, de fries, de lijst en de consolerij staan op schuine kragen (`hull`), het tentdak is een zestienzijdige piramide en het torentje is achtkantig; deur, vensters en boogjes zijn nissen.

De watertoren aan de Parallelweg 127, naast het spoor en het John F. Kennedyviaduct, is in 1899 gebouwd naar ontwerp van D. de Leeuw in neorenaissancestijl: een ronde toren van machinale baksteen met siermetselwerk in drie geledingen, een vlakbodemreservoir van 290 m³ en een overstekend tentdak met een open torentje. Volgens Wikipedia is hij 33,4 m hoog, het register noemt 35 m. Rijksmonument 517134; nu een woning.

## Bestanden

- `watertoren-bergen-op-zoom.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een los dak of torentje zou een eigen voet tot de grondplaat krijgen.
- `watertoren-bergen-op-zoom.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight`, `groundSamplePoints` en het vervangen BAG-pand.
- `watertoren-bergen-op-zoom-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [79206.31, 389501.75], het middelpunt van de cirkel door de BAG-contour van pand 0748100000041750 (73 punten, straal 5,19 tot 5,22 m, doorsnede 10,42 m), op maaiveld (AHN-DTM NAP +10,05 m; rond de voet 10,0 tot 10,1). Het hart van het torentje ligt in het AHN-DSM op hetzelfde punt. `xAxis` [1, 0]: +X wijst naar RD-oost, een ronde toren heeft geen hoofdas. De ingang en de dakkapel staan aan de westkant (180 graden): het AHN toont daar de dakkapel, de luchtfoto de informatieborden voor de deur, en op de foto vanaf het viaduct staat de dakkapel recht boven het fronton.

De vier `groundSamplePoints` liggen 6,5 m uit het hart, 1,3 m buiten de onderbouw; verder naar het westen begint de oprit van het viaduct (AHN tot NAP +12,5). `groundHeight` 54,34 (NAP 10,05 + 44,29, NLGEO2018-geoïde op de oorsprong) is de terugval zonder maaiveld. Er staan geen andere panden binnen 14 m.

## Onderdeel `building:onderbouw-schacht-fries-en-tentdak`

- Onderbouw van 10,42 m doorsnede tot +5,6, met een schuine waterlijst (48 graden) naar de schacht op +6,0.
- Ingang aan de westkant: deur van 1,6 × 2,5 m als nis, met een driehoekig fronton van 2,4 m breed dat 0,3 m voor de gevel staat, top op +3,8; de onderkant loopt onder 53 graden terug naar de gevel. Rondboogvensters van 0,9 × 1,8 m in de onderbouw op 125 en 235 graden en een hoge boogopening van 1,0 × 2,2 m aan de straat (zuid).
- Schacht van 9,7 m doorsnede. Acht gekoppelde rondboogvensters in hun nis (1,5 × 2,5 m, vanaf +8,3) om de 45 graden, te beginnen boven de deur; daarboven acht smalle rondboogvensters (0,65 × 2,3 m, vanaf +13,4), verspringend.
- Rondboogfries van 10,4 m doorsnede op een schuine kraag (49 graden) van +17,6 tot +18,0, tot +20,9, met 24 boogjes van 0,7 m (0,2 m diep, +18,5 tot +20,4); daarboven een lijst van 10,7 m op een kraag van 50 graden tot +21,4.
- Reservoirzone van 9,9 m doorsnede, glad.
- Consolerij als dichte zestienzijdige rok van 51 graden van de muur (+22,35) naar de dakrand (+24,15), dan een rechte dakrand van 0,7 m tot +24,85. De dakrand heeft zijn hoeken op 6,4 m uit het hart (12,8 m over de hoeken), een vlak midden op het westen.
- Zestienzijdig tentdak van 28 graden (AHN: z = 28,24 - 0,53 r).
- Dakkapel midden op het westvlak: 1,5 m breed, voorkant 5,45 m uit het hart, plat dak op +27,0.
- Torentje: schuine achtkantige voet van 1,45 naar 1,3 m over de vlakken (+27,4 tot +28,4), het open deel met de zuiltjes als dichte trommel van 1,1 m tot +29,4, een lijst van 1,58 m op een kraag van 49 graden tot +30,0, een achtkantig koepeltje tot +30,75 en een knop tot +31,0.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Bergen_op_Zoom)): ontwerper, bouwjaar, 33,4 m, 290 m³.
- [Rijksmonument 517134](https://monumentenregister.cultureelerfgoed.nl/monumenten/517134): drie geledingen, fronton met jaartal boven de dubbele deur, gekoppelde rondboogvensters in een nis, smalle vensters in afwisselende positie, rondboogfries op consoles, korfbogen met lisenen en spleetvensters bij het reservoir, overstekend dak op houten consoles, open achtkantig torentje met koepeltje en windvaan, dakkapel.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-02): maaiveld NAP +10,05; dakrand NAP +34,9 (24,85 m) met de rand op 6,3 tot 6,5 m uit het hart (aan de noordkant valt de rand weg in het DSM); tentdak binnen 0,2 m op het vlak z = 28,24 - 0,53 r; dakkapel aan de westkant tot NAP +37,0 (27,0 m), 1,5 m breed van 2,3 tot 5,4 m uit het hart; torentje tot NAP +41,0 (31,0 m).
- BAG-pand 0748100000041750 en luchtfoto (PDOK, 8 cm): ronde contour, zestien dakvlakken, dakkapel op het westvlak, borden voor de westdeur.
- Foto [Bergen op Zoom water tower](https://commons.wikimedia.org/wiki/File:Bergen_op_Zoom_water_tower.jpg), vanaf het viaduct uit het westen: alle geledingen, deur en fronton, vensterkolommen om de 45 graden, fries, dakkapel en torentje. Breedtes geschaald op de onderbouw (46 px/m), hoogtes op de AHN-hoogte van het torentje (43 px/m).
- Foto [Bergen op Zoom - Watertoren - voorkant](https://commons.wikimedia.org/wiki/File:Bergen_op_Zoom_-_Watertoren_-_voorkant.jpg), zuid: onderbouw met de boogopening en het venster op 235 graden, gekoppelde vensters, consoles.
- Foto [Bergen op Zoom - Watertoren met bomen](https://commons.wikimedia.org/wiki/File:Bergen_op_Zoom_-_Watertoren_met_bomen.jpg), zuidoost: reservoirzone met zestien velden, dakvlakken en torentje.
- Foto [Bergen op Zoom - Watertoren - torentje](https://commons.wikimedia.org/wiki/File:Bergen_op_Zoom_-_Watertoren_-_torentje.jpg): verhoudingen van voet, zuiltjes, lijst en koepeltje.
- 3D BAG (LoD2.2) van pand 0748100000041750: een rechte cilinder met een scheve piramide als dak, ter vergelijking.

## Geschat en weggelaten

Geschat: de hoogtes van de waterlijst (6,0 m), de vensters, de fries (17,6 tot 21,4 m) en de onderkant van de consolerij uit één foto, geschaald op de AHN-hoogte (±0,5 m); de breedte van schacht, fries en reservoirzone uit verhoudingen op de foto's (±0,1 m); dat de vensterkolommen rondom om de 45 graden doorlopen (aan de noord- en oostkant niet op foto's te zien); de consoles als dichte rok van 51 graden, in het echt een vlak overstek op losse consoles; de afmetingen van de dakkapel en het torentje (±0,2 m). Aan de oostkant zijn geen vensters in de onderbouw gemodelleerd: daar zijn geen foto's van.

Weggelaten: de korfbogen, lisenen en spleetvensters van de reservoirzone (smaller dan 0,9 m; de zone van 1 m tussen de lijst en de consolerij laat geen nissen zonder overhang toe); de kleine rondvensters en de consoles in de fries, de natuurstenen banden in de onderbouw, de gedenkstenen, de zuiltjes en boogjes van het open torentje (0,12 m), de windvaan en de bliksemafleider (kleiner dan 0,9 m); de informatieborden voor de deur.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vult de 45-gradenopvulling per node, zoals de export die doet, vrijwel niets op (volume 1,000004): de kragen lopen onder 48 tot 53 graden en de plafonds van de nissen onder 56 graden. De doorsneden van de voet tot het torentje blijven gelijk. Controlebeelden blijven buiten de repo.

Controle-URL: http://localhost:3000/kaart/51.48946/4.29588/200/1x1/0
