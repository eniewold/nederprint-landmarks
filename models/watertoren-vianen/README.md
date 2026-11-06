# Watertoren Vianen (Vianen)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-vianen.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de onderbouw is een prisma op het BAG-vierkant, het skelet een achthoekige buis waaruit per verdieping en per vlak een vak is gesneden, de middenkolom, het reservoir en de plaat zijn één omwentelingsprofiel, de radiale balken losse bouwdelen en de lensvelden, deur en vensters nissen.

De watertoren achter het pompstation van het voormalige waterleidingbedrijf van Vianen is in 1909 gebouwd naar ontwerp van Roelof Kuipers. Volgens Wikipedia is het de oudste Nederlandse watertoren met een open draagconstructie van gewapend beton, 26,3 m hoog, met één reservoir van 100 m³; eigenaar is Oasen, de toren is buiten bedrijf. Rijksmonument 520862. Een wit betonskelet van acht kolommen op een achthoek met drie ringbalken en schoren in de hoeken van de vakken, een ronde middenkolom (standpijp) met een kraag en acht radiale balken op de middelste ring, een ronde plaat met omgang, het cilindrische reservoir met lensvormige velden en een flauw kegeldak met een klein luik, op een vierkante witte onderbouw met een rondboogdeur en kleine vensters.

## Bestanden

