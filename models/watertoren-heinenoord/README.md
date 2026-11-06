# Watertoren Heinenoord (Heinenoord)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-heinenoord.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: plint, taps toelopende schacht, rondboogfries, uitkragende banden en leien bovenbouw zijn één omwentelingsprofiel (96 segmenten), de kunststenen banden losse omwentelingsringen, de gootlijst en het kegeldak hulls van zestienhoeken, de vensters, de deur en de bogen van het fries blinde nissen met een schuin plafond.

De watertoren bij Sluisendijk 2, aan de noordkant van de voet van de Sluisendijk tussen Heinenoord en Goidschalxoord, werd in 1910 gebouwd naar ontwerp van J. Smit (constructeur Visser), alleen voor de drinkwatervoorziening van het dorp. Hij is een van de kleinste watertorens van Nederland, met een ijzeren vlakbodemreservoir van 50 m³ (rijksmonument 525095). Een ronde, taps toelopende onderbouw van rode baksteen met een gepleisterde plint en twee kunststenen banden draagt via een rondboogfries en uitkragende banden een cilindrische bovenbouw met leien in rijndekking, een zestienzijdige houten gootlijst op schoren en een flauw hellend, zestienzijdig kegeldak. Begin jaren 1990 is de toren deels verbouwd (lichtopeningen in het reservoir, kleine dakramen, nieuwe deur); de loden piron is toen verwijderd, op de foto van 2022 staat er weer een slanke windwijzer op. De toren staat er nog (luchtfoto en AHN 2026, foto 2022).

## Bestanden

- `watertoren-heinenoord.glb`: één node, `building:watertoren-onderbouw-fries-bovenbouw-gootlijst-en-dak`.
- `watertoren-heinenoord.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-heinenoord-1-1000.stl`: het model op 1:1000 (6,7 × 6,7 × 14,9 mm).

## Oorsprong en oriëntatie

RD-oorsprong [91330.83, 426967.22] (51,82767 N, 4,46358 O): het hart van de cirkelvormige voetafdruk van BAG-pand 0585100001340143 (cirkelfit op 23 hoeken, straal 3,34 m, afwijking onder 1 cm), op het maaiveld: AHN-DTM NAP +0,65 rond de voet (0,45 aan de noordkant tot 0,98 aan de zuidkant; de dijk begint 12 m naar het zuiden). De top van het dak in het AHN-DSM ligt op dat hart. De BAG-cirkel is de omtrek van de gootlijst: op de luchtfoto heeft het dak die doorsnede en op de foto's is de gootlijst 1,27 keer zo breed als de voet.

De lokale X-as wijst naar RD-oost (`xAxis` [1, 0]), naar de deur (register: deur aan de oostzijde). Hoeken hieronder in graden linksom vanaf de lokale X-as.

`groundSamplePoints` liggen op 4,5 m in de vier asrichtingen, binnen het erf en buiten de schuur aan de oostkant; `groundHeight` 44,28 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (oost 44,31, west 44,45, noord 44,28, zuid 44,50, gemeten 2026-11-06). Het PDOK-pand staat op 44,1. `groundOffsetMetres` is −0,1.

## Onderdelen

Maten en hoogtes boven het maaiveld (NAP +0,65).

- Gepleisterde plint: straal 2,72 m tot 0,45 m, schuin terug naar de voet van de schacht.
- Onderbouw: ronde schacht, taps van 5,28 m doorsnede op 0,53 m tot 4,76 m op 7,0 m. Twee kunststenen banden van 0,1 m uitsprong (2,08–2,24 en 4,72–4,88 m).
- Deur aan de oostzijde als rondboognis van 1,0 m breed tot 2,73 m; vier kleine vensters op 45, 135, 225 en 315 graden (2,3–3,25 m); vier ronde vensters in de tweede band op 0, 90, 180 en 270 graden (4,4–5,25 m, recht boven de deur, zoals op de foto).
- Rondboogfries: ring met straal 2,55 m van 7,21 tot 8,24 m op een kraag van 51 graden (aanzetstenen), met tien boognissen.
- Uitkragende banden: ring met straal 2,72 m tot 9,68 m op een kraag van 51 graden, met acht ronde vensters op 22,5 + k × 45 graden (8,65–9,35 m), en een kraag tot de bovenbouw op 10,0 m.
- Bovenbouw met leien: straal 2,98 m van 10,0 tot 12,01 m, met vier drieruitsvensters op 0, 90, 180 en 270 graden (10,6–11,5 m).
- Gootlijst: zestienhoek met straal 3,36 m (om de BAG-cirkel), op de schoren als kraag van 50 graden vanaf de leien, 12,47 tot 12,85 m.
- Kegeldak: zestienzijdig, voet met straal 3,2 m op 12,85 m (3D BAG: dakvlakken vanaf NAP +13,46), top op 14,6 m (AHN NAP +15,25), helling circa 29 graden.

