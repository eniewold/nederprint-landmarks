# Voormalige Hervormde Kerk (Overasselt)

Het huidige gebouw aan Valkstraat 7 is het vijftiende-eeuwse koor van de voormalige Sint-Antonius Abtkerk. Het schip verdween in 1710; in 1908 kreeg de westgevel een open klokkengevel. Het model toont de huidige toestand, dus zonder de verdwenen toren en het verdwenen schip.

## Bestanden

- `voormalige-hervormde-kerk-overasselt.glb`: model in meters voor de kaart.
- `voormalige-hervormde-kerk-overasselt.json`: catalogusgegevens en bronverwijzingen.
- `voormalige-hervormde-kerk-overasselt-1-1000.stl` en `voormalige-hervormde-kerk-overasselt-1-100.stl`: binaire printmodellen in millimeters.
- Generator: `scripts/generate-voormalige-hervormde-kerk-overasselt.mjs`.

## Ligging en vorm

De oorsprong ligt in het midden van de westgevel, RD (182983,284; 419085,3105), lokale +X wijst naar de driezijdige koorsluiting met richting (0,971222; -0,238176). Het model vervangt BAG-pand 0252100000018390. Het maaiveld is NAP +10,391 m; het model loopt 0,5 m door onder maaiveld. De plattegrond, dakrichting en hoogtes komen uit de 3DBAG en zijn getoetst aan het AHN DSM: de nok ligt rond NAP +27,26 m, circa 16,87 m boven maaiveld. Het hoofdgebouw met steunberen is circa 12,15 bij 11,12 m.

Het dak is uit twee hellende hoofdvlakken en een schuin sluitingsvlak opgebouwd. Steunberen, de geprofileerde westgevel, de spitsboogvensters en de drie openingen van de klokkengevel zijn vereenvoudigd naar de foto's. De kleine open klokkenstoel is als ondiepe nissen met een verdikte uitkraging weergegeven voor printbaarheid; de klok en zijn dunne staanders, goten, glasverdeling en hekwerk zijn weggelaten. De exacte nisdiepte, afmetingen van de steunberen en de vorm van de klokkengevel zijn geschat.

## Controle

De generator controleert een vlakke voet en één gesloten manifold. De test controleert de plaatsing, BAG-vervanging, samenhang en de invloed van overhangopvulling op het volume en op doorsneden voor 1:1000. Twee volledige uitsneden met en zonder landmark zijn geëxporteerd en vanuit vier hoeken vergeleken met de bestaande PDOK-reconstructie en foto's. Controleer op de kaart vooral de positie van het koor, de sluiting en de klokkengevel.

## Bronnen

- [3DBAG pand 0252100000018390](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0252100000018390): contour, maaiveld en dakvlakken.
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0): DSM 0,5 m voor dakhoogten.
- [Rijksmonumentenregister 32125](https://monumentenregister.cultureelerfgoed.nl/monumenten/32125): resterend koor met twee traveeën en driezijdige sluiting.
- [Nijmeegs archief](https://studiezaal.nijmegen.nl/detail.php?id=2126479088): beschrijving van de resterende kerk.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Overasselt): foto's van alle gevels.
