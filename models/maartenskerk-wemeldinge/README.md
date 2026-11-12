# Maartenskerk Wemeldinge

Tweebeukige kerk met twee parallelle langskappen, vijfzijdig gesloten koor en oudere westtoren. Toren en kerk zijn in BAG-pand `0678100000007555` opgenomen en zijn één gesloten modelvolume.

## Bronnen en schattingen

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0678100000007555): BAG-omtrek, beide langskappen en koor. De 3DBAG-reconstructie mist het grootste deel van de torenspits.
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld bij de toren circa 1,85 m NAP, schipnok circa 19,5 m NAP en hoogste torenmeting 39,9 m NAP.
- [Rijksmonument kerk](https://monumentenregister.cultureelerfgoed.nl/monumenten/23507), [rijksmonument toren](https://monumentenregister.cultureelerfgoed.nl/monumenten/23508) en [bouwgeschiedenis](https://de.wikipedia.org/wiki/Maartenskerk_(Wemeldinge)): oudere veertiende-eeuwse toren, vijftiende-eeuws schip en jongere zuidbeuk.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint_Maarten_(Wemeldinge)): foto's van gevels, koor en toren.

De slanke achtzijdige spits is op 38,05 m boven plaatselijk maaiveld geschat naar AHN en foto's; de top is 0,96 mm op schaal 1:1000. De hoekberen, vensters en galmgaten zijn naar foto's vereenvoudigd. Dunne windvaan en maaswerk zijn weggelaten. Oorsprong RD (57626,8; 392863,1), x-as (0,95; 0,3122); onderzijde zakt 0,5 m in de terreinplaat.

## Productie en controle

`node scripts/generate-maartenskerk-wemeldinge.mjs` genereert GLB, JSON en STL's op 1:100 en 1:1000. De gerichte test in `tests/landmark-models.test.ts` controleert plaatsing, één gesloten volume en de benadering van 45-graden ondersteuning. De vier zijden zijn vergeleken met PDOK en schuine foto's.

De kaart en preview-export van de volledige uitsnede zijn gecontroleerd.
