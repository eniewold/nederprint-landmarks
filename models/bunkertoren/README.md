# BunkerToren (Eindhoven)

Vereenvoudigd, printbaar model van de BunkerToren aan de John F. Kennedylaan (woontoren van 100 m, 2019–2023, Powerhouse Company), samen met de bewaarde delen van studentencentrum De Bunker (H.A. Maaskant, 1969) waarop en waarnaast hij staat. De toren heeft natuurstenen banden per verdieping met glas erachter, een 1 m bredere middenzone aan de westkant, een oostelijke erker en een getrapte zuidkant: de verdiepingen springen per laag terug langs één schuin vlak dat de zuidgevel diagonaal snijdt. Van De Bunker staan de noord- en zuidkop met hun naar buiten hellende betonnen bovengevels en de oostvleugel met een teruggezette glazen laag.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `bunkertoren.glb` | Model in meters, Y omhoog, één node `building:bunkertoren-getrapte-toren-en-koppen-van-de-bunker` |
| `bunkertoren.json` | Catalogusitem |
| `bunkertoren-1-1000.stl` | Los te printen op 1:1000 (51 × 99 × 104 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[161420.0, 384230.0]` (in de toren, ongeveer midden in de schacht). De lokale X-as staat loodrecht op de oostgevel van de toren, −11,85° op RD-oost; de oostgevel ligt op x = 12,15 m (BAG-hoekpunten op 12,150 en 12,151). Lokaal z = 0 is NAP +18,78 m (3D BAG-maaiveld van de toren). `groundSamplePoints` liggen op het plein rondom (NAP circa +18,8), `groundHeight` is 62,675 m (ellipsoïdisch), `groundOffsetMetres` −0,15.

`replacesBuildings` bevat drie panden: de toren (`0772100001025376`), De Bunker (`0772100000300142`) en de ondergrondse garage onder het plein (`0772100001047020`, bouwjaar 2022, zonder gebruiksdoel). De PDOK-reconstructies van De Bunker en de garage hebben punten van de toren meegenomen en steken als spitsen tot NAP circa +128 en +132 m boven het dak uit; het PDOK-terrein loopt onder alle drie door, dus er valt geen gat.

## Onderdelen en maten

| Onderdeel | Vorm | Hoogte (NAP) |
| --- | --- | --- |
| Schacht | zuidgevel 23,7 m, oostgevel 34,0 m, westgevel schuin (14° op de oostgevel), noordelijk deel boven De Bunker | dak +118,65 m |
| Dakopbouw | vijfhoek circa 12,5 × 19 m | +121,5 m |
| Middenzone west | 1,0 m buiten de westgevel van de schacht | +77,5 m |
| Oostelijke erker | 2,0 m uit de oostgevel, 20,8 m lang | +113,0 m |
| Getrapte zuidkant | per laag van 3,0 m 1,09 m terug langs het vlak v = −35,52 − 0,230·u + 0,3625·z(NAP); snijlijn met de zuidgevel van de schacht | +53,0 m (west) tot +69,0 m (oost) |
| Podium | zuidrand op het schuine vlak, westrand 2,5 m buiten de middenzone | +32,5 m |
| Hellende westrand van het podium | van de BAG-rand naar de podiumgevel | +27,5 tot +30,3 m |
| Begane grond toren | BAG-contour | +25,6 m |
| De Bunker, oostvleugel en rond de toren | BAG-contour; glazen laag 1,2 m terug achter een terras | terras +22,0 m, dak +25,6 m |
| Noordkop | BAG-contour, bovengevel naar buiten hellend | +26,6 m |
| Zuidkop | BAG-contour, bovengevel naar buiten hellend | +27,9 m |
| Lage delen voor de zuidkop | BAG-contour | +23,94 m (west) en +19,95 m (oost) |

Alle hoogtes en vlakken komen uit de 3D BAG LoD2.2 (AHN5, 2024): de dakvlakken en horizontale doorsneden van de panden van toren en Bunker om de 3–6 m. De getrapte zuidkant is in de 3D BAG een reeks doorsneden waarvan de zuidrand per hoogte evenwijdig verschuift (helling in plan −0,23, 0,3625 m per m hoogte); het vlak volgt die doorsneden van +32,5 tot +69 m binnen 0,2 m en gaat door de terrassen op +47,47 m. Het AHN-DSM van de PDOK-WCS is hier niet gebruikt: dat toont nog de bouwput met de oude Bunker en een kraan.

## Geschat en weggelaten

- Verdiepingen: +25,6 / +29,05 / +32,5 m en daarboven 3,0 m (de terrassen op +47,47 en +77,48 m vallen op dat raster); de bovenste laag loopt van +113,5 m tot het dak. Per laag een natuurstenen band van 1,0 m en daarboven glas 0,35 m terug; de bovenste laag houdt een dakrand van 1,0 m. Elke nis heeft meer dan 1 m materiaal achter zich.
- De getrapte zuidkant is als treden per verdieping gemodelleerd; de glazen balustrades van de terrassen zijn weggelaten (dunner dan 0,9 m). Foto's van de oostkant laten op circa +44 m nog een tweede, verder teruggelegen treereeks onder een uitkraging vermoeden; de 3D BAG (2,5D) kan dat niet bevestigen en het is niet gemodelleerd.
- De oostelijke erker (2 m, van +25,6 tot +113,0 m) komt uit de doorsneden van de 3D BAG; op foto's is hij nauwelijks als sprong te zien.
- De Bunker: de helling van de bovengevels van de koppen (dakrand op de BAG-contour, voet 2,0 m naar binnen op +21,6 m, 68–72°) is geschat uit foto's van het oude studentencentrum. De lage dakstroken van +26,0 tot +26,6 m naast de toren (minder dan 0,9 m boven het dak) en de schuine betonnen luifel voor de oostvleugel zijn weggelaten. Lintraam (+19,3 tot +20,7 m) en glazen opbouw (+22,4 tot +25,0 m) aan de oostgevel zijn nissen van 0,35 m.
- De gevel van de begane grond van de toren is een glazen pui van 0,35 m diep tot 5,8 m boven het plein. Waar De Bunker tegen de toren staat, is de torenvoet 5 cm over de gedeelde muur doorgetrokken (anders blijft er een vlak zonder dikte).
- Gondelkranen, leuningen en zonnepanelen op de daken zijn kleiner dan 0,9 m of los en zijn weggelaten.

## Controle

`node scripts/generate-bunkertoren.mjs` geeft `NoError`, genus 0, één gesloten deel en 3162 driehoeken. In de webshop controleert `tests/landmark-models.test.ts` het dak en de dakopbouw, de middenzone, het podium en de hellende westrand, de treden van de zuidkant (west lager dan oost), de daken van De Bunker, de naar buiten hellende bovengevel van de zuidkop, dat een glasband in de oostgevel na de printcorrectie op 45° een nis blijft, genus 0, één component en de plaatsing; de printcorrectie voegt 0,08 % volume toe. Vier schuine aanzichten zijn naast de PDOK-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, panden `0772100001025376` (2022), `0772100000300142` (1969) en `0772100001047020` (2022); actuele orthoHR.
- 3D BAG: [toren](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0772100001025376), [De Bunker](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0772100000300142).
- [Wikipedia: BunkerToren](https://nl.wikipedia.org/wiki/BunkerToren).
- Foto's op Wikimedia Commons (niet meegeleverd): [Bunker Toren (2023)](https://commons.wikimedia.org/wiki/File:Bunker_Toren_(2023).jpg), [BunkerToren in Eindhoven in 2022](https://commons.wikimedia.org/wiki/File:BunkerToren_in_Eindhoven_in_2022.jpg), [Bunkertoren1](https://commons.wikimedia.org/wiki/File:Bunkertoren1.jpg), [Bunkertoren2](https://commons.wikimedia.org/wiki/File:Bunkertoren2.jpg), [Studentencentrum De Bunker Eindhoven](https://commons.wikimedia.org/wiki/File:Studentencentrum_De_Bunker_Eindhoven.jpg).
