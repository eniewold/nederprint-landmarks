# Corneliuskerk, Noordwelle

Laatgotische eenbeukige kerk met een lager driezijdig gesloten koor, steunberen en een brede westtoren met achtkantige klokkenkamer en spits. Het model bestaat uit afzonderlijke bouwdelen en vlakke daken, samen één gesloten bouwdeel.

## Bronnen en maten

- [3D BAG pand 1676100000433785](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1676100000433785) levert de contour en nokken: schip circa NAP +16,0 m, koor NAP +13,5 m, maaiveld NAP +1,228 m.
- PDOK AHN DSM 0,5 m levert een hoogste meetpunt op de torenspits van NAP +28,0 m. Het model eindigt op 26,8 m boven maaiveld; de uiterste pin is wegens de printbreedte afgevlakt.
- [Rijksmonument 38818](https://monumentenregister.cultureelerfgoed.nl/monumenten/38818), [plaatselijke kerkgeschiedenis](https://www.pgschouwenaanzee.nl/kerken/corneliuskerk-noordwelle) en [monumentbeschrijving](https://www.dbnl.org/tekst/sten009monu09_01/sten009monu09_01_0067.php) beschrijven kerk en toren.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Corneliuskerk,_Noordwelle) toont de lange gevels, koorsluiting en westtoren vanuit verschillende richtingen. Historische foto's met een eerdere aanbouw zijn niet als huidige toestand gebruikt.

De maat en ligging van de vensternissen, steunberen, torenovergang en spits zijn deels naar foto's en AHN geschat. Het uurwerk, de windvaan, dunne kozijnen en kleine gevelopeningen zijn voor de print vereenvoudigd of weggelaten; de klankopeningen zijn blinde nissen.

## Bestanden en controles

De GLB heeft één node `building:kerk` en vervangt BAG-pand `NL.IMBAG.Pand.1676100000433785`; oorsprong RD (44818, 415615), X-as (0,996, 0,089). STL's zijn op 1:100 en 1:1000 beschikbaar. Regenereer met `node scripts/generate-corneliuskerk-noordwelle.mjs --scale 100` en daarna `--scale 1000`.

Het model is één gesloten manifold zonder onprintbare ondervlakken; de gerichte test controleert componenten en ondersteuning op 1:1000. Vier renders zijn vergeleken met de PDOK-reconstructie en beschikbare schuine foto's. De kaart en preview-export van de volledige uitsnede zijn gecontroleerd. In de directe omgeving van de kerk zijn geen afzonderlijke PDOK-panden die overlappen met het model aangetroffen.
