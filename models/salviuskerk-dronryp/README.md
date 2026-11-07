# Salviuskerk Dronryp

De witgepleisterde Salviuskerk (d'Alde Wite) bestaat uit een lang schip met veelhoekige koorsluiting en een dwarse aanbouw aan de noordzijde. De toren heeft een vierkante onderbouw, achthoekige klokkenlantaarn, kleinere traptoren en peervormige bekroning. Het model vervangt twee BAG-panden: kerk 0083100000006198 en toren 0083100000006225.

## Bronnen en maten

- [3D BAG kerk](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0083100000006198) en [toren](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0083100000006225): contouren, nokken en geledingen; maaiveld circa NAP +3,0 m.
- [AHN DSM 0,5 m](https://service.pdok.nl/rws/ahn/wcs/v1_0): gemeten maximum NAP +46,137 m ter plaatse van de bekroning; het model eindigt op circa NAP +45,8 m. Rond de toren zijn enkele ontbrekende cellen, voornamelijk aan de rasterrand; de kern van de bekroning en de omhullende zijn gemeten.
- [Rijksmonument 28604](https://monumentenregister.cultureelerfgoed.nl/monumenten/28604) en [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Salviuskerk_(Dronryp)): gevels, westtoren en koor.

De oorsprong ligt op RD (172105,7; 578930,4) bij de torenas; de +X-as (0,9997; -0,024) wijst langs het schip naar het koor. Onderkant 0,5 m onder lokaal maaiveld. Vensterindelingen, koorportaal, steunberen en exacte vorm van de bekroning zijn op basis van foto’s geschat en vereenvoudigd. Galmgaten zijn ondiepe nissen; de kleine open lantaarn is gesloten uitgevoerd om steunloos te printen. Windvaan, kruis, balustrade en fijn maaswerk zijn weggelaten.

## Genereren en controleren

`node scripts/generate-salviuskerk-dronryp.mjs` schrijft GLB, JSON en STL op 1:1000. Het gebouw is één gesloten component, genus 0. Steuncontrole op 45 graden gaf een volumeverhouding van 0,9999999997 en gelijke doorsneden. Volledige 150 × 150 m-uitsneden zijn met en zonder landmark geëxporteerd; vier aanzichten zijn vergeleken met de PDOK-reconstructie en foto's. De vervanging verwijdert beide afzonderlijke PDOK-panden.
