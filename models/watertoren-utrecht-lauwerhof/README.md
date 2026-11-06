# Watertoren Lauwerhof (Utrecht)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-utrecht-lauwerhof.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: onderbouw, waterlijst, schacht, fries, holle overkraging, reservoirmantel, kroonlijsten, borstwering en het vlakke kegeldak zijn één omwentelingsprofiel (96 segmenten), de kantelen sectorvormige prisma's, de dakkap en de trede blokken, en de vensters, deur, arcadevelden en oculi blinde nissen.

De watertoren aan de Lauwerhof 29 werd in 1895-1896 gebouwd voor de Utrechtse Waterleiding Maatschappij, naar ontwerp van L.C. Dumont, in neorenaissancestijl. Hij is 39 m hoog en heeft een Intze-reservoir van 1500 m³ van F.A. Neumann uit Aken (rijksmonument 514252). Van 1983 tot 2010 zat het Waterleidingmuseum erin; nu zijn er woningen en een vergaderruimte. De toren staat er nog (BAG-pand in gebruik, AHN, luchtfoto, foto 2022). Een ronde toren geheel in baksteen: een lage onderbouw met waterlijst, een licht verjongende schacht, een rondboogfries, een holle, gemetselde overkraging met ijzeren ribben naar de bredere reservoirmantel, en bovenop een borstwering met kantelen.

## Bestanden

- `watertoren-utrecht-lauwerhof.glb`: één node, `building:watertoren-onderbouw-schacht-fries-overkraging-reservoir-en-kantelen`.
- `watertoren-utrecht-lauwerhof.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-utrecht-lauwerhof-1-1000.stl`: het model op 1:1000 (17,1 × 17,1 × 40,1 mm).

## Oorsprong en oriëntatie

RD-oorsprong [136594.5, 456414.98] (52,09568 N, 5,11861 O): het hart van de cirkel van BAG-pand 0344100000031105 (straal 8,42 m; de BAG-contour is het bovenaanzicht van de reservoirmantel), op het maaiveld: AHN-DTM NAP +3,55 (3,51 tot 3,58 tussen 8 en 15 m). Het hart van de hoge DSM-punten ligt 0,2 m ernaast.

De lokale X-as is RD-oost (`xAxis` [1, 0]), Y is noord. Hoeken hieronder in graden linksom vanaf oost: de deur op 45 graden (noordoost).

`groundSamplePoints` liggen op 10 m in de vier asrichtingen, buiten de mantel; `groundHeight` 46,84 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (oost 46,90, noord 46,84, west 46,93, zuid 46,94, gemeten 2026-11-06). Het PDOK-pand staat op 46,80. `groundOffsetMetres` is −0,1.

## Onderdelen

Maten en hoogtes boven het maaiveld (NAP +3,55).

- Onderbouw: straal 6,6 m aan de voet, licht verjongend tot 6,5 m op 3,98 m; waterlijst met een kraag van 50 graden tot straal 6,85 m (4,4 tot 4,8 m) en een schuine afdekking naar de schacht op 5,3 m. Zes boogopeningen op 45 + k × 60 graden: de deur (1,4 m breed, 0,35 tot 2,9 m plus spitse boog) met een trede van 0,35 m (2,4 m breed) aan de noordoostkant, de andere vijf 1,3 m breed (0,8 tot 2,8 m).
- Schacht: verjongt van straal 6,1 m op 5,3 m tot 5,6 m op 18,3 m. Zes grote boogvensters (1,4 m, 5,9 tot 8,6 m) boven de openingen van de onderbouw, zes kleinere (0,9 m, 10,6 tot 12,6 m) ertussen, drie oculi (1,0 m, 15,4 tot 16,3 m) boven de deur en op 165 en 285 graden.
- Rondboogfries: straal 5,9 m van 18,66 tot 20,35 m, met een kraag van 50 graden vanaf de schacht, 24 boognissen (0,9 m breed, 18,9 tot 20,3 m) en een lijst van straal 6,05 m tot 20,8 m.
- Overkraging: hol profiel van straal 6,05 m op 20,8 m tot 8,2 m op 24,0 m; de helling loopt van 0,5 tot 0,84 (50 graden).
- Reservoirmantel: onderste kroonlijst straal 8,5 m (kraag van 50 graden, tot 25,1 m), mantel met straal 8,25 m tot 35,9 m. Daarop zestien kleine vensters in de onderste band (25,85 tot 26,75 m), zestien arcadevelden van 2,3 m breed die 0,3 m terugliggen (29,4 tot 33,0 m met een spitse boog tot 34,4 m) met elk een venster (30,1 tot 32,7 m), en zestien oculi tussen de bogen (34,6 tot 35,35 m).
- Bovenste kroonlijst: straal 8,55 m van 36,25 tot 36,7 m (kraag van 49 graden). Borstwering met straal 8,35 m (binnen 7,5 m) tot 38,1 m en 26 kantelen tot 39,1 m (buiten 1,0 m breed, openingen even breed).
- Dak: vlakke kegel van 10 graden van 37,7 m aan de binnenkant van de borstwering tot 38,95 m, met een dakkap van 1,2 × 1,2 m tot 39,84 m in het midden.

