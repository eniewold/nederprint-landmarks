# Sint Nicolaaskerk Nieuwegein

De neogotische kerk bestaat uit een middenschip en lagere zijbeuken, kruisbeuk, veelhoekig koor, aangebouwde gang, westtoren, vieringruiter en traptoren. Dakvlakken en bouwdelen zijn afzonderlijk samengesteld; kleine dakkapellen zijn boven het middenschip toegevoegd. De STL meet 41,1 × 43,8 × 50,2 mm op 1:1000, met 0,5 mm onder maaiveld. De generator maakt één samenhangend en gesloten volume met genus 0 en controleert ondervlakken; de webshoptest controleert plaatsing, steunvolume en doorsneden.

## Bronnen en plaatsing

- [Rijksmonumentenregister 30422](https://monumentenregister.cultureelerfgoed.nl/monumenten/30422).
- [3DBAG pand 0356100000070858](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0356100000070858): contour, dakvlakken en maaiveld NAP +1,99 m. Kerk, toren en de lange lage noordvleugel vallen onder hetzelfde BAG-pand. De oude 3DBAG-spits is onvolledig.
- AHN DSM 0,5 m: hoogste torenpixel NAP +51,68 m, circa 49,7 m boven maaiveld; andere punten op de spits ondersteunen het hoogtebeeld.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint_Nicolaaskerk,_Nieuwegein): foto's vanaf de weg, begraafplaats en voorgevel, plus historische plattegrond voor koor, transept en torens.
- PDOK 3D Basisvoorziening: reconstructie en vervanging van het ene BAG-pand. De naburige panden zijn lokaal met AHN vergeleken. Ten zuiden hebben 0356100000078350 en verder zuidelijk 0356100000078337 lokaal positieve dakverschillen (p90 circa 2,4 respectievelijk 4,1 m); oorzaak onzeker, bijvoorbeeld interpolatie of dakranden. Controleer deze bij grotere uitsneden.
- [Open Monumentendag](https://www.openmonumentendag.nl/monument/de-sint-nicolaaskerk/) beschrijft de kerk te Jutphaas.

Oorsprong RD (135028, 450192), X-as (0,915, -0,403), maaiveld NAP +1,99 m. [Controleer op de kaart](http://localhost:3000/kaart/52.03974/5.09613/200/1x1/0).

## Geschat en vereenvoudigd

De afmetingen van torenspits, traptoren, vieringruiter, dakkapellen, steunberen en gevelopeningen zijn naar foto en hoogtepunten geschat. De vieringruiter is massief, torenspitsen hebben minimaal 0,9 mm breedte en klein maaswerk en kruisen zijn weggelaten. De lange aangebouwde vleugel is vereenvoudigd in dak en gevel. Controleer vooral de aansluiting van de lage vleugel, traptoren en hoogte van de hoofdspits.

Generator: `node scripts/generate-sint-nicolaaskerk-nieuwegein.mjs --components`.
