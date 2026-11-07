# Watertoren Mallegat (Rotterdam)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-rotterdam-mallegat.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de voet bestaat uit achtkante prisma's en hulls, schacht, omgang, reservoir, dakrand, dak en schoorsteenmond zijn omwentelingsprofielen (96 segmenten), de onderkant van het reservoir is een hull van de schacht naar de achtkante ringbalk, de consoles zijn hulls en de velden in de voet blinde nissen.

De watertoren in het Mallegatpark (Feijenoord) werd in 1915-1916 gebouwd op het terrein van de gasfabriek Feijenoord. Het is een gemetselde fabrieksschoorsteen waaraan een betonnen reservoir hangt: het bluswater circuleerde door de schoorsteen en werd erdoor verwarmd. De Nederlandse Watertoren Stichting vroeg vergeefs de status van rijksmonument aan voor deze laatste combinatie van watertoren en schoorsteen in Nederland; het is een gemeentelijk monument en is gerestaureerd. De toren staat er nog (BAG-pand in gebruik, AHN, luchtfoto). Een hoogte en inhoud zijn niet gepubliceerd.

## Bestanden

- `watertoren-rotterdam-mallegat.glb`: één node, `building:watertoren-schoorsteen-voet-schacht-omgang-reservoir-en-mond`.
- `watertoren-rotterdam-mallegat.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-rotterdam-mallegat-1-1000.stl`: het model op 1:1000 (7,3 × 7,3 × 27,4 mm).

## Oorsprong en oriëntatie

RD-oorsprong [94849.91, 435293.96] (51,902898 N, 4,513176 O): het hart van BAG-pand 0599100010037769, een regelmatige achthoek met een straal van 2,05 m tot de hoeken (11,9 m²), op het maaiveld: AHN-DTM NAP +3,56 (3,48 tot 3,64 tussen 3 en 5 m). Het hart van de schoorsteenmond in het AHN-DSM ligt 0,4 m ernaast (pixels van 0,5 m).

De lokale X-as staat 3,2 graden linksom vanaf RD-oost (`xAxis` [0.99844, 0.05582]), zodat een hoek van de BAG-achthoek op de X-as ligt; de hoeken staan op k × 45 graden, de vlakken op 22,5 + k × 45 graden.

`groundSamplePoints` liggen op 4 m in de vier asrichtingen, net buiten de plint; `groundHeight` 47,15 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (oost 47,16, west 47,21, noord 47,15, zuid 47,21, gemeten 2026-11-07). Het PDOK-pand staat op 47,11. `groundOffsetMetres` is −0,1.

## Onderdelen

Maten en hoogtes boven het maaiveld (NAP +3,56).

