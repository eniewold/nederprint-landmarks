# Hartje New York (Eindhoven)

Vereenvoudigd, printbaar model van de woontoren Hartje New York, bij de architect E' Tower (Wiel Arets Architects, 2013), aan de Gerard Philipslaan in het Stadionkwartier naast het Philips Stadion. Het is een glazen schijf van 22 woonlagen op een begane grond, met een schuine noordwestkop. Elke laag heeft een doorlopende witte vloerrand (de gefacetteerde brise-soleils) met het glas erachter. Op de hoeken staan balkonstapels die per hoogte van plaats wisselen, en de westelijke helft van de zuidwestgevel kraagt in de bovenste lagen uit. Aan de zuidoostkop loopt een lage doorgang naar het buurgebouw van tien lagen, dat een eigen pand is en niet in het model zit.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `stadionkwartier-eindhoven.glb` | Model in meters, Y omhoog, één node: `building:stadionkwartier-eindhoven-toren` |
| `stadionkwartier-eindhoven.json` | Catalogusitem |
| `stadionkwartier-eindhoven-1-1000.stl` | Los te printen op 1:1000 (38 × 21 × 76 mm), Z omhoog |

## Oorsprong en oriëntatie

De RD-oorsprong `[160340.33, 383825.28]` ligt in het hart van de BAG-contour. De X-as loopt langs de lange gevels naar het zuidoosten (−36,83° op RD-oost; de BAG-randen zijn evenwijdig tot op 0,1°) en Y wijst naar het noordoosten. Lokaal z = 0 ligt op NAP +18,32 m, het 3D BAG-maaiveld (het AHN-DTM rondom geeft 18,25 aan de noordwestkant tot 18,9 aan de zuidwestkant). `groundHeight` is 62,25 m: het NAP-maaiveld plus de geoïde NLGEO2018 ter plekke (43,93), in overeenstemming met de PDOK-voet van het pand (62,2–62,3). `groundOffsetMetres` is −0,15.

`replacesBuildings` bevat naast de toren (`0772100001013392`) ook de parkeergarage onder het blok (`0772100001018057`, zonder verblijfsobjecten). De PDOK- en 3D BAG-reconstructie van die garage bevat de toren nog een keer, tot ellipsoïdisch 138,4 m, en zou anders door het model heen steken. Op een garage-inrit van 119 m² op NAP +22,4 na dubbelt de garage alleen panden die een eigen reconstructie hebben.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Toren | BAG-contour, 33,6 × 15,9 m, schuine noordwestkop | dak +91,85 m | BAG; 3D BAG 70e percentiel (AHN5 2024), AHN-DSM-mediaan 91,87 |
| Uitkraging zuidwestgevel | 1,1 m over de westelijke 17,4 m, vanaf de 8e woonlaag, kraag onder 45° | tot het dak | AHN-DSM en 3D BAG op het dak (v tot −8,6…−9,1); startlaag geschat |
| Liftopbouw | 4,3 × 3,7 m | +93,45 m | 3D BAG-dakvlak 93,34–93,54 |
| Balkonstapels | elf stapels van 4,3–9,3 m breed en 2,0–2,4 m diep, met per laag een open balkon | bovenste balkonranden +88,5 m; zuidoostkop lagen 7–15 tot +66,5 m | 3D BAG (88,3–88,7 en 66,4–66,7), gevelaanzicht en plattegronden van de architect, foto's |
| Doorgang zuidoostkop | 2,6 × 15,9 m | begane grond (3,3 m) | BAG-contour, plattegrond begane grond |
| Lagen | begane grond 3,3 m, 22 woonlagen van 3,12 m, dakrand 1,6 m | | gevelaanzicht van de architect |

