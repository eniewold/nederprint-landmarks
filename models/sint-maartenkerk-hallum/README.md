# Sint-Maartenkerk Hallum

De Sint-Maartenkerk is een middeleeuwse eenbeukige kerk met vijfzijdig gesloten koor, steunberen en twee lagere zijkapellen. Na het instorten van de oude zadeldaktoren is de vierkante westtoren in 1806 herbouwd met een ingesnoerde spits. Het model vervangt BAG-pand 1722100000005077.

## Bronnen en maatvoering

- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1722100000005077): hoofdcontour, daknokken en nokrichtingen; maaiveld NAP +4,675 m, nok van de kerk circa NAP +21,9 m.
- [AHN DSM 0,5 m](https://service.pdok.nl/rws/ahn/wcs/v1_0): hoogste punt van de spits NAP +51,2868 m; het model eindigt op circa NAP +51,275 m. In het 10,5 × 10,5 m raster rond de torentop ontbreken 52 van 441 cellen, waaronder een aaneengesloten strook aan de zuidzijde van de spits; de top en de overige zijden zijn gemeten en de symmetrische spitsvlakken zijn daartussen doorgetrokken.
- [Rijksmonument 15618](https://monumentenregister.cultureelerfgoed.nl/monumenten/15618), [Visit Wadden](https://www.visitwadden.nl/nl/bezoeken/activiteiten-overzicht/1600897362/sint-maartenkerk) en [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Martinuskerk_(Hallum)): bouwgeschiedenis, bouwdelen en schuine gevelbeelden.

Oorsprong RD (181532,5; 591260,2) op de torenas; +X (0,9998; -0,02) langs het schip richting koor. De onderkant ligt 0,5 m onder maaiveld. Vensterplaatsen, breedte en diepte van galmgaten, steunberen en de kapellen zijn geschat uit foto's en vereenvoudigd. De bliksemafleider, windvaan, wijzers en glasroeden zijn weggelaten; galmgaten zijn blinde nissen.

## Genereren en controleren

`node scripts/generate-sint-maartenkerk-hallum.mjs` schrijft GLB, JSON en een STL op schaal 1:1000. Eén gesloten component, genus 0; de steuncontrole op 45 graden gaf een volumeverhouding van circa 1,0000000004 en gelijke doorsneden. De volledige 150 × 150 m-uitsnede is met en zonder landmark geëxporteerd; vier aanzichten zijn naast de PDOK-reconstructie en bronfoto's beoordeeld.
