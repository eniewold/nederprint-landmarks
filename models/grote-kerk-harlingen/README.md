# Grote Kerk, Harlingen

Kruiskerk uit 1772–1775 met een oudere westtoren, Kerkpad 3 in Harlingen; rijksmonumenten 20447 (kerk) en 20446 (toren). De plattegrond is een Grieks kruis en de vier armen hebben zadeldaken die bij de viering samenkomen. De toren heeft een hoge, ingesnoerde spits.

## Model

De generator `scripts/generate-grote-kerk-harlingen.mjs` bouwt het kruis uit twee dakvolumes met vlakke hellingen, een torenschacht en een uit vier vlakken gevormde spits; hoekpilasters, drie portalen, dakvensters, gevelbekroningen en ondiepe vensternissen zijn afzonderlijke bouwdelen. Het model is één gesloten `building:kerk`-node in de GLB. De oorsprong ligt bij de viering op RD (157330,10; 576247,10); +X loopt langs de kerk naar het oosten. De voet ligt 0,5 m onder maaiveld.

Het model vervangt BAG-pand `NL.IMBAG.Pand.0072100000295357`. De GLB gebruikt meters en Y omhoog; de STL is in millimeters op schaal 1:1000, met Z omhoog. Regenereer met `node scripts/generate-grote-kerk-harlingen.mjs`; `--scale` en `--out` zijn optioneel.

## Bronnen en aannames

- [3D BAG, pand 0072100000295357](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0072100000295357): contour, oriëntatie en dakvlakken. Nok NAP +29,82 m, goot circa NAP +20,25 m en maaiveld NAP +4,23 m.
- PDOK AHN-DSM 0,5 m en actuele orthofoto: controle van de dakvorm, de westtoren en de dakvensters. Het raster geeft boven de toren lokaal ongeveer NAP +54,2 m.
- [Rijksmonument 20447](https://monumentenregister.cultureelerfgoed.nl/monumenten/20447), [Wikipedia](https://nl.wikipedia.org/wiki/Grote_Kerk_(Harlingen)) en [Commons-foto's](https://commons.wikimedia.org/wiki/Category:Grote_Kerk_(Harlingen)): bouwgeschiedenis en verschijningsvorm, inclusief portalen en gevelvensters.

De torenspits is vereenvoudigd tot vier vlakken en de hoogte ervan is op 48,7 m boven maaiveld geschat; de bovenste breedte is tot 0,9 m vergroot voor de print. De exacte afmetingen van de vensternissen, portalen, pilasters, dakvensters en topbekroningen zijn van foto en luchtfoto geschat. De vensters hebben voor de steunloze print een puntige bovenzijde; de grote ronde gevelvensters zijn daarom hoekig en spits vereenvoudigd. De wijzerplaat aan de zuidzijde is als een nis van circa 1,3 m weergegeven. Overige wijzerplaten zijn weggelaten omdat hun exacte positie uit de beschikbare foto's onvoldoende vaststaat; maaswerk, ornament en details kleiner dan 0,9 m zijn weggelaten.

## Printcontrole

De generator controleert op gesloten geometrie, Float32-herinlezing en ondervlakken steiler dan 45 graden; de STL is één gesloten volume. In een afzonderlijke controle van de 45-graden-export nam het volume minder dan 0,01% toe en bleven doorsneden op 5, 10, 15, 19, 22, 27, 35 en 45 m binnen 0,1% gelijk.

## Kaart en export

De ligging is op de kaart en in de volledige 1:1000-preview gecontroleerd. Twee 3MF-exports met en zonder landmark en vier gelijke schuine renderhoeken zijn naast PDOK en foto's bekeken; de fotohoeken komen niet overal exact overeen. De spits, portalen, gevelnissen en dakdetails vullen de PDOK-reconstructie aan.
