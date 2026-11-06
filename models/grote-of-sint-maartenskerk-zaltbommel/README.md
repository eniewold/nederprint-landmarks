# Grote of Sint-Maartenskerk (Zaltbommel)

Gesloten model van kerk en stompe toren voor de kaart en voor print op 1:1000.

## Bestanden

- `grote-of-sint-maartenskerk-zaltbommel.glb`: catalogusmodel in meters met één node `building:kerk`.
- `grote-of-sint-maartenskerk-zaltbommel.json`: plaatsing en vervanging van BAG-pand `0297100000003841`.
- `grote-of-sint-maartenskerk-zaltbommel-1-1000.stl`: Z omhoog, millimeters, 78 × 41,7 × 66,4 mm.
- Reproduceer met `node scripts/generate-grote-of-sint-maartenskerk-zaltbommel.mjs`.

## Positie en onderdelen

De oorsprong is RD (145711, 424837) op maaiveld; +X loopt in richting 23° naar het koor. De onderkant ligt op -0,5 m. Vijf meetpunten rond het gebouw bepalen de terreinhoogte. AHN DTM geeft op deze punten ongeveer NAP +5,5 tot +5,9 m. Kerk en toren vervangen samen één BAG-pand.

Het model bevat het middenschip met zadeldak, de zijbeuken onder lange lessenaarsdaken, de veelhoekige koorsluiting, de zuidelijke kooraanbouw en kapel, het noordportaal, een traptoren, steunberen en pinakels. De westtoren heeft een vlakke bekroning en vier hoekpinakels: de historische spits is niet meer aanwezig. Vensters en ingangen zijn als blinde spitsboognissen uitgevoerd. Alle schuine daken zijn opgebouwd uit dakvlakken; het gebouw vormt één gesloten volume.

## Geschat en weggelaten

De hoofdlijnen van de plattegrond, de dakrichtingen en hoogtes volgen BAG en 3D BAG; het maaiveld en de maximumhoogte zijn getoetst aan AHN. De precieze vormen en afmetingen van pinakels, steunberen, vensternissen, portalen, kapellen en de traptoren zijn uit foto's vereenvoudigd en deels geschat. Gevelmaaswerk, klokken, ornamenten en overige onderdelen kleiner dan 0,9 m zijn weggelaten; openingen zijn voor de schaal als blinde nissen uitgevoerd.

## Controle

De generator controleert geslotenheid, de Float32-rondgang en naar beneden gerichte vlakken boven de voet. Het volume is één component met genus 0. Een lokale 1:1000-test van de exportondersteuning gaf geen merkbare volumetoename en vrijwel gelijke doorsneden. Een uitsnede van 150 × 150 m is met en zonder landmark geëxporteerd; de vier schuine aanzichten zijn vergeleken met PDOK en bronfoto's.

## Bronnen

- [3D BAG LoD2.2, pand 0297100000003841](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0297100000003841).
- [AHN DSM en DTM, PDOK WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0).
- [Bouw- en cultuurhistorisch onderzoek Sint-Maartenskerk](https://www.griffie.media/uploads/2FCA5C6A-8384-B727-6B20-0D3165FB946D/documenten/21861/Bouwhistorisch%20onderzoek%20St.%20Maartenskerk.pdf).
- [Foto's van de buitenzijde, Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Exterior_Sint_Maartenskerk_Zaltbommel).