Gevelreliëf: elke laag heeft een glasband van 0,4 m diep achter een doorlopende witte vloerrand van 0,9 m, met een plafond onder 45° (op de begane grond een plint van 0,6 m). De banden zitten alleen waar de gevel op die hoogte buitengevel is. In de balkonstapels heeft elke laag een open balkon van 0,9 m diep tussen zijschotten van 0,9 m. Onder elke stapel en onder de uitkraging loopt een kraag onder 45° terug naar de gevel.

Balkonstapels per gevel:

- Noordoostgevel, noordhoek: lagen 1–12 en 16–22.
- Noordoostgevel, oosthoek: lagen 1–6 en 16–22.
- Noordwestkop: bij de noordhoek lagen 13–15, bij de westhoek lagen 1–22.
- Zuidwestgevel: midden lagen 1–7, op de uitkraging lagen 8–22, zuidhoek lagen 1–10.
- Zuidoostkop: lagen 1–22 en daarnaast lagen 7–15.

## Geschat en weggelaten

- Naam: de hoogbouwlijst en Commons noemen de toren Hartje New York (75 m, 22 lagen, 2013, Wiel Arets). De architect en ArchDaily noemen hem E' Tower; het daar genoemde adres is Mathildelaan 85, maar het BAG-pand heeft adressen aan de Gerard Philipslaan.
- De startlaag van de uitkraging (8e woonlaag) is geschat. Dat er een uitkraging is, blijkt uit de plattegronden (eerste laag recht, 22e laag uitgebouwd) en uit de dakmeting.
- De plaats en de laagbereiken van de balkonstapels zijn geschat uit het noordoostelijke gevelaanzicht, de plattegronden van de eerste en 22e laag en foto's van drie kanten. Alleen de bovenkanten zijn gemeten.
- De hoogte van de begane grond en de diepte van de glasbanden zijn geschat. De gefacetteerde vloerranden zijn vereenvoudigd tot rechte banden.
- Weggelaten: de gevelonderhoudsinstallatie op het dak (een beweegbare kraanarm die per opname anders staat, met een voet van 2,8 × 1,6 m tot +96 m in AHN5), de glazen balkonhekken, de stijlen en de zeefdruk op het glas (allemaal kleiner dan 0,9 m), en het buurgebouw van tien lagen (pand `0772100001013393`, eigen PDOK-reconstructie op +37,2 m).

## Controle

`node scripts/generate-stadionkwartier-eindhoven.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert een test de volgende punten:

- de dakhoogte, ook boven de uitkraging;
- de liftopbouw en drie balkonstapels;
- dat de glasbanden, een open balkon en de kraag onder de uitkraging na de printcorrectie op 45° blijven, met een volumegroei van minder dan 1 %;
- één component en de plaatsing op het maaiveld.

Vier schuine aanzichten zijn naast de 3D BAG-reconstructie gelegd. De PDOK-gebouwtegels zijn uitgelezen voor de panden die het model raken.

## Bronnen

- PDOK BAG, pand `0772100001013392` (bouwjaar 2013, Gerard Philipslaan) en garage `0772100001018057`; 3D BAG LoD2.2 (TU Delft/3DGI, CC BY 4.0, AHN5 2024); AHN-DSM en -DTM 0,5 m; actuele orthoHR; PDOK 3D-gebouwtegels.
- [Lijst van hoogste gebouwen van Eindhoven](https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Eindhoven).
- [E' Tower / Wiel Arets Architects op ArchDaily](https://www.archdaily.com/445282/e-tower-wiel-arets-architects): gevelaanzicht, plattegronden en projectgegevens.
- Foto's op Wikimedia Commons (niet meegeleverd): [Woontoren Hartje New York in Eindhoven](https://commons.wikimedia.org/wiki/File:Woontoren_Hartje_New_York_in_Eindhoven.jpg), [Hartje New York](https://commons.wikimedia.org/wiki/File:Hartje_New_York.jpg), [Hartje NY, Eindhoven](https://commons.wikimedia.org/wiki/File:Hartje_NY,_Eindhoven.jpg).
