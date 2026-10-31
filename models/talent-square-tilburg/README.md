# High Lane (Tilburg)

Vereenvoudigd, printbaar model van woontoren High Lane aan Talent Square in de Spoorzone van Tilburg (2023, HUB architecten Antwerpen, voor TBV Wonen), op de hoek van de Hart van Brabantlaan en de Sint Ceciliastraat. Een rechthoekige toren van 23 lagen met 150 sociale huurwoningen en gevels van lichtgrijze prefab betonelementen: een regelmatig raster van brede vensters tussen penanten, een hogere begane grond en bovenaan een dichte band met een dakrand. Op het dak staat een installatie- en liftopbouw.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `talent-square-tilburg.glb` | Model in meters, Y omhoog, één node: `building:talent-square-tilburg-toren` |
| `talent-square-tilburg.json` | Catalogusitem |
| `talent-square-tilburg-1-1000.stl` | Los te printen op 1:1000 (29,8 × 18,8 × 72 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[133339.85, 396950.44]`, midden in de toren. De lokale X-as loopt langs de zuidgevel naar het oosten (−7,84° op RD-oost; alle BAG-randen staan daarop evenwijdig of haaks), Y langs de korte gevels naar het noorden. Lokaal z = 0 is NAP +13,15 m, het laagste maaiveld rond de toren (3D BAG-maaiveld 13,11; de laan aan de oostkant langs Talent Square 13,1–13,2). Aan de west- en zuidkant liggen straat en binnenhof hoger (14,3–14,5). `groundHeight` is 56,97 m (NAP + 43,82: NLGEO2018 ter plekke 43,85, geijkt op De Bankier met 43,80) en `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Toren (pand `0855100000815266`) | BAG-contour 29,78 × 18,84 m | dak +83,02 m (69,9 m boven maaiveld) | BAG, 3D BAG LoD2.2 (dakvlak 82,90–83,03; 70e percentiel 83,02) |
| Dakrand | 0,9 m breed rondom | +84,15 m | 3D BAG (strook langs de noordgevel 84,02–84,19), foto's |
| Installatie- en liftopbouw | 4,2 × 5,1 m | +84,4 m | 3D BAG (dakvlak 84,28–84,47), ortho |
| Vloer begane grond | — | +14,45 m | AHN-DTM binnenhof (14,4–14,5), foto van de entreetrap |

Gevelreliëf: acht traveeën van 3,72 m op de lange en vijf van 3,77 m op de korte gevels (geteld op foto's). Per woonlaag (22 lagen van 2,92 m boven een begane grond van 3,9 m) een venster van 2,1 m breed als blinde nis van 0,35 m met een plafond onder 45°; op de begane grond brede ramen van 2,6 m. Aan het binnenhof (zuidgevel) ligt de hal over de middelste twee traveeën 1,2 m terug, met een plafond onder 45°. Boven de bovenste woonlaag blijft een dichte band van circa 1,5 m tot de dakrand.

## Geschat en weggelaten

- Naam: de taak noemt de toren naar de plek (Talent Square); het gebouw heet High Lane (Wikipedia-hoogbouwlijst: 70 m, 2023). Wikipedia noemt 21 lagen, andere bronnen 23; het model heeft 23 lagen.
- Verdiepingshoogte, vloerpeil van de begane grond, vensterbreedte en -hoogte, de teruggelegen hal (plaats, breedte en diepte) en de dakrand langs de andere drie gevels zijn geschat.
- Weggelaten: het lage L-vormige blok van zes lagen aan de zuidkant (pand `0855100000815267`, hoort bij hetzelfde complex), het glazen tussenlid tussen toren en L-blok en de betonnen pergola boven de entreetrap (geen deel van dit pand, blijven PDOK); de voegen, textuurwisselingen en ventilatieroosters van de prefab-elementen, de zonnepanelen, leidingen en de gevelonderhoudsrail op het dak (kleiner dan 0,9 m).

## Controle

`node scripts/generate-talent-square-tilburg.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert een test de hoogtes van dak, dakrand en opbouw, dat de vensternissen in de zuidgevel na de printcorrectie op 45° blijven, de diepte van de hal, de volumeratio na de printcorrectie en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0855100000815266` (bouwjaar 2023); actuele orthoHR; AHN-DTM 0,5 m.
- 3D BAG LoD2.2 (AHN5, 2024): <https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0855100000815266>.
- [Lijst van hoogste gebouwen van Tilburg](https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Tilburg).
- [HUB architecten: High-Lane, Tilburg](https://www.hubarchitecten.eu/en/projects/woontoren-tilburg) en [Van de Ven: High Lane](https://www.vandevenbv.nl/nl/projecten/high-lane) (foto's, niet meegeleverd).
