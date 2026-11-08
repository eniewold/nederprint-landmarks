# Sint-Remigiuskerk (Steenderen)

De Remigiuskerk is een laatgotische pseudobasiliek met een breed driebeukig schip, een veelhoekig koor en een zware westtoren. Na een brand in 1782 is de kerk hersteld; de huidige torenspits dateert uit die herbouw.

## Bestanden

- `sint-remigiuskerk-steenderen.glb`: gesloten model in meters voor de kaart.
- `sint-remigiuskerk-steenderen.json`: catalogusgegevens en bronverwijzingen.
- `sint-remigiuskerk-steenderen-1-1000.stl`: printmodel in millimeters op schaal 1:1000.
- Generator: `scripts/generate-sint-remigiuskerk-steenderen.mjs`.

## Ligging en model

De oorsprong ligt in de toren op RD (209849,4; 453024,3), de lokale +X-as loopt naar het koor met richting (0,994597; 0,103815). Het maaiveld is circa NAP +10,293 m en de vlakke modelvoet ligt 0,5 m daaronder. Het model vervangt BAG-pand 1876100000016632 en omvat schip, koor en toren; het meet inclusief steunberen circa 49,1 bij 22,3 m. De footprint en de dakvlakken komen uit de 3DBAG, de hoogtemeting uit het AHN-DSM. De DSM-uitsnede bevat geldige punten op de spits tot circa NAP +52,35 m; het model reikt circa 42,06 m boven maaiveld. De 3DBAG-informatie geeft AHN4 als bron, want AHN5 heeft voor dit pand geen dekking; de beschikbare PDOK-DSM-uitsnede is apart gecontroleerd.

Het brede zadeldak, het lagere veelhoekige koor, de toren en de overgang van vierkant naar achtkantige spits zijn als aparte bouwdelen en dakvlakken gemodelleerd. Steunberen, venster- en galmgatnissen en de wijzerplaten zijn vereenvoudigd naar foto's geschat. Het dunne kruis, de wijzers, glazen raamtraceringen en klein metselwerk zijn op 1:1000 weggelaten; de spits is bovenaan voor printbaarheid verbreed.

## Controle

De generator controleert een vlakke voet en één gesloten manifold. De catalogustest controleert plaatsing, BAG-vervanging en volume en doorsneden na overhangopvulling op 1:1000. Een volledige uitsnede is met en zonder landmark geëxporteerd en vanuit vier hoeken met de PDOK-reconstructie en foto's vergeleken. Controleer op de kaart vooral de koorsluiting, de plaatsing rond het maaiveld en de brede toren met spits.

## Bronnen

- [3DBAG pand 1876100000016632](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1876100000016632): contour, hoogte en dakvlakken.
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0): DSM 0,5 m voor de dakvorm en torenspits.
- [Rijksmonumentenregister 34521](https://monumentenregister.cultureelerfgoed.nl/monumenten/34521): monumentbeschrijving.
- [Monumenten in Nederland, Gelderland](https://www.dbnl.org/tekst/sten009monu05_01/sten009monu05_01_0191.php): bouwvorm.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Remigiuskerk,_Steenderen): gevels en torenvorm.
