# B'Mine (Amsterdam)

Vereenvoudigd, printbaar model van B'Mine, de woontoren aan de Bercylaan op Overhoeks in Amsterdam-Noord (Paul de Ruiter Architects, 2017, 75 m, 147 woningen). Eén BAG-pand: een toren van 23 lagen en aan de noordoostkant een sokkel van acht lagen. Zwarte gevels achter een raster van witte verticale vinnen, per travee een stapel balkons of een kolom vensters, een begane grond van dubbelhoog glas met twee parkeerlagen erboven, een teruggelegen penthouselaag en een open witte kroon waarin de vinnen boven het dak doorlopen.

De taak noemde het gebouw "Woontoren Bercylaan (Overhoeks)"; de echte naam is B'Mine (in de hoogbouwlijst als "B'Mine Toren", 75,0 m, 2017, 23 lagen).

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `bercylaan-overhoeks.glb` | Model in meters, Y omhoog, twee nodes: `building:bercylaan-overhoeks-toren` (toren met penthouselaag en kroon) en `building:bercylaan-overhoeks-sokkel` |
| `bercylaan-overhoeks.json` | Catalogusitem |
| `bercylaan-overhoeks-1-1000.stl` | Los te printen op 1:1000 (43 × 29 × 76 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[122070.8, 488651.81]`, het hart van de BAG-contour (43,13 × 29,33 m). De lokale X-as loopt langs de lange zuidoostgevel naar het noordoosten (36,08° op RD-oost; de vier BAG-randen staan binnen 0,1° evenwijdig of haaks), Y naar het noordwesten. Lokaal z = 0 is NAP +1,55 m (3D BAG-maaiveld 1,54, AHN-DTM rondom 1,58); `groundHeight` is 44,5 m (ellipsoïdisch, terugval) en `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Toren | 28,6 × 29,3 m (zuidwestelijk deel van de BAG-contour) | terras +70,88 m | BAG; 3D BAG LoD2.2 (70,87–70,89), grens met de sokkel uit het 3D BAG-sokkeldak |
| Sokkel | 14,5 × 29,3 m | +29,55 m | 3D BAG (29,54–29,57), AHN-DSM (29,5–30) |
| Penthouselaag | 2,0 m terug van de voorkant, hoekterrassen van 2 × 2 travees | +74,0 m | 3D BAG (74,01–74,07), terrasrand 1,9–2,0 m; luchtfoto en foto's |
| Hogere penthousedaken | langs de zuidwest-, zuidoost- en noordwestzijde | +75,8 m | 3D BAG (75,65–75,91), AHN-DSM 76 |
| Leidingstraat | 3,8 m breed, dwars over het dak | +75,35 m | 3D BAG (75,27–75,39), luchtfoto (grote leidingen) |
| Installatiekast | 6 × 3,9 m | +76,05 m | 3D BAG (75,99–76,10) |
| Witte kroon | palen (de vinnen), ringbalk rondom, korte balken naar de penthouselaag, per hoek een paal met balken | +76,4 m | 3D BAG (76,39–76,40 op de zuidwestrand), luchtfoto 0,1 m, foto's |
| Vinnen | 0,9 m breed, 1,0 m diep, 10 travees per torengevel (2,86 en 2,93 m), 5 per sokkelgevel (2,91 m) | tot +76,4 m (toren), +29,55 m (sokkel) | travees geteld op foto's, deling over de BAG-randen; DSM-rand 1–1,5 m |
| Balkonstapels | tussen twee vinnen, voorkant 0,3 m achter de vinnen, per laag een borstwering van 0,9 m en een open balkon | +13,75 m tot het terras of sokkeldak | foto's |

Lagen: begane grond 6,0 m (glaspui als nis over de hele travee), twee parkeerlagen van 3,1 m (liggende openingen), daarboven 18 woonlagen van 3,174 m in de toren en 5 van 3,16 m in de sokkel, dan de penthouselaag. In de vensterkolommen per laag een vensternis van 1,3 m breed en 0,35 m diep met een plafond onder 45°; in de balkonstapels per laag een open balkon tot 0,15 m in de gevel met een plafond onder 47°, onder elke stapel een kraag onder 45° naar de gevel. De kroonbalken hebben tussen de palen een spitse onderkant onder 50°, zodat de kroon zonder steun printbaar blijft en open blijft. Balkonpatroon per gevel (vanaf de zuid- of westhoek): noordwest BBWWBBWWBB (toren) en sokkel WWWBB, zuidwest BWWBBWWWWB.

## Geschat en weggelaten

- Naam: de opdracht vermoedde B'Mine; bevestigd door de hoogbouwlijst en de projectpagina van de architect.
- De zuidoost- en noordoostgevel staan op geen bruikbare foto (de zuidoostgevel kijkt op het gebouw van de Amsterdamse Hogeschool voor de Kunsten); hun balkonpatroon volgt de noordwestgevel.
- Lagenindeling (begane grond 6,0 m, parkeerlagen 3,1 m) uit foto's, afgestemd op de gemeten daken.
- Vindiepte (1,0 m) en -breedte (0,9 m; werkelijk circa 0,6 m) zijn verdikt voor 1:1000; de balkons zijn dichte borstweringen van 0,9 m (in werkelijkheid glas).
- De binnenste kroonbalk is een borstwering op de rand van de penthouselaag tot de bovenkant van de kroon; in werkelijkheid zit er tussen het penthousedak en de balk een open strook van circa 1,5 m.
- Ligging van de palen in de hoeken van de kroon uit de luchtfoto en twee foto's.
- Weggelaten: de glazen borstweringen op de terrassen en balkons, de lichte kolommen in de parkeerlagen, de leidingen zelf (als één blok) en losse dakapparatuur (kleiner dan 0,9 m of glas). De hoogste DSM-waarde (78,15) is één punt boven de kroon zonder vorm op de luchtfoto.

## Controle

`node scripts/generate-bercylaan-overhoeks.mjs` geeft per node `NoError` en één gesloten deel (genus 146 en 10). In de webshop controleert `tests/landmark-models.test.ts` de dakhoogtes (penthouse, installatiekast, kroon, hoekterras, sokkel), dat een vensterkolom en een balkonstapel na de printcorrectie op 45° hun reliëf houden, dat de kroon tussen de palen open blijft, dat het volume met minder dan 1 % groeit, één component per node en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd. Het model ligt 9 m van het Y-Towers-model en overlapt het niet.

## Bronnen

- PDOK BAG, pand `0363100012245546` (bouwjaar 2017); actuele orthoHR; AHN-DSM en -DTM 0,5 m.
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012245546) (LoD2.2, AHN5 2023, CC BY 4.0).
- [Lijst van hoogste gebouwen van Amsterdam](https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Amsterdam).
- [B'Mine Tower, Paul de Ruiter Architects](https://paulderuiter.nl/en/projects/bmine-tower).
- Foto's op Wikimedia Commons (niet meegeleverd): [B MIne toren Amsterdam](https://commons.wikimedia.org/wiki/File:B_MIne_toren_Amsterdam.jpg), [Woontoren Overhoeks](https://commons.wikimedia.org/wiki/File:Woontoren_Overhoeks.jpg), [BMine woontoren in Overhoeks](https://commons.wikimedia.org/wiki/File:BMine_woontoren_in_Overhoeks,_Amsterdam-noord.jpg).
