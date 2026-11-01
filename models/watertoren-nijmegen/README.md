# NYMA-watertoren (Nijmegen)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-nijmegen.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: het reservoir is een zestienhoekig prisma met kolommen als blokken, ringbalken en kroonlijst als omhulsels met een onderkant onder 55 graden, de schoren als banden op de wand en het dak als omhulsel van twee zestienhoeken. De fabriek bestaat uit de dakvlakken van de 3D BAG, elk als prisma onder zijn eigen vlak.

De watertoren van kunstzijdefabriek Nyma is ontworpen door J. Buining en in 1929 boven op het fabrieksgebouw aan de Waal gebouwd, omdat er naast de fabriek geen ruimte was. Het opschrift NYMA maakte hem tot beeldmerk van de fabriek; sinds de bouw van brug De Oversteek (2013) staat hij prominent in het zicht. Gemeentelijk monument sinds 14 november 2012.

## Bestanden

- `watertoren-nijmegen.glb`: twee nodes van klasse `building`. De toren is één node (reservoir, skelet, schoren en dak samen), zodat de export geen los reservoir of dak opvult; de fabriekshal is een tweede node.
- `watertoren-nijmegen.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-nijmegen-1-1000.stl`: alles samen op 1:1000 (toren met de hele fabriekshal, 177 × 122 mm).

## Oorsprong en oriëntatie

RD-oorsprong [186049.0, 429908.65], het hart van het reservoir in het AHN (cirkelfit op de rand tussen 12 en 22 m boven maaiveld), op maaiveld (NAP +14,29 m, het plein ten noordoosten van de toren). Assen in RD-richting (`xAxis` [1, 0]). De hoeken van de zestienhoek liggen op k · 22,5 graden en de kolommen op de RD-assen en de diagonalen; de werkelijke stand van de kolommen is niet bekend.

De toren is geen eigen BAG-pand: hij hoort bij pand 0268100000015629, de fabriekshal van 1928 (9750 m²). Kaart en export kunnen alleen hele panden verbergen, en de PDOK-reconstructie van dat pand bevat een eigen torenblok dat door het model heen zou steken. Daarom vervangt het model het hele pand en neemt het de fabriek als tweede node over, zoals de abdij bij `lange-jan`.

## Onderdeel `building:reservoir-met-betonskelet-schoren-en-kegeldak`

- Zestienhoekig reservoir met de hoeken op 5,85 m (11,7 m over de hoeken), van de onderkant tot de kroonlijst; binnen de fabriek loopt het door tot het maaiveld.
- Betonskelet: acht kolommen van 0,7 m breed op de even hoeken, 0,2 m voor de wand, en drie ringbalken van 12,2 m over de hoeken: onderste van 10,05 tot 10,65 m, middelste van 15,35 tot 16,2 m, bovenste van 21,75 tot 22,45 m onder de bakstenen band met het opschrift.
- Zigzag van schoren tussen de onderste en de middelste ringbalk: vanaf elke tweede kolom onder de middelste ringbalk naar de twee buurkolommen op de onderste ringbalk (circa 46 graden). Banden van 0,7 m breed en 0,2 m dik met afgeschuinde flanken.
- Kroonlijst van 12,4 m over de hoeken van 26,1 tot 26,6 m met een onderkant onder 55 graden, laag zestienzijdig kegeldak (21 graden) tot r 1,5 m op 28,4 m en een lichtkoepel van 2,7 m tot 28,55 m.

## Onderdeel `building:fabriekshal-nyma`

