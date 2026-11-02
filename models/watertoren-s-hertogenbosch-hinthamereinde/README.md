# Watertoren Hinthamereinde ('s-Hertogenbosch)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-s-hertogenbosch-hinthamereinde.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: onderbouw, bovenbouw, waterlijsten, boogfries en borstwering zijn rechthoekige prisma's en omhulsels met kragen van 45 graden, de kantelen uitsparingen in de borstwering, de pinakels omhulsels van achthoeken; vensters, oculi, de blinde boogjes van de fries en de ingangen zijn nissen.

De watertoren aan het Hinthamereinde (73), aan de Aa op de plek van de vroegere stadswal, is in 1885 gebouwd naar een ontwerp van J. Kalff, hoofdingenieur van de Staatsspoorwegen (niet de Amsterdamse stedenbouwkundige): volgens Wikipedia 30,84 m hoog, volgens het register 33 m, met twee vierkante plaatijzeren reservoirs van 180 m³. Rijksmonument 522464, buiten gebruik sinds 1974, na de restauratie van 2010–2012 een bedrijfsverzamelgebouw met horeca. Een eclectische bakstenen toren op een vierkante plattegrond: een hardstenen onderbouw met banden, vier bouwlagen gescheiden door hardstenen waterlijsten, bakstenen hoeklisenen, een boogfries met kantelen en hoekblokken met pinakels, en ingangen aan de noord- en zuidzijde in rondboognissen met hardstenen trappen.

## Bestanden

