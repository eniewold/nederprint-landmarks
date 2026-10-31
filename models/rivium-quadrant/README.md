# Gemini I en II (Capelle aan den IJssel)

Vereenvoudigd, printbaar model van de twee kantoortorens aan het Rivium Quadrant op het Rivium, bij de Van Brienenoordbrug en zichtbaar vanaf de A16. Gemini I (Rivium Quadrant 81, 1995, met de reclame van Schouten Zekerheid) en Gemini II (Rivium Quadrant 141–181, 1998, vroeger met de reclame van Ballast Nedam) zijn ontworpen door VTBS (Van Tilburg, Banvard & Soderbergh) voor Van Vlymen Vastgoed en hebben elk 19 lagen. Ze staan op het halfronde parkeerdek rond een ronde vijver.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `rivium-quadrant.glb` | Model in meters, Y omhoog, twee nodes: `building:rivium-quadrant-gemini-i` en `building:rivium-quadrant-gemini-ii` |
| `rivium-quadrant.json` | Catalogusitem |
| `rivium-quadrant-1-1000.stl` | Los te printen op 1:1000 (69 × 67 × 80 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[96607.2, 436508.25]`, midden tussen de twee torens. De X-as loopt langs de zuidgevels, 11,32° linksom van RD-oost (de BAG-randen van beide torens liggen binnen 0,05° op die richting); Y wijst naar het noordnoordwesten. Lokaal z = 0 is NAP +4,75 m, de bestrating rond de vijver; `groundHeight` is 48,25 m (NAP + 43,50: geoïde NLGEO2018 43,60 ter plekke, geijkt op Ien Dalesshof en Hoge Maas) en `groundOffsetMetres` −0,15. Het parkeerdek rond de torens ligt circa 2 m hoger (NAP +6,5 tot +7) en zit in het terrein, niet in het model; `groundSamplePoints` liggen op de bestrating aan de vijver, zodat het model niet naar het water of naar het dek zakt.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Gemini I, armen (pand `0502100000021139`) | kruis van 10,2 m breed over het vierkant van 22,25 m met hoekinkepingen van 1,7 m | +67,8 m | BAG, 3D BAG LoD2.2 (AHN3), AHN4-DSM zuidhelft 68–69 |
| Gemini I, donkere hoekblokken | per hoek drie treden: 1,5 m langs de armen, dan 1,0 m, dan de buitenhoek | +61,1 / +44,2 / +27,2 m | 3D BAG, AHN4-DSM (61), foto's |
| Gemini I, reclameblok | 10,2 × 10,2 m in het midden | +76,6 m | 3D BAG, AHN4-DSM 77 |
| Gemini I, vakwerkkubus | vier stijlen van 0,9 m op 5,1 m, balken met een V-onderkant onder 45° | +83,8 m | AHN4-DSM (hoogste punt), foto's |
| Gemini I, vakwerkschermen | op de oost- en westarm naast het reclameblok, 1,2 × 5 m | tot +76,6 m | foto's |
| Gemini I, entreepaviljoen | halve schijf van 6,5 × 5,8 m aan de zuidgevel | 4,0 m boven maaiveld | orthofoto (vorm), hoogte geschat |
| Gemini II, schacht (pand `0502100000021143`) | BAG-contour, 22,3 × 19,5 m met gebogen noordgevel en uitbouw van 2,9 m | +68,0 m | BAG, 3D BAG LoD2.2 (AHN4) |
| Gemini II, glazen opbouw | 19,6 × 17,0 m, twee lagen | +74,7 m | 3D BAG, AHN4-DSM 75 |
| Gemini II, pergola | langs west- en zuidrand, 1,5 m dik, 2,2–2,4 m uitkragend, kraag onder 45° | bovenkant +74,7 m | orthofoto, foto's |
| Gemini II, witte kroon | 13,3 × 14,3 m | +81,6 m | 3D BAG, AHN4-DSM 82 |
| Gemini II, donkere schijven | aan noord- en zuidkant van de kroon, 2 m dik, oosteinde rond aflopend | +82,9 m, oosteinde +79,4 m | 3D BAG, AHN4-DSM 83; ronding van foto |
| Gemini II, installatieblok | 4,9 × 4,8 m | +84,2 m | 3D BAG |
| Gemini II, aanbouw oostkant | BAG-contour, circa 8 × 14 m | +12,9 m | BAG, 3D BAG |

Gevelreliëf: Gemini I heeft op elke witte armkop per laag vier vensters van 1,2 m naast een doorgaande verticale sleuf van 1,2 m en in de bovenste twee lagen per kant een achthoekige patrijspoort; de donkere hoekblokken hebben per laag een glasband. Gemini II heeft op de witte west- en oostgevel vensters van 1,5 m op een travee van 2,7 m, en op de donkere noord- en zuidgevel per laag een glasband met een witte penant van 2,4 m in het midden; de glazen opbouw en de aanbouw hebben glasbanden. Alle nissen zijn 0,35 m diep met een plafond onder 45°. Lagen: begane grond 5,0 m, daarboven 18 lagen van 3,2 m.

## Geschat en weggelaten

- De taaknaam was "Rivium Quadrant" (de straat); de torens heten Gemini I en Gemini II.
- De noordhelft van beide torens is in het AHN4-DSM ruis. Gemini I is daar symmetrisch aangevuld (de 3D BAG op AHN3 en de foto's bevestigen dat); bij Gemini II zijn de kroon en de noordelijke schijf tot v = 8,5 m genomen en ligt de uitbouw op +68,0 m zoals de 3D BAG aangeeft. Een klein dakvlak van +8,7 m in de noordoosthoek van Gemini II (3D BAG) en een hellend strookje van +70,7–71,0 m op de westarm van Gemini I zijn weggelaten.
- De kroonvlakken van de 3D BAG voor Gemini II zijn scheef (circa 11°); ze zijn rechtgezet in het gebouwstelsel. De zuidrand van de schacht (3D BAG +68,6 m) staat op +68,0 m.
- De ronding aan het oosteinde van de donkere schijven (3,5 m), de plaats en maat van de vakwerkschermen en de pergola, de hoogte van het entreepaviljoen en de verdiepingsindeling zijn geschat uit foto's.
- Weggelaten: de mast op de vakwerkkubus, de gevelreclame, de glazenwassersgiek en de witte lamellen langs de noordwesthoek van Gemini II (alle kleiner dan 0,9 m), en het parkeerdek (terrein, geen BAG-pand).

## Controle

`node scripts/generate-rivium-quadrant.mjs` geeft per toren `NoError` en één gesloten deel (Gemini I genus 4 door de vakwerkkubus, Gemini II genus 0). In de webshop controleert de test de daken van alle bouwdelen, de ronding van de schijf, dat de vensternissen van Gemini II en de glasbanden van Gemini I na de printcorrectie op 45° blijven, dat het printvolume minder dan 1 % groeit, één component per toren en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, panden `0502100000021139` (bouwjaar 1995) en `0502100000021143` (bouwjaar 1998); actuele orthoHR; AHN-DSM en -DTM 0,5 m; 3D BAG LoD2.2.
- [Rivium](https://nl.wikipedia.org/wiki/Rivium) op Wikipedia; [Gemini I](https://www.pss-archi.eu/immeubles/NL-502-73261.html) en [Gemini II](https://www.pss-archi.eu/immeubles/NL-502-73260.html) op PSS-Archi (architect, bouwjaar, 19 lagen).
- Foto's op Wikimedia Commons (niet meegeleverd): [zicht op het Rivium](https://commons.wikimedia.org/wiki/File:Capelle_ad_IJssel,_zicht_op_het_Rivium_foto1_2013-07-07_15.56.jpg), [Rivium](https://commons.wikimedia.org/wiki/File:Rivium.jpg), [kantoorgebouw](https://commons.wikimedia.org/wiki/File:Capelle_aan_den_IJssel_-_Rivium_-_kantoorgebouw.jpg).
