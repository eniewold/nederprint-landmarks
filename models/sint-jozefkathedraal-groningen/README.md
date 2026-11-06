# Sint-Jozefkathedraal (Groningen)

Gesloten, steunloos model van de kathedraal en de zeskantige Dronkemanstoren, voor de kaart en print op 1:1000.

## Bestanden

- `sint-jozefkathedraal-groningen.glb`: catalogusmodel in meters, één node `building:kathedraal`.
- `sint-jozefkathedraal-groningen.json`: plaatsing en vervanging van BAG-pand `0014100010941689`.
- `sint-jozefkathedraal-groningen-1-1000.stl`: Z omhoog, millimeters, circa 54,6 × 32,2 × 76,5 mm.
- Genereren: `node scripts/generate-sint-jozefkathedraal-groningen.mjs`.

## Plaatsing en opbouw

Oorsprong RD (234201, 581571), +X langs het schip naar het koor, 126° vanaf RD-X, +Y loodrecht daarop. De onderzijde ligt 0,5 m onder het maaiveld; AHN DTM rond de kerk is circa NAP +4,6 tot +5,1 m. De 3D BAG geeft voor het hoofddak een nok van NAP +31,8 m en een dakhelling van circa 60°. De totale torenhoogte van circa 76 m komt uit literatuur; de dunne bekroning wordt door AHN niet volledig geraakt.

Bouwdelen: middenschip met zadeldak en vijfzijdige koorsluiting, twee zijbeuken met lessenaarsdaken, kapellen en aanbouw, steunberen, dakvensters en een dakruiter. De zeshoekige toren naast de voorgevel en de taps toelopende bekroning zijn opgebouwd uit polygonale volumes; vensters en galmgaten zijn blinde spitsboognissen. De luchtbogen boven de zijbeuken zijn voor de print gevuld.

## Geschat en weggelaten

De kapelvormen en -hoogten, dakvensters, dakruiter, nissen en steunberen zijn op grond van foto's vereenvoudigd en deels geschat. De karakteristieke open ijzeren spits is als verdikt, taps gesloten volume met nissen weergegeven; de afzonderlijke dunne spijlen, uurwerken, ornamenten, kruis en windvaan zijn weggelaten omdat ze op 1:1000 te klein of steunbehoevend zijn. Het model heeft daardoor een grovere spits dan het monument.

## Controle

De generator controleert de geslotenheid, Float32-rondgang en naar beneden gerichte vlakken; het resultaat heeft één component en genus 0. Een 1:1000-test van de steunopvulling gaf praktisch hetzelfde volume en gelijke doorsneden. Een uitsnede van 150 × 150 m is met en zonder landmark geëxporteerd en vanuit vier hoeken naast de PDOK-reconstructie en foto's bekeken.

## Bronnen

- [3D BAG LoD2.2, pand 0014100010941689](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0014100010941689).
- [AHN DSM en DTM, PDOK WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0).
- [Rijksdienst voor het Cultureel Erfgoed: Sint-Jozefkathedraal](https://kennis.cultureelerfgoed.nl/index.php/Monumenten/18669).
- [Foto's van de Sint-Jozefkathedraal, Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Jozefkathedraal,_Groningen).
- [Sint-Jozefkathedraal, Wikipedia](https://nl.wikipedia.org/wiki/Sint-Jozefkathedraal_(Groningen)).
