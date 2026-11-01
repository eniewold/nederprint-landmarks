# Watertoren Hoorn (Terschelling)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-hoorn-terschelling.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de toren is één omwentelingsprofiel (cilinder, schuine kraag, dakrand en licht oplopend dak), het dakluik een achthoek en het portaal een veelhoek uit de BAG-contour met een overstekende dakplaat; deur en panelen zijn nissen.

De watertoren van Hoorn op Terschelling is in 1958 gebouwd, 10 m hoog met één reservoir van 200 m³. Hij staat aan de Duinweg op een duin in het Hoornse Bos: een bakstenen cilinder met een betonnen dakrand en een plat dak, met aan de zuidzuidoostkant een laag betonnen deurportaal.

## Bestanden

- `watertoren-hoorn-terschelling.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een los portaal of dakluik zou een eigen voet krijgen.
- `watertoren-hoorn-terschelling.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-hoorn-terschelling-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [152416.89, 601676.59], het middelpunt van de cirkel door de ronde BAG-contour van pand 0093100000216576 (straal 3,27 m), op maaiveld (NAP +17,9 m in het AHN-DTM). Het hart van de toren in het AHN-DSM valt daarmee samen. Assen in RD-richting (`xAxis` [1, 0]). Het middelste vlak van het portaal, met de deur, kijkt naar -63,4 graden (zuidzuidoost). De coördinaten in de taak lagen 33 m ten zuiden van de toren; het BAG-pand is gecontroleerd (in gebruik, bouwjaar 1959, rond, onder de toren). Vervangt alleen dat pand.

## Onderdeel `building:cilinder-dakrand-dakluik-en-portaal`

- Bakstenen cilinder van 6,3 m tot +8,85, zonder verjonging (foto).
- Betonnen dakrand: een kraag onder 56 graden naar 6,6 m (de BAG-contour) op +9,07 en een rechte rand tot +9,25 (AHN NAP +27,1).
- Dak licht oplopend van de binnenkant van de dakrand naar +9,5 in het midden (AHN tot NAP +27,5), met een achthoekig dakluik of ontluchtingskap van 1,4 m tot +10,5, iets uit het midden (AHN-piek NAP +28,4 tot 28,6).
- Deurportaal aan de zuidzuidoostkant, uit de BAG-contour: drie vlakken van circa 1,3 m tussen -87 en -40 graden, 1,45 tot 1,6 m voor de muur, muren tot +2,1 en een plat dak met 0,2 m overstek op een schuine onderkant tot +2,65 (AHN NAP +20,45). Deur (0,95 × 2,0 m) in het middelste vlak, een dicht paneel (0,9 × 1,7 m) in elk zijvlak.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Hoorn_Terschelling)): bouwjaar, 10 m, 200 m³, ligging op een duin in het Hoornse Bos.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +17,8 tot 18,1 rond de voet, dakrand NAP +27,0 tot 27,1, dak tot NAP +27,5, dakluik tot NAP +28,6, portaaldak NAP +20,2 tot 20,5. De toren staat in het bos; de bomen eromheen staan tot NAP +28 maar raken de toren in het DSM niet.
- BAG-pand 0093100000216576 en luchtfoto (PDOK): ronde contour met de dakrand (straal 3,27 m), het portaal met drie vlakken, op de luchtfoto de lichte dakrand en het dakluik in het midden.
- Foto [Watertoren Hoorn, Terschelling](https://commons.wikimedia.org/wiki/File:Watertoren_Hoorn,_Terschelling.jpg), frontaal op het portaal: rechte bakstenen cilinder, betonnen dakrand met klein overstek, portaal met deur, twee panelen, betonnen kozijnen en een overstekend dak. Geschaald op de BAG-breedte (83 px/m) voor de toren en op de AHN-hoogte van het portaaldak (136 px/m) voor het portaal, dat dichter bij de camera staat.

## Geschat en weggelaten

Geschat: de muurstraal (3,15 m; de BAG-contour is het bovenaanzicht met de dakrand, de foto geeft een klein overstek), de hoogte en de helling van de kraag, de bolling van het dak (het DSM ziet het midden 0,2 tot 0,5 m hoger dan de rand), vorm en ligging van het dakluik (één DSM-piek van circa 1 m bij 1,5 m en een lichte schijf van 1,5 m op de luchtfoto), de maten van deur en panelen en het overstek van het portaaldak. Er is maar één foto (van de portaalkant); de andere kanten zijn op de luchtfoto en in het DSM even glad als op die foto, maar vensters of openingen daar zijn niet uit te sluiten.

Weggelaten (kleiner dan 0,9 m of te dun): de antennemast met de leidingen langs de muur, de ladder en de beugels op het dak, het ronde gat of putje bij de zuidrand van het dak, de betonnen kozijnen van het portaal als aparte lijst, het metselwerk en de ankers in de muur.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met 0,01 %: de kraag en de onderkant van het portaaldak hangen onder 56 graden en de nissen hebben steile plafonds. De doorsneden op 1, 2,3, 8,95 en 9,4 m (deur en panelen, portaaldak, kraag, dak) blijven gelijk. Renders van vier kanten naast de 3D BAG LoD2.2: de toren valt op het PDOK-blok, het portaal op het BAG-aanbouwtje. Controlebeelden blijven buiten de repo. In een preview-export op 1:1000 (100 × 100 m) is er vrijwel geen ondersteuning, alleen een sliertje onder het portaaldak. Op de kaart staat de toren op de plek van het verborgen PDOK-blok, met de voet 0,2 tot 0,7 m in het PDOK-maaiveld van het duin.

Controle-URL: http://localhost:3000/kaart/53.40140/5.34838/200/1x1/0
