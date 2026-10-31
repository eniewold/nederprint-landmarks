# The Muse (Rotterdam)

Vereenvoudigd, printbaar model van The Muse aan de Wijnhaven (BARCODE Architects, 2019): een woontoren van 23 lagen op een onderbouw van vijf lagen, met daartussen een "rok" van vier lagen die naar de toren versmalt. Aan de Wijnhaven (zuid) en de Wijnstraat (noord) loopt die rok in getrapte terrassen op, aan de oostkant ligt een donker dakvlak met dakramen en aan de westkant hellen twee wanden naar buiten (de knik naar het noordwesten). De toren zit in een antraciet kader met gesloten oost- en westgevels en glazen noord- en zuidgevels met witte balkons die per laag verspringen. CasaNova sluit aan de oostkant aan en heeft een eigen model.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `the-muse.glb` | Model in meters, Y omhoog, één node `building:the-muse` |
| `the-muse.json` | Catalogusitem |
| `the-muse-1-1000.stl` | Los te printen op 1:1000 (44 × 38 × 76 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[93041.4, 436981.5]`, in het hart van de BAG-contour. De lokale X-as loopt langs de lange gevels naar het oost-noordoosten (17,6° op RD-oost, `xAxis` `[0.953191, 0.302370]`), Y naar het noord-noordwesten (naar de Wijnstraat); de Wijnhaven ligt aan de −Y-kant. Lokaal z = 0 is NAP +2,55 m, de kade voor de zuidgevel. `groundHeight` is 46,08 m (NAP 2,55 + 43,53; de geoïde NLGEO2018 is hier 43,60, geijkt op `blaak-10` en `stedin-blaak`, die beide 43,53 gebruiken), `groundOffsetMetres` −0,15 en twee `groundSamplePoints` op de kade (de Wijnstraat aan de noordkant ligt circa 0,7 m hoger).

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Onderbouw (begane grond + 4 lagen) | BAG-contour 44 × 38 m | +18,9 m | BAG, 3D BAG (18,73–18,95), AHN-DSM |
| Rok, verdieping 5–8 | van de voet op de onderbouw naar de torenplattegrond, vloeren +18,90 / 21,85 / 24,81 / 27,76 | tot +30,72 m | 3D BAG-terrassen (21,9 / 24,9 / 27,8), plattegrond 5e verdieping |
| Terrassen zuid | gevels op v = −13,5 / −10,9 / −8,3 / −5,3 | per laag | 3D BAG, foto's |
| Terrassen noord | gevels op v = 19,2 / 17,9 / 16,55 / 15,2 | per laag | 3D BAG-dakvlak (64°), foto's |
| Oostelijk dakvlak | 51°, van de oostgevel (u = 23,25) naar de toren (u = 13,6) | +18,9 tot +30,7 m | 3D BAG (49°), AHN-DSM |
| Uitsparing in het oostelijke dakvlak | u ≥ 19,0, v 0–12 | +21,5 m | 3D BAG (21,2–21,85); AHN4 ziet hem op +19 |
| Schuine westwanden | voeten (−14,8; −0,2)–(−5,1; −15,4) en (−14,8; 9,2)–(−5,2; 20,7) op +18,9 m, top op de torenhoeken op +30,7 m (circa 18° naar buiten) | | plattegrond 5e verdieping, 3D BAG, foto's |
| Toren | 28,4 × 20,5 m | +75,75 m | 3D BAG (75,75), AHN-DSM (76) |
| Dakrand van het kader | 0,9 m breed | +76,55 m | 3D BAG-randjes (76,49–76,57) |
| Installatie-/liftopbouw | 8,7 × 6,7 m | +77,55 m | 3D BAG (77,49–77,57), AHN-DSM (78) |
| Verdiepte dakterrassen penthouses | 3,6 × 7,1 en 3,7 × 6,5 m | +72,17 m | 3D BAG (72,14–72,19), ortho |

Gevelreliëf:

- **Toren noord en zuid**: glas 0,8 m achter het kader (hoekpenanten en kaderband boven 0,9 m), per laag (9–23, 2,954 m) een doorlopende witte band van 1,25 m die 1,3 m buiten het glas steekt en drie diepe balkons van 4,3 m breed die 2,9 m buiten het glas steken en per laag een vak verspringen (zes vakken). De diepe balkons hebben een open vloer achter een borstwering van 0,9 m dik en 0,95 m hoog met zijwangen van 0,9 m; onder elke band en elk balkon loopt een kraag van 47° naar de gevel.
- **Toren oost en west**: per laag vier of vijf ramen van 1,0 × 1,7 m als blinde nissen van 0,35 m die per laag 2 m verspringen; ook in de verticale strook van de westgevel onder de toren.
- **Rok**: getrapte terrassen met borstweringen van 0,9 × 1,0 m en verdiepte glaspuien; donkere schuine randen (2 m) over de uiteinden van de terrassen langs de westwanden en (1 m) langs het oostelijke dakvlak; ramen als nissen in de schuine westwanden en dakramen van 1,2 × 1,6 m in het oostelijke dakvlak, alle met een plafond steiler dan 47°.
- **Onderbouw noord en zuid**: per laag een witte band van 1,25 m en de glazen pui 0,9 m terug, de begane grond 1,3 m terug met een penant midden in de zuidgevel; langs de dakrand een borstwering van 0,9 × 1,0 m.

## Geschat en weggelaten

- Verdiepingshoogtes: de begane grond (5,45 m) en de lagen van de onderbouw (2,725 m) zijn geschat; vanaf de 5e verdieping 2,954 m volgt uit de 3D BAG-terrassen en de dakterrassen op +72,17 m.
- De gevels van de terrassen (v per laag), de plaats van de voeten van de schuine westwanden en de helling van het oostelijke dakvlak zijn afgeleid uit de plattegrond van de 5e verdieping en de 3D BAG en afgerond.
- Balkondiepte, de breedte van de diepe balkons (zes vakken over de gevel), het verspringpatroon en de ramen in de gesloten gevels zijn uit foto's geschat; het werkelijke patroon is onregelmatiger.
- De uitsparing in het oostelijke dakvlak: de 3D BAG (AHN5 2023) en het AHN4 verschillen in vorm en hoogte; genomen is een rechthoek op +21,5 m.
- Het noordelijke terras op de 8e verdieping (1,35 m diep) heeft geen eigen borstwering: de balkons van de 9e verdieping liggen erboven.
- Weggelaten: balkonhekken van glas, plantenbakken en bomen op de terrassen, de entreeluifel (kleiner dan 0,9 m of geen vaste vorm); de 3D BAG-vlakken op +43 tot +59 m voor de zuidgevel zijn een meetfout (waarschijnlijk een bouwkraan van CasaNova in 2023) en zitten niet in het model.

## Controle

`node scripts/generate-the-muse.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert de test in `tests/landmark-models.test.ts` het hoofddak, de opbouw, een dakterras, het dak van de onderbouw, een terras, de uitsparing en het oostelijke dakvlak met een dakraam, dat een diep balkon, de band en de open balkonvloer na de printcorrectie op 45° blijven, dat het volume minder dan 1 % groeit, één component met genus 0, en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0599100100015965` (bouwjaar 2019); actuele orthoHR; AHN-DSM en -DTM 0,5 m.
- [3D BAG, pand 0599100100015965](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100100015965) (LoD2.2, AHN5 2023).
- [The Muse (Wikipedia)](https://nl.wikipedia.org/wiki/The_Muse): 23 verdiepingen, circa 74 m, knik van de 5e tot de 8e verdieping, glazen noord- en zuidgevel.
- [BARCODE Architects, The Muse](https://barcodearchitects.com/projects/the-muse/): plattegronden van de 5e en 15e verdieping en foto's, alleen als visuele referentie (niet meegeleverd).
- Foto's op Wikimedia Commons (niet meegeleverd): [Category:The Muse (Rotterdam)](https://commons.wikimedia.org/wiki/Category:The_Muse_(Rotterdam)) en [Woontoren The Muse aan de Wijnhaven (2019)](https://commons.wikimedia.org/wiki/File:Woontoren_The_Muse_aan_de_Wijnhaven_met_op_de_voorgrond_de_Grote_Wijnbrug,_rechts_de_Zwartehondstraat_en_de_Wijnstraat_2019.jpg).
