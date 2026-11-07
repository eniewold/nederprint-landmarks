# Watertoren Nieuw-Lekkerland (Nieuw-Lekkerland)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-nieuw-lekkerland.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is een zeshoek met zes hoeklisenen als één doorsnede, verjongend geëxtrudeerd (onderaan met bredere lisenen), de lijsten en de erker hulls, reservoir, bolle bodem en dak met rand één omwentelingsprofiel (96 segmenten), de ribben op het reservoir hulls met een console, de deuren en vensters blinde nissen.

De watertoren aan de Lekdijk werd in 1915 gebouwd door Visser & Smit (Hanab); hij lijkt op de watertoren van Ouderkerk aan den IJssel. Wikipedia geeft 34 m hoogte en een reservoir van 400 m³. Het is een gemeentelijk monument; in 2010 verkocht Oasen de toren via De Landerije en sindsdien is het een woning. De toren staat er nog (luchtfoto en AHN 2026; op het dak liggen zonnepanelen). Een zeskante betonnen schacht met hoeklisenen en drie lijsten draagt een rond reservoir dat met een bolle bodem over de schacht uitkraagt en een plat dak heeft.

## Bestanden

- `watertoren-nieuw-lekkerland.glb`: één node, `building:watertoren-schacht-lisenen-lijsten-erker-en-reservoir`.
- `watertoren-nieuw-lekkerland.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-nieuw-lekkerland-1-1000.stl`: het model op 1:1000 (11,1 × 11,6 × 30,7 mm).

## Oorsprong en oriëntatie

RD-oorsprong [107344.8, 434004.91] (51,89252 N, 4,69490 O): het zwaartepunt van de zeskante voetafdruk van BAG-pand 0571100000000425 (bouwjaar 1915, 78 m²), op het maaiveld: AHN-DTM NAP +3,05 (3,0 tot 3,15 tussen 5 en 10 m; de Lekdijk aan de zuidkant ligt op NAP +3,1 à +3,3). Het midden van het platte dak in het AHN-DSM ligt 0,4 m van dat hart.

De hoeken van de zeshoek liggen in de BAG op −107 + k × 60 graden (RD, linksom van oost). De lokale X-as staat 77 graden rechtsom van RD-oost (`xAxis` [0.22495, −0.97437]), loodrecht op het vlak naar de Lekdijk (zuidzuidoost); de wandvlakken staan op k × 60 graden en de hoeken op 30 + k × 60 graden. Hoeken hieronder in graden linksom vanaf de lokale X-as.

`groundSamplePoints` liggen op 7 m voor elk van de zes vlakken; `groundHeight` 46,69 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (46,687 aan de dijkzijde, 46,72 tot 46,80 rondom, gemeten 2026-11-07). Het PDOK-pand staat op 46,66 met de bovenkant op 76,9. `groundOffsetMetres` is −0,1.

## Onderdelen

Maten en hoogtes boven het maaiveld (NAP +3,05).

- Schacht: zeshoek met hoekstraal 5,42 m aan de voet (apothema 4,69, BAG), verjongend tot 5,12 m op 20,6 m. Zes hoeklisenen van 0,9 m breed: tot 9,3 m met het voorvlak 0,4 m voorbij de hoek (5,82 m; BAG 5,75), daarboven 0,25 m.
- Drie lijsten op 6,2, 12,4 en 18,6 m: 0,5 m hoog, 0,2 m uitstekend, onderkant onder 45 graden.
- Ruitvensters (1,0 m breed, 1,3 m hoog) als nis: in de derde geleding (hart 15,8 m) in de vlakken 0, 120 en 240 graden, in de tweede (hart 9,3 m) in 60, 180 en 300 graden.
- Aan de voet: deur van 1,5 m breed tot 2,4 m met een stoep in het dijkvlak (0 graden), een tweede deur van 1,4 m breed tot 2,3 m op 60 graden en een venster van 1,2 × 1,1 m (1,0 tot 2,1 m) op −60 graden.
- Erker onder het reservoir in het dijkvlak: 3,0 m breed aan de gevel, 2,0 m aan de voorkant, 1,0 m diep, onderkant onder 45 graden van 18,9 m aan de gevel tot 19,9 m aan de voorkant, tot in de reservoirbodem.
- Reservoir: bolle bodem van de schacht (20,6 m) naar de wand onder 51 en 45 graden, rond met straal 5,5 m van 21,9 tot 30,4 m, plat dak op 30,25 m binnen een rand van 0,95 m breed op 30,4 m. Zes ribben van 0,85 m breed op de hoeken tot 5,7 m, met een console van 48 graden vanaf de lisenen. In elk van de zes velden een nis van 1,2 m breed van 24,4 tot 28,4 m voor het paar spleetvensters.

