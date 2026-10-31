# Westerlaantoren (Rotterdam)

Vereenvoudigd, printbaar model van de Westerlaantoren aan de Westerlaan in het Scheepvaartkwartier. Het is het voormalige hoofdkantoor van Phs. van Ommeren (Verhave-Luyt-De Iongh-Slikker, gebouwd 1958–1962), met de laagbouw uit 1965. Tussen 2000 en 2012 heeft Ector Hoogstad de toren tot het betonskelet gestript, de bovenste twee lagen vervangen door vijf lichtere en een nieuwe gevel aangebracht. Nu telt de toren 19 lagen: kantoren onderin en woningen erboven.

De toren staat op een vierkant van 32,9 m. Elke gevel heeft aan één eind een donker betegeld deel van 8,8 m. Daarnaast ligt een witte gevel met raamstroken in de plint en de kantoorlagen, en daarboven een wit balkonraster voor de woonlagen dat buiten de gevel staat. De donkere delen draaien als een molen rond de toren. Op het dak staat een ondiepe koperen koepel met een verdiept midden, het vroegere helikopterplatform.

Tegen de zuidgevel staat de laagbouw van zes lagen: een witte onderbouw met een glazen begane grond en daarop een donker betegelde kantoordoos van drie lagen die aan de zuidkant uitkraagt. Op het dak staat een glazen paviljoen en tegen de oostgevel een geel trappenhuis. Het BAG-pand omvat ook de parkeergarage onder het plantsoen aan de westkant. Daarvan staan alleen de drie schuine glazen nooduitgangen boven het maaiveld.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `westerlaantoren.glb` | Model in meters, Y omhoog, zes nodes: `building:westerlaantoren-toren`, `building:westerlaantoren-laagbouw`, `building:westerlaantoren-gele-trappenhuistoren` en `building:westerlaantoren-nooduitgang-1` tot en met `-3` |
| `westerlaantoren.json` | Catalogusitem |
| `westerlaantoren-1-1000.stl` | Los te printen op 1:1000 (57 × 119 × 76 mm), Z omhoog |

## Oorsprong en oriëntatie

- **Oorsprong:** RD `[92180.98, 435660.76]`, in het hart van de toren.
- **X-as:** langs de zuidgevel van de toren naar het oostnoordoosten, 20,4° op RD-oost. De BAG-randen van toren en laagbouw lopen daar binnen 0,4° evenwijdig mee.
- **Y-as:** langs de laagbouw naar het noordnoordwesten.
- **Hoogte:** lokaal z = 0 is NAP +3,15 m, het maaiveld aan de Westerlaan.
- **Terugval voor het maaiveld:** `groundHeight` is 46,65 m (NAP +3,15 m plus 43,51 m). Ter plekke is de NLGEO2018-geoïde 43,61 m; het getal is geijkt op Lloydtoren en De Hoge Maas, die 43,50 m gebruiken bij een geoïde van 43,62 m. `groundOffsetMetres` is −0,15.
- **`groundSamplePoints`:** liggen op de straat rondom (Westerlaan, zuidkant, oostkant en noordkant). Ze liggen niet op het plantsoen boven de garage, dat ongeveer 1 m hoger ligt, en niet in de inrit.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Toren | 32,9 × 32,8 m (BAG-contour) | +74,43 m | 3D BAG-dakvlak 74,42–74,43, AHN-DSM 74–75 |
| Koepel | rand r = 13,0 m, kegel tot r = 4,0 m, 48 vlakken | rand +75,4 m, top +78,4 m | AHN-DSM-profiel rond het hart, 3D BAG tot 78,9 |
| Verdiept midden van de koepel | r = 3,4 m, opbouw 2 × 2 m | +76,9 m, opbouw +78,2 m | 3D BAG-dakvlak 76,86–76,93, DSM |
| Balkonraster (vier gevels) | 22 m breed, 1,8 m buiten de gevel, kraag onder 45° | +40,75 tot +70,15 m | DSM-randen 1,5–2 m buiten de gevel (64–70), foto's |
| Donkere gevelvlakken | 8,8 m aan het begin van elke gevel (molenpatroon), smalle rand van 2 m aan het andere eind | — | DSM (geen raster over 8,7–9,6 m), foto's |
| Entreeluifel | 3,5 m diep, 1,5 m dik, om de noordwesthoek, op kolommen van 0,9 m | bovenkant +7,0 m | DSM 6,5–7,0 buiten de westgevel, foto |
| Laagbouw | 22,9 × 75,7 m | +24,3 m | BAG, 3D BAG 24,29–24,36 |
| Lage strook tussen toren en laagbouw | 3,2 m breed | +14,35 m | DSM 14–15 |
| Uitkraging van de kantoordoos (zuidkant) | 4 m, kraag onder 45° | onderkant +13,65 m | foto's (geschat) |
| Dakpaviljoen | 9,9 × 20 m en 4,5 × 6 m | +28,2 m en +27,5 m | 3D BAG 28,08–28,19, DSM 25,9–28,6 |
| Gele trappenhuistoren | 3,7 × 7,3 m (BAG-uitstulping) | +25,5 m | 3D BAG 25,34–25,60 |
| Terras voor de zuidgevel | 16,5 × 8 m | +4,25 m | DSM 4,2–4,3 |
| Nooduitgangen parkeergarage (3) | 5,2 × 2,2 m, schuin dak | hoog eind +7,8 m | DSM |

