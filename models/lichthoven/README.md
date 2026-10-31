# Lichthoven (The Social Hub) (Eindhoven)

Vereenvoudigd, printbaar model van de hotel- en woontoren Lichthoven aan de Stationsweg bij Eindhoven Centraal (2016, Sarafopoulos Architecten en Architecten Cie), op de plek van het oude postkantoor. Het hotel heette eerst The Student Hotel en heet nu The Social Hub. De toren is een rechthoekige schijf van 43,2 × 14,8 m met 23 lagen: lichte baksteenlisenen met donkere baksteenvelden en kleine vensters ertussen, per vier lagen een lichte horizontale band, een glazen plint van twee lagen tussen dezelfde penanten, en op het dak een borstwering rondom, een installatiekast en een paar kanalen.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `lichthoven.glb` | Model in meters, Y omhoog, één node: `building:lichthoven-toren` |
| `lichthoven.json` | Catalogusitem |
| `lichthoven-1-1000.stl` | Los te printen op 1:1000 (43 × 16 × 77 mm), Z omhoog |

## Oorsprong en oriëntatie

De RD-oorsprong `[161534.31, 383657.88]` ligt in het hart van de BAG-contour. De X-as loopt langs de lange gevels naar het oostnoordoosten (12,52° op RD-oost; de BAG-randen zijn evenwijdig binnen 0,05°) en Y naar het noordnoordwesten. De zuidgevel (Y = −7,42) staat aan de Stationsweg, de westgevel kijkt naar het station. Lokaal z = 0 is NAP +16,0 m (AHN-DTM rondom 15,9–16,4; 3D BAG-maaiveld 15,94). `groundHeight` is 59,93 m: NAP plus de NLGEO2018-geoïdehoogte 43,93 op deze plek. Ter controle: de Kennedytoren, 220 m noordelijker, staat op 43,92. `groundOffsetMetres` is −0,15.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Toren (pand `0772100001019300`) | BAG-contour 43,22 × 14,84 m (rechthoek binnen 3 cm) | dak +89,17 m | 3D BAG LoD2.2 (89,16–89,18), AHN-DSM 89,2 |
| Borstwering | rand van 0,9 m rondom | +89,85 m | AHN-DSM (89,8–89,9 op een rand van 0,7 m) |
| Installatiekast | 24,7 × 7,95 m | +92,04 m | 3D BAG-dakvlak (92,03–92,05), DSM 92,1 |
| Lager installatieblok oostkant | 3,3 × 4,55 m | +90,46 m | 3D BAG-dakvlak; omvang op het DSM |
| Kanalen en ventilatoren oostkant | twee stroken van 5,8 m (1,1 m breed) en een blok van 2,2 × 1,2 m | +90,65 m | AHN-DSM (90,5–90,7), ortho |
| Glazen plint | twee lagen tot 10,2 m boven het maaiveld | +26,2 m | foto's (geschat) |
| Lagen erboven | 21 lagen van 3,0 m | tot +89,17 m | Wikipedia (23 lagen), foto's |
| Entreeluifels | twee aan de Stationsweg, 5,8 m breed, 1,5 m dik, 1,0 m voor de penanten | bovenkant +20,0 m | foto's (geschat) |

Gevelreliëf: lisenen van 0,9 m op 14 traveeën van 3,09 m (lange gevels) en 5 traveeën van 2,97 m (korte gevels), met op de hoeken een lisene op beide gevels. Tussen de lisenen ligt per travee een donker veld 0,3 m terug, met een plafond onder 45°. De velden zijn per segment van vier lagen (bovenaan vijf) onderbroken door een lichte band van 0,9 m op +26,2, +38,2, +50,2, +62,2 en +74,2 m, en door de dakrand van 0,9 m. Per laag zit in elk veld een venster als blinde nis van nog eens 0,35 m, met een plafond onder 45°. Op de lange gevels staan de vensters in het midden van het veld (1,2 m breed). Op de korte gevels zijn ze 1,0 m breed en verspringen ze per laag links en rechts, zoals op de foto's. In de plint zit tussen de penanten glas 0,45 m terug, tot onder de plintband. De luifels hebben een kraag onder 45° tot in de glasnis.

## Geschat en weggelaten

- De plinthoogte (10,2 m) komt uit de verhouding tot de traveebreedte op frontale foto's. De laaghoogte van 3,0 m volgt uit 21 lagen tussen plint en dak. Plint en bovenste segment staan op foto's, de rest is afgeleid.
- Het lisene- en vensterraster komt uit foto's: 14 en 5 traveeën zijn geteld aan de plintpenanten. De vensterbreedtes en het verspringen op de korte gevels zijn geschat.
- De entreeluifels zijn in werkelijkheid zwarte platen van circa 0,7 m. Ze zijn verdikt tot 1,5 m met een kraag; hun plaats (traveeën 4–5 en 9–10 vanaf de westhoek) komt uit één schuine foto.
- De dakkanalen en ventilatoren zijn vereenvoudigd tot drie blokken op de DSM-hoogte.
- Weggelaten: de lichtreclame "The Social Hub" (de letters steken minder dan 0,9 m uit), de fijnere verdeling met smalle lichte strips in de bovenste vijf lagen (strips van circa 0,4 m, kleiner dan 0,9 m), kozijnen en de terrasparasols aan de westkant.
- Niet meegenomen, omdat het andere panden zijn: het object van 2 m² op 2 m van de noordoosthoek (pand `0772100001021016`, 2017, overige gebruiksfunctie), het nieuwbouwproject Lightyards ten oosten (`0772100001043324`, in aanbouw) en het geplande pand ten noorden (`0772100001040867`). Geen van deze panden raakt de toren.

## Controle

`node scripts/generate-lichthoven.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert de test de dakhoogtes van dak, borstwering en installatieblokken, de veld- en vensternissen in de zuidgevel en een entreeluifel (ook na de printcorrectie op 45°), dat de printcorrectie het volume met minder dan 1 % laat groeien, en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0772100001019300` (bouwjaar 2016); actuele orthoHR; AHN-DSM en -DTM 0,5 m.
- [3D BAG LoD2.2](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0772100001019300) (AHN5 2024; TU Delft/3DGI, CC BY 4.0).
- NLGEO2018-geoïde voor `groundHeight`.
- [Lichthoven](https://nl.wikipedia.org/wiki/Lichthoven) op Wikipedia.
- Foto's op Wikimedia Commons (niet meegeleverd): [Lichthoven Eindhoven](https://commons.wikimedia.org/wiki/File:Lichthoven_Eindhoven.jpg), [The Student Hotel – Stationsweg](https://commons.wikimedia.org/wiki/File:The_Student_Hotel_-_Stationsweg_Eindhoven.jpg), [Bouwproject Lightyards (2026)](https://commons.wikimedia.org/wiki/File:Bouwproject_Lightyards_(2026)_(1).jpg).