Nissen zijn 0,3 m diep met een plafond dat naar binnen onder 56 graden oploopt.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Nieuw-Lekkerland)): 1915, Visser & Smit Hanab, 34 m, 400 m³, gemeentelijk monument, sinds 2010 particulier en een woning.
- BAG-pand 0571100000000425 (PDOK, 2026-11-07): regelmatige zeshoek met zes uitstekende hoeklisenen.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-07): maaiveld NAP +3,05, plat dak NAP +33,3 à +33,35, rand +33,45, reservoir 11 m doorsnede.
- PDOK-luchtfoto (Actueel_orthoHR): rond reservoir met witte rand (11,7 m over de rand) en zonnepanelen.
- Foto's op Wikimedia Commons (categorie "Watertoren (Nieuw-Lekkerland)"): "Overzicht watertoren - Nieuw-Lekkerland - 20276806 - RCE.jpg" (vanaf de Lekdijk, bijna frontaal op het dijkvlak), "Overzicht watertoren - Nieuw-Lekkerland - 20335214 - RCE.jpg" (kleur, vanaf het oostzuidoosten) en "Watertoren Nieuw Lekkerland.jpg" (vanaf de Lek, noordzijde).

## Geschat en weggelaten

Geschat: de hoogtes van de lijsten (6,2, 12,4 en 18,6 m), de verspringing van de lisenen (9,3 m), de onderkant van het reservoir (21,9 m) en de bolle bodem, de erker en de hoogte en breedte van de vensters en deuren komen uit de RCE-foto vanaf de Lekdijk, geschaald op de reservoirbreedte (11 m, AHN) en de dakhoogte (AHN); circa een halve meter onzeker. De verjonging van de schacht (0,3 m in de hoekstraal) is uit dezelfde foto geschat. De verdeling van de ruitvensters (afwisselend in de tweede en derde geleding) volgt uit drie foto's van vijf vlakken; het zesde vlak (120 graden, noordoost) is aangenomen. De tweede deur op 60 graden staat op de kleurenfoto (op de oudere RCE-foto is het een venster); de voet van de drie noordelijke vlakken is op geen foto te zien. De ribben op het reservoir zijn 0,85 m breed (in het echt smaller) en het paar spleetvensters van circa 0,25 m breed is één nis van 1,2 m.

Weggelaten: de twee kleine vierkante vensters in de erker en in de bovenste geleding, de dunne groeflijnen in de bovenrand van het reservoir, de zonnepanelen op het dak en het hek rond de toren (kleiner dan 0,9 m). Wikipedia noemt 34 m; boven het maaiveld aan de voet is de toren volgens het AHN 30,4 m.

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (80 m uitsnede, steunmethode v2, 45 graden) bevat het model zonder ondersteuningsobject en zonder het PDOK-pand. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een zeskant prisma met lisenen tot het platte dak) het ronde, uitkragende reservoir met bolle bodem, ribben en vensters, de verjongende schacht met de drie lijsten, de bredere lisenen aan de voet, de ruitvensters, deuren en de erker.

Controle-URL: http://localhost:3000/kaart/51.89252/4.69490/200/1x1/0
