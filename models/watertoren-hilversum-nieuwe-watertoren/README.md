# Nieuwe watertoren (Hilversum)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-hilversum-nieuwe-watertoren.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: alle daken zijn plat (AHN), dus blokken op een gemeten hoogte; de gevels zijn profielen van borstwering, verdiepte glasstrook en dakrand per laag (hulls tussen ringen), de toren, de opbouw en de trappenhuizen zijn cilinders met kragen onder 45 graden.

De nieuwe watertoren van Sanatorium Zonnestraal is in 1926-1928 gebouwd naar ontwerp van Jan Duiker en Bernard Bijvoet en hoort bij rijksmonument 46771. Het is geen vrijstaande toren: een betonnen cilinderreservoir op een ronde schacht in de zuidelijke binnenhoek van het hoofdgebouw, met de voet op het dakterras van de lage voorvleugel en het reservoir tegen de dakrand van de verdieping. De toren ligt in hetzelfde BAG-pand als het hoofdgebouw (0402100001480421). Omdat de kaart en de export alleen hele panden kunnen vervangen, bevat dit model het hele hoofdgebouw; anders bleef de PDOK-reconstructie (met een eigen blok op de plek van de toren) door het model heen steken.

## Bestanden

- `watertoren-hilversum-nieuwe-watertoren.glb`: één node `building:hoofdgebouw-zonnestraal-met-watertoren`, op het maaiveld.
- `watertoren-hilversum-nieuwe-watertoren.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-hilversum-nieuwe-watertoren-1-1000.stl`: alles samen op 1:1000 (46 × 57 × 9,5 mm).

## Oorsprong en oriëntatie

RD-oorsprong [139000.27, 468074.65] (52,20055 N, 5,15317 O), het hart van het reservoir (AHN-DSM: cirkel van 4,7 m boven 8,3 m), op maaiveld (AHN-DTM NAP +3,0 tot +3,35; gebruikt +3,3). Lokale +X loopt langs de lange gevels van het hoofdgebouw (gewogen richting van de BAG-randen, 32,7 graden linksom op RD-oost, `xAxis` [0.84151, 0.54024]), +Y naar het noordwesten; de toren staat aan de zuidkant. `groundHeight` 46,5 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de veertien `groundSamplePoints` rond het gebouw (46,50 tot 46,66). Het model vervangt BAG-pand 0402100001480421, zodat het PDOK-blok verdwijnt; andere panden raken het model niet.

## Onderdeel `building:hoofdgebouw-zonnestraal-met-watertoren`

- Watertoren: schacht van 2,2 m doorsnede van het maaiveld door het terras tot 5,9 m, kraag onder 45 graden naar het reservoir van 4,4 m doorsnede op 7,0 m, plat dak op 9,2 m (AHN 9,2).
- Kruis van twee lagen tot 7,62 m (AHN): zuidarm naast de toren (u 0,1 tot 11,58, v -5,2 tot de dwarsarm), dwarsarm van 32,8 × 11,85 m, noordbalk waarvan de verdieping uitkraagt tot u -0,3 en 11,2 (AHN) boven een begane grond op de BAG-contour (1,25 tot 10,7), met een kraag onder 45 graden.
- Ronde opbouw boven de eetzaal in het hart van het kruis: 9,2 m doorsnede tot 9,03 m (AHN), met een verdiepte glasstrook en een dakrand.
- Noordblok tot 7,62 m met een rond trappenhuis van 6,28 m doorsnede aan de kop (AHN tot v 33,4), op een lage voet tot de BAG-contour.
- Zuidelijk trappenhuis: halfronde glazen toren van 1,4 m straal tegen de voorvleugel tot 5,5 m (AHN), met een afdak op een kraag onder 45 graden.
- Lage voorvleugel (zuid) en achtervleugel (noord) van één laag tot 3,62 m, gang en noordwestblok tot 3,16 m (AHN), met een lage bank langs het terras naast de schacht (AHN 1 tot 2 m).
- Gevels: per laag een gesloten borstwering, een glasstrook 0,4 m (begane grond) of 0,5 m (verdieping) terug met een plafond onder 45 graden, en een dakrand.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Nieuwe_watertoren_(Hilversum)): ontwerpers, bouwjaar, functie voor Zonnestraal.
- [Rijksmonumentenregister 46771](https://monumentenregister.cultureelerfgoed.nl/monumenten/46771): Sanatorium Zonnestraal.
- BAG-pand 0402100001480421 (PDOK, 2026-11-04): contour van de begane grond, hoofdrichting, trappenhuizen.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-04), in het lokale stelsel per 0,25 m gelezen: maaiveld NAP +3,3; lage vleugels 3,59 tot 3,64 en 3,16; kruis, noordbalk en noordblok 7,62; opbouw 9,03 (cirkel van 4,76 m straal incl. rand); reservoir 9,2 (ventilatiekappen 9,6); zuidelijk trappenhuis 5,5; uitkraging van de noordbalk. 3D BAG (LoD2.2) ter controle van de dakhoogtes; luchtfoto voor de cirkels.
- Foto's op Wikimedia Commons: RCE 20372212 "Hoofdgebouw, waterreservoir" (reservoir op de schacht vanaf het terras), "Rijksmonument 46771 Sanatorium Zonnestraal Hilversum 03" (reservoir van onderen: verhouding schacht/reservoir 0,44, hoogte reservoir halve doorsnede), "Rijksmonument 46771 … 19" en RCE 20349385 "Overzicht achtergevel, na restauratie" (gevels, glasstroken, trappenhuizen, afdak).

## Geschat en weggelaten

Geschat: de doorsnede van de schacht (0,44 van het reservoir op een frontale foto) en de onderkant van het reservoir (hoogte de helft van de doorsnede); de hoogtes en diepte van borstweringen, glasstroken en dakranden (uit foto's, gelijk per laag); de halfronde vorm van het zuidelijke trappenhuis (BAG-boog en AHN); het afdak ervan. Het reservoir hangt in werkelijkheid met een vlakke onderkant over de schacht; in het model loopt daar een kraag onder 45 graden, zodat het op 1:1000 zonder steun print.

Weggelaten: de roestvrijstalen rookgasafvoer en de twee ventilatiekappen op het reservoir en de pijpen langs de schacht (dunner dan 0,9 m), de leuningen en borstweringen van de dakterrassen (0,2 m dik), de stalen kozijnen, de dunne luifelplaten en consoles van de verdieping (vlak, niet printbaar zonder steun; de dakrand staat op de gevel), de losse tuinmuren rond het gebouw (geen deel van het pand) en de bakstenen schoorsteen van 1952 (eigen pand). De kleine trappen en uitbouwen van minder dan 1,2 m aan de BAG-contour zijn niet gemodelleerd.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet (verhouding 1,0000): glasstrookplafonds, de kraag onder de noordbalk, het afdak van het trappenhuis en de kraag onder het reservoir lopen onder 45 graden. Via `createModelBundle` op een uitsnede van 90 m staat het model compleet op het PDOK-maaiveld (voet 0,4 tot 0,6 m in het terrein) en is het PDOK-pand weg. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (rechte blokken met een los blok op de plek van de toren en een scheve muur) het ronde reservoir op de schacht, de ronde opbouw, de twee ronde trappenhuizen, de uitkragende noordbalk en per laag de borstwering, verdiepte glasstrook en dakrand.

Controle-URL: http://localhost:3000/kaart/52.20056/5.15319/200/1x1/0
