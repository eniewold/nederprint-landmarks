# De Kapel (Witte kerk), Boelenslaan

Witgepleisterde, torenloze kapel met zadeldak en lagere achterbouw. Het model vervangt BAG-pand 0059100000834625. De BAG-omtrek omvat circa 182 m² en de nok ligt circa 6,68 m boven maaiveld; daarmee voldoet het pand niet aan de afvalsgrens van minder dan circa 6 m of 40 m².

## Bronnen en metingen

- [BAG en 3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0059100000834625): grondvorm, maaiveld NAP +3,681 m en nok NAP +10,363 m.
- [AHN DSM](https://service.pdok.nl/rws/ahn/wcs/v1_0): nok en achterbouwen; 3DBAG gebruikt AHN5 2023 met 0,28% ontbrekende cellen.
- [Schuin exterieurbeeld](https://gereformeerdekerken.info/2016/01/01/het-ontstaan-van-de-voortgezette-gereformeerde-kerken-in-nederland-vgkn/): gevel, dak en vensters.
- [Kerk & Orgel](https://www.kerk-en-orgel.nl/record.php?action=display_ordered&id=18829): gebouwd in 1905 als hervormde evangelisatiekapel.

## Model en schattingen

Kerkzaal en achterbouw zijn afzonderlijke dakvormen uit vlakken; samen vormen zij één gesloten volume. De vierzijdige vergelijking met PDOK en de schuine foto toont de hoofdvorm en achterbouw. Gevel- en raamdetails zijn geschat; de ronde opening boven de voordeur is als kleine nis met schuine bovenzijde benaderd om steunvrij te blijven. Het hek en dunne sierdetails zijn weggelaten. De 1:1000-STL heeft geen neerwaartse vlakken steiler dan 45° boven het grondvlak.

- `de-kapel-witte-kerk-boelenslaan.glb`: kaartmodel
- `de-kapel-witte-kerk-boelenslaan.json`: catalogus en plaatsing
- `de-kapel-witte-kerk-boelenslaan-1-100.stl`: printmodel 1:100
- `de-kapel-witte-kerk-boelenslaan-1-1000.stl`: printmodel 1:1000

Bron: `scripts/generate-de-kapel-witte-kerk-boelenslaan.mjs`. Genereer beide schalen met `--scale 1000` en `--scale 100`.

De kaart is in perspectief gecontroleerd en de preview bevat de volledige kerk op 1:1000 zonder ondersteuning.
