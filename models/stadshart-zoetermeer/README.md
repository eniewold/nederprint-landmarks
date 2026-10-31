# City Tower en Noordwaarts (Zoetermeer)

Vereenvoudigd, printbaar model van de twee woontorens uit 1998 in het Stadshart van Zoetermeer, 210 m uit elkaar aan weerszijden van de Europaweg. City Tower (Berlijnstraat, Cees Reijers, 65 m, 23 lagen) heeft een hoofdblok met een schuine zuidoostgevel en drie balkonstapels, een liftkop en twee lagere vleugels boven de vijver. De toren aan het Noordwaarts (Kokon, 63 m, 22 lagen) is een schijf waarvan beide kopse kanten in vier terrassen naar het westen aflopen, met een kern aan de oostgevel en een winkelonderbouw.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `stadshart-zoetermeer.glb` | Model in meters, Y omhoog, twee nodes: `building:stadshart-zoetermeer-city-tower` en `building:stadshart-zoetermeer-noordwaarts` |
| `stadshart-zoetermeer.json` | Catalogusitem |
| `stadshart-zoetermeer-1-1000.stl` | Los te printen op 1:1000 (258 × 33 × 70 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[93647.0, 453116.0]`, midden tussen de torens. De X-as loopt langs de noordgevel van City Tower en de kopse kanten van Noordwaarts naar het oostnoordoosten (21,5° op RD-oost; de BAG-randen van beide torens zijn evenwijdig binnen 0,2°). Lokaal z = 0 is NAP −4,2 m, het maaiveld rond City Tower (AHN-DTM −4,1 tot −4,4). `groundSamplePoints` liggen op de parkeerplaats en de straat ten noorden en oosten van City Tower; `groundHeight` is 39,27 m (NAP −4,2 plus geoïde 43,47 volgens NLGEO2018) en `groundOffsetMetres` −0,15. Noordwaarts staat 2,8 m hoger (straat aan de westkant NAP −1,4, oostkant −2,7) en loopt door tot dezelfde onderkant.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| City Tower, hoofdblok (pand `0637100000178446`) | BAG-contour, circa 22 × 20 m met schuine zuidoostgevel | +60,1 m | 3D BAG (60,08–60,16), AHN-DSM 60 |
| City Tower, liftkop | circa 6 × 8,5 m | +64,0 m, noordelijk deel +62,6 m | 3D BAG, AHN-DSM 63–66 |
| City Tower, strook langs de noordgevel | 12,8 × 1,6 m | +57,3 m | 3D BAG |
| City Tower, entreebouw | 12,8 × 2,8 m | +3,3 m | 3D BAG, AHN-DSM 3 |
| City Tower, vleugel zuidwest | circa 14 × 9 m | +35,9 m, hoek +33,0 m | 3D BAG, AHN-DSM 36 |
| City Tower, westvleugel | circa 14 × 8 m | +27,8 m, hoek +24,9 m | 3D BAG, AHN-DSM 28 |
| City Tower, balkonstapels | drie op de zuidoostgevel (3–6 m breed, 1,8 m uitstekend), één per vleugel (1,5 m) | +57,4 m, +34,0 m, +25,9 m | AHN-DSM buiten de gevel (57–58, 33–37, 25–26), luchtfoto |
| Noordwaarts, schijf (pand `0637100000178154`) | 18,7 × 32,5 m | +59,4 m | 3D BAG (59,36–59,43), AHN-DSM 59 |
| Noordwaarts, terrassen zuidkop | vier kolommen van west naar oost | +48,25 / +51,25 / +53,95 / +56,6 m | 3D BAG, grenzen uit het AHN-DSM |
| Noordwaarts, terrassen noordkop | vier kolommen van west naar oost | +42,9 / +45,85 / +48,55 / +51,2 m | 3D BAG, grenzen uit het AHN-DSM |
| Noordwaarts, kern aan de oostgevel | 6,1 × 5,2 m | +64,5 m | 3D BAG, AHN-DSM 64–66 |
| Noordwaarts, ventilatorkasten | twee van circa 1,8 × 3 m | +61,6 m | 3D BAG, AHN-DSM 61–62, luchtfoto |
| Noordwaarts, winkelonderbouw | twee blokken aan de oostkant, 6,2 m diep | +5,25 m | 3D BAG, AHN-DSM 5 |

Gevelreliëf: per laag vensters van 1,8 m op een travee van 3,0 m als blinde nissen van 0,35 m met een plafond onder 45°, alleen waar de gevel buitengevel is; de entreebouw en de winkelonderbouw hebben bredere en hogere puien. In de balkonstapels per laag een open balkon van 0,9 m diep, onder elke stapel een kraag onder 45° naar de gevel.

## Geschat en weggelaten

- Verdiepingshoogte 2,7 m uit de sprongen tussen de terrassen en vleugels; begane grond 4,6 m (City Tower) en 4,0 m (Noordwaarts) zijn geschat.
- Het vensterraster (travee 3,0 m, venster 1,8 m) is geschat: er zijn geen bruikbare foto's van de gevels gevonden.
- Breedte en uitsteek van de balkonstapels komen uit het DSM buiten de gevel en de luchtfoto; de bovenkanten zijn afgerond op de DSM-waarde.
- De grenzen tussen de dakdelen van City Tower volgen de 3D BAG; het deel tussen de vleugel en het hoofdblok heeft geen DSM-waarden en staat op de hoogte van de vleugel.
- De opdracht noemde kantoortorens; volgens de BAG zijn het woontorens (Noordwaarts met winkels en een bijeenkomstfunctie in de onderbouw).
- Weggelaten: balkonhekken, de dakrandlijsten, het stalen kader langs de noordrand van City Tower en de ventilatoren (kleiner dan 0,9 m), de BAG-uitsprongen van 0,3–0,4 m aan de westgevel van Noordwaarts en aan de westkant van City Tower (kleiner dan 0,9 m), en de voetbrug over de vijver ten zuiden van City Tower (geen deel van het pand).

## Controle

`node scripts/generate-stadshart-zoetermeer.mjs` geeft per toren `NoError`, genus 0 en één gesloten deel. In de webshop controleert `tests/landmark-models.test.ts` de dakhoogtes, terrassen en kernen, dat een balkonstapel op de zuidoostgevel uitsteekt en zijn open balkons na de printcorrectie op 45° houdt, een vensternis op de westgevel van Noordwaarts, één component per toren, een volumegroei door de printcorrectie onder 1 % en de plaatsing op het maaiveld. Vier schuine aanzichten per toren zijn naast de 3D BAG (LoD2.2) gelegd.

## Bronnen

- PDOK BAG, panden `0637100000178446` (Berlijnstraat 27–193, bouwjaar 1998) en `0637100000178154` (Noordwaarts 34–196, bouwjaar 1998); actuele orthoHR; AHN-DSM en -DTM 0,5 m.
- 3D BAG LoD2.2 (puntenwolk AHN5 2023), panden [`0637100000178446`](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0637100000178446) en [`0637100000178154`](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0637100000178154).
- CTBUH Skyscraper Center: [City Tower](https://www.skyscrapercenter.com/building/city-tower/6762) en [Noordwaarts](https://www.skyscrapercenter.com/building/noordwaarts/6763).
- [BAG-viewer](https://bagviewer.kadaster.nl/lvbag/bag-viewer/?objectId=0637100000178446).
