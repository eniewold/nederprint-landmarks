# Sint-Pieterskerk Tricht

Model van de Sint-Pieterskerk aan Kerkstraat 6 te Tricht, met laatmiddeleeuwse toren en driebeukig schip. Kerk en toren zijn afzonderlijke rijksmonumenten 16521 en 16522 maar vormen samen BAG-pand 0236100000020884. De huidige toren heeft een vierzijdig tentdak; de eerdere achtkante spits is in 1971 vervangen.

## Bronnen en maatvoering

- [Monumentenregister kerk](https://monumentenregister.cultureelerfgoed.nl/monumenten/16521) en [toren](https://monumentenregister.cultureelerfgoed.nl/monumenten/16522), [bouwgeschiedenis van de gemeente](https://maranatha-tricht.nl/historie-van-het-kerkgebouw/) en [historische toelichting](https://www.hetkontakt.nl/westbetuwe/nieuws/433894/lesje-geschiedenis-van-rooms-naar-reformatorische-kerk-in-tricht).
- [Wikimedia Commons: foto's van de kerk](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Tricht).
- BAG voor de grondvlakken, 3DBAG LoD2.2 voor de kapvlakken en AHN DSM voor hoogtecontrole. Maaiveld circa NAP +4,10 m; nok schip en koor circa 17,6 m boven maaiveld. De hoogste AHN-piek ligt op NAP +32,51 m, waarschijnlijk inclusief bekroning; omliggende dakvlakmetingen liggen rond NAP +30,6–30,9 m en ondersteunen een torendakpunt circa 26,8 m boven maaiveld. Het torenraster bevat 116 geldige en 51 lege cellen, maar de piramidevlakken zijn uit de beschikbare punten en foto's te reconstrueren.

Het model omvat het gemeenschappelijke schipdak, het driezijdig koor, toren, doopkapel, sacristie, steunberen, schoorsteen en blinde vensternissen. Exacte maten van vensters, torennissen, steunberen, kapellen en schoorsteen zijn geschat uit foto's en 3DBAG. De dakpunt is verbreed voor afdruk op 1:1000; windvaan, wijzerplaat, leienpatroon en klein venstermaaswerk zijn weggelaten. De voetafdruk bedraagt circa 39,5 bij 17,7 m.

## Productie en controle

Het model is één gesloten volume en bedoeld voor afdruk op 1:1000 zonder steunmateriaal. Maak GLB, JSON en STL opnieuw met `node scripts/generate-sint-pieterskerk-tricht.mjs` in de landmarks-repository. De webshop bevat een plaatsings- en printtest in `tests/landmark-models.test.ts`. Een uitsnede van 150 bij 150 m is geëxporteerd en vier aanzichten zijn naast de PDOK-reconstructie en foto's gelegd. Controleer de ligging via [de kaart](http://localhost:3000/kaart/51.88929/5.27039/200/1x1/0).
