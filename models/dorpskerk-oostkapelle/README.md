# Dorpskerk, Oostkapelle

Eenbeukige Dorpskerk met een hoge middeleeuwse westtoren en aangebouwde consistorie. De toren is veertiende-eeuws; het schip werd in 1610 gewijzigd. Sinds 2026 wordt de vroegere consistorie gesloopt en door een groter gebouw vervangen.

## Bronnen en maatvoering

- [BAG/3D BAG, pand 0717100000002896](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0717100000002896): oriëntatie en contour van kerk en toren; schipnok NAP +12,7 m, maaiveld +1,79 m. De 3D BAG laat de oude consistorie zien en is voor deze aanbouw niet actueel.
- [AHN DSM 0,5 m](https://service.pdok.nl/rws/ahn/wcs/v1_0): torenprofiel en daknokken; torenschacht circa NAP +36,3 m, hoogste punt NAP +50,1 m.
- [Rijksmonument 42167](https://monumentenregister.cultureelerfgoed.nl/monumenten/42167), [historische afbeeldingen](https://commons.wikimedia.org/wiki/Category:Dorpskerk,_Oostkapelle), [recente bouwfoto's](https://www.pgoostkapelle.nl/fotogalerij/2026/nieuwbouw-consistorie-dorpskerk) en [RCE-advies 2026](https://kennis.cultureelerfgoed.nl/images/rce/5/5e/RCE_advies_1808086_Waterstraat_4%2C_4356BJ_Oostkapelle_42167_42166.pdf): opstanden en nieuwbouw van de consistorie.

Oorsprong RD (27685, 399007), X-as (0,99996, -0,00836), onderkant 0,5 m onder maaiveld. De torenspits is tot 48,3 m boven maaiveld aangevuld met AHN en foto’s; de top is op 1:1000 verbreed. De gevelnissen, galmgaten en steunberen zijn vereenvoudigd. De nieuwe consistorie was ten tijde van de meest recente beschikbare foto's nog in aanbouw: positie, afmetingen, dakhoogte en ramen zijn daarom aan de hand van die foto's en het oude BAG-profiel geschat. Dakramen, glasverdeling, uurwerk en windvaan zijn wegens geringe afmetingen weggelaten.

## Bestanden en controle

De GLB bevat één node `building:kerk` in meters, Y omhoog. De JSON vervangt het genoemde BAG-pand. De STL-bestanden zijn op 1:100 en 1:1000. Genereer met `node scripts/generate-dorpskerk-oostkapelle.mjs --scale 1000` in de modelrepository.

De gerichte modeltest controleert plaatsing, één gesloten manifold, 45°-steunopvulling en doorsneden. Vier schuine zijden zijn vergeleken met PDOK en de beschikbare kerkfoto's: het model vult de ontbrekende torenspits en gevelopeningen aan. De nieuwe consistorie wijkt bewust af van PDOK omdat die de gesloopte voorganger toont. Bij de omringende panden zijn PDOK-hoogten steekproefsgewijs met AHN vergeleken; losse afwijkingen bij randen zijn geen bevestigde te hoge kolom.


De kaart en preview-export van de volledige uitsnede zijn gecontroleerd.
