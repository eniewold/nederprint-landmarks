# Watertoren Simpelveld

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-simpelveld.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de onderbouw is een geëxtrudeerde achthoek, het reservoir één omwentelingsprofiel (schuine onderrand, cilinder en licht oplopend plat dak); deur en venster zijn nissen.

De spoorwegwatertoren van Simpelveld is in 1929–1930 gebouwd door aannemer Meijer uit Voerendaal, 8,85 m hoog, met een rond betonnen reservoir dat een scheidingswand in twee delen van 25 m³ verdeelt. Hij staat op een verhoging aan het spoorwegemplacement (nu de Zuid-Limburgse Stoomtrein Maatschappij), was tot 1954 in bedrijf en is sinds 2001 rijksmonument (518643): een achtzijdige bakstenen onderbouw in kruisverband met een stalen deur en een venster, en een ver overstekend betonnen reservoir zonder ommanteling met een plat dak en een stalen trap.

## Bestanden

- `watertoren-simpelveld.glb`: één node van klasse `building`, op het maaiveld. De export vult elke node apart op; een los reservoir zou een eigen voet tot de grondplaat krijgen.
- `watertoren-simpelveld.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight`, `groundSamplePoints` en het vervangen BAG-pand.
- `watertoren-simpelveld-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [197218.65, 315851.5], het hart van het dak in het AHN-DSM (cirkelfit op de dakpixels boven NAP +166,0), op maaiveld (NAP +158,05 in het DTM op het plateau rond de voet). Assen in RD-richting (`xAxis` [1, 0]). De BAG-contour van pand 0965100000822833 (24 punten, 5,2 m doorsnede) ligt 1,3 m naar het zuidoosten; op dat deel van de contour staat in het DSM alleen begroeiing (NAP +159 tot +164), dus de contour is verschoven. De vlakken van de achthoek staan op 0, 45, 90 … graden: de foto vanuit het noordwesten kijkt frontaal op een vlak (middenvlak 0,43 van de breedte, zoals bij een achthoek). Het venster zit in het vlak naar het noordwesten (foto), de deur in het vlak naar het noorden, waar het betonpad van de luchtfoto bij de toren uitkomt. Vervangt alleen het BAG-pand van de toren; het dichtstbijzijnde andere pand ligt 23 m verderop.

`groundSamplePoints` liggen op 3,8 m van het hart op het plateau (DTM NAP +157,95 tot +158,15); het lagere werkterrein in het westen en noordwesten (NAP +153,5) begint pas 6 m verder. `groundHeight` 204,07 = NAP 158,05 + 46,02 (NLGEO2018-geoïde op de oorsprong).

## Onderdeel `building:achtzijdige-onderbouw-en-reservoir`

- Achtzijdige bakstenen onderbouw van 3,0 m over de vlakken (apothema 1,5 m) tot in het reservoir. Deurnis van 0,9 × 2,0 m (0,3 m diep) in het noordvlak, vensternis van 0,6 × 0,7 m (0,25 m diep) van 2,75 tot 3,45 m in het noordwestvlak, beide met een plafond onder 56 graden.
- Betonnen reservoir van 4,6 m doorsnede: vlakke bodem op 5,0 m tot r 2,15, schuine onderrand onder 53 graden tot r 2,3 op 5,2 m (de afgeronde onderrand op de foto), cilinder tot de dakrand op 8,8 m en een plat dak dat licht oploopt tot 8,9 m in het midden. Het reservoir steekt 0,55 tot 0,8 m over de onderbouw.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Simpelveld)): bouwjaar, aannemer, 8,85 m, 2 × 25 m³, doorsnede 5,1 m, rijksmonument.
- [Monumentenregister 518643](https://monumentenregister.cultureelerfgoed.nl/monumenten/518643): achtzijdige bakstenen onderbouw, rechthoekige stalen deur en venster, betonnen reservoir zonder ommanteling met plat dak en stalen trap, 9 m hoog.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +158,05 op het plateau, dakrand NAP +166,8, hoogste punt NAP +166,96 (8,9 m boven maaiveld), reservoir 4,4 tot 4,7 m tussen de randpixels, het hart.
- Luchtfoto (PDOK, 8 cm): het dak 4,4 m breed, het betonpad dat van het noorden naar de toren loopt, de verharding ten zuidwesten van de voet.
- Foto [Simpelveld Watertoren 8547](https://commons.wikimedia.org/wiki/File:Simpelveld_Watertoren_8547.JPG), vanuit het lagere terrein in het noordwesten, frontaal op een vlak van de achthoek: verhoudingen, geschaald op het reservoir van 4,6 m (78 px/m): reservoir 3,8 m hoog, onderbouw 3,0 m over de vlakken, het venster (0,45 × 0,55 m) 1,7 m onder de bodem.
- Foto [Watertower, Simpelveld, Netherlands](https://commons.wikimedia.org/wiki/File:Watertower,_Simpelveld,_Netherlands.JPG): dezelfde kant, controle van de verhoudingen.

## Geschat en weggelaten

Geschat: de doorsnede van het reservoir (4,6 m uit AHN en luchtfoto; Wikipedia noemt 5,1 m en de BAG-contour 5,2 m, maar dat past niet bij het DSM, en 4,6 × 3,8 m geeft met wanden en vloeren de 50 m³ uit de bron), de hoogte van de bodem (5,0 m, uit de fotoverhouding onder de dakrand van het AHN), de stand van de achthoek (vlakken op de RD-assen en diagonalen, uit de frontale foto vanuit het noordwesten), de deur (richting en maat; hij staat niet op de foto's, het pad komt aan de noordkant uit), de schuine onderrand en het oplopende dak. Het venster is iets groter genomen (0,6 × 0,7 m) dan op de foto, zodat de nis zichtbaar blijft.

Weggelaten (dun staal of kleiner dan 0,9 m): de stalen trap schuin langs het reservoir met de bordessen onderaan (zuidwestkant) en bovenaan op de dakrand, de ladder van het maaiveld naar het onderste bordes, de leuningen, de kleine opbouwen op het dak, de afvoer langs het reservoir en de stortnaad halverwege het reservoir. De voet van de onderbouw staat op de foto's in de begroeiing; een plint is niet te zien en niet gemodelleerd. De draaischijfring en de watervulinstallatie die tot hetzelfde monument horen, staan elders op het emplacement en horen niet bij dit model.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met 2,4 %: de wig onder de vlakke reservoirbodem, de echte overhang. Onder 4,0 m blijven deur en venster open (op een randje van 0,006 m³ bovenin de vensternis na), en de doorsneden op 1, 3, 6,5 en 8,5 m blijven gelijk. Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2) komt een wig onder de reservoirbodem en een paar dunne randjes langs de hoeken van de achthoek. Op de kaart staat de toren op het plateau, met het verborgen PDOK-blok 1,3 m zuidoostelijk ernaast, en de voet 0,12–0,21 m in het maaiveld.

Controle-URL: http://localhost:3000/kaart/50.83094/5.98645/200/1x1/0
