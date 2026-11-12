# Jacobuskerk Renesse

Eenbeukige kerk aan de Lange Reke met zadeldak, aanbouw aan de oostzijde, westtoren en achtkantige traptoren. Het model vervangt de aangrenzende BAG-panden `1676100000440194` en `1676100000440182` samen. De bouwdelen zijn als één gesloten printbaar volume uitgevoerd, met steunberen en ondiepe spitsboognissen.

## Bronnen en interpretatie

- [3DBAG kerk](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1676100000440194) en [3DBAG toren](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1676100000440182): positie, omtrek en kerkdak; de torenspits wordt door de reconstructie afgesneden.
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld circa 3,8 m NAP, schipnok circa 22,3 m NAP en hoogste torenmeting circa 34 m NAP.
- [Schuine foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint_Jacobus_(Renesse)) en [torenfoto's](https://commons.wikimedia.org/wiki/Category:Tower_of_Jacobuskerk,_Renesse): hoofdvorm, gevelindeling en karakteristieke traptoren.
- [Monumenten in Nederland: Renesse](https://www.dbnl.org/tekst/sten009monu09_01/sten009monu09_01_0079.php): historische beschrijving.

De spits is geschat op 30,2 m boven maaiveld op basis van hoogste AHN-punten en foto's; de doorsnede van de top is voor 1:1000 vergroot tot 0,9 mm. Afmetingen van nissen, steunberen, traptoren en entree zijn op basis van foto's vereenvoudigd en geschat; ornamenten en kruis zijn te fijn voor deze schaal. De oorsprong is RD (43603,7; 417209,33), lokale x-as (0,9954; 0,0958). De onderkant zakt 0,5 m in de terreinplaat.

## Productie en controle

`node scripts/generate-jacobuskerk-renesse.mjs` genereert GLB, JSON en STL's op 1:100 en 1:1000. De gerichte test in `tests/landmark-models.test.ts` controleert plaatsing, één gesloten volume en de benadering van 45-graden ondersteuning. De vier zijden zijn vergeleken met PDOK-gebouwreconstructie en schuine foto's; de hoofdspits ontbreekt gedeeltelijk in PDOK en is met AHN en foto's aangevuld.

De kaart en preview-export van de volledige uitsnede zijn gecontroleerd.
