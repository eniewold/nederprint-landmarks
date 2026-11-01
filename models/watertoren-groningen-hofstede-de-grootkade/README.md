# Watertoren Hofstede de Grootkade (Groningen)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-groningen-hofstede-de-grootkade.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is een verjongende zestienhoek met losse lisenen en kraagstenen, banden en kroonlijst zijn schuine ringen, het dak is een zestienzijdige afgeknotte piramide, de koepels zijn één omwentelingsprofiel; vensters, boogvensters en de deur zijn nissen.

De watertoren aan de Hofstede de Grootkade, op de hoek met de Herman Colleniusstraat, is in 1912 gebouwd naar ontwerp van stadsarchitect J.A. Mulock Houwer ("Watertoren West"). Hij is 56,30 m hoog en had een hangbodemreservoir van 1000 m³; in 1925 kwam daaronder een tweede van 782 m³. Sinds eind 2013 buiten gebruik, verkocht en verbouwd tot appartementen met een skylounge. Rijksmonument 485188.

## Bestanden

- `watertoren-groningen-hofstede-de-grootkade.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een los dak of reservoir zou een voet tot de grondplaat krijgen.
- `watertoren-groningen-hofstede-de-grootkade.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-groningen-hofstede-de-grootkade-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [232618.08, 581972.45], het hart uit een cirkelfit per hoogte op het AHN over de sectoren zonder bomen, op maaiveld (NAP +2,45 m, mediaan van de ring van 9,5 tot 11,5 m rond de voet). De BAG-contour van pand 0014100010913807 is een grove achthoek (straal 9,45 tot 9,96 m) en ligt 0,25 m van het hart. Assen in RD-richting (`xAxis` [1, 0]). De zestien vlakken van schacht, boogvensterzone en dak hebben hun midden op 4,5 + k·22,5 graden: zo staan de vier dakkapellen, die het AHN op circa 27, 117, 207 en 297 graden laat zien, midden op een vlak, net als op de foto's, waar de lisenen, de boogvensters en de vensters van mantel en fries in dezelfde zestien kolommen staan. `groundHeight` 43,21 is het maaiveld plus de NLGEO2018-geoïdehoogte (40,76 m). Vervangt alleen het BAG-pand van de toren; het dichtstbijzijnde andere pand ligt meer dan 4 m van het model.

## Onderdeel `building:schacht-reservoir-dak-en-lantaarn`