- Voet: achtkante plint met een straal van 2,21 m tot de hoeken tot 0,9 m, afgeschuind onder 45 graden naar de achthoek van de BAG (2,05 m) op 1,06 m. De achthoek loopt tot 5,6 m; in de bovenste helft heeft elk vlak een verdiept veld van 0,95 m breed en 0,15 m diep (3,3 tot 5,25 m) tussen de hoekpenanten. Een afgeschuinde kap gaat naar de ronde schacht op 5,85 m.
- Schacht: rond, verjongend van straal 1,55 m op 5,85 m tot 1,32 m op 17,9 m.
- Omgang: betonnen plaat met straal 2,17 m van 18,8 tot 19,1 m op een kraag van 43 graden.
- Onderkant van het reservoir: kegel van de schacht (straal 1,4 m) op de omgang naar de hoeken van een achtkante ringbalk op 21,3 m (41 graden), met acht consoles van 0,9 m breed midden op de vlakken (onderkant 42 graden, tot 0,35 m buiten de kegel).
- Ringbalk: achthoek met de vlakken op 3,1 m, van 21,3 tot 22,35 m.
- Reservoir: cilinder met straal 3,08 m tot 23,45 m, dan de dakrand met een onderkant van 43 graden tot straal 3,65 m (24,07 m) en verticaal tot 25,0 m.
- Dak: kegel van 25,0 m aan de rand tot 25,6 m bij de schoorsteenmond (helling 0,3).
- Schoorsteenmond: straal 1,1 m tot 27,12 m.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Rotterdam_Mallegat)): 1915-1916, onderdeel van de gasfabriek Feijenoord en tegelijk schoorsteen; het water circuleerde voor koeling en werd door de schoorsteen verwarmd; rijksmonumentaanvraag afgewezen, gemeentelijk monument, gerestaureerd; hoogte en inhoud onbekend.
- BAG-pand 0599100010037769 (PDOK, 2026-11-07): regelmatige achthoek, straal 2,05 m tot de hoeken, hoeken op 3,2 + k × 45 graden; bouwjaar in de BAG 1975 (een standaardwaarde).
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-07): maaiveld NAP +3,56; schoorsteenmond NAP +30,68 (27,12 m) over 4,75 m² (straal circa 1,2 m); dak NAP +29,02 op 2 m, +28,80 op 2,5 m, +28,69 op 3 m en +28,57 op 3,5 m (alleen aan de zuidkant meetbaar; rondom staat in het DSM boomkruin). De PDOK-reconstructie is een achtkante kolom tot 27,15 m.
- PDOK-luchtfoto (Actueel_orthoHR): rond dak van 7,3 m doorsnede (dakrand), schoorsteenmond van circa 2,3 m in het midden.
- Foto's op Wikimedia Commons: "Rotterdam - Watertoren Mallegat.jpg" (Quistnix, 2009) en "Rotterdam persoonshaven schoorsteen.jpg", beide vanaf de parkzijde naar de Nieuwe Maas.

## Geschat en weggelaten

Geschat: alle hoogtes onder het dak en alle stralen behalve de achthoek, de dakrand en de schoorsteenmond. Ze komen uit de twee foto's, geschaald op de achthoek uit de BAG (3,8 m breed) en de top uit het AHN (27,12 m): plint 0,9 m, achthoek 5,6 m, schacht 3,1 m doorsnede aan de voet en 2,64 m onder de omgang, omgang 4,3 m doorsnede op circa 19 m, ringbalk vanaf circa 20,7 m, reservoir 6,15 m doorsnede, dakrand 0,9 m dik. Beide foto's zijn van dezelfde kant genomen; de andere kanten zijn gelijk verondersteld (de toren is rond en de voet regelmatig).

Aangepast om zonder steun te printen: in werkelijkheid zit er circa 1,5 m schacht tussen de omgang en de vrijwel vlakke onderkant van het reservoir, met consoles eronder. Een vlakke onderkant van 1,7 m uitkraging kan niet zonder steun; daarom loopt de onderkant hier als kegel van 41 graden vanaf de omgang naar de ringbalk, die zo op 21,3 m begint in plaats van circa 20,7 m. De kraag onder de omgang is een kegel van 43 graden in plaats van een plaat op consoles.

Weggelaten: de deur (op de foto's van de noordkant niet te zien, de zuidkant is niet gefotografeerd), de ijzeren banden om de voet en de schacht en de gemetselde banden (dunner dan 0,9 m), het hekwerk van de omgang, de ladders, de consoles onder de omgang (de kraag dekt ze), de afdeklijst en het ventilatiegat van de schoorsteenmond.

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (80 m uitsnede, steunmethode v2, 45 graden) bevat het model met hetzelfde volume als zonder steun en zonder het PDOK-pand. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een achtkante kolom van maaiveld tot de top) de plint en de velden van de voet, de ronde verjongende schacht, de omgang, de kegel met consoles, de ringbalk, het bredere reservoir met dakrand, het hellende dak en de smallere schoorsteenmond.

Controle-URL: http://localhost:3000/kaart/51.9029/4.51318/200/1x1/0