Nissen zijn 0,3 m diep (de ronde vensters in de uitkragende band 0,15 m, de vensters in de leien 0,2 m) met een plafond dat naar binnen onder 68 graden oploopt; met 56 graden vulde de export op de ronde gevel onder elk nisplafond en onder de kragen boven de bovenste nissen een randje op.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Heinenoord)): 1910, J. Smit, 18 m, 50 m³, aan de Sluisendijk tussen Heinenoord en Goidschalxoord.
- [Rijksmonumentenregister 525095](https://monumentenregister.cultureelerfgoed.nl/monumenten/525095): cirkelvormige plattegrond, taps toelopende onderbouw met gepleisterde plint en twee kunststenen banden, rondboogfries op aanzetstenen, uitkragende banden van baksteen en kunststeen, cilindrische bovenbouw met leien, zestienzijdige houten gootlijst op schoren, flauw hellend zestienzijdig kegeldak met bitumen en kleine dakramen, deur aan de oostzijde in een rondboog, vier zesruitsvensters, vier ronde vensters in de tweede band, acht in de band tussen de uitkragende banden, vier drieruitsvensters in de leien; loden piron verwijderd.
- BAG-pand 0585100001340143 (PDOK, 2026-11-06): cirkel met straal 3,34 m; 3D BAG: dakvlakken van NAP +13,46 tot +15,24, 40,5 m² schuin dak op 34,4 m² grondvlak.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld NAP +0,65, top van het dak NAP +15,25, dakhelling 0,56 à 0,6 tussen 0,5 en 2 m van het hart.
- PDOK-luchtfoto (Actueel_orthoHR): zestienzijdig dak van circa 6,7 m doorsnede, schuur met zonnepanelen aan de oostkant.
- Foto's op Wikimedia Commons: "Overzicht watertoren - Heinenoord - 20353440 - RCE.jpg" (vanuit het oostzuidoosten, deur rechts in beeld) en "Hoeksche Waard Heinenoord, de watertoren RM525095 IMG 2550 2022-07-11 15.16.jpg"; ook "Watertoren Heinenoord.JPG" en "Watertoren Heinenoord zomer.jpg".

## Geschat en weggelaten

Geschat: de hoogte komt uit het AHN (14,6 m tot de top van het dak); Wikipedia en het register noemen 18 m, wat niet past bij AHN, 3D BAG en de verhoudingen op de foto's (misschien met de verwijderde piron). Alle stralen en hoogtes tussen de plint en het dak komen uit de RCE-foto, horizontaal geschaald op de gootlijst (de BAG-cirkel, 6,68 m) en verticaal met 1,03 bijgesteld op de AHN-top; ze zijn circa 0,2 m onzeker. De voet van het dak (12,85 m) is een afweging tussen de foto (12,95) en de 3D BAG (12,81). De vensters zijn in het echt 0,3 à 0,5 m breed en staan als nissen van 0,9 m in het model; de ronde vensters in de uitkragende band zitten 0,3 m lager en de vensters in de leien 0,3 m lager dan op de foto, zodat hun plafond onder de kraag erboven blijft. De richtingen van de vensters zijn uit de RCE-foto afgeleid (zesruitsvensters 45 graden naast de deur, ronde vensters recht boven de deur); die van de acht ronde vensters boven het fries en van de vensters in de leien zijn een schatting. Het rondboogfries heeft in het echt circa veertien smalle bogen, in het model tien nissen van 0,9 m. De schoren onder de gootlijst zijn één kraag van 50 graden.

Weggelaten: de windwijzer op de top, de regenpijp, de lamp aan de gevel en de dakramen (dunner of kleiner dan 0,9 m), het hekwerk en de bestrating rond de voet. De houten schuur met zonnepanelen aan de oostkant is een eigen BAG-pand (0585100001641695) en blijft als PDOK-reconstructie staan (PDOK 3,5 m, AHN circa 3,3 m boven het maaiveld).

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (80 m uitsnede, steunmethode v2 en zonder steun, 45 graden) bevat het model zonder ondersteuningsobject en zonder het PDOK-pand; beide exports zijn gelijk. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een rechte veelhoekige zuil met een lage piramide) de taps toelopende onderbouw met plint, banden, deur en vensters, het rondboogfries, de uitkragende banden met ronde vensters, de bredere leien bovenbouw met vensters, de gootlijst en het zestienzijdige kegeldak.

Controle-URL: http://localhost:3000/kaart/51.82767/4.46358/200/1x1/0
