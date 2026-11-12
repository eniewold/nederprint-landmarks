# Sint-Gerulphuskerk Vogelwaarde

Neogotische pseudobasiliek met langskap, driezijdige koorsluiting en half ingebouwde toren met frontalen en naaldspits. Kerk en toren zijn samen BAG-pand `0677100000597789` en vormen één gesloten volume.

## Bronnen en schattingen

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0677100000597789): ligging, BAG-contour en dakvlakken van het schip. De 3DBAG-reconstructie kapt de torenspits af.
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): plaatselijk maaiveld bij de toren circa 1,7 m NAP, nok circa 17,1 m NAP en hoogste torenpunt circa 35,8 m NAP.
- [Rijksmonument 22231 en bouwgeschiedenis](https://kennis.cultureelerfgoed.nl/index.php/Monumenten/22231): gebouwd 1860–1861, na brand herbouwd in 1870.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Gerulphuskerk,_Vogelwaarde): foto's van schip, koor en toren.

De naaldspits is op 34,1 m boven plaatselijk maaiveld geschat aan de hand van AHN en foto's; de top is 0,9 mm breed op schaal 1:1000. Torenfrontalen, steunberen, sacristie, vensters en galmgaten zijn vereenvoudigd en naar de foto's geschat. Fijn maaswerk en het kruis zijn weggelaten. Oorsprong RD (57315; 371377), x-as (-0,9892; 0,1465); het model zakt 0,5 m in de terreinplaat.

## Productie en controle

`node scripts/generate-sint-gerulphuskerk-vogelwaarde.mjs` genereert GLB, JSON en STL's voor 1:100 en 1:1000. De gerichte test in `tests/landmark-models.test.ts` controleert plaatsing, één gesloten volume en de benadering van 45-graden ondersteuning. De vier richtingen zijn naast PDOK en schuine foto's gecontroleerd.

De kaart en preview-export van de volledige uitsnede zijn gecontroleerd.
