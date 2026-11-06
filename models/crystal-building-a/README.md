# Crystal Building A (Capelle aan den IJssel)

Vereenvoudigd, printbaar model van de glazen kantoorschijf aan de westkant van de Rivium Boulevard (201-231) op het Rivium, tegenover XO Hotels Rivium; Groep 5 Architecten, 2001, tien lagen. Samen met Crystal Building B aan de overkant vormt het een paar: beide schijven lopen in treden op naar de boulevard en eindigen daar in een "kristal", een dak dat schuin oploopt tot een hoge rand op de kopgevel.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `crystal-building-a.glb` | Model in meters, Y omhoog, één node `building:crystal-building-a` |
| `crystal-building-a.json` | Catalogusitem |
| `crystal-building-a-1-1000.stl` | Los te printen op 1:1000 (53 × 23 × 53 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[97107.5, 436472.0]`, in het hart van de schijf. De X-as loopt langs de lange gevels naar het oostnoordoosten, 17,47° linksom van RD-oost (richting van de zuidgevel in de BAG); Y wijst naar het noordnoordwesten. Lokaal z = 0 is NAP +5,0 m, het plein aan de zuid- en oostkant bij de entree; `groundHeight` is 48,5 m (NAP + circa 43,5) en `groundOffsetMetres` −0,15. Aan de noordkant ligt een sloot op NAP −1,1 en aan de westkant het maaiveld op +2,5 tot +3,5; daarom liggen de `groundSamplePoints` op het plein en loopt de onderkant van het model door tot NAP −2,0 (lokaal −7,0).

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Schijf | 52 × 15,3 m (BAG-contour, vier hoekpunten) | | BAG |
| Westdeel (u −26 tot −3) | | +27,45 m | 3D BAG, DSM |
| Middendeel (u −3 tot 11,3) | | +38,5 m | 3D BAG, DSM |
| Kristal (u 11,3 tot 26,3) | dak onder 37° tot u 21,3 (+46,0), daarna onder 47° | rand +50,7 m op de oostgevel | 3D BAG (vlakken 37,0° en 46,7°), DSM |
| Entreeblok | 6,6 × 6,4 m aan de zuidoosthoek | +9,5 m | BAG, 3D BAG |
| Kolommen | twee van 0,9 m onder het westelijke deel (u < −15,1), BGT-vlakjes van 0,2 m² | tot de eerste verdieping | BGT |
| Installatieblok westdak, liftopbouw middendak | 3,2 × 2,4 m en 3,6 × 2,7 m | +30,1 en +41,1 m | 3D BAG |

Lagen van 3,4 m vanaf +5,0 (tien lagen tot +39,0). Glasband per laag van +1,3 tot +3,1 m boven de vloer als blinde nis van 0,35 m diep, de begane grond als glazen plint van 0,5 m diep; het entreeblok twee glasbanden. Het schuine dak is glad gelaten.

## Geschat en weggelaten

- Verdiepingshoogte en gevelbanden zijn geschat uit de luchtfoto's; de 3D BAG en het DSM geven alleen de daken.
- Het westelijke deel staat volgens de BGT op kolommen; de twee kolommen staan op de BGT-vlakjes, de rest van de onderkant is vlak en krijgt in de print een wig.
- Weggelaten: een schuin glasvlak van 1 × 8 m aan de noordrand van het westdak (3D BAG 29,6-31,9 m), een insprong van 0,8 m in de zuidgevel bij het entreeblok, en installaties kleiner dan 0,9 m.

## Controle

`node scripts/generate-crystal-building-a.mjs` geeft `NoError`, genus 0 en één gesloten deel; twee keer draaien geeft byte-identieke bestanden. In de webshop controleert de test (samen met Crystal Building B) de daken en de beide dakvlakken van het kristal, de kolom en de open begane grond onder het westelijke deel, dat de glasbanden na de printcorrectie op 45° blijven, het printvolume (minder dan 6 % groei) en de plaatsing. Vier schuine aanzichten zijn naast de luchtfoto en de schuine luchtfoto van de gemeente gelegd.

## Bronnen

- PDOK BAG, pand `0502100000021052` (bouwjaar 2000; Rivium Boulevard 201-223); BGT (begane grond en kolommen); actuele orthoHR; AHN-DSM en -DTM 0,5 m; 3D BAG LoD2.2 (AHN5 2023).
- [Crystal Building A](https://www.pss-archi.eu/immeubles/NL-502-73263.html) op PSS-Archi (Groep 5 Architecten, 2001, tien lagen, circa 45 m) en [Crystal Building West](https://skyscraperpage.com/b63184) op SkyscraperPage.
- [Rivium Boulevard 301-321](https://capellebouwtaandestad.nl/project/rivium-boulevard-301-321), gemeente Capelle aan den IJssel: schuine luchtfoto met beide Crystal Buildings op de voorgrond (niet meegeleverd).
