# Watertoren Amstelveenseweg (Amsterdam)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-amsterdam-amstelveenseweg.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Het model heeft geen hoogteplakken. De kern, de kolommen, de reservoirbodem, de mantel en het dak zijn omwentelingsvormen (`hull` van ringen). Het opbouwtje is een achtkantig prisma met een kraag en een laag schilddak, en de glasband en het venster zijn nissen.

De watertoren staat aan de Amstelveenseweg in Amsterdam-Buitenveldert, naast het pompstation van Waternet. Hij is in 1965 gebouwd naar een ontwerp van Piet Elling en is nog in gebruik. Volgens Wikipedia is hij 40 m hoog, met één stalen reservoir van 2335 m³ in een aluminium mantel. Een ronde betonnen kern met zes vrijstaande ronde kolommen eromheen draagt een betonnen ringbalk. Daarop staat het reservoir als omgekeerde kegelstomp met staande naden. Op het vrijwel vlakke dak staat een achtkantig glazen opbouwtje met een dun overstekend dak en een hekwerk.

## Bestanden

- `watertoren-amsterdam-amstelveenseweg.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op.
- `watertoren-amsterdam-amstelveenseweg.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight`, `groundSamplePoints` en `replacesBuildings` (BAG-pand 0363100012216977).
- `watertoren-amsterdam-amstelveenseweg-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [118826.29, 483272.19] (WGS84 52.336184, 4.856456) is het middelpunt van een cirkelfit op de ronde BAG-contour van pand 0363100012216977. Die cirkel heeft een straal van 8,74 m en is de bovenrand van het reservoir van boven gezien. Het maaiveld ligt op NAP +0,80 m (AHN-DTM in een ring van 10 tot 16 m: +0,69 tot +0,87, mediaan +0,79). De toren is rond: `xAxis` [1, 0], +X loopt langs RD-oost. De `groundSamplePoints` liggen 7 m uit het hart, net buiten de kolommen. `groundHeight` 43,85 (NAP 0,80 + 43,05, de NLGEO2018-geoïdehoogte op de oorsprong) is de terugval als er geen maaiveld is.

## Onderdeel `building:kern-kolommen-reservoir-en-opbouw`

- Ronde betonnen kern van 6,6 m. Aan de zuidkant, tussen twee kolommen, zit een venster als nis van 1,8 × 0,9 m, 0,35 m diep, van 10,6 tot 11,5 m.
- Zes vrijstaande ronde kolommen van 1,07 m op een kring van 10,1 m (hart op 5,06 m). Tussen kern en kolommen is 1,2 m vrij.
- Reservoirbodem: een kraag van 45 graden van de kern (op 11,75 m) naar de ringbalk. De kolommen steken er aan de buitenkant tot 14,0 m onder uit.
- Ringbalk van 12,9 m, met een verticale rand van 14,9 tot 15,17 m en een schuine overgang van 45 graden naar de mantel.
- Reservoir in de aluminium mantel: een omgekeerde kegelstomp van 13,36 m op 15,4 m naar 17,48 m (BAG) op 35,65 m. De wand staat 5,8 graden uit het lood.
- Dak: een flauwe kegel met helling 0,08 (AHN), van de dakrand op 35,65 m naar 36,12 m bij het opbouwtje.
- Achtkantig opbouwtje van 5,96 m over de hoeken, met een hoek op -8 graden (luchtfoto), van 36,0 tot 38,4 m. De glasband is per zijde een nis van 1,7 × 0,9 m, 0,3 m diep, van 36,8 tot 37,7 m. Daarboven zit een kraag van 45 graden naar de dakrand van 7,3 m over de hoeken, die 0,5 m dik is (38,4 tot 38,9 m). Het lage schilddak loopt tot 39,26 m in het hart (AHN NAP +40,06).

## Bronnen en maten

- [Wikipedia, Watertoren Amstelveenseweg](https://nl.wikipedia.org/wiki/Watertoren_Amstelveenseweg): 1965, Piet Elling, 40 m, 2335 m³, stalen reservoir in een aluminium mantel, in gebruik bij Waternet.
- BAG-pand 0363100012216977, een cirkel met een straal van 8,74 m.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-03):
  - het maaiveld;
  - de dakrand op NAP +36,45, met het dak dat oploopt naar +36,86 op 4,25 m uit het hart;
  - de dakrand van het opbouwtje op +39,7 op 3,5 m en de top op +40,06 in het hart.
  Onder het reservoir ziet het DSM niets.
