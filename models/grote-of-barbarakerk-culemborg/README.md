# Grote of Barbarakerk (Culemborg)

Landmarkmodel van de protestantse Barbarakerk te Culemborg. De westtoren is stomp; de vroegere spits verdween na de brand in 1654.

## Bestanden en plaatsing

- `grote-of-barbarakerk-culemborg.glb`: gesloten model in meters, glTF met Y omhoog.
- `grote-of-barbarakerk-culemborg.json`: plaatsing, bronnen en overige metadata.
- `grote-of-barbarakerk-culemborg-1-1000.stl`: print op 1:1000.
- Generator: `scripts/generate-grote-of-barbarakerk-culemborg.mjs`.

De oorsprong ligt op RD (143933, 441024); lokale +X loopt 25,4° noord van oost langs het schip. Het model vervangt BAG-pand `0216100000002246`; het ondervlak ligt 0,5 m onder het lokale maaiveld.

## Onderdelen en aannames

Het model omvat het schip met zadeldak, zijbeuken, noord- en zuidtransept, vijfzijdig koor en lagere kooromgang, sacristie, traptoren, steunberen, vensternissen en de vierkante westtoren met blinde spitsboogvelden, galmgaten en gestileerde wijzerplaten. De dakvlakken zijn uit 3D BAG LoD2.2 afgeleid; de torenhoogte is uit het AHN en 3D BAG afgeleid. Het maaiveld is ongeveer NAP +4,95 m.

De exacte steunberen, portalen, vensternissen, sacristie, traptoren en torengeledingen zijn geschat op basis van foto's en BAG-data. Maaswerk, de open rand boven op de toren en kleine geveldetails onder 0,9 m zijn weggelaten; de wijzerplaten en galmgaten zijn als blinde nissen vereenvoudigd voor de steunloze print. De geveldetails zijn vergeleken met foto's; de aansluiting op het terrein is op de kaart en in de preview bekeken.

## Controle

De generator controleert gesloten manifold, rondgang via Float32 en neerwaartse vlakken. De proefexport is één aangesloten volume met status `NoError`, genus 0 en afmetingen 60,8 × 49,6 × 36,0 mm op 1:1000. Een tijdelijke catalogus- en 45-gradenproef en 1:1000-exports van een volledige uitsnede met en zonder landmark zijn geslaagd. De geometrie is vanuit vier gelijke richtingen vergeleken met PDOK en foto's; ook de kaart en de volledige 1:1000-preview zijn bekeken.

## Bronnen

- [3D BAG, pand 0216100000002246](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0216100000002246): dakvlakken, omtrek en maaiveld.
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0): DSM 0,5 m.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Grote_of_Sint-Barbarakerk_(Culemborg)): gevels, toren en koor.
- [Wikipedia](https://nl.wikipedia.org/wiki/Grote_of_Sint-Barbarakerk_(Culemborg)): geschiedenis en identificatie.
