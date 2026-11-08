# Protestantse Gemeente Velp (Grote Kerk)

De Grote Kerk aan Kerkstraat 32 is een neoclassicistische Waterstaatskerk, gebouwd in 1839–1841. De kerk heeft een T-vormige plattegrond en een rijk versierde ingang; aan de achterzijde ligt de halfronde moderne aanbouw het Rondeel. Dit gebouw heeft geen toren: de Oude Jan is een andere kerk van dezelfde gemeente.

## Bestanden

- `protestantse-gemeente-velp.glb`: model in meters voor de kaart.
- `protestantse-gemeente-velp.json`: catalogusgegevens en bronnen.
- `protestantse-gemeente-velp-1-1000.stl`: printmodel in millimeters op schaal 1:1000.
- Generator: `scripts/generate-protestantse-gemeente-velp.mjs`.

## Ligging en model

De oorsprong ligt bij het midden van de kerk op RD (195666; 445059), de lokale +X-as wijst naar de hoofdgevel met richting (0,915857; 0,401505). Het maaiveld is circa NAP +14,317 m, met een vlakke modelvoet 0,5 m daaronder. Het model vervangt BAG-pand 0275100000008585 en omvat de kerk en het Rondeel. De totale omhulling is circa 38,2 bij 32 m. De BAG-contour en het AHN bepalen ligging en dakhoogten; de nok van de kerk ligt rond NAP +28,3 m. Het pand heeft geen AHN5-dekking volgens de 3DBAG, maar de beschikbare PDOK-DSM-uitsnede en de AHN4-reconstructie bevatten voldoende metingen. Het Rondeel heeft volgens de DSM een naar buiten aflopend rond dak, gemodelleerd als een omwentelingsprofiel, met een open binnenruimte.

De vleugels hebben afzonderlijke schilddaken. Het fronton, de kolommen, klokgevel, vensternissen en de gevel van het Rondeel zijn vereenvoudigd en op foto's geschat. Ornamenten, dun smeedwerk en de dunne zonnepanelen zijn op 1:1000 weggelaten.

## Controle

De generator controleert een vlakke voet en één gesloten manifold. Genus 1 is hier bewust: kerk en Rondeel omsluiten een open binnenruimte. De catalogustest controleert plaatsing, BAG-vervanging, de open ruimte en de verandering door overhangopvulling op 1:1000 met volume en doorsneden. Een volledige uitsnede is met en zonder landmark geëxporteerd en vanuit vier richtingen vergeleken met de PDOK-reconstructie en voor-, zij- en achteraanzichten. Controleer op de kaart vooral de hoofdgevel, het Rondeel en het open binnenterrein.

## Bronnen

- [3DBAG pand 0275100000008585](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0275100000008585): contour, hoogte en dakvlakken.
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0): DSM 0,5 m voor kerk en Rondeel.
- [Rijksmonument 504520](https://www.monumenten.nl/monument/504520): gebouw en architectuur.
- [GeschiedenisExtra](https://www.geschiedenisextra.nl/velp/gebouw/nhkerkkerkstr.htm): zij- en achtergevel.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Waterstaatskerk_(Velp)): voorgevels.
