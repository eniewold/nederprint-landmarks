# Oude Kerk of Kluntjespot Haarlo

Landmark voor de achthoekige Oude Kerk uit 1858, BAG-pand `1859100000780933`. De centraalbouw heeft acht gevels, een achthoekig tentdak, hoekpilasters, een schoorsteen en een dakruiter. De deuren, galmgaten en spitsboogvensters zijn als ondiepe nissen weergegeven.

## Bronnen en schattingen

- [3DBAG-pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1859100000780933): achthoekige omtrek en maaiveld NAP +18,568 m.
- [AHN DSM via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): dakruiter circa NAP +36,2 m, ongeveer 17,6 m boven maaiveld; omringende bomen zijn buiten beschouwing gelaten.
- [Rijksmonumentenregister 516436](https://monumentenregister.cultureelerfgoed.nl/monumenten/516436) beschrijft vier grote vensters, drie vensters in de voorgevel, twee deuren en de blinde achtergevel.
- [Beheerder: gebouw](https://kluntjespot.nl/gebouw/), [buitenpanorama's](https://www.geldersekerken.nl/filmpjes/Haarlo/index.html) en [schuine bronfoto](https://achterhoek.nl/Kerk-de-Kluntjespot-Haarlo).

De plaatsing van voorgevel en schoorsteen, de goothoogte, helling van het tentdak en afmetingen van de dakruiter en nissen zijn geschat uit de BAG, AHN, foto's en monumentomschrijving. De raamtracering en de windvaan zijn weggelaten; de dunne dakruiterdetails zijn verbreed voor een 1:1000-print.

## Controle

De generator maakt één gesloten volume met vlakke voet. De test in `tests/landmark-models.test.ts` controleert catalogusplaatsing, mesh en printbaarheid zonder extra steun op schaal 1:1000. Een uitsnede van 150 × 150 m is met en zonder landmark als preview en 3MF geëxporteerd en vanuit vier gelijke richtingen naast de PDOK-reconstructie, foto's en buitenpanorama's vergeleken.

Controleer op [de kaart](http://localhost:3000/kaart/52.11120/6.58152/200/1x1/0) de plaatsing en oriëntatie van de voorgevel.
