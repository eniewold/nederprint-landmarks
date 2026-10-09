# Lichttoren — Eindhoven

Volledig EC/ED-fabriekscomplex op 1:1000. Gesloten BAG-prisma, afzonderlijke dakvlakken en vleugels, zevenzijdige proefruimtetoren, hogere trapkern, liftkoppen en dakopbouw; geen gestapelde hoogtelagen.

## Bronnen en maten

BAG `0772100001003341`, BGT, PDOK-orthofoto en AHN DSM/DTM 0,5 m, geraadpleegd 9 oktober 2026. [3D BAG, CC BY 4.0](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0772100001003341) levert hoofdvlak NAP 44,82 m, toren 61,44 m, hogere trapkern 65,02 m, dakopbouw 50,2 m en westelijke nok 51,54 m. De moderne hotelvleugel behoort tot hetzelfde BAG-pand en is inbegrepen. De overkant, waaronder de Bruine Heer/Admirant, blijft behouden.

[RCE 518717](https://monumentenregister.cultureelerfgoed.nl/monumenten/518717) beschrijft zes fabriekslagen, drie facetten aan de hoek en vijf torenlagen. Schuine referenties: [voorzijde](https://commons.wikimedia.org/wiki/File:Lichttoren_Eindhoven_1.JPG), [Ralf 2013](https://commons.wikimedia.org/wiki/File:13-06-28-eindhoven-by-RalfR-66.jpg), [achterzijde ED](https://commons.wikimedia.org/wiki/File:Achterzijde_van_gebouw_ED,_gezien_vanaf_de_Emmasingel_-_Eindhoven_-_20338975_-_RCE.jpg) en [binnengevel EC](https://commons.wikimedia.org/wiki/File:Overzicht_van_de_binnengevel_van_gebouw_EC_en_rechts_een_gedeelte_van_de_zuidgevel_van_gebouw_ED_-_Eindhoven_-_20338982_-_RCE.jpg).

RD-oorsprong `[161123,383504]`, x-as 13,5°, maaiveld NAP 16,55 m, onderkant −0,4 m. Modelmaat 123,90 × 106,16 × 48,87 m, dus evenveel mm op 1:1000.

## Geschat en vereenvoudigd

Venstermaten, roeden, liftbanden en gevelritme zijn uit foto's regelmatig gemaakt; moderne hotelvensters zijn geschat. Dakvlakken zijn vereenvoudigd en kleine installaties, reclameletters, masten en hekjes weggelaten. De blinde vensternissen zijn 0,35 m diep; de uitstekende liftbanden zijn klein en verbonden met hun schacht.

## Controle voor rapportage

- Generator: `NoError`, één verbonden onderdeel, genus 0, 10.122 driehoeken, volume 175.233,8 m³.
- Vier aanzichten −35°, 55°, 145° en 235° naast de werkelijke PDOK-reconstructie vergeleken met de schuine foto's. Volledige vleugels, toren, hogere achterkern en binnenruimte sluiten aan.
- [Controle-URL](http://127.0.0.1:3037/kaart/51.44006/5.47564/350/1x1/0): ligging, rotatie, aansluiting op maaiveld en behoud van de gebouwen aan de overkant gecontroleerd.
- Echte webshop-export RD `[160978,383413,161168,383603]`, 190 × 190 mm, 1:1000, basis 1 mm, z-factor 1 en overhanginstelling 45°: 304 objecten, 131.374 driehoeken, twee printonderdelen, hoogte 51,3 mm. Het volledige complex valt binnen de uitsnede.
- Voorbereiding met/zonder 45° overhanginvulling: beide `NoError`, identiek volume 180.124,1848 mm³. Geen aanvullende steunen nodig.
- Catalogus-/API-tests en echte lokale exportcontrole: 295 geslaagd. De modeltest controleert de complete EC/ED-vleugels, beide torenhoogtes, dakopbouw en zes vensterreeksen.

Brongegevens, vier renders, kaartbeeld en `preview.3mf` staan in de aparte werkomgeving onder `lichttoren/`.

## Genereren

`node scripts/generate-lichttoren.mjs` of `--scale 1000 --out models`. Controleer op de kaart de afgeschuinde toren, de hogere achterkern en het gevelritme van alle EC/ED-vleugels.
