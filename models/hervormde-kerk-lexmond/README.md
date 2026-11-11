# Hervormde Kerk, Lexmond

De eenbeukige middeleeuwse kruiskerk heeft een hoog schip, lagere dwarsarmen, een driezijdig gesloten koor, een zuidelijke aanbouw en een forse vierkante westtoren met ingesnoerde naaldspits. Aan de zuidzijde van de toren staat een klein traptorentje. Het model vervangt BAG-pand 0707100000379314 volledig.

## Ligging en maatvoering

RD-oorsprong (130930, 441688), +X langs de nok naar het koor, met richting (0,999688, 0,024992). Het maaiveld ligt rond NAP +2,14 m. Het AHN DSM meet op de torenspits maximaal NAP +41,78 m; de modelspits ligt 39,65 m boven maaiveld. De voet steekt 0,5 m in het terrein. Het model meet ongeveer 47,9 × 28,4 × 40,1 mm op schaal 1:1000.

Schip, dwarsschip, koor en aanbouw zijn opgebouwd als afzonderlijke bouwdelen met schuine dakvlakken, waarbij de BAG-omtrek ook de steunberen bevat. Dakhoogten en omtrek zijn afgeleid uit 3D BAG en AHN. De vorm van de toren en de spits, het traptorentje en de plaats en afmetingen van de vensternissen en galmgaten zijn geschat naar foto's. De punt is voor printbaarheid minimaal 0,9 mm breed; kleine ornamenten en de opengewerkte balustrade zijn weggelaten.

In de PDOK-tegel zijn geen afzonderlijke panden binnen 4 m van de kerkvoet aanwezig; extra vervangingen van buurpanden zijn niet nodig.

## Bronnen en controle

- [3D BAG: pand en dakvlakken](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0707100000379314)
- [Rijksmonumentenregister 25809](https://monumentenregister.cultureelerfgoed.nl/monumenten/25809)
- [Commons: buitenfoto's kerk en toren](https://commons.wikimedia.org/wiki/Category:Exterior_of_Hervormde_kerk,_Lexmond)
- [DBNL: beschrijving en bouwhistorie](https://www.dbnl.org/tekst/gron052vijf01_01/gron052vijf01_01_0022.php)
- PDOK 3D Basisvoorziening en AHN DSM/DTM 0,5 m. Vier vergelijkingen van model, PDOK en foto's zijn gemaakt in het werkscratchpad `lexmond-1953/compare0.png` t/m `compare3.png`; daarbij is vooral de in PDOK ontbrekende naaldspits hersteld.

Generator: `node scripts/generate-hervormde-kerk-lexmond.mjs --components`. De export vormt één gesloten volume (genus 0); de gerichte test controleert plaatsing, verbondenheid en steunbehoefte met doorsneden. De kaart en preview-export worden afzonderlijk in de webshop gecontroleerd.
