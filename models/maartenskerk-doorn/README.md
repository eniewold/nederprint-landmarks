# Maartenskerk Doorn

De Maartenskerk is opgebouwd uit zelfstandig begrensde bouwdelen met dakvlakken: schip, zuidelijk zijschip, koor met veelhoekige sluiting, aanbouw, westtoren en dakruiter. De toren en ruiter zijn voor een stabiele print massief; ramen en galmgaten zijn ondiepe nissen. GLB-coördinaten zijn meters; de STL meet 37,9 × 17,6 × 36,3 mm op 1:1000, inclusief 0,5 mm fundering onder maaiveld. De bovenzijde van de spits is 0,9 mm breed. Manifold rapporteert één samenhangend, gesloten deel met genus 0. Het script controleert neerwaartse overhang; de webshoptest controleert plaatsing en steunvolume en verschillende doorsneden.

## Bronnen en plaatsing

- [Rijksmonumentenregister 13271](https://monumentenregister.cultureelerfgoed.nl/monumenten/13271).
- [3DBAG pand 1581100000010503](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1581100000010503): contour, dakvlakken en maaiveld NAP +7,51 m; nok schip NAP +21,69 m. De gereconstrueerde spits is onvolledig.
- AHN DSM 0,5 m: plaatselijke hoogste torenmeting NAP +43,3 m, circa 35,8 m boven maaiveld.
- [Wikimedia Commons, Nederlands Hervormde Kerk Doorn](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Doorn): noord-, zuidwest- en zuidoostaanzichten en RCE-opnamen; controle van toren, ruiter, koor en ramen.
- PDOK 3D Basisvoorziening: reconstructie ter vergelijking en vervanging van het ene BAG-pand. Naburige dakvlakken zijn steekproefsgewijs lokaal vergeleken met de AHN; geen stelselmatig te hoge aangrenzende kolom vastgesteld. Negatieve verschillen bevatten tevens wanden, grond en begroeiing.

Oorsprong RD (152101, 449427), X-as (0,998198, 0,06), naar het oosten langs het schip; basis -0,5 m. Controleer de plaatsing op de [kaart](http://localhost:3000/kaart/52.03317/5.34495/200/1x1/0).

## Geschat en vereenvoudigd

De metselwerkhoogte en de vorm van de overgang naar de spits, hoogte en breedte van de dakruiter, raam- en galmgatafmetingen en de details van de aanbouw zijn naar foto's en beschikbare dakpunten geschat. De top van de spits is voor de print afgeplat en de open dakruiter is massief uitgevoerd. De wijzerplaten zijn wegens de schaal weggelaten. Foto's en AHN zijn geen maatvaste gevelopmetingen; controleer vooral de dakruiter, torenspits en aansluiting van het zuidelijke zijschip.

Generator: `node scripts/generate-maartenskerk-doorn.mjs --components`.
