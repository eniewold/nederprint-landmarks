# Crystal Building B (Capelle aan den IJssel)

Vereenvoudigd, printbaar model van de glazen kantoorschijf aan de oostkant van de Rivium Boulevard (202-234) op het Rivium, tegenover XO Hotels Rivium; Groep 5 Architecten, 2001, vijftien lagen. Het is het grotere spiegelbeeld van Crystal Building A aan de overkant: de schijf loopt in treden op naar de boulevard en eindigt daar in een "kristal", een dak dat onder 42° oploopt tot een rand van 71 m op de westgevel.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `crystal-building-b.glb` | Model in meters, Y omhoog, één node `building:crystal-building-b` |
| `crystal-building-b.json` | Catalogusitem |
| `crystal-building-b-1-1000.stl` | Los te printen op 1:1000 (70 × 23 × 78 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[97205.0, 436489.0]`, in het hart van de schijf. De X-as loopt langs de lange gevels naar het oosten, 2,64° linksom van RD-oost (richting van de noordgevel in de BAG); Y wijst naar het noorden. Lokaal z = 0 is NAP +5,2 m, het plein aan de boulevard bij de entree; `groundHeight` is 48,7 m (NAP + circa 43,5) en `groundOffsetMetres` −0,15. Aan de oostkant ligt het maaiveld op +1,6 en aan de noordkant op −0,5; daarom liggen de `groundSamplePoints` aan de westkant en loopt de onderkant van het model door tot NAP −2,0 (lokaal −7,2).

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Schijf | 69,4 × 15,3 m; beide lange gevels bollen 1,4 m naar het noorden (BAG-polylijn) | | BAG |
| Oostdeel (u 17,6 tot 34,7) | | +34,8 m | 3D BAG, DSM |
| Middendeel (u −5 tot 17,6) | | +38,5 m | 3D BAG, DSM |
| Westdeel (u −34,7 tot −5) | | +56,9 m | 3D BAG, DSM |
| Kristal (u < −18,5) | dak onder 41,6° oplopend naar de westgevel | rand +71,3 m (3D BAG 70,4-71,6) | 3D BAG, DSM (69 m aan de westrand) |
| Entreeblok | 6,7 × 6,3 m aan de zuidwesthoek | +9,5 m | BAG, 3D BAG |
| Kolommen | twee van 0,9 m onder het oostelijke deel (u > 21,7), BGT-vlakjes van 0,2 m² | tot de eerste verdieping | BGT |
| Liftopbouw op het westdak | 4,5 × 2,6 m | +59,5 m | 3D BAG |

Lagen van 3,46 m vanaf +5,2 (vijftien lagen tot +57,1; het westdak op +56,9 valt precies op laag 15). Glasband per laag van +1,3 tot +3,1 m boven de vloer als blinde nis van 0,35 m diep, de begane grond als glazen plint van 0,5 m diep; het entreeblok twee glasbanden. Het schuine glasvlak van het kristal is glad gelaten.

## Geschat en weggelaten

- Verdiepingshoogte en gevelbanden zijn geschat uit de luchtfoto's; de 3D BAG en het DSM geven alleen de daken.
- Het oostelijke deel (13 m) staat volgens de BGT op kolommen; de twee kolommen staan op de BGT-vlakjes, de rest van de onderkant is vlak en krijgt in de print een wig.
- Weggelaten: schuine glasstroken van 1 tot 2 m breed langs beide dakranden bij de sprong van +56,9 naar +38,5 m (3D BAG 42-49 m) en aan de noordoosthoek (36,5-39,6 m), en installaties kleiner dan 0,9 m.

## Controle

`node scripts/generate-crystal-building-b.mjs` geeft `NoError`, genus 0 en één gesloten deel; twee keer draaien geeft byte-identieke bestanden. In de webshop controleert de test (samen met Crystal Building A) de daken en het schuine dakvlak, de kolom en de open begane grond onder het oostelijke deel, dat de glasbanden na de printcorrectie op 45° blijven, het printvolume (minder dan 6 % groei) en de plaatsing. Vier schuine aanzichten zijn naast de luchtfoto en de schuine luchtfoto van de gemeente gelegd.

## Bronnen

- PDOK BAG, pand `0502100000021056` (bouwjaar 2000; Rivium Boulevard 202-234); BGT (begane grond en kolommen); actuele orthoHR; AHN-DSM en -DTM 0,5 m; 3D BAG LoD2.2 (AHN5 2023).
- [Crystal Building B](https://www.pss-archi.eu/immeubles/NL-502-73262.html) op PSS-Archi (Groep 5 Architecten, 2001, vijftien lagen, circa 59,5 m).
- [Rivium Boulevard 301-321](https://capellebouwtaandestad.nl/project/rivium-boulevard-301-321), gemeente Capelle aan den IJssel: schuine luchtfoto met beide Crystal Buildings op de voorgrond (niet meegeleverd).
