# Nederlands Hervormde Kerk, Rumpt

De kerk aan de Middenstraat is een driebeukige pseudobasiliek met een ingebouwde westtoren, een smaller en hoger koor met driezijdige sluiting en een zuidelijke, veelhoekige kapel. De toren draagt een lage ingesnoerde spits en heeft een traptoren aan de noordwesthoek. Het model gebruikt afzonderlijke bouwdelen en dakvlakken, verbonden met steunberen. De westnis, gevelvensters en galmgaten zijn ondiepe, printbare uitsparingen.

## Bronnen en plaatsing

- [Rijksmonument 16515: kerk](https://monumentenregister.cultureelerfgoed.nl/monumenten/16515) en [16516: toren](https://monumentenregister.cultureelerfgoed.nl/monumenten/16516): architectuur en traptoren.
- [Monumenten in Nederland, Gelderland](https://www.dbnl.org/tekst/sten009monu05_01/sten009monu05_01_0182.php): pseudobasiliek, vierdelige toren, koor en bouwgeschiedenis.
- [Archimon: Hervormde kerk Rumpt](https://www.archimon.nl/gelderland/rumptherv.html): schuine foto's van alle zijden en details van toren, koor en zuidkapel.
- [3DBAG, pand 0236100000008578](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0236100000008578): BAG-contour en dakvlakken van kerk en toren.
- [PDOK AHN-WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0): 0,5 m DSM en DTM. De hoogste gemeten torencel ligt op +29,89 m NAP; op de torenspits is geen rastergat. De nokken van schip en koor liggen rond +20 m NAP. Het lokale maaiveld naast de kerk ligt ongeveer tussen +3,1 en +3,9 m NAP. Een kleine NoData-cluster ligt ten zuidoosten van het gebouw en niet op de spits.

De RD-oorsprong is 140534,48 / 432918,95; de X-as volgt de nok naar het oosten. De maten zijn circa 36,45 × 21,45 × 26,65 m inclusief de 0,3 m ingegraven voet. Maaiveldpunten langs de voet verminderen de invloed van lagergelegen omliggende straten. De spitsverhoudingen, traptoren, steunberen en venster- en portaalnissen zijn geschat uit foto's en AHN; metselornament, wijzerplaten en windvaan zijn vereenvoudigd of weggelaten.

## Genereren en controleren

`node scripts/generate-nederlands-hervormde-kerk-rumpt.mjs` schrijft de GLB, JSON en STL 1:1000; met `--scale 100` wordt de STL 1:100 gegenereerd. De geometrie is één gesloten component (genus 0). Plaatsing en printbaarheid op 1:1000 zijn getest en werkelijke 150 × 150 m-kaartuitsneden met en zonder landmark zijn geëxporteerd. Vier richtingen zijn naast de PDOK-reconstructie en schuine foto's beoordeeld. Controleer op de kaart de torenhoogte en -positie, de zuidkapel en de aansluiting op het licht oplopende maaiveld.