- Zestienhoekige bakstenen schacht, apothema 9,05 m aan de voet en 8,85 m op 29 m, op een plint (apothema 9,3) tot 2,2 m met een afgeschuinde lijst tot 2,6 m. Op elke hoek een lisene van 1,0 m breed en 0,25 m buiten de hoek (buitenkant van 9,48 naar 9,27 m uit het hart). Bovenaan elk vlak getrapte kraagstenen: twee hoge naast de lisenen (27,6 tot 29,0 m) en een lagere in het midden (27,1 tot 28,1 m), 0,2 m voor het vlak.
- Trappenhuisvensters in de oneven vlakken (onder de dakkapellen en daartussen): een paar hoge smalle vensters van 23,0 tot 26,2 m en twee enkele vensters van 15,3 tot 18,7 en van 7,1 tot 9,9 m. De ingang (1,8 × 3,2 m) staat in het vlak naar het westen, waar het pad op de luchtfoto bij de toren uitkomt.
- Onderste stenen band van 29,0 tot 29,3 m op de lisenen, daarboven de zestienhoekige zone (apothema 8,95) met in elk vlak een segmentboogvenster van 1,8 m breed (29,7 tot 31,35 m), daarboven de bovenste band naar de ronde mantel (31,95 tot 32,33 m).
- Ronde reservoirmantel van 18,2 m met zestien vensters (twee boven elkaar in één omlijsting, 33,3 tot 35,75 m), het tegelfries van 36,6 tot 37,8 m met twaalf vierkante venstertjes, en de overstekende kroonlijst tot 19,0 m met een onderkant onder 56 graden, tot de dakvoet op 38,9 m.
- Zestienzijdig tentdak (55 graden) van de kroonlijst tot de lantaarn op 47,9 m. Vier dakkapellen van 4,4 m breed op de mantel, die de kroonlijst onderbreken, met een groot venster van 2,5 m (36,4 tot 40,9 m) en een schilddakje van 41,6 tot 43,9 m dat in het tentdak loopt.
- Zestienzijdige lantaarn (apothema 2,85) met zestien vensters tot 49,6 m, daarboven de koepel tot 52,1 m, een hals van 1,9 m tot 54,8 m en een kleine koepel tot 55,9 m.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Groningen_Hofstede_de_Grootkade)): architect, bouwjaar, 56,30 m, reservoirs van 1000 en 782 m³, verbouwing.
- [Rijksmonumentenregister 485188](https://monumentenregister.cultureelerfgoed.nl/monumenten/485188).
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +2,45, hoogste punt NAP +58,32 (55,9 m boven maaiveld, de kleine koepel), hart en straal per hoogte (cirkelfit, buitenkant van de kroonlijst circa 9,45 m), dakprofiel (helling 54,4 graden, van 40,4 m op r = 8,25 tot 47,4 m op r = 3,25), dakkapellen per sector (front op de mantel, ongeveer 4,4 m breed, nok rond 43,8 m), lantaarn en koepels uit het radiale profiel.
- BAG-pand 0014100010913807 en luchtfoto (PDOK): ligging, zestien dakvlakken, vier dakkapellen, het pad aan de westkant.
- Foto [RM485188 foto6](https://commons.wikimedia.org/wiki/File:Groningen,_de_watertoren_aan_de_Hofstede_de_Grootkade,_RM485188_foto6_2013-08-04_17.35.jpg), bijna frontaal: hoogtes van banden, boogvensters, kraagstenen, mantelvensters, fries en kroonlijst op het voorste vlak, geschaald op het maaiveld en de kroonlijst in het AHN (26,4 px/m).
- Foto [Watertower Hofstede de Grootkade](https://commons.wikimedia.org/wiki/File:Watertower_Hofstede_de_Grootkade_(Groningen).JPG): dakkapellen, lantaarn, koepel, hals en spits, en de trappenhuisvensters onder een dakkapel.
- Foto's [Watertoren van Groningenstad 01](https://commons.wikimedia.org/wiki/File:Watertoren_van_Groningenstad_01.jpg) en [Watertoren Groningen](https://commons.wikimedia.org/wiki/File:Watertoren_Groningen.JPG): lisenen (zestien, geteld op hun hoeken), kraagstenen, banden, plint en vensters.
- NLGEO2018 voor de geoïdehoogte op de oorsprong.

## Geschat en weggelaten

Geschat: de verjonging van de schacht (0,2 m; het AHN ziet de gevel onder de kroonlijst niet, de foto's tonen een lichte verjonging), de breedte en het uitsteken van lisenen, kraagstenen en banden, de hoogte van de plint, de hoogtes van de twee enkele trappenhuisvensters en het patroon van de vensters per vlak (in de foto's alleen aan de straatzijden te zien; hier in elk oneven vlak), de richting van de ingang (westen, naar het pad), de vorm van de dakkapellen (front 0,27 m achter de mantel zodat de hoeken erop vallen) en de koepelprofielen (een kwartellips tussen de AHN-punten). De dakkapel op 27 graden is in het AHN ongeveer 1 m hoger dan de andere drie (waarschijnlijk de glazen pui van de verbouwing); hier zijn ze gelijk.

Weggelaten (kleiner dan 0,9 m of te dun): de spits op de kleine koepel (Wikipedia 56,30 m tegen 55,9 m in het AHN), de pinakels op de dakkapellen, de dakramen, de consoles onder de kroonlijst, het tegelpatroon van het fries, de lamellen in de blinde boogvensters, de stenen omlijstingen van de vensters en de profielen langs het fries.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met 0,01 %: banden, kraagstenen en kroonlijst hebben onderkanten van 56 graden en de nisplafonds lopen onder 56 graden op. De doorsneden op 8,5, 24,6, 30,5, 34,5, 37,2, 40 en 48,8 m (vensters, boogvensters, mantel, fries, dakkapellen en lantaarn) blijven gelijk. Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2) komen alleen splinters steun in de vensternissen. Op de kaart staat de toren op het verborgen PDOK-blok met de voet 0,11–0,62 m in het maaiveld.

Controle-URL: http://localhost:3000/kaart/53.21857/6.54909/200/1x1/0