Nissen zijn 0,3 m diep met een plafond dat naar binnen onder 56 graden oploopt; boognissen hebben een spits plafond van 50 tot 55 graden.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Utrecht_Lauwerhof)): 1895-1896, L.C. Dumont, neorenaissance, 39 m, Intze-reservoir van 1500 m³ (F.A. Neumann) op circa 30 m; woningen en vergaderruimte.
- [Rijksmonumentenregister 514252](https://monumentenregister.cultureelerfgoed.nl/monumenten/514252): ronde toren van 39 m in baksteen met geglazuurde baksteen, kunststeen en natuursteen; de schacht eindigt met een rondboogfries, een gemetselde overkraging met ijzeren balken gaat naar het bredere reservoir met lichtspleten en een korfboogfries, bekroond met kantelen.
- BAG-pand 0344100000031105 (PDOK, 2026-11-06): cirkel met straal 8,42 m, bouwjaar 1896.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld NAP +3,55; kantelen NAP +42,65 (39,1 m) op straal 7,5 tot 8 m; dak NAP +41,25 op 7 m tot +42,3 op 1 m (helling 0,17); dakkap NAP +43,39.
- PDOK-luchtfoto (Actueel_orthoHR): mantel van 16,6 m doorsnede, vlak donker dak met een dakkap in het midden.
- Foto's op Wikimedia Commons (categorie "Water tower (Lauwerhof Utrecht)"): "Water tower (Lauwerhof Utrecht).jpg" (telelens, bijna van opzij), "Utrecht, de watertoren aan het Lauwerhof RM514252 foto3 2015-11-01 13.59.jpg", "Utrecht - Watertoren Lauwerhof - 20220223 PvE (Q2621420).jpg", "Watertoren Lauwerhof.jpg" en de RCE-foto's 20235332 (bovenbouw), 20235333 (onderbouw), 20339928 en 20339929.

## Geschat en weggelaten

Geschat: alles onder de borstwering. De hoogtes van mantel, overkraging en fries komen uit de telelensfoto (vanaf de top 18,3 m tot de onderkant van de overkraging), geschaald op de mantel (16,6 m) en de kantelen uit het AHN; de stralen van schacht, fries en onderbouw uit de breedteverhoudingen op die foto en de RCE-foto van de onderbouw (schacht/mantel 0,68). De RCE-foto van de onderbouw is omhoog gefotografeerd en geeft geen betrouwbare hoogtes; de hoogte van de onderbouw (4,8 m) komt uit de onderste meters ervan. De verdeling van de vensters in de schacht (zes, zes en drie) en de richting van de deur (noordoost, naar het verharde binnenterrein met speelplaats) zijn geschat uit de foto's; het AHN en de luchtfoto zien de voet niet. Het aantal kantelen (26) en arcadevelden (16) is geteld op de foto's en zo gekozen dat kantelen en openingen minstens 0,9 m breed zijn. Het profiel van de overkraging is in werkelijkheid bovenaan vlakker; hier loopt het tot 50 graden zodat het zonder steun te printen is. Ronde bogen staan als spitse bogen in het model, kleine vensters en oculi (0,3 à 0,6 m) als nissen van 0,9 à 1,0 m.

Weggelaten: de ijzeren ribben van de overkraging, de consoles onder het fries, de sierankers, de kleurbanden en de lijsten in de schacht en de mantel, de spitse kapjes tussen de arcadebogen (allemaal dunner dan 0,9 m of alleen kleur), het hekwerk achter de kantelen, de dakluiken en de lamp en het hek bij de deur.

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (80 m uitsnede, steunmethode v2, 45 graden) bevat het model zonder ondersteuningsobject en zonder het PDOK-pand. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een cilinder met de straal van de mantel van maaiveld tot dak) de smallere onderbouw met waterlijst en deur, de verjongende schacht met vensters, het fries, de holle overkraging, de mantel met vensterband, arcade en oculi, de kroonlijst en de kantelen.

Controle-URL: http://localhost:3000/kaart/52.09568/5.11861/200/1x1/0
