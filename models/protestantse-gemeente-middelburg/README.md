# Protestantse Gemeente Middelburg — Dorpskerk Sint Laurens

Vereenvoudigde zaalkerk uit 1644 aan de Van Cittersstraat met schilddak, houten dakruiter, steunberen, toegangsportaal en de westelijke consistorie. De kerk ligt in Sint Laurens, gemeente Middelburg; de huidige kerk staat op de fundamenten van een oudere kerk.

## Bronnen en maatvoering

- [BAG/3D BAG pand 0687100000028318](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0687100000028318): voetafdruk, uitrichting en dakvlakken; maaiveld NAP +1,24 m, nok circa NAP +16,7 m.
- [AHN DSM 0,5 m](https://service.pdok.nl/rws/ahn/wcs/v1_0): controle nok en dakruiter; hoogste punt bij torentje NAP +27,9 m omvat vermoedelijk de smalle bekroning; de dakruiter is tot 24,4 m boven maaiveld gemodelleerd.
- [Rijksmonument 29734](https://monumentenregister.cultureelerfgoed.nl/monumenten/29734), [dorpsgeschiedenis](https://www.sint-laurens.nl/pages/hervormde-kerk-0.html) en [Commons-foto's](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Sint_Laurens): functie, gebouwgeschiedenis, exterieur en aanbouw.

De oorsprong ligt op RD (31205, 394797), lokale X-as (0,9889, 0,1486). Schaal en oriëntatie volgen BAG en 3D BAG. De houten dakruiter, diens spits en nissen, vensterafmetingen, portaal en details van de consistorie zijn op basis van foto's en AHN geschat. De open klokkenstoel is een gesloten kern met blinde nissen om deze op 1:1000 te kunnen printen; windvaan, klok en fijn glaswerk zijn weggelaten wegens afmetingen kleiner dan 0,9 m. De steunberen staan op de BAG-uitsteeksels; hun onderbreedte is vergroot voor printbaarheid.

## Bestanden en controle

De GLB bevat één node `building:kerk`, in meters met Y omhoog. De JSON vervangt het genoemde BAG-pand; onderkant 0,5 m onder maaiveld. STL-bestanden zijn op 1:100 en 1:1000. Genereer met `node scripts/generate-protestantse-gemeente-middelburg.mjs --scale 1000` in de modelrepository.

De gerichte modeltest controleert één gesloten manifold, de plaatsing en de 45°-steunopvulling met horizontale doorsneden. Vier schuine zijden zijn vergeleken met de PDOK-reconstructie en foto's: het model behoudt consistorie en schilddak en voegt dakruiterspits, portaal en gevelopeningen toe. Naburige panden zijn op PDOK-hoogte tegen AHN gecontroleerd; enkele lokale uitschieters bij dakranden en maaiveld zijn niet overtuigend bewijs voor een te hoge kolom.

De kaart en een preview-export van de volledige uitsnede zijn gecontroleerd.
