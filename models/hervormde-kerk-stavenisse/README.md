# Hervormde Kerk Stavenisse

T-vormig kerkgebouw met westtoren, achtkantige lantaarn en lagere oostelijke kapel. De kerk en toren vormen BAG-pand `0716100000283519` en zijn als één gesloten volume gemodelleerd. De houten lantaarn heeft een stevige kern met blinde nissen om op 1:1000 te kunnen printen.

## Bronnen en schattingen

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0716100000283519): BAG-contour en dakvlakken van de kerk.
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld circa 1,05 m NAP, schipnok 15,61 m NAP en hoogste torenmeting 24,29 m NAP.
- [Rijksmonument 35407](https://monumentenregister.cultureelerfgoed.nl/monumenten/35407) en [geschiedenis van het kerkgebouw](https://www.hervormdstavenisse.nl/geschiedenis/kerkgebouw): het T-vormige kerkgebouw dateert uit 1910–1911, de behouden toren uit 1672; het BAG-bouwjaar 1623 verwijst naar de voorgaande kerk.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Hervormde_kerk,_Stavenisse): foto's van kerk, toren en kapel.

De hoogtes en vormen van de bovenste lantaarn en bol zijn geschat uit AHN en foto's, met de top op 24 m boven maaiveld. De houten lantaarn is gesloten uitgevoerd met ingesneden vensternissen; dit benadert het open origineel zonder dunne zuilen of leuningen. Steunberen, gevelnissen en kapel zijn vereenvoudigd, en kruis en weerhaan zijn weggelaten. Oorsprong RD (59708,65; 400602,27), x-as (0,9798; -0,2). Onderzijde zakt 0,5 m in de terreinplaat.

## Productie en controle

`node scripts/generate-hervormde-kerk-stavenisse.mjs` genereert GLB, JSON en STL's op 1:100 en 1:1000. De gerichte test in `tests/landmark-models.test.ts` controleert plaatsing, één gesloten volume en een 45-graden ondersteuningstoets. De vier richtingen zijn vergeleken met PDOK en schuine foto's; de fijnmazige lantaarn ontbreekt grotendeels in PDOK.

De kaart en preview-export van de volledige uitsnede zijn gecontroleerd.