Het gevelreliëf bestaat uit blinde nissen met een plafond onder 45°:

- **Toren, woonlagen:** negen lagen met per laag vier balkons van 4,6 m breed en 1,1 m diep in het balkonraster.
- **Toren, plint en kantoorlagen:** twee plintlagen en zeven kantoorlagen met per laag een raamstrook van 0,35 m diep over het witte deel.
- **Toren, bovenste laag:** een raamstrook.
- **Toren, begane grond:** glas 0,4 m terug.
- **Laagbouw, kantoordoos:** verspreide vensters van 2,4 m die per laag een halve travee verspringen.
- **Laagbouw, witte onderbouw:** raamstroken per travee van 7,2 m.
- **Laagbouw, begane grond aan de Westerlaan:** een glazen pui 1,2 m achter kolommen van 0,9 m.

## Geschat en weggelaten

**Naam en bouwjaar:** de naam klopt. De BAG geeft bouwjaar 1956, maar de toren is van 1958–1962 en de laagbouw van 1965. In 2012 is de toren door Ector Hoogstad gerenoveerd en opgehoogd; hij is toen niet nieuw gebouwd.

**Geschat:**

- Verdiepingshoogtes: begane grond 5,0 m, plint 2 × 3,5 m, kantoren 7 × 3,66 m, woonlagen 9 × 3,27 m. In de laagbouw: 4,5 m, 2 × 3,0 m en 3 × 3,55 m.
- Het raster van balkons en vensters, en de diepte van de balkons.
- De lengte van de uitkraging van de laagbouw aan de zuidkant (4 m) en de hoogte waarop de witte onderbouw overgaat in de donkere doos.
- De vorm van de nooduitgangen (wig in plaats van gebogen glas) en de grenzen van het dakpaviljoen.

**Weggelaten:**

- De dunne witte staanders en balkonhekken van het raster, de spleetvensters in de donkere gevelvlakken, de V-schoren boven de luifel en de antennes op het dak: alle kleiner dan 0,9 m.
- De pergola op het dakpaviljoen en het gele gaas met de rode glijbuis om het trappenhuis: kleiner dan 0,9 m of open.
- De inrit van de parkeergarage: een verdieping in het maaiveld met lage borstweringen.

## Controle

`node scripts/generate-westerlaantoren.mjs` geeft voor elke node `NoError`, genus 0 en één gesloten deel.

In de webshop controleert de test op het volgende:

- de hoogtes van torendak, koepel, laagbouw, strook, paviljoen en trappenhuis;
- dat het balkonraster na de printcorrectie op 45° uitsteekt en open blijft;
- de uitkraging aan de zuidkant;
- dat het volume na de printcorrectie minder dan 1 % groeit;
- de plaatsing op het maaiveld.

Daarnaast zijn vier schuine aanzichten naast de 3D BAG-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0599100000701967` (bouwjaar 1956 volgens de BAG); actuele orthoHR; AHN-DSM en -DTM 0,5 m; 3D BAG LoD2.2 (AHN5, 2022).
- [Westerlaantoren op Wikipedia](https://nl.wikipedia.org/wiki/Westerlaantoren).
- Foto's op Wikimedia Commons (niet meegeleverd):
  - [vanaf de Euromast](https://commons.wikimedia.org/wiki/File:Euromast_-_Scheepvaartkwartier_-_Rotterdam_-_View_of_Westerlaantoren.jpg)
  - [Westerlaantoren.jpg](https://commons.wikimedia.org/wiki/File:Westerlaantoren.jpg)
  - [159](https://commons.wikimedia.org/wiki/File:1604_Westerlaantoren,_Rotterdam_159.jpg), [164](https://commons.wikimedia.org/wiki/File:1604_Westerlaantoren,_Rotterdam_164.jpg) en [157](https://commons.wikimedia.org/wiki/File:1604_Westerlaantoren,_Rotterdam_157.jpg)
