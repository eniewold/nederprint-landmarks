# Sint Margaretakerk Boksum

Eenbeukige middeleeuwse kerk op een terp met vijfzijdig gesloten koor; de vierkante westtoren is na de instorting van 1843 herbouwd met een spits. Het model bevat schildvlakken boven het koor, twee zware steunberen aan de zuidkant, kleinere koorsteunen en vereenvoudigde spitsboogvensters en galmgaten. Het vervangt BAG-pand 0083100000008523.

## Gegevens en bronnen

- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0083100000008523): plattegrond, nokrichting en hoogte van schip en koor.
- [AHN DSM 0,5 m](https://service.pdok.nl/rws/ahn/wcs/v1_0): opgevraagd raster rondom het gebouw; maaiveld volgens 3D BAG NAP +4,241 m, hoogste rasterpunt nabij de spits NAP +33,196 m. In het gebied van 50 × 30 m zijn acht ontbrekende rastercellen, deels aan de torenrand; de omgeving en hoogste punt zijn meetbaar.
- [Rijksmonument 28584](https://monumentenregister.cultureelerfgoed.nl/monumenten/28584), [Alde Fryske Tsjerken](https://aldefrysketsjerken.nl/boksum) en [foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Margaretakerk,_Boksum): bouwgeschiedenis, gevels en toren.

De oorsprong ligt op RD (177701,5; 576756), de +X-as langs het schip naar het oosten (0,9877; -0,1564). Het model reikt 0,5 m onder de lokale ondergrond; de terp veroorzaakt hoogteverschillen die op de kaart moeten worden gecontroleerd. Hoogte van het model boven maaiveld 28,95 m; de hoofdnok circa 13,5 m. Vensterplaatsen en -maten, koorsteunen, galmgaten en kleine hellingen zijn geschat en vereenvoudigd. De open galmgaten zijn ondiepe nissen; windwijzer, glasroeden, uurwerk en smalle versieringen zijn weggelaten.

## Genereren en controleren

`node scripts/generate-sint-margaretakerk-boksum.mjs` maakt GLB, catalogus-JSON en een STL op 1:1000. Het model is één gesloten component, genus 0. De 45°-steuncontrole gaf een volumeverhouding van 1,00000000005 met gelijke doorsneden. Volledige 150 × 150 m-uitsneden zijn met en zonder landmark geëxporteerd; vier aanzichten zijn vergeleken met de PDOK-reconstructie en schuine foto's. De spits ontbreekt vrijwel geheel in PDOK.
