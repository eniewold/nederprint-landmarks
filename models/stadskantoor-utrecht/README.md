# Stadskantoor Utrecht (Utrecht)

## Bestanden en plaatsing

`stadskantoor-utrecht.glb` in meters met Y omhoog, `stadskantoor-utrecht.json` voor de catalogus en `stadskantoor-utrecht-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-stadskantoor-utrecht.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [135870, 455736], X-as [0.8688908169083602, 0.49500378613938134], Z=0 op NAP 2.47 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 45.86565235 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0344100000135173.

## Bouwdelen, gemeten maten en aannames

Het H-vormige Stadskantoor van Kraaijvanger, Dirk Jan Postel en Christian Müller (2014), bestaat uit de noordtoren op haar garage, de zuidtoren boven de stationsterminal en twee carrévleugels om het atrium. Dakcontouren en hoogtes volgen 3D BAG en AHN: noord 92,450 m en zuid 92,439 m NAP, techniekhuizen 96,469/96,457 m, noordelijke techniek tot 97,8 m, ventilatieveld 94,077 m, middenvleugels 55,353/55,412 m, glasdak 36,309 m en garageplint 10,509 m. De twee afgeschuinde gevels zijn doorlopende vlakke vormen tussen hun schouder op circa 55,35 m en de gemeten dakcontouren. Nissen volgen die hellingen; geveldiagonalen liggen aan de gevel, zonder loshangende staven. De publieke glasgevel heeft een licht gekromde plancontour. De ruimte onder het glasdak blijft hol en de hof erboven open. Drie hoofdsteunpunten onder de zuidtoren volgen de constructiebron; hun precieze positie, onderkant op 33 m NAP en de aangesloten printonderschalen zijn uit foto geschat, circa 1–2 m onzeker. Deze schalen maken de onderhang massiever dan werkelijk. Vensters circa 2,7 bij 2 m, 3,6 m verdiepingsteek, nissen 0,4 m diep, witte diagonalen 1,1 m breed en glaspuiverdeling zijn geschat. Ventilatorposities komen uit de actuele ortho, hoogte is tot 0,9 m verdikt. De acht grove toegangstreden lopen naar 10,35 m NAP; plaats en breedte zijn geschat. Utrecht Centraal en WTC blijven afzonderlijke panden.

## Weggelaten

Dunne kozijnen, gele onderhoudsframes, roosters en zonnepanelen onder 0,9 m dikte. De grote dakinstallaties en zichtbare ventilatorkoppen staan wel in het model. De rest van het Stadsplateau en de publieke pleinen blijven PDOK-terrein: geen dubbele plateau- of pleinplaat. Interieurmeubilair, roltrappen en personen zijn buiten de landmarkmodellering gehouden.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 29,196 driehoeken. Printcontrole per node: NoError, 2.81% extra volume; NoError, 0.00% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: Twee afgeschuinde torens met vensternissen en witte geveldiagonalen; open zuidonderhang boven het station.; 55 graden: Gevarieerde gevelvlakken, drie zuidsteunpunten met aangesloten printonderschalen, dakinstallaties en ventilatoren.; 145 graden: Glasfront, toegangstrappen en garageplint sluiten op de voet en het lagere terrein aan.; 235 graden: Twee afzonderlijke carrévleugels met een open binnenhof boven het glasdak, behoud van Utrecht Centraal en WTC..

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 220 bij 220 mm, 346 objecten, 159,978 driehoeken, 98.7 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- https://www.nationalestaalprijs.nl/project/stadskantoor-utrecht (constructie,driehoofdkolommen)
- https://www.staalmakers.nl/projecten/stadskantoor-utrecht/ (uitvoerende staalbouwer)
- https://www.octatube.nl/project-item/projectitem/167-stadskantoor-utrecht.html (glasgevelleverancier)
- https://www.architectuur.org/bouwwerk/690/Stadskantoor_Utrecht.html
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0344100000135173 (TU Delft/3DGI CC BY4.0)
- https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)
- https://service.pdok.nl/rws/ahn/wcs/v1_0 (CC0)
- https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0
- https://commons.wikimedia.org/wiki/File:Stadskantoor_Utrecht._(18148413504).jpg (FaceMePLS,CC BY2.0)
- https://commons.wikimedia.org/wiki/File:Stadskantoor_Utrecht_in_2021.jpg (Choinowski,CC BY-SA4.0)
- https://commons.wikimedia.org/wiki/File:Stadskantoor_Utrecht_(oktober_2014)_1.jpg (Victor van Werkhooven,CC BY3.0)
