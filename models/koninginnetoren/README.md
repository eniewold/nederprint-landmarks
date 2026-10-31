# Koninginnetoren (Rotterdam)

Vereenvoudigd, printbaar model van de Koninginnetoren aan de Boezemsingel (2001, Jorissen Simonetti architecten), op de grens van Kralingen en Crooswijk, op de plek van de in 1972 gesloopte Koninginnekerk. Een bakstenen woontoren van 26 lagen op een rechthoek met afgeschuinde hoeken, met in elke gevel teruggelegen stroken glazen serres en een kopergroene kroon van vier lagen: de gevelvelden tussen de stroken lopen als groene kaders door tot boven het dak, de stroken eindigen lager, zodat de kroon gekarteld is. Het groen herinnert aan de koperen torendaken van de kerk. Tegen de noordoosthoek staat een kantoor uit 1974 tot circa 40 m hoogte.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `koninginnetoren.glb` | Model in meters, Y omhoog, één node `building:koninginnetoren` |
| `koninginnetoren.json` | Catalogusitem |
| `koninginnetoren-1-1000.stl` | Los te printen op 1:1000 (22,3 × 20,0 × 79,0 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[93792.49, 438233.65]`, in het hart van de BAG-contour. De lokale X-as loopt langs de zuidgevel naar het oosten (−6,95° op RD-oost, BAG-randen evenwijdig binnen 0,1°), Y haaks erop naar het noorden. Lokaal z = 0 is NAP −0,2 m (AHN-DTM rondom −0,24, 3D BAG-maaiveld −0,17); `groundHeight` is 43,3 m (ellipsoïdisch: NAP −0,2 plus de geoïde-offset 43,5 van de modellen in het centrum, zoals Blaak 10 en de Hoofdpoort) en `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Schacht | 22,3 × 19,7 m, hoeken 1,95 m afgeschuind; oostgevel knikt bij Y = 1,8 een halve meter naar binnen | dak +74,3 m | BAG-contour; 3D BAG (AHN5 2023) 74,27–74,31, AHN-DSM p90 74,57 |
| Plint | twee lagen, hoge ramen tussen penanten van ≥ 0,9 m | tot +5,3 m | foto |
| Serrestroken | noord en zuid twee van 2,6 m (X ±3,2–5,8), oost en west één van 2,0 m in het midden; 1,2 m diep, vanaf de plint tot +71,5, daarboven 1,5 m diep tot boven de kroon | bovenkant strook +71,5 m | 3D BAG (inkepingen 71,44–71,54 in noord- en zuidgevel), luchtfoto, foto's |
| Kroonkaders | rand van 1,0 m langs de gevel | +74,8 m | AHN-DSM langs de gevels 74,6–75,2 |
| Middenkaders noord en zuid | 6,4 m breed, holle bovenrand (cirkelboog) | +75,1 aan de uiteinden, +74,5 in het midden | AHN-DSM (75,1 bij X ±3, 74,3 in het midden), foto |
| Dakopbouw | 8,8 × 9,7 m | +78,0 m | 3D BAG 77,97–78,02, AHN-DSM p99 78,3; Wikipedia: bouwhoogte 78 m |
| Noordoosthoek | gevuld tot de BAG-hoek, tegen het kantoor van 1974 (pand `0599100000611372`) | +40,4 m | BAG, 3D BAG 40,34–40,44 |

Gevelreliëf: 24 woonlagen van 2,8 m boven de plint; vensters van 1,3 m als blinde nissen van 0,35 m met een plafond onder 45° (noord en zuid één kolom per buitenveld en twee in het middenveld, oost en west twee kolommen aan weerszijden van de strook, één per afgeschuinde hoek); in de achterwand van elke serrestrook per laag een glasband van 0,35 m diep. Waar het kantoor van 1974 tegen de toren staat (noordgevel oostelijk deel, oostgevel noordelijk deel) beginnen vensters en de serrestrook pas boven +40,4.

## Geschat en weggelaten

- De serrestroken in de oost- en westgevel komen alleen uit de luchtfoto (een onderbreking in de groene kaders halverwege de oostgevel); de 3D BAG en het AHN laten ze niet duidelijk zien en er is geen foto van die gevels gevonden. Plaats en breedte (2,0 m in het midden) zijn geschat.
- De diepte van de serrestroken (1,2 m, in de kroon 1,5 m) is geschat uit de inkepingen in de 3D BAG en de schaduwen op de foto's; de BAG-contour loopt recht door, dus aan de voet is de strook niet teruggelegen.
- Verdiepingshoogte (plint 5,5 m, daarboven 2,8 m) en het vensterraster zijn geschat uit foto's; het raster van de oost- en westgevel is niet gezien.
- De hoogte van de kroonkaders (+74,8) en de holle bovenrand van de middenkaders komen uit het ruizige AHN4-DSM en de foto's.
- De vorm van de dakopbouw (een blok) is geschat; de luchtfoto toont een licht omrand blok met installaties.
- Weggelaten: de gevelonderhoudsinstallatie (arm op het dak) en antennes (dunner dan 0,9 m), de sprongetjes van 0,2–0,3 m in de west- en noordgevel van de BAG-contour, de lichte en donkere baksteenbanden en het groen van de kroon (alleen kleur), de open binnenkant van de kroonkaders (kleiner dan 0,9 m diep op de luchtfoto).
- Niet in het model: het kantoor van 1974 tegen de noordoosthoek (ander BAG-pand, blijft PDOK).

## Controle

`node scripts/generate-koninginnetoren.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert een test in `tests/landmark-models.test.ts` het dak, de dakopbouw, de kroonkaders en de holle middenkaders, de inkeping boven de serrestroken en de sleuf tot de plint, de noordoosthoek tegen het kantoor, de diepte van de vensternissen na de printcorrectie op 45°, de volumegroei (< 1 %) en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0599100000611391` (bouwjaar 2001) en buurpand `0599100000611372` (1974); actuele orthoHR; AHN-DSM en -DTM 0,5 m.
- 3D BAG, `NL.IMBAG.Pand.0599100000611391` (LoD2.2, puntwolk AHN5 2023).
- [Koninginnetoren (Wikipedia)](https://nl.wikipedia.org/wiki/Koninginnetoren).
- Foto's op Wikimedia Commons (niet meegeleverd): [Rotterdam toren koninginnetoren](https://commons.wikimedia.org/wiki/File:Rotterdam_toren_koninginnetoren.jpg), [vanaf de Vredenoordbrug](https://commons.wikimedia.org/wiki/File:Vredenoordbrug_-_Crooswijk_-_Rotterdam_-_View_from_the_bridge_towards_the_Koninginnetoren_in_the_north.jpg).