- `watertoren-s-hertogenbosch-hinthamereinde.glb`: één node `building:onderbouw-lisenen-kantelen-en-hoekpinakels`, op het maaiveld.
- `watertoren-s-hertogenbosch-hinthamereinde.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-s-hertogenbosch-hinthamereinde-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [150145.26, 411313.44], het midden van de BAG-contour van pand 0796100000218014 (197 m², 13,67 × 14,90 m), op maaiveld (AHN-DTM NAP +7,0 m; 3D BAG 6,99). De zijden van de contour staan op 40,5 en 130,5 graden van RD-oost: lokale +X loopt langs RD 40,5 graden (`xAxis` [0.7604, 0.6494]), zodat de noordoost- en zuidwestgevel op ±X staan en de ingangsgevels (noordwest, in het register "noord", en zuidoost, "zuid") op ±Y. Het DTM heeft voor die twee gevels de gaten van de trappen. `groundHeight` 50,59 is NAP +7,0 plus de NLGEO2018-geoïdehoogte op de oorsprong (43,59 m). Het model vervangt het pand, zodat het PDOK-blok (een rechthoekige kolom van 13,7 × 14,9 m tot het dak met twee blokken erop) verdwijnt.

## Onderdeel `building:onderbouw-lisenen-kantelen-en-hoekpinakels`

- Onderbouw van 13,67 × 14,90 m (de BAG-contour) tot 6,8 m. In de zijgevels (±X) ligt het middendeel van 7,5 m 0,37 m terug (BAG), met een plafond van 45 graden.
- Ingangen: een rondboognis van 4,8 m breed tot 6,1 m, 0,45 m diep, met de vloer op 0,6 m, en daarvoor een hardstenen trap van 6 m breed in twee treden (0,6 en 0,3 m) tot 8,05 m uit het hart.
- Waterlijst van 6,8 tot 7,8 m: schuin van de onderbouw naar de bovenbouw (45 graden op de ingangsgevels).
- Bovenbouw: hoeklisenen van 1,5 m breed tot 12,6 × 12,9 m, bakstenen gevelvlakken daartussen 0,3 m terug; hardstenen waterlijsten tot de voorkant van de lisenen op 19,0–19,8 en 22,9–23,8 m, met een kraag van 45 graden.
- Boogfries als kraag van 45 graden (28,6–29,05 m) naar de borstwering van 12,9 × 13,2 m, 0,15 m buiten de lisenen; in de borstwering per zijde zes blinde boogjes van 0,9 m (29,2–30,6 m) onder de kantelopeningen.
- Plat dak op 30,44 m binnen een borstwering van 0,9 m dik; per zijde vijf kantelen en zes openingen van 0,9 m (onderkant 31,9 m, bovenkant 32,8 m) tussen hoekblokken van 1,5 × 1,5 m tot 33,75 m.
- Pinakels op de hoekblokken: voetstuk van 0,9 m tot 34,15 m en een achthoekige bol van 1,0 m tot 35,05 m.
- Twee installaties op het dak tot 32,6 en 32,4 m (DSM).
- Nissen van 0,3 m met plafonds van 56 graden: op elke gevel in de vierde bouwlaag een rond venster van 1,5 m (midden 27,2 m) en in de derde twee rondboogvensters van 1,0 × 2,0 m (20,1–22,1 m) op 2 m uit het midden; op de ingangsgevels in de eerste bouwlaag een rondboogvensterpaar van 1,35 × 3,1 m (8,0–11,1 m) en daarboven het grote rondboogvenster van 3,8 m breed (14,3–16,6 m); in de zuidwestgevel drie rondboogvensters van 0,9 m boven elkaar van het noordelijke trappenhuis (7,9–18,8 m), 1,1 m uit het midden naar de noordkant.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_('s-Hertogenbosch_Hinthamereinde)): bouwjaar, ontwerper, 30,84 m, 180 + 180 m³, buiten gebruik 1974, restauratie 2010–2012.
- [Rijksmonumentenregister 522464](https://monumentenregister.cultureelerfgoed.nl/monumenten/522464): J. Kalff, 1885, eclectisch, 33 m, vierkant met plat dak en kantelen, hardstenen plint, vier bouwlagen met hardstenen waterlijsten, bakstenen hoeklisenen, ingangen noord en zuid met hardstenen trappen in rondboognissen, de vensters per bouwlaag en het noordelijke trappenhuis. Ontwerper en vorm komen daarmee overeen met de opdracht.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-02): maaiveld NAP +6,4 tot +7,1, dak NAP +37,4, hoekblokken NAP +40,7 tot +40,8, installaties NAP +39,4 en +39,9; de dakrand op circa 6,45 en 6,6 m uit het hart; de gaten van de trappen in het DTM voor de noordwest- en zuidoostgevel.
- 3D BAG (LoD2.2, AHN4 2021) van pand 0796100000218014: maaiveld 6,99, dak 37,44, maximum 39,36 (NAP); ter controle.
- BAG-pand 0796100000218014 en luchtfoto (PDOK): het hart, de stand en maat van de onderbouw, de terugliggende middendelen van de zijgevels, de kantelen en de installaties op het dak.
- Foto "Overzicht exterieur" (RCE 20109301, Wikimedia Commons), zuidgevel met verticalen evenwijdig: hoogtes van de onderbouw, waterlijsten, vensters, oculus, boogfries en kantelen, geschaald op de kantelen en de hoekblokken (AHN).
- Foto's "Overzicht watertoren met kantelen" (RCE 20348614), "RM522464 Watertoren, Hinthamereinde73", "Watertoren05jan2007" en "522464 Watertoren ('s-Hertogenbosch Hinthamereinde)" (Wikimedia Commons): de noordgevel, de zijgevel met de trappenhuisvensters, de kantelen en de pinakels.

## Geschat en weggelaten

Geschat: de hoogtes van de onderbouw, waterlijsten, vensters, oculi, fries en kantelen (foto, geschaald op het AHN), de terugsprong van de bovenbouw (DSM-dakrand en foto), de breedte en diepte van de lisenen, de maat van de vensters en de ingangsnissen, de vorm en maat van de pinakels (op het AHN onzichtbaar), de breedte van de kantelopeningen (in het echt smaller dan de kantelen; op 0,9 m gezet om te printen), de trappen (DTM-gaten en DSM) en de installaties op het dak (DSM). De vensters van de noordoostgevel zijn op geen foto te zien: alleen de vensters die het register voor elke gevel noemt (twee rondboogvensters en een rond venster) staan erin.

Weggelaten (kleiner dan 0,9 m of alleen vlakversiering): de hardstenen banden van de onderbouw (vlak in de gevel), de consoles van de boogfries, de hardstenen sluitstenen en omlijstingen, de medaillons en het gemetselde wapen boven de noordingang, de krulvormige muurankers, de windvanen op de pinakels, de deuren en vensterkozijnen, het dakraam en de leuningen op het dak.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met 0,03 %: waterlijsten, boogfries, nisplafonds en pinakels hangen nergens steiler dan 45 graden over. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (3D BAG LoD2.2: een rechthoekige kolom ter grootte van de onderbouw met twee blokken op het dak) de bredere onderbouw met de ingangsnissen en trappen, de smallere bovenbouw met hoeklisenen, de waterlijsten, de boogfries, de kantelen met hoekblokken en pinakels, de installaties op het dak, en de vensters, het grote rondboogvenster, de oculi en de trappenhuisvensters.

Controle-URL: http://localhost:3000/kaart/51.69028/5.31694/200/1x1/0
