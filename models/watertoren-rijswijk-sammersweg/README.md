# Watertoren Sammersweg (Rijswijk)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-rijswijk-sammersweg.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: het onderstel is een afgeknotte piramide waar per zijde één doorgang met een spitse top doorheen is gesneden, zodat vier vrijstaande hoekpoten overblijven, en de bak is een kubusvormig blok.

De watertoren staat aan de Sammersweg in Rijswijk, naast de afslag naar de Strijplaan bij de Sammersbrug, op de noordoever van de sloot. Het is een tuinderswatertoren: een vierkante ijzeren bak op vier stalen poten, gebouwd voor de bevloeiing van gewassen in een tuindersbedrijf. Bouwjaar, hoogte en inhoud zijn onbekend (Wikipedia). Hij doet geen dienst meer en staat er als herinnering aan de kassenbouw langs de Sammersweg. De toren staat er nog: hij staat op elke luchtfoto van 2016 tot en met 2026 (de weg en het fietspad ernaast zijn tussen 2025 en 2026 omgelegd) en in de AHN5-puntenwolk van 2023.

De toren is geen BAG-pand: in de BAG-WFS, de 3D BAG en de PDOK-gebouwtegels staat op deze plek niets. Het enige pand in de buurt (0603100000001329) ligt aan de overkant van de Sammersweg. `replacesBuildings` is daarom leeg; zonder dit model toont de kaart hier alleen terrein.

## Bestanden

- `watertoren-rijswijk-sammersweg.glb`: één node, `building:watertoren-poten-en-bak`.
- `watertoren-rijswijk-sammersweg.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints` en `groundHeight`, zonder vervangen pand.
- `watertoren-rijswijk-sammersweg-1-1000.stl`: het model op 1:1000 (3,0 × 3,0 × 8,0 mm).

## Oorsprong en oriëntatie

RD-oorsprong [79897.73, 450806.92] (52,040494 N, 4,292548 O): het hart van de bak en de ringen in de AHN5-puntenwolk. De Wikipedia-coördinaat en de controle-URL liggen 2 m westelijker, op de toren.

De lokale X-as staat 18 graden linksom van RD-oost (`xAxis` [0.95106, 0.30902]), evenwijdig aan een zijde van de bak, gemeten op de wanden van de bak en de twee ringen in de puntenwolk (circa 3 graden onzeker).

`groundSamplePoints` liggen op 3 m oost, noord en zuid en op 3,1 m noordwest, buiten de voeten (1,5 m) en niet aan de westkant, waar de oever naar de sloot zakt (PDOK 43,99 op 3 m west). `groundHeight` 44,74 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten: oost 44,79, noord 44,74, zuid 44,80 en noordwest 44,84, gemeten op 2026-11-07. Onder het hart ligt het PDOK-terrein op 44,83. `groundOffsetMetres` is −0,1.

## Onderdelen

Maten boven het maaiveld (NAP +1,45).

- Poten: vier hoekpoten van 0,9 m in het vierkant. De buitenkant loopt van 3,0 m in het vierkant op het maaiveld naar 2,15 m onder de bak op 6,0 m (4 graden uit het lood). Onder het maaiveld lopen ze loodrecht door tot −0,3 m.
- Doorgangen: per zijde één doorgang van de grond tot 5,6 m, met zijden langs de binnenkant van de poten en een spitse top onder 50 graden. Binnen de poten een holte met een piramidevormig plafond onder 50 graden. Tussen de toppen en de bak blijft een drager van 0,4 m.
- Bak: 2,15 m in het vierkant van 6,0 tot 7,65 m.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Rijswijk_Sammersweg)): vierkante ijzeren bak op vier poten, voor de bevloeiing in een tuindersbedrijf, nu een herinnering aan de kassenbouw. Bouwjaar, hoogte en inhoud onbekend.
- Foto's op Wikimedia Commons: "Rijswijk - Watertoren Sammersweg.jpg" (Quistnix, 2009, vanaf de zuidkant van de sloot) en "Watertoren Sammersbrug.JPG" (2015, van onderaf). Daarop zijn te zien: de vier taps toelopende hoekpoten, twee horizontale ringen, gekruiste trekstangen met spanschroeven in de twee bovenste vakken, schoren in het onderste vak, een stijgbuis in het midden en de geklonken bak. Uit de foto van 2009 komen de verhoudingen: de voeten staan 1,4 keer zo breed als de bak, en de hele toren is 3,5 keer de breedte van de bak hoog.
- AHN5-puntenwolk 2023 (GeoTiles 30DZ2_25), geclassificeerde punten rond de toren, 2026-11-07. Het DSM van 0,5 m laat de dunne toren bijna niet zien, de puntenwolk wel:
  - maaiveld NAP +1,45 (grondpunten bij de vier voeten 1,38 tot 1,48);
  - ringen op NAP +3,49 en +5,50, 2,65 à 2,7 m en 2,25 à 2,3 m in het vierkant;
  - bodem binnen in de bak op NAP +7,52;
  - rand van de bak op NAP +9,0 à +9,17, de wanden 2,1 à 2,15 m in het vierkant.
  De punten op de bodem binnen de bak, 1,6 m onder de rand, laten zien dat de bak geen dak heeft.
- PDOK-luchtfoto's (Actueel_orthoHR en de jaargangen 2016 tot 2026): de bak als donker vierkant van circa 2,2 m met zijn schaduw.
- PDOK BAG-WFS, 3D BAG en gebouwtegels (2026-11-07): geen pand op de toren.

## Geschat en weggelaten

Geschat:

- De spreiding van de voeten (3,0 m) is doorgetrokken uit de ringen en de bak in de puntenwolk en klopt met de foto van 2009. Ook de rechte lijn van de poten is aangenomen.
- De hoek van de as is circa 3 graden onzeker.
- De poten zijn in het echt hoekprofielen van circa 0,15 m. Hier zijn ze 0,9 m, zodat ze op 1:1000 printbaar zijn. De doorgangen worden daardoor smal: 1,2 m aan de voet en 0,4 m onder de bak.

Weggelaten (dunner dan 0,9 m):

- de twee ringen (hoekstaal). Als ringen van 0,9 m zouden ze het smalle vakwerk tot een gesloten toren met vensters maken;
- de trekstangen en schoren, de stijgbuis in het midden, de klinknagels en naden van de bak;
- de open bovenkant van de bak. Bij wanden van 0,9 m blijft er binnenin maar 0,35 m over, dus de bak is hier dicht.

De brug, de leuning en de sloot staan als PDOK-terrein op de kaart.

## Controle

Eén gesloten NoError-node, één component, genus 0 (de vier poten staan los op de grond en komen samen onder de bak). In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet:

- de poten staan 4 graden uit het lood;
- de toppen van de doorgangen en het plafond van de holte lopen onder 50 graden;
- de bak staat recht op de poten.

Een export op 1:1000 (uitsnede van 80 m, steunmethode v2, 45 graden) bevat het model zonder ondersteuningsobject. Het volume is alleen gegroeid met de voeten die tot de ondergrond doorlopen. Zonder landmarks staat er op deze plek niets. Controlebeelden blijven buiten de repo.

Controle-URL: http://localhost:3000/kaart/52.04049/4.29252/200/1x1/0
