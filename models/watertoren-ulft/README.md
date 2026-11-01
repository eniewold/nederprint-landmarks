# Watertoren Ulft

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-ulft.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is een vierkant prisma, de consoles een afgeknotte piramide met een spitse nis per zijde, de waterkamer een blok met voetplaat, fries en kroonlijst op schuine onderkanten; vensters zijn nissen. Het complex eromheen bestaat uit prisma's onder de dakvlakken van de 3D BAG.

De watertoren van Ulft staat op het Beltmancomplex van de voormalige ijzergieterij DRU (Diepenbrock en Reigers te Ulft), aangewezen als industrieel erfgoed. Het complex en de toren zijn in 1913 gebouwd; op de toren staan de jaartallen 1913 en 1754 (de stichting van de hoogoven De Olde Hut). Het complex is herbestemd tot woningen en kantoren. Niet te verwarren met de watertoren Bontebrug, ook in Ulft (`watertoren-bontebrug`).

## Bestanden

- `watertoren-ulft.glb`: twee nodes van klasse `building`, beide op het maaiveld. De toren is één node, zodat de export de waterkamer niet apart tot de grondplaat opvult; het complex is een eigen bouwdeel.
- `watertoren-ulft.json`: catalogusitem met RD-oorsprong, `xAxis`, de bemonsteringspunten op de binnenplaats, `groundHeight` 59,09 (ellipsoïdisch maaiveld van de binnenplaats, terugval voor een uitsnede zonder binnenplaats) en het vervangen BAG-pand.
- `watertoren-ulft-1-1000.stl`: toren en complex samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [223450.26, 434748.43], het hart van de waterkamer in het AHN (omhullende boven 10 m: 6,3 bij 6,4 m), op het maaiveld van de binnenplaats (NAP +15,19 m). +X loopt langs de zuidgevel van de toren en de gevel van het complex aan de binnenplaats (RD-richting 28,4 graden, uit de BAG-contour en de dakvlakken van de 3D BAG); -Y wijst naar de binnenplaats (zuidzuidoosten). De schacht staat midden onder de waterkamer; zijn zuidgevel ligt daardoor 0,3 m achter de BAG-gevellijn van het complex.

De toren is geen eigen BAG-pand: hij hoort bij pand 1509100000186256, het hele Beltmancomplex (3103 m²). De kaart en de export kunnen alleen hele panden verbergen, en de PDOK-reconstructie van de toren is een blok van 6 m tot NAP +40,4 dat de schacht en de consoles zou opslokken. Daarom vervangt het model het hele pand en neemt de GLB de rest ervan over als `building:beltmancomplex`.

## Onderdeel `building:schacht-consoles-en-waterkamer`

- Vierkante bakstenen schacht van 3,55 m tot +17,0, aan drie kanten tot het complexdak (+9,4) ingebouwd en aan de binnenplaats vrij tot het maaiveld. Eén rondboogvenster per zijde (1,4 × 2,3 m, +12,3 tot +14,6) als nis met een spitse top.
- Consoles: een afgeknotte piramide van de schacht naar de voetplaat (5,94 m op +18,95); de vlakken staan onder 58,5 graden, de hoekgraten onder 49 graden. In elke zijde een nis van 0,3 m diep en 1,8 m breed met een spitse top onder 55 graden (het gewelf tussen de hoekconsoles); de hoekconsoles blijven 1,0 tot 1,2 m breed.
- Waterkamer: voetplaat met tandlijst van 5,94 m (+18,95 tot +19,85), wand van 5,7 m met drie vensters per zijde (0,58 × 1,7 m, 1,5 m uit elkaar, penanten 0,92 m), rondboogfries als band van 0,12 m op een schuine onderkant (+23,6 tot +24,4) en een kroonlijst van 6,2 m op een schuine onderkant (56 graden) tot het platte dak op +25,2.

## Onderdeel `building:beltmancomplex`

