# Watertoren Doorwerth

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-doorwerth.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: hoofdbouw en trappenhuis zijn geëxtrudeerde veelhoeken (een rechthoek en een rechthoek met halfronde kop), plint en afdeklijsten zijn omhulsels van twee contouren, de uitkragingen en banden omhulsels van cirkelsegmenten; vensters zijn nissen, aanbouw en tussenbouw prisma's op de BAG-contour.

De watertoren aan de Spechtlaan in Doorwerth is in 1937-1938 gebouwd naar ontwerp van ir. Th.K.J. Koch in een zakelijk-expressionistische bouwtrant, met een betonnen reservoir van 50 tot 60 m³. Door de hoge ligging op de stuwwal (circa NAP +55 m) kon de toren laag blijven. Hij is sinds 2001 rijksmonument (523656) en is in 2009-2010 verbouwd tot woning met een aanbouw.

## Bestanden

- `watertoren-doorwerth.glb`: één node van klasse `building`, op het maaiveld: toren, trappenhuis, aanbouw en tussenbouw samen. De export vult elke node apart op; aanbouw en tussenbouw staan tegen de toren.
- `watertoren-doorwerth.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-doorwerth-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [182824.03, 443183.24], het hart van de vierkante hoofdbouw in de BAG-contour van pand 0274100000012264, op maaiveld (NAP +55,6 m; het maaiveld rond de toren ligt tussen +55,4 en +55,8). +X staat loodrecht op de oostgevel aan de Spechtlaan, 2,1 graden linksom van RD-oost (`xAxis` [0.99933, 0.03664], de richting van de noord- en westgevel in de BAG); +Y wijst naar het noorden. Het BAG-pand omvat ook de aanbouw en de tussenbouw van 2010, dus die staan in het model. De buurpanden liggen 10 m of verder weg.

## Onderdeel `building:toren-trappenhuis-en-aanbouw`

- Hoofdbouw van 5,56 × 5,5 m (BAG) op een kunststenen plint die 0,1 m uitsteekt tot +0,6 met een schuine bovenkant tot +0,75; bakstenen gevels tot +14,55 en een kunststenen afdeklijst die 0,1 m uitkraagt op een schuine onderkant (56 graden), tot +14,9.
- Trappenhuis aan de zuidzijde: 2,42 m breed met een halfronde kop (straal 1,21 m) die 1,75 m buiten de zuidgevel staat, tot +17,1 en met een afdeklijst tot +17,45. Boven het dak loopt het door tot 1,2 m voorbij het hart van de hoofdbouw. Drie valraampjes van 0,35 × 0,9 m in de kop (op +2,8, +7,9 en +12,9) en in elke flank boven het dak een nis van 2,0 m breed voor de twee vensters (+15,0 tot +15,7).
- In de noord-, oost- en westgevel de gebogen uitkraging rond de omgang van het reservoir: 3,0 m breed en 0,4 m uit de gevel van +10,3 tot +13,5, op een onderste band (3,3 m, 0,5 m uit, +10,05 tot +10,3) met een schuine onderkant vanaf +9,35, en onder een bovenste band (0,55 m uit) op een schuine kraag tot +13,95. In elke uitkraging een nis van 1,8 m breed en 0,3 m diep voor de twee louvrevensters (+11,35 tot +12,75); in elke van deze gevels eronder een zesruitsvenster van 0,55 × 0,95 m (+5,0 tot +5,95).
- Aanbouw (2010) op de BAG-contour, 14,5 × 9 m met een schuine noordrand, plat dak op +4,9 met twee dakopbouwen tot +5,45; tussenbouw tegen de oostgevel van de toren met plat dak op +3,7.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Doorwerth)): bouwjaar, architect, hoogte 19 m, reservoir 60 m³, verbouwing 2009-2010.
- [Rijksmonumentenregister 523656](https://monumentenregister.cultureelerfgoed.nl/monumenten/523656): vierkante hoofdbouw van circa 6 × 6 m, halfrond trappenhuis aan de zuidzijde dat enkele meters boven de hoofdbouw uitsteekt, borstweringen met kunststenen afdeklijst, spleten in de borstwering van het trappenhuis, kunststenen plint, horizontale betonnen banden, gebogen uitkragingen met twee vensters met vier betonnen banden in de noord-, oost- en westgevel, reservoir van circa 5 m doorsnede en 3 m hoog met de hoogste waterstand op 13,5 m, ingang met gebogen betonnen luifel in de oostgevel.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +55,6, borstwering van de hoofdbouw +14,9 (NAP +70,5), trappenhuis +17,3 tot +17,55 (top NAP +73,15), de verhoging van het trappenhuis van v -4,5 tot +1,2, de uitkragingen als randpixels van 0,4 tot 0,5 m buiten de oost- en westgevel, aanbouw +4,8 tot +5,0 met dakopbouwen op +5,4, tussenbouw +3,7.
- BAG-pand 0274100000012264 (bouwjaar 1938, in gebruik) en luchtfoto (PDOK): plattegrond van hoofdbouw, trappenhuis, aanbouw en tussenbouw, de U-vormige borstwering op het trappenhuis, de plaats van de dakopbouwen.
- Foto [Watertoren Doorwerth](https://commons.wikimedia.org/wiki/File:Watertoren_Doorwerth.jpg) (2007, oostgevel en trappenhuis vanuit het oostzuidoosten): hoogtes van banden, louvrevensters, venster en plint, breedtes van uitkraging en vensters, de vensters in de flank van het trappenhuis, geschaald op de borstwering in het AHN (44 px/m). Foto's op watertoren-doorwerth.nl ter controle: de valraampjes in de kop van het trappenhuis en de aanbouw en tussenbouw na 2010.

## Geschat en weggelaten

Geschat: het uitsteken van de uitkragingen (0,4 m, uit randpixels in het AHN) en van de banden, plint en afdeklijsten (0,1 tot 0,55 m), de diepte van de nissen (0,25 tot 0,3 m), de hoogtes van de banden en vensters (van één schuine foto, circa 0,2 m nauwkeurig), dat de noord- en westgevel dezelfde indeling hebben als de oostgevel boven de tussenbouw (het register noemt de gevels symmetrisch; er is geen foto van die kanten), de richting van de valraampjes (zuidzuidwest) en de vensters in de westflank van het trappenhuis (spiegelbeeld van de oostflank).

Weggelaten: de twee louvrevensters als aparte openingen (de penant ertussen is 0,17 m) en hun vier betonnen lamellen; de spleten in de borstwering van het trappenhuis (0,15 m breed, 0,45 m uit elkaar); het consoletje onder de onderste band (0,35 m); de verdiepte borstweringen boven de daken (wanden van 0,3 m); de ingang met gebogen luifel en de twee ramen ernaast in de oostgevel, die sinds 2010 achter de tussenbouw zitten; de vlaggenmast op het trappenhuis; de zonnepanelen en een smalle schuine dakrand aan de noordkant van de aanbouw.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet meetbaar (gemeten 1,000000): afdeklijsten, plint, banden en nisplafonds hangen onder 56 graden. De doorsneden op 1, 3, 4,5, 5,5, 9, 10,2, 12, 13,6, 14,8, 15,4, 16,5 en 17,3 m blijven gelijk. Op de kaart hoort de toren met aanbouw op de plek van het verborgen PDOK-pand te staan, de voet 0,1 tot 0,2 m in het PDOK-maaiveld. Controlebeelden blijven buiten de repo. De preview-export (1:1000, support v2) heeft geen steun; op de kaart staan toren, tussenbouw en aanbouw op het verborgen PDOK-pand, met de voet op het hellende terrein van 0,05 m boven tot 0,4 m in het maaiveld.

Controle-URL: http://localhost:3000/kaart/51.97642/5.79224/200/1x1/0