- `watertoren-vianen.glb`: één node `building:watertoren-onderbouw-skelet-plaat-en-reservoir`, op maaiveld.
- `watertoren-vianen.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-vianen-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [134599.847, 445280.395] (51,99553 N, 5,09018 O), het hart van BAG-pand 0620100000011958 (vierkant van 6,63 tot 6,79 m, bouwjaar 1909); de top van het dak in het AHN-DSM ligt er 0,3 m naast. Maaiveld AHN-DTM NAP +5,03 (ring van 7 tot 12 m: mediaan 5,01). +X langs de BAG-zijden op RD 19,5 graden (gemiddelde van de vier zijrichtingen), +Y 90 graden linksom daarop. De achthoek van het skelet heeft zijn vlakken evenwijdig aan de zijden van de onderbouw (twee kolommen per zijde, de kolommen vlak met de gevels); de deur zit in het vlak +X (oostnoordoost).

`groundHeight` 48,34 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vijf `groundSamplePoints`: oost 48,42, west 48,46, zuid 48,58, noordoost 48,43, noordwest 48,34. Recht ten noorden van de onderbouw (lokaal 0, 3 tot 7 m) zakt het PDOK-terrein in een kuil tot 45,6: daar heeft het AHN-DTM een gat (ook in het DSM, schaduw van de toren). Daar ligt bewust geen bemonsteringspunt; de kuil zit in het PDOK-terrein en is niet omzeild. De PDOK-reconstructie van het pand is een vierkant prisma van 45,81 tot 73,64 met een kleine punt; de buurpanden (pomphuis 0620100000006830 in het zuiden, 0620100000007325 en 0620100000007326) staan los en zijn laag.

## Onderdeel `building:watertoren-onderbouw-skelet-plaat-en-reservoir`

Maten in het lokale stelsel, hoogtes boven maaiveld.

- Onderbouw: vierkant met halve zijde 3,345 m (BAG) tot 3,45 m, lijst van 0,15 m overstek met een onderkant van 53 graden tot 3,74 m. Rondboogdeur van 1,0 m breed tot 2,45 m in het vlak +X naast de kolom, twee vensters in dat vlak en twee per ander vlak (0,6 à 0,7 × 0,9 m), als nissen van 0,3 m diep.
- Skelet: achthoekige buis met apothema 3,345 m en een wand van 0,9 m, van de onderbouw tot 17,1 m. Per vlak vier vakken: van 3,74 m tot de spits op 6,93 m, van 7,83 tot 10,75 m, van 11,65 tot 14,6 m en van 15,5 tot 16,85 m (het bovenste smaller). De vakken zijn aan de buitenkant 1,76 m breed (bovenste 1,5 m), met onderhoeken van 45 graden (0,25 m) en een spitse bovenkant van 52 graden; hun zijkanten lopen evenwijdig aan de straal door de kolom, zodat elke kolom over de hele wanddikte 0,93 m breed is. Tussen de vakken blijven ringbalken van 0,9 m (midden van een vak) over op 6,93–7,83, 10,75–11,65 en 14,6–15,5 m.
- Middenkolom: straal 0,73 m (foto 1,46 m) van de onderbouw tot de reservoirbodem, met een kraag van 0,95 m op de middelste ring (onderkant 50 graden).
- Radiale balken: acht, naar de kolommen, 0,9 m breed, bovenkant 11,65 m, onderkant met 50 graden oplopend van 9,4 m aan de kolommen tot 10,75 m in het midden.
- Reservoirbodem: kegel van 50 graden van de middenkolom (14,77 m) tot de binnenhoeken van het skelet (17,05 m).
- Plaat met omgang: onderkant van 50 graden van het skelet (17,1 m) naar 4,55 m op 18,53 m, vloer op 19,0 m.
- Reservoir: straal 3,9 m van 19,0 tot 23,35 m (AHN NAP +28,38), met acht lensvormige velden (2,5 m breed, 20,8 tot 21,5 m, 0,3 m diep) tussen de kolommen; dakrand 4,05 m met een onderkant van 50 graden tot 23,55 m.
- Dak: flauwe kegel van 23,55 m aan de rand naar 24,4 m op 0,95 m van het hart (AHN: 23,85 op 2 m, 24,15 op 1,5 m, 24,4 op 1 m); luik met straal 0,95 m tot 24,9 m en een afgeschuinde top tot 25,13 m (AHN NAP +30,16).

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Vianen)): 1909, Roelof Kuipers, oudste open betonskelet, 26,3 m, 100 m³, eigenaar Oasen.
- [Rijksmonumentenregister 520862](https://monumentenregister.cultureelerfgoed.nl/monumenten/520862).
- BAG-pand 0620100000011958 (PDOK, 2026-11-06): vierkante onderbouw en hoofdas.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-06): maaiveld, dakprofiel, dakrand en straal van het reservoir.
- PDOK-gebouw- en terreintegels (2026-11-06): vierkant prisma tot het dak; terreinhoogtes op de bemonsteringspunten en de kuil ten noorden.
- Foto's op Wikimedia Commons: "Vianen RM Watertoren (2).jpg" (diagonaal op de onderbouw: skelet, ringen, middenkolom, plaat, reservoir met lensvelden; schaal 54,4 px/m uit de diagonaal van de onderbouw), "Vianen RM Watertoren (1).jpg" (ingangszijde met rondboogdeur, vensters, kraag en radiale balken), "Vianen Watertoren 6659.JPG" en de RCE-foto "Exterieur OVERZICHT - Vianen - 20300594".

## Geschat en weggelaten

Geschat: de stralen van reservoir (3,9 m), plaat (4,55 m) en middenkolom (0,73 m) en de hoogtes van de onderbouw, de ringen, de plaat en de lensvelden uit één perspectivische foto, geschaald op de BAG-diagonaal en de AHN-hoogte (circa 0,3 m nauwkeurig); de plaats van de deur (uit de ligging van het pomphuis op de foto's); de vensters aan de niet-zichtbare kanten; het aantal en de plaats van de lensvelden (drie op de voorkant van de foto, acht aangenomen).

Bewust anders dan in het echt, om op 1:1000 zonder steun te printen: de kolommen en balken zijn 0,9 à 0,93 m in plaats van circa 0,45 m, en de vakken hebben een spitse bovenkant van 52 graden in plaats van een rechte balk met kleine schoren in de hoeken; het skelet oogt daardoor geslotener dan het echte. De radiale balken zijn alleen op de middelste ring gemodelleerd.

Weggelaten: het hekwerk van de omgang (dunner dan 0,9 m), de puntvormige reliëfvelden onder de lensvelden (vlak pleisterwerk), de regenpijpen, de lamp en het wapen boven de deur, het hekwerk rond het terrein en de losse buurpanden.

## Controle

Eén gesloten NoError-node met genus 40 (de vakken en balken). In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet; een export met `createModelBundle` op 1:1000 (ondersteuning v2, 45 graden) van een uitsnede van 80 m bevat het model, niet meer het PDOK-pand, en geen ondersteuning onder het model. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een vierkant prisma tot het dak) aan elke kant de lagere onderbouw met lijst en vensters, het open skelet met kolommen, ringen en de middenkolom erachter, de bredere plaat met schuine onderkant, het reservoir met lensvelden, dakrand, kegeldak en luik; aan de oostnoordoostkant ook de deur.

Controle-URL: http://localhost:3000/kaart/51.99555/5.09009/200/1x1/0
