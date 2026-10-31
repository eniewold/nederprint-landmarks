# Leonardo Royal Hotel Amsterdam (Amsterdam)

Vereenvoudigd, printbaar model van het Leonardo Royal Hotel aan de Paul van Vlissingenstraat 24 bij metrostation Overamstel (2019, 490 kamers). Een hoteltoren van rode baksteen van 50,5 × 21,7 m en circa 60 m hoog op een glazen plint met hoge, wit omlijste ramen; in de bovenste twee lagen heeft elke travee een groot kruisvenster van twee lagen hoog. Achter de toren liggen een sokkelvleugel, een lage tussenstrook en een parkeergarage met een parkeerdek op twee halve niveaus. Het hele complex is één BAG-pand van 50,5 × 69,0 m.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `leonardo-royal-amsterdam.glb` | Model in meters, Y omhoog, drie nodes: `building:leonardo-royal-amsterdam-hoteltoren`, `building:leonardo-royal-amsterdam-sokkel` en `building:leonardo-royal-amsterdam-parkeergarage` |
| `leonardo-royal-amsterdam.json` | Catalogusitem |
| `leonardo-royal-amsterdam-1-1000.stl` | Los te printen op 1:1000 (50,5 × 72 × 64,7 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[123003.87, 482858.06]`, het hart van de BAG-contour. De X-as loopt langs de zuidgevel van de toren naar het oostnoordoosten (22,47° op RD-oost, alle BAG-randen evenwijdig of haaks binnen 0,05°), Y haaks erop naar het noordnoordwesten. Lokaal z = 0 is NAP +0,45 m, het maaiveld rondom (AHN-DTM 0,37–0,57); `groundHeight` is 43,49 m (NAP +0,45 plus de geoïdehoogte 43,04 van NLGEO2018) en `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Maat (u × v vanaf de zuidwesthoek) | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Hoteltoren | 50,5 × 21,7 m | +60,5 m | BAG; 3D BAG 60,48–60,52; AHN-DSM-rand 60,5–60,6 |
| Liftopbouw | 7,7 × 4,0 m | +64,35 m | 3D BAG 64,29–64,40; DSM |
| Trappenhuis dwars over het dak | 2,2 × 11,4 m | +63,9 m | 3D BAG 63,87–63,92; DSM |
| Installatiekasten en -platen | zes blokken tussen u 9 en 46 | +62,1 tot +64,0 m | 3D BAG-dakvlakken; DSM |
| Sokkelvleugel | 50,5 × 14,7 m (v 21,7–36,4) | +15,85 m | 3D BAG 15,84–15,86; DSM 15,8–16,0 |
| Lage tussenstrook | 50,5 × 9,4 m (v 36,4–45,8) | +8,35 m | 3D BAG 8,33–8,39; DSM 8,3–8,4 |
| Parkeerdek west | 13,5 × 23,2 m | +17,35 m | DSM 17,3–17,4 |
| Parkeerdek oost | 15,7 × 23,2 m | +18,7 m | DSM 18,7 |
| Stijgende hellingbaan (zuid) | u 13,5–34,8, v 45,8–56,8 | +17,35 → +18,7 m | DSM, lineair |
| Dalende hellingbaan (noord) | u 13,5–34,8, v 56,8–69,0 | +17,35 → +16,1 m | DSM, lineair |
| Trappenhuis op het dek | 6,5 × 5,7 m en 4,4 × 2,6 m | +20,1 en +19,6 m | 3D BAG 20,05–20,12 en 19,54–19,70 |
| Liftopbouw op het dek | 2,3 × 2,2 m | +21,2 m | 3D BAG 21,17–21,19 |
| Entreeluifel | 13 × 3,0 m, 1,5 m dik | bovenkant 6,2 m boven maaiveld | foto, geschat |

Gevelreliëf: de plint heeft een glazen band van 0,4 m diep tot 6,4 m boven maaiveld en per vensterkolom een hoog omlijst raam tot 10,2 m. Daarboven 16 hotellagen van 3,0 m (vanaf 10,6 m) met per laag vensters van 1,4 m breed als blinde nissen van 0,35 m met een plafond onder 45°, op een regelmatig raster van 14 kolommen langs de lange en 6 langs de korte gevels. In de bovenste twee lagen heeft elke travee van twee kolommen één kruisvenster van 5,0 m breed als nis van 0,4 m. De sokkelvleugel heeft dezelfde plint en één rij vensters op de eerste hotellaag; de lage strook heeft per kolom een hoog raam. De luifel heeft aan de onderkant een kraag onder 45° tegen de gevel.

## Geschat en weggelaten

- Naam: het pand heeft geen eigen Wikipedia-pagina en staat ook niet in de hoogbouwlijst van Amsterdam; de naam komt uit de BAG (logiesfunctie op Paul van Vlissingenstraat 24) en de Commons-beschrijving van de foto, die als architect Saarberg, Van der Scheer en Partners noemt.
- Verdiepingshoogte, plinthoogte, het vensterraster en de kruisvensters zijn op één foto (zuid- en westgevel) geteld en geschat; de noord- en oostgevel van de toren zijn naar die gevels aangenomen.
- De luifel (breedte, uitsteek, hoogte) is geschat op de foto.
- Gevels van de sokkelvleugel aan de noordkant, van de lage strook en van de parkeergarage: geen foto; de parkeergarage is vlak baksteen gelaten, de lage strook heeft geschatte hoge ramen.
- Weggelaten: de rode kruisen in de kruisvensters, de grijze borstweringspanelen, de wandlampen, het logobord bovenaan de zuidgevel, de dakrand van circa 0,4 m rond het torendak en de borstweringen van het parkeerdek (alle kleiner dan 0,9 m), en een halfrond uitsteeksel van 0,26 m in de BAG-contour aan de zuidgevel.

## Controle

`node scripts/generate-leonardo-royal-amsterdam.mjs` geeft per node `NoError`, genus 0 en één gesloten deel. In de webshop controleert een test de daken, dekniveaus en hellingbanen, dat een kruisvenster en een vensternis van de toren en de entreeluifel na de printcorrectie op 45° blijven, dat de printcorrectie het volume met minder dan 1 % laat groeien, één component per node en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto gelegd.

## Bronnen

- PDOK BAG, pand `0363100012242114` (bouwjaar 2019; verblijfsobjecten Paul van Vlissingenstraat 24 en Isaäc Asscherpad 4); actuele orthoHR; AHN-DSM en -DTM 0,5 m; 3D BAG LoD2.2 (AHN5, 2023); geoïde NLGEO2018.
- [Lijst van hoogste gebouwen van Amsterdam](https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Amsterdam) (bron van de taak; het hotel staat er niet in).
- Foto op Wikimedia Commons (niet meegeleverd): [Leonardo Royal Hotel Amsterdam](https://commons.wikimedia.org/wiki/File:LeonardoRoyalHotelAmsterdam.jpg).
