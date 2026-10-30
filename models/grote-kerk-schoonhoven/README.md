# Grote of Bartholomeüskerk (Schoonhoven)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-grote-kerk-schoonhoven.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: prisma's van de BAG-contour met daken als planvlakken (per gevelrand een halfruimte onder de dakhelling, zodat zadeldaken, schilden en de veelhoekige koorsluitingen vanzelf ontstaan), en een toren uit vierkante prisma's en omhulsels.

Middeleeuwse kerk met westelijke hallenkerk, breed dwarsschip, drie oostkoren en een scheve toren (rijksmonument 33472).

## Bestanden

- `grote-kerk-schoonhoven.glb`: twee nodes van klasse `building`.
- `grote-kerk-schoonhoven.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `grote-kerk-schoonhoven-1-1000.stl`: alles samen op 1:1000 (56,1 × 31,1 × 46,5 mm).

## Oorsprong en oriëntatie

RD-oorsprong [118140, 439890.5], het zwaartepunt van BAG-pand 0608100001224191, op NAP +2,0 m. +X loopt oostwaarts langs de kerkas, 8,90 graden linksom van RD-oost (`xAxis` [0.98797, 0.15466]); +Y naar het noorden. De toren staat aan -X (west), de koren aan +X tegen de Haven. Vervangt alleen het BAG-pand van de kerk.

## Onderdelen

- `building:hallenkerk-dwarsschip-en-drie-koren`: drie evenwijdige zadeldaken van 60 graden over de westelijke hallenkerk (nokken NAP +22,5 / +23,3 / +22,5), met een schild aan de westkant van de zuidbeuk en een wolfseind vanaf NAP +19 aan de noordbeuk; dwarsschip van 14,6 m breed met nok NAP +27,7 en topgevels noord en zuid; drie oostkoren met een veelhoekige sluiting en schilddaken (zuid NAP +19,5, midden +22,2, noord +19,2); consistorie aan de zuidkant, een lage aanbouw met lessenaarsdak tegen de noordarm, een schoorsteen bij de toren. Steunberen op de plaatsen uit de BAG-contour en op elke hoek van de koorsluitingen, met een versnijding halverwege; spitse vensternissen per travee, per sluitingsvlak en groot in de topgevels van het dwarsschip.
- `building:scheve-toren-met-tentdak`: onderbouw van 9,4 m in het vierkant tot de omgang op NAP +27,3, met per hoek twee haakse steunberen en een pinakel, twee galmgaten per zijde en het westportaal met het grote venster erboven; bovengeleding van 7,8 m met twee vensters per zijde tot de kroonlijst op NAP +38,2; tentdak met vier uurwerkfrontons, lantaarn, koepeltje en kroon tot NAP +48,2. De hele toren helt 1,6 m oostwaarts en 0,4 m noordwaarts over (lineaire scheefstelling vanaf maaiveld).

## Bronnen en maten

- 3D BAG LoD2.2 van pand 0608100001224191 (CC BY 4.0): dakhellingen, nokken en goten van het schip, dwarsschip en de koren.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-10-30): maaiveld circa NAP +2,0 m, de vlakke omgang van de toren op NAP +27,3, hoogste punt NAP +53 m (windvaan), en het hart van de torenkap tegenover dat van de voet voor de scheefstand.
- BAG-contour: plattegrond, de knik tussen schip en koren en de plaats van de steunberen.
- [Wikipedia](https://nl.wikipedia.org/wiki/Grote_of_Bartholome%C3%BCskerk), [Rijksmonumentenregister 33472](https://monumentenregister.cultureelerfgoed.nl/monumenten/33472) en de [Commons-categorie](https://commons.wikimedia.org/wiki/Category:Grote_of_Sint-Bartholome%C3%BCskerk_(Schoonhoven)): geledingen van de toren, vensters, koren en aanbouwen.

## Geschat en weggelaten

Geschat uit AHN en foto's: de torenmaten boven de omgang (bovengeleding, kroonlijst, kap en lantaarn), de vorm en maat van de uurwerkfrontons en pinakels, de plaats en maat van alle vensters en galmgaten, de diepte van de steunberen en de schoorsteen. De gebogen kap van de toren is een recht tentdak geworden; ronde of samengestelde bogen zijn spitse nissen (top ≥ 50 graden), zodat ze zonder steun printen.

Weggelaten (kleiner dan 0,9 m of te dun): windvaan en kruis, de balustrade van de omgang, het traceerwerk en de roeden van de vensters, de wijzerplaten, dakkapellen en kleine schoorstenen op de daken, regenpijpen, het hek en de bomen rond de kerk.

## Controle

Twee gesloten NoError-nodes met genus 0, elk één deel; samen één deel. STL 56,1 × 31,1 × 46,5 mm, 25,4 cm³. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de gedeelde 45-gradenopvulling het volume met minder dan 2 % en blijven de doorsneden op 5, 15 en 30 m gelijk. Op de kaart staat de kerk in het BAG-vlak met de toren aan de westkant; het PDOK-blok van het pand is verborgen. Controlebeelden blijven buiten de repo.

Controle-URL: http://localhost:3000/kaart/51.94624/4.85109/150/1x1/30
