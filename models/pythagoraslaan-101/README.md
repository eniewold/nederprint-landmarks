# De Pyth, Pythagoraslaan 101 (Utrecht)

Vereenvoudigd, printbaar model van kantoortoren De Pyth aan de Pythagoraslaan in Rijnsweerd (1995, 17 lagen). Het ontwerp draait om één middelpunt: de laagbouw is een kwart cirkelschijf van 34 m straal die in een vijver steekt, en de zuidoosthoek van de toren is een kwart cirkel om hetzelfde punt. De toren bestaat uit een wit gebogen deel met horizontale raambanden, een lager noordblok met een dichte witte oostschijf, een donkerglazen dakopbouw en een donkerglazen cilinder aan de oostkant. Aan de zuidwestkant ligt een luifel boven het parkeerdek.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `pythagoraslaan-101.glb` | Model in meters, Y omhoog, drie nodes: `building:pythagoraslaan-101-toren`, `building:pythagoraslaan-101-waaier` en `building:pythagoraslaan-101-luifel` |
| `pythagoraslaan-101.json` | Catalogusitem |
| `pythagoraslaan-101-1-1000.stl` | Los te printen op 1:1000 (57 × 48 × 67 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[138739.04, 456081.78]`, het middelpunt van de waaier (cirkelfit op 36 BAG-punten, afwijking onder 2 cm). De X-as loopt langs de lange gevels, -9,45° op RD-oost (BAG-randen van toren en waaier evenwijdig binnen 0,2°); Y wijst naar het noordnoordoosten. Lokaal z = 0 is NAP +1,05 m (AHN-DTM rondom, 3D BAG-maaiveld 1,01). `groundHeight` is 44,4 m: NAP +1,05 plus de NLGEO2018-geoïde ter plekke (43,35). `groundOffsetMetres` is −0,15.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Gebogen witte deel | zuidgevel 13,3 m + kwart cirkel r 10,55 m | +60,9 m | BAG, AHN-DSM (60,8–61,0), 3D BAG |
| Noordblok | 24 × 12 m met gebogen noordwesthoek (r 11,23 m) | +53,9 m | BAG, DSM, 3D BAG (53,88; binnenstrook 54,35 meegenomen) |
| Opstand langs de witte oostschijf | 0,9 × 8,1 m | +55,06 m | 3D BAG |
| Kastje noordrand | 2,5 × 2,5 m | +56,3 m | 3D BAG (55,9–56,6) |
| Donkerglazen dakopbouw | 13,2 × 14,5 m, noordwesthoek afgeschuind | +66,75 m | DSM (66,7–66,8), 3D BAG |
| Vier dakkasten | 1,5 × 1,5 m en 2 × 1,5 m | +67,65 m | DSM (67,6–67,7), luchtfoto |
| Glazen cilinder oostzijde | r 1,9 m met koppelstuk | +63,8 m | BAG-contour, 3D BAG (63,75–63,82), foto |
| Glazen voeg westzijde | 1,9 × 4,1 m, 0,6 m terug | +53,9 m (geschat) | gat in het DSM, randen 53,5–55,9 |
| Ronde trappenhuizen west en zuid | r 1,95 m | +11,4 m | BAG-contour, 3D BAG |
| Waaier | kwart cirkel r 34,27 m, uitbouwen van 2,2 m tussen r 17,6 en 29,6 | zie hieronder | BAG, DSM-straalprofiel |
| Luifel (buiten het BAG-pand) | 22 × 17 m, dak 1,5 m dik | +11,4 m | DSM (11,3–11,4), luchtfoto |

Waaier, per straal (DSM-mediaan over -92° tot -18°, stappen van 0,5 m): binnenring vlak op +11,4 m tot r 12,6; ring 1 van +13,06 (r 13) oplopend met 0,262 m per m tot r 18,7; een lichtstrook die naar buiten kijkt; ring 2 van +12,74 (r 19) oplopend met 0,265 m per m tot +15,6 op r 29,8; een tweede lichtstrook naar buiten; daarna een schuine glazen rand die met 0,26 m per m afloopt tot de witte daklijst op +11,33 m aan de gevel (3D BAG 11,3–11,8; het DSM zakt daar door het glas heen).

Gevelreliëf: 17 lagen van 3,5 m vanaf NAP +1,4 (60,9 = 1,4 + 17 × 3,5; het noordblok eindigt na 15 lagen op 53,9). Per laag een doorlopende raamband van 1,7 m als nis van 0,35 m met een plafond dat in drie treden onder 45° terugloopt, rondom behalve op de dichte witte oostschijf, de witte eindpenant van het gebogen deel, de cilinder en de glazen voeg. Onder de luifel en de waaier (lagen 0–2) alleen op het noordblok. In de waaier zijn beide lichtstroken een nis van 0,35 m onder een witte rand, en de hoge glazen pui is een nis van 0,4 m tussen witte eindpenanten onder een witte daklijst van 1,15 m.

## Geschat en weggelaten

- Naam: de hoogbouwlijst noemt het gebouw "Pythagoraslaan 101 (De Pyth)", 65 m, 17 lagen, 1995; er is geen eigen pagina. Het adres is volgens de overheidsalmanak het bezoekadres van de provincie Utrecht.
- Verdiepingshoogte en raambanden komen uit één foto van de oostkant en de dakhoogtes; dat de west- en noordgevel ook raambanden hebben is aangenomen.
- De glazen voeg aan de westkant is een gat in het DSM (waarschijnlijk donker glas of een diepe nis); hoogte en terugligging zijn geschat. De 3D BAG legt er een hellend vlak van 58–60 m.
- De luifel ligt buiten het BAG-pand en vervangt dus geen PDOK-pand. Wat eronder staat, open of glas, is niet bekend. Het model zet er een dichte onderbouw onder die 1,5 m (noord en west) en 3,0 m (zuid, langs de rij BGT-pijlers) terugligt, met een kraag onder 45° of steiler, want een vrije plaat is op 1:1000 niet te printen.
- Hoogte van de lichtstroken, de witte randen en de glazen pui van de waaier zijn van de foto geschat; de daklijst op 11,33 m is uit de helling van de rand doorgetrokken.
- Weggelaten: het glazen windscherm met stalen frame op het dak van het gebogen deel (DSM-lijn op 62,2 m, dunner dan 0,9 m), de gevelonderhoudsinstallatie op het noordblok en de dunne radiale ribben in de glazen daken (kleiner dan 0,9 m). Ook weggelaten is de borstwering van 62,0 m die de 3D BAG alleen op de twee uiteinden van het gebogen deel vindt: het DSM toont langs de rand niets boven 61,0 m.

## Controle

`node scripts/generate-pythagoraslaan-101.mjs` geeft per node `NoError`, genus 0 en één gesloten deel. Het model ligt voor 77 % van de punten binnen 0,5 m van het AHN-DSM en voor 82 % binnen 1 m. De afwijkingen zitten op de glazen rand van de waaier (het DSM ziet door het glas), op gebouwranden en op het windscherm. In de webshop controleert een test de daken van toren, dakopbouw, cilinder, waaierringen en luifel. Hij controleert ook dat een raamband en de buitenste lichtstrook na de printcorrectie op 45° een nis blijven, dat elk onderdeel één component is, dat het volume minder dan 1 % groeit en dat het model goed op het maaiveld staat. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto gelegd.

## Bronnen

- PDOK BAG, pand `0344100000130837` (bouwjaar 1995); actuele orthoHR; AHN-DSM en -DTM 0,5 m; BGT-overbruggingsdelen bij het parkeerdek.
- 3D BAG, `NL.IMBAG.Pand.0344100000130837` (LoD2.2, AHN5 2023).
- [Lijst van hoogste gebouwen van Utrecht (stad)](https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Utrecht_(stad)).
- Foto op Wikimedia Commons (niet meegeleverd): [Pythagoraslaan 101](https://commons.wikimedia.org/wiki/File:Pythagoraslaan_101.jpg).
