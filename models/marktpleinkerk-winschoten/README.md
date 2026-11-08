# Marktpleinkerk en d’Olle Witte (Winschoten)

Dit model bevat de langgerekte Marktpleinkerk met zadeldak, dakkapellen, venster- en gevelnissen en de vrijstaande klokkentoren d’Olle Witte met vierkante schacht, achtzijdige klokkenverdieping en bekroning. Beide zijn aparte GLB-nodes; de tussenruimte blijft open op de kaart.

De oorsprong is RD (265556, 574127) met X-as (0,9906; 0,1368) langs het schip. BAG-panden 1895100000007017 (kerk) en 1895100000006739 (toren) worden vervangen. GLB en JSON gebruiken meters; de losse STL en de verbindende grondplaat-STL zijn op 1:1000 in millimeters.

## Bronnen en onzekerheid

- [3DBAG kerk](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1895100000007017) en [toren](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1895100000006739): contouren en dakgegevens; maaiveld respectievelijk NAP +2,709 m en +2,976 m. Gezamenlijk modelmaaiveld +2,85 m is een benadering.
- [AHN4 DSM](https://service.pdok.nl/rws/ahn/wcs/v1_0): op de torenas hoogste cel NAP +46,00 m, daarnaast +45,21 en +44,94 m; een grotere aaneengesloten omgeving ligt rond +43,9–44,3 m. Dat is circa 41 m boven het torenmaaiveld. De hoogste cel kan de topdecoratie betreffen; de meting ligt op de toren en niet op de naastgelegen boom.
- [Open Monumentendag Oldambt](https://www.openmonumentendag.nl/wp-content/uploads/2019/01/Brochure_afdrukversie.pdf) noemt de toren 41 m hoog, zonder aan te geven of de topdecoratie meetelt. De dakbekroning van het model is daarom benaderd op 41 m; de hoogte van de weggelaten ornamenten blijft onzeker.
- [Rijksmonument kerk 39011](https://monumentenregister.cultureelerfgoed.nl/monumenten/39011), [toren 39012](https://monumentenregister.cultureelerfgoed.nl/monumenten/39012), en foto's van [kerk](https://commons.wikimedia.org/wiki/File:Kerk_marktplein_Winschoten.JPG) en [toren](https://commons.wikimedia.org/wiki/File:Hervormde_kerk,_vrijstaande_toren_-_1.jpg).

De dakruiterverhoudingen, nissen, dakkapellen en gevelverdeling zijn geschat uit foto's en hoogtegegevens. De open balustrades, kleine lamellen en dunne windvaan zijn voor printbaarheid weggelaten of gesloten vereenvoudigd. De toren ligt tussen bestaande winkelpanden die afzonderlijk in PDOK blijven staan.

## Controle

Beide onderdelen zijn afzonderlijk gesloten en hebben vlakke voeten; hun catalogusplaatsing en steuncontrole op 1:1000 zijn getest. Er zijn exports met en zonder landmark van een uitsnede van 150 × 150 m gemaakt en vier aanzichten met PDOK en foto's vergeleken.

Controlekaart: http://localhost:3000/kaart/53.14249/7.03981/200/1x1/0
