# Rietveld Schröderhuis — Utrecht

Klein woonhuis uit 1924 op 1:1000. Het model bestaat uit een gesloten gevelvolume op het BAG-plan, terugliggende glasnissen, afzonderlijke uitstekende gevelvlakken, twee balkonplaten, twee dakplaten, daklicht en schoorsteen. Geen gestapelde hoogtelagen.

## Bronnen en maatvoering

BAG `0344100000059839`, actuele BGT, PDOK-orthofoto en AHN DSM/DTM 0,5 m, geraadpleegd 9 oktober 2026. [3D BAG CC BY 4.0](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0344100000059839): hoofdvlak NAP 8,36–8,40 m. Dit model neemt 8,38 m. Maaiveld NAP 2,08 m; daklicht en schoorsteen volgen de AHN-pieken en foto's. Alleen dit pand wordt vervangen; het aangebouwde bakstenen buurhuis en de tuin-/garagestructuren blijven staan.

[UNESCO 965](https://whc.unesco.org/en/list/965/) en het [ruimtelijke archief van de beheerder](https://www.rietveldschroderhuis.nl/nl/ontdek/ruimtelijk-archief) documenteren de uit elkaar geschoven vlakken. Schuine foto's: [voor- en zijgevel RCE 20231596](https://commons.wikimedia.org/wiki/File:Voor_en_zijgevel_-_Utrecht_-_20231596_-_RCE.jpg), [zuidzijde RCE 20231592](https://commons.wikimedia.org/wiki/File:Exterieur_vanuit_het_zuiden_-_Utrecht_-_20231592_-_RCE.jpg), [tuinzijde Casa 07](https://commons.wikimedia.org/wiki/File:Casa_Rietveld_Schr%C3%B6der_07.jpg).

RD-oorsprong `[138575,455256]`, x-as −29,5°, onderkant 0,35 m onder maaiveld. Modelmaat 8,25 × 10,81 × 8,45 m, dus mm op 1:1000.

## Geschat en vereenvoudigd

Balkon-, raam- en plaatmaten, lichtkap en schoorsteenvorm zijn uit foto's geschat; hoofdhoogte en grondplan zijn gemeten. De dak-/balkonplaten zijn circa 1,5 m dik gemaakt, met schuine onderranden. Smalle roeden en glas worden dichte wanden met blinde nissen; balkons hebben kleinere ondersnijdingen. Fijne stalen balken, hekjes, gevelkleuren en het interieur ontbreken. Op 1:1000 is het huis slechts circa 8 × 11 mm: beoordeel vooral het vlakkenbeeld en de hoekvensters, niet het oorspronkelijke dunne detail.

## Controle voor rapportage

- Generator: `NoError`, één verbonden onderdeel, genus 0, 586 driehoeken, volume 489,6 m³.
- Vier renders −35°, 55°, 145° en 235° naast de echte PDOK-reconstructie, vergeleken met de schuine foto's. De gedeelde blinde wand richting buurhuis blijft gesloten; terugliggende glasstroken, balkons en daklicht zijn zichtbaar.
- [Controle-URL](http://127.0.0.1:3037/kaart/52.08533/5.14760/350/1x1/0): ligging, rotatie, aansluiting op buurhuis en maaiveld gecontroleerd.
- Echte webshop-export RD `[138535,455215,138615,455295]`, 80 × 80 mm op 1:1000, basis 1 mm, z-factor 1 en 45° overhanginstelling: 122 objecten, 22.704 driehoeken, vier printonderdelen, totale hoogte 15,5 mm. Hele huis binnen de uitsnede, export visueel bekeken.
- Voorbereiding met/zonder 45° overhanginvulling: beide `NoError`, identiek volume 557,3662 mm³. Geen aanvullende steunen nodig. Dit is een geometrische printcontrole; er is geen fysieke proefprint gemaakt.
- 295 catalogus-/API-tests geslaagd, plus één lokale echte exportcontrole. De toegevoegde test controleert footprint, dak-/balkonplaten, lichtkap en schoorsteen.

Vier renders, brongegevens, kaartbeeld en `preview.3mf` staan in de afzonderlijke werkomgeving onder `rietveld-schroderhuis/`.

## Genereren

`node scripts/generate-rietveld-schroderhuis.mjs` of `--scale 1000 --out models`. Controleer op de kaart het vlakkenbeeld, de verdikte dak-/balkonplaten en de aansluiting op het bakstenen buurhuis.