- Luchtfoto (PDOK, 8 cm): het achtkantige opbouwtje (7,3 m over de hoeken, een hoek op -8 graden) met het hekwerk eromheen. De luchtfoto is schuin opgenomen en toont het reservoir 4,6 m te ver naar het zuiden.
- Foto [Amsterdam Watertoren Amstelveenseweg](https://commons.wikimedia.org/wiki/File:Amsterdam_Watertoren_Amstelveenseweg.jpg). Het is een telefoto (270 mm-equivalent, circa 250 m afstand), dus vrijwel orthografisch. Geschaald op de bovenrand van 17,48 m geeft hij:
  - de hoogte van de mantel (20,25 m) en zijn onderkant (13,36 m);
  - de ringbalk (0,75 m);
  - de kolommen (1,07 m, buitenkant op 5,59 m) en de kern (6,6 m);
  - het venster in de kern;
  - het opbouwtje: de breedte van de wand tegenover de dakrand en de dikte van het dak.
- Foto [Watertoren Amstelveenseweg - panoramio](https://commons.wikimedia.org/wiki/File:Watertoren_Amstelveenseweg_-_panoramio.jpg): de kolommen vrij voor de kern en de ringbalk.
- NLGEO2018-geoïdehoogte op de oorsprong (43,05 m) voor `groundHeight`.
- De 3D BAG was bij het meten niet bereikbaar. PDOK heeft voor dit pand alleen een blok op één hoogte (`rf_roof_type` `unknown`).

## Geschat en weggelaten

Geschat:

- Het aantal kolommen (zes). Dat volgt uit de stand van de zichtbare kolommen op twee foto's. Hun richting rond de toren is niet bekend; in het model staan ze op 0, 60, …, 300 graden vanaf oost.
- De hoogte van de onderkant van de mantel, 15,4 m (±1 m), uit de telefoto. Een perspectieffit op de panoramio-foto geeft circa 19,5 m, maar daarvan zijn de uitsnede en het hoofdpunt onbekend.
- De richting (zuid) en de hoogte van het venster in de kern. Op de foto zit het circa 3 m onder de ringbalk. In het model ligt het 0,7 m lager, onder de kraag van de reservoirbodem.
- De reservoirbodem. In het echt is die vlak op kern en kolommen. In het model is het een kraag van 45 graden naar de kern, zodat de overspanning tussen de kolommen zonder steun te printen is.
- De glasband van het opbouwtje is per zijde één nis in plaats van meerdere ruiten. De kraag van 45 graden onder het dak is in het echt een dunne overstekende plaat.

Weggelaten, omdat ze kleiner zijn dan 0,9 m of te dun:

- de staande naden van de aluminium mantel;
- de kleine ventilatieluiken boven in de mantel (circa 0,4 × 0,8 m);
- het hekwerk rond het opbouwtje;
- de dakrand van het reservoir.

Een deur in de kern is op de foto's niet te zien en staat daarom niet in het model.

## Controle

Het model is één gesloten NoError-node met genus 0. In de webshoptest vult de 45-gradenopvulling per node vrijwel niets op (volume minder dan 0,1 % meer). In een exporttest op 1:1000 (80 × 80 m) staat de toren in zijn geheel in de export. De opvulling is daar 0,5 mm³, rond het venster en de kraag van het opbouwtje. Het PDOK-pand is verborgen en de voet zakt 0,1 tot 0,3 m in het maaiveld.

PDOK toont de toren als een cilinder van 17,5 m tot de dakrand, op de hele BAG-cirkel tot het maaiveld. Het model voegt toe:

- de vrije ruimte onder het reservoir met de kern en de zes kolommen;
- de ringbalk;
- de kegelvorm van de mantel;
- het flauwe dak;
- het achtkantige opbouwtje met de glasband en het overstekende dak.

Controlebeelden blijven buiten de repo.

Controle-URL: http://localhost:3000/kaart/52.33618/4.85646/200/1x1/0