- De vijf delen van BAG-pand 0268100000015629 uit de 3D BAG (LoD2.2): elk dakvlak (99 stuks, de vlakken met hun gaten) als prisma vanaf de onderkant, afgesneden door het vlak door zijn hoekpunten (kleinste kwadraten). Het dak rond de toren ligt op 5 tot 7,8 m.
- De dertien torenvlakken van de 3D BAG (hoger dan NAP +30 m) liggen als vlak op 5,1 m, de hoogte van het fabrieksdak, zodat er geen spleet blijft waar de 3D BAG-toren breder is dan het model (tot 7,3 m uit het hart).
- Vier dakopbouwen van circa 8,6 m (eigen 3D BAG-delen) vormen een los blok binnen de pandcontour, zoals in de 3D BAG.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Nijmegen)): architect, bouwjaar, ligging boven het fabrieksgebouw, monumentstatus.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +14,29, hoogste punt NAP +42,57 (28,3 m boven maaiveld), middelpunt en straal van het reservoir (rand op halve hoogte circa 6,1 m uit het hart), radiaal dakprofiel van 26,98 m op 5,25 m naar 28,14 m op 2,25 m (21 graden), glas in het midden (geen data binnen 1,5 m), fabrieksdak rond de toren op 5 tot 7,5 m en het plein ten noordoosten op maaiveld.
- 3D BAG, pand NL.IMBAG.Pand.0268100000015629 (LoD2.2, puntenwolk AHN5 2024, CC BY 4.0, TU Delft 3D geoinformation en 3DGI): de dakvlakken van de fabriek.
- Foto [Nijmegen NYMA-watertoren](https://commons.wikimedia.org/wiki/File:Nijmegen_NYMA-watertoren.JPG), bijna frontaal: kolommen (acht, 45 graden uit elkaar), de hoogtes van kroonlijst en ringbalken en de schoren, geschaald op de breedte uit het AHN (45 px/m) en gelijkgezet op de dakrand in het AHN.
- Telefoto [vanuit de Waalsprong](https://commons.wikimedia.org/wiki/File:Nijmegen_NYMA_watertoren_achter_de_Oversteek,_vanuit_de_Waalsprong_gezien_(02).JPG): controle van de bovenste ringbalk (44,6 px/m) en de voet van de schoren op de onderste ringbalk rond 10,6 m.
- Foto's [Nijmegen Watertoren NYMA 2010](https://commons.wikimedia.org/wiki/File:Nijmegen_Watertoren_NYMA_2010.jpg) en [Nijmegen Watertoren 2010](https://commons.wikimedia.org/wiki/File:Nijmegen_Watertoren_2010.JPG): de noordzijde vanaf de overkant van de Waal en een andere zijde met de bakstenen band; ringbalken en kolommen rondom gelijk.
- Luchtfoto (PDOK, 8 cm): zestienhoekige dakrand, kegeldak met radiale naden en een ronde lichtkoepel in het midden.

## Geschat en weggelaten

Geschat: de stand van de kolommen (op de RD-assen en diagonalen), de zestienhoek (de luchtfoto toont een veelhoek met circa zestien zijden, de foto's acht kolommen), het uitsteken van kolommen, ringbalken en kroonlijst (0,2 tot 0,35 m), de hoogte van de onderste ringbalk (uit één telefoto), de breedte en dikte van de schoren, de hoogte van de lichtkoepel. Het dak is het dak uit het AHN (rand 26,6 m, top 28,4 m); de 3D BAG (AHN5, 2024) toont de toren zonder dak, kennelijk tijdens de renovatie, en de nieuwste luchtfoto weer een kegeldak met lichtkoepel, waarvan de hoogte niet gemeten is. Onder het fabrieksdak loopt het reservoir als volle zestienhoek door tot het maaiveld; op de telefoto lijkt de toren onder de onderste ringbalk smaller, maar dat deel zit vrijwel overal in de fabriek. Aan de noordoostzijde, waar de gevel van de fabriek langs de toren loopt, staat het reservoir zo tot op het plein, zoals het AHN daar ook tot het maaiveld een rand op 6,5 m toont.

Weggelaten: het opschrift NYMA (verf op metselwerk), de boogvormige bovenkant van de bakstenen panelen (zwiktrommels kleiner dan 0,9 m en met een te vlakke onderkant), de kooiladder aan de westzijde, de stalen consoles aan de schoren, de ronde daklichten op het kegeldak, en het witte stalen frame ten zuidoosten en de witte opbouw ten noordwesten op de nieuwste luchtfoto (dunner dan 0,9 m of niet in het AHN; mogelijk tijdelijk door de renovatie). De fabriek heeft het detail van de 3D BAG, zoals de PDOK-reconstructie.

## Controle

Toren: één gesloten NoError-node met genus 0. Fabriek: NoError, genus 0, twee delen (de hal en het blok dakopbouwen). In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met minder dan 0,1 %: de toren heeft geen ondervlak vlakker dan 45 graden (ringbalken en kroonlijst onder 55 graden, flanken van de schoren 37 graden afgeschuind) en de fabriek bestaat uit prisma's. De doorsneden van de toren op 5, 13, 19, 24 en 27,5 m en van de fabriek op 2 en 6 m blijven gelijk. Controlebeelden blijven buiten de repo. De preview-export (1:1000, support v2, uitsnede 300 m zodat de hele fabriekshal erin valt) heeft geen steun; op de kaart staan toren en hal op het verborgen PDOK-pand en sluit de hal aan op de omgeving, met de torenvoet 0,1–0,6 m in het maaiveld.

Controle-URL: http://localhost:3000/kaart/51.85667/5.83778/200/1x1/0
