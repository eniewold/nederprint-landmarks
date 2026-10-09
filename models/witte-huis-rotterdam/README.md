# Het Witte Huis — Rotterdam

Tien verdiepingen, drie straatgevels, twee ronde hoekerkers met achtkantige arkeldaken, drie topgevels en een afgeplat schilddak met centrale dakopbouw. Gesloten gevelvolumes, dakvlakken en losse bouwdelen; geen gestapelde hoogtelagen.

## Bronnen en maatvoering

BAG `0599100000690521`, actuele BGT, PDOK-orthofoto en AHN DSM/DTM 0,5 m, geraadpleegd 9 oktober 2026. [3D BAG CC BY 4.0](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000690521) geeft het volledige grondplan en westelijke inspringing; de automatisch gereconstrueerde dakvorm is onvolledig. Dakhoogten volgen AHN: maaiveld NAP 2,8 m, goot 33,85 m, plat bovenvlak 41,8 m, centrale opbouw 45,6 m. Alleen dit BAG-pand wordt vervangen; de historische Wijnhavenpanden blijven staan.

[RCE 334003](https://monumentenregister.cultureelerfgoed.nl/monumenten/334003) beschrijft de drie topgevels, klokken, arkels, westelijke vluchttrap-inspringing en vijf overgebleven beelden. [Stadsarchief Rotterdam](https://stadsarchief.rotterdam.nl/het-witte-huis) vermeldt de bouw in 1897–1898 en circa 43 m hoogte. Schuine foto's: [zuidoostzijde 2020](https://commons.wikimedia.org/wiki/File:Halfzijaanzicht_van_het_Witte_Huis_Rotterdam_(2020)_2.jpg) en [noordwestzijde](https://commons.wikimedia.org/wiki/File:00_2440_Witte_Huis_(Rotterdam).jpg).

RD-oorsprong `[93395,437083]`, x-as 18,5°, onderkant 0,4 m onder maaiveld. Modelmaat 21,82 × 21,59 × 43,2 m, dus mm op 1:1000.

## Geschat en vereenvoudigd

Erkerradius, arkeltop op NAP 45,5 m, kapvorm, topgevelprofielen, klokken, vensters, dakvensters en beelden zijn uit foto's geschat. Vensters zijn blinde nissen, beelden vast schematisch reliëf. De westelijke nis krijgt een steile gesloten bovenzijde voor printbaarheid. Kleine daklichten, sierballen, reclames, dakhek en vlaggenmasten ontbreken. De overige drie dakvlakken, gevelritmes en complete inspringende voet blijven herkenbaar.

## Controle voor rapportage

- Generator: `NoError`, één verbonden onderdeel, genus 0, 8.654 driehoeken, volume 13.383,4 m³.
- Vier renders −35°, 55°, 145° en 235° naast de echte PDOK-reconstructie, vergeleken met beide schuine foto's: dakvorm, westelijke nis, ronde erkervoeten en drie topgevels gecontroleerd.
- [Controle-URL](http://127.0.0.1:3037/kaart/51.91861/4.49167/350/1x1/0): ligging, rotatie, kadeaansluiting en behoud van de Wijnhavenpanden gecontroleerd.
- Echte webshop-export RD `[93340,437028,93450,437138]`, 110 × 110 mm op 1:1000, basis 1 mm, z-factor 1 en 45° overhanginstelling: 118 objecten, 49.086 driehoeken, vier printonderdelen, totale hoogte 47,3 mm. Hele model binnen de uitsnede; export visueel bekeken.
- Voorbereiding met/zonder 45° overhanginvulling: beide `NoError`, identiek volume 13.688,6457 mm³. Geen aanvullende steunen nodig. Geometrische controle; geen fysieke proefprint gemaakt.
- 296 catalogus-/API-tests en één lokale echte exportcontrole geslaagd. Nieuwe test controleert BAG-vervanging, volledige voet, schilddak, dakopbouw en erkertoppen.

Vier renders, brongegevens, kaartbeeld en `preview.3mf` staan in de afzonderlijke werkomgeving onder `witte-huis-rotterdam/`.

## Genereren

`node scripts/generate-witte-huis-rotterdam.mjs` of `--scale 1000 --out models`. Controleer op de kaart het steile schilddak, de hoekerkers en de westelijke inspringing naast de behouden Wijnhavenpanden.