De rest van BAG-pand 1509100000186256 uit de 3D BAG (LoD2.2, dezelfde vlakken als de PDOK-gebouwtegels): per dakvlak een prisma tot het vlak (kleinste kwadraten), samengevoegd. Het torenblok (dakvlak op NAP +40,4) is vervangen door het complexdak eromheen (NAP +24,6) tot aan de schacht; de schacht zelf en de strook ervoor aan de binnenplaats zijn eruit gesneden. De binnenplaats blijft open naar het westen, zoals in de BAG.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Ulft)): Beltmancomplex van 1913, DRU-terrein, jaartal 1754.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld binnenplaats NAP +15,19, dak van de toren NAP +40,38 (25,2 m boven maaiveld; hoogste punt +40,51 is de reling of mast), omhullende van de waterkamer 6,3 × 6,4 m, complexdak NAP +24,5 tot +24,7.
- BAG-pand 1509100000186256 en luchtfoto (PDOK): ligging, gevelrichting, binnenplaats met pergola.
- 3DBAG (3DGI en TU Delft, CC BY 4.0), pand NL.IMBAG.Pand.1509100000186256: dakvlakken van het complex, als constante onderaan het script.
- Foto [waterreservoir, RCE 20530862](https://commons.wikimedia.org/wiki/File:Overzicht_van_het_waterreservoir_van_de_watertoren_-_Ulft_-_20530862_-_RCE.jpg), op de hoek: breedte van schacht (0,61 × de waterkamer), kroonlijst, fries, vensters, voetplaat en consoles (82,4 px/m, geschaald op de waterkamer van 5,7 m).
- Foto [watertoren, RCE 20530905](https://commons.wikimedia.org/wiki/File:Overzicht_van_de_watertoren_-_Ulft_-_20530905_-_RCE.jpg), op de hoek: hoogtes van voetplaat, consoles, gele band en schachtvensters (44,3 px/m).
- Foto [2025-02-08 Water tower DRU Ulft ZvD 01](https://commons.wikimedia.org/wiki/File:2025-02-08_Water_tower_DRU_Ulft_ZvD_01.jpg): huidige staat, rondboogvensters van de schacht, consoles en gewelven.

## Geschat en weggelaten

Geschat: de breedte van waterkamer (5,7 m) en kroonlijst (6,2 m) uit het AHN en de verhoudingen op de foto's, de schacht (3,55 m) uit die verhoudingen; de hoogtes van voetplaat, consoles, vensters, fries en kroonlijst uit twee schuine foto's (onderling 5 tot 7 % verschil). De voet van de consoles ligt met +17,0 zo'n 0,3 m lager dan op de foto's, zodat de hoekgraten steiler dan 45 graden blijven. De gewelven zijn in werkelijkheid flauwe bogen over vrijwel de hele zijde; een spitse nis van 1,8 m houdt ze printbaar. De vensters van de waterkamer zijn 0,58 m breed in plaats van circa 0,7 m, zodat de penanten 0,9 m blijven. Eén schachtvenster per zijde op alle vier zijden.

Weggelaten (kleiner dan 0,9 m of alleen kleur): de rondboogjes van de fries (0,5 m), de tandlijst als reliëf, de gele band en de geschilderde jaartallen, de reling en de mast op het dak, de ijzeren brandtrap, de regenpijp en de deur naar de trap. Het complex is niet verder gemodelleerd dan de 3D BAG; de pergola op de binnenplaats is geen pand.

## Controle

Twee gesloten NoError-nodes met genus 0, elk één component met de onderkant op -0,3 m. In de webshoptest (`tests/landmark-models.test.ts`) verandert de 45-gradenopvulling per node, zoals de export die doet, het volume niet (gemeten 1,000 voor toren en complex): consoles, gewelfnissen, vensters, fries en kroonlijst hebben geen ondervlak vlakker dan 45 graden, en het complex is een 2,5D-blok. De doorsneden op 5, 13,5, 17,5, 18,4, 21,5 en 24,8 m (toren) en 2, 9 en 12 m (complex) blijven gelijk. Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2, uitsnede 150 m) staan toren en complex zonder steun. Op de kaart staat de toren op de binnenplaats met de voet 0,10–0,13 m in het maaiveld; het complex sluit aan op de omgeving.

Controle-URL: http://localhost:3000/kaart/51.89694/6.38139/200/1x1/0
