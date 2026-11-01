# Watertoren Eibergen

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-eibergen.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is een cirkel met vier geëxtrudeerde risalieten, band, kroonlijst en dak zijn omwentelingsprofielen; deur, vensters, raambanden en spleetvensters zijn nissen.

De watertoren van Eibergen is in 1935 gebouwd naar ontwerp van J.H.J. Kording, 46 m hoog met reservoirs van 400 en 200 m³. Hij draagt een antenne en is rijksmonument 509417.

## Bestanden

- `watertoren-eibergen.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een losse kroonlijst of een los dak zou een voet tot de grondplaat krijgen.
- `watertoren-eibergen.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-eibergen-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [242361.39, 459482.32], het middelpunt van de BAG-contour van pand 1859100000791649, op maaiveld (NAP +29,2 m: de licht verhoogde berm rond de voet; verderop ligt het weiland op NAP +28,4 tot +28,9). De hoekpunten van de contour tussen de risalieten liggen op een cirkel van 5,83 m (binnen 0,12 m); de top van de kegel in het AHN ligt 0,1 m van dat middelpunt. +X wijst naar de oostelijke risaliet, 4,6 graden linksom van RD-oost (`xAxis` [0.99678, 0.0802]), de richting van de rechte vlakken in de contour. De ingang zit in de noordwestelijke hoek, waar het pad vanaf de weg uitkomt. Vervangt alleen het BAG-pand van de toren.

## Onderdeel `building:schacht-band-kroonlijst-en-kegeldak`

- Ronde bakstenen schacht van 11,66 m met vier vlakke risalieten van 3,8 m breed (vlak op 5,88 m uit het hart: in het midden 0,05 m voor de cirkel, aan de randen 0,37 m). Op elke risaliet een verdiept middenvlak van 1,6 m tussen twee lisenen van 1,1 m, van de plint tot onder de band.
- Gemetselde plint tot 2,5 m, 0,15 m breder dan de schacht. Deur (1,2 × 2,1 m) in de noordwestelijke hoek.
- In elke hoek, midden tussen de risalieten: een ventilatierooster op 4,2 tot 5,3 m, drie vensters van 0,6 m boven elkaar (7,4 tot 10,4, 13,3 tot 16,6 en 19,6 tot 22,7 m) en een raamband van 2,4 m op 25,6 tot 27,1 m.
- Witte betonnen band tot 6,25 m uit het hart, voorkant van 28,7 tot 29,4 m, met een schuine onderkant onder 56 graden.
- Reservoirzone met in elke hoek drie spleetvensters van 0,4 m breed (30,6 tot 37,8 m, 1,3 m hart op hart).
- Witte kroonlijst tot 6,25 m, voorkant van 38,9 tot 39,3 m, schuine onderkant onder 56 graden; boven elk spleetvenster een wit kruisblok van 0,7 m breed dat door de kroonlijst loopt en 0,3 m boven de lijst uitsteekt.
- Koperen kegeldak van 5,9 m straal op 39,3 m tot de top op 45,2 m (helling 1:1, zoals het AHN).

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Eibergen)): architect, bouwjaar, 46 m, 400 + 200 m³, monument.
- [Rijksmonumentenregister 509417](https://monumentenregister.cultureelerfgoed.nl/monumenten/509417).
- BAG-pand 1859100000791649 (PDOK, in gebruik, bouwjaar 1935): 22 hoekpunten, vier rechte vlakken van 3,8 m en daartussen hoekpunten op een cirkel van 5,83 m.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld rond de voet NAP +29,0 tot +29,4, het dak past op een ronde kegel met helling 0,98 en top NAP +74,4 (rms 0,08 m), dakrand rond NAP +68,5.
- Foto [Overzicht watertoren - Eibergen - 20359578 - RCE](https://commons.wikimedia.org/wiki/File:Overzicht_watertoren_-_Eibergen_-_20359578_-_RCE.jpg), frontaal op de westelijke risaliet: alle hoogtes, 32,0 px/m, geschaald op de risaliet van 3,8 m en de kroonlijst in het AHN; de hoeken liggen verder van de camera en zijn 2 % opgehoogd. Ook de ronde hoeken (de band loopt er als een boog overheen), de lisenen, de plint en de ingang met de roosters.
- Foto [Eibergen Watertoren 2006](https://commons.wikimedia.org/wiki/File:Eibergen_Watertoren_2006.JPG), op een hoek: vensters, raamband, spleetvensters, kruisblokken en het kegeldak.

## Geschat en weggelaten

Geschat: de diepte van de nissen (0,25 tot 0,45 m) en van het verdiepte middenvlak (0,2 m), de breedte van de vensters (0,6 m, op de foto 0,5 m), de uitsprong en de schuine onderkant van band en kroonlijst (op de foto 0,3 tot 0,4 m, de helling gekozen op 56 graden), de breedte van de kruisblokken (0,7 m, op de foto 0,6 m), de richting van de deur (onder de roosters in de noordwestelijke hoek) en de hoogte van de deur (2,1 m, zodat het nisplafond in de plint blijft). In het AHN lijkt de dakrand op de diagonalen aan de oostkant tot 4,5 m in te springen; de foto's van twee kanten en de BAG-contour tonen aan alle kanten dezelfde ronde hoeken, het model volgt die.

Weggelaten (kleiner dan 0,9 m of te dun): de antenne en antennemasten, het hekwerk rond de voet van het kegeldak, het platte luifeltje boven de deur (een dunne plaat; als steunconsole zou hij de deur dichtzetten), de witte kaders rond de raambanden, de kleine consoles onder de band op de lisenen, de witte dorpels onder de spleetvensters, het dakluik op de kegel, de lantaarnpaal en het bord bij de ingang.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet meetbaar (verhouding 1,0000): de band, de kroonlijst, de kruisblokken en alle nisplafonds lopen onder 56 graden en de toren heeft geen uitkragend reservoir. De doorsneden op 1, 9, 26,3, 28,3, 34, 38,5 en 42 m (deur, vensters, raamband, band, spleetvensters, kruisblokken, dak) blijven gelijk. Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2) komen alleen splinters steun in de roosternissen; op de kaart staat de toren op het verborgen PDOK-blok met de voet 0,1–0,3 m in het maaiveld.

Controle-URL: http://localhost:3000/kaart/52.11666/6.66273/200/1x1/0
