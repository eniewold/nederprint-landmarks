# De Hoogt (Utrecht)

Vereenvoudigd, printbaar model van woontoren De Hoogt aan de Beneluxlaan en de Van Weerden Poelmanlaan in Kanaleneiland (1968, architecten H. Nefkens en Th. Benschop, opdrachtgever de Nationale Levensverzekeringsmaatschappij). Bij de opening was het de hoogste woontoren van Nederland. De toren heeft 18 woonlagen boven een kantoorsokkel van twee lagen. Om elke woonlaag loopt een balkonplaat met vaste stukken witte borstwering en open balkons met hekken. Bovenop zit een gesloten dakrand van ruim 4 m met daarop een liftopbouw. The Rock staat ernaast en is een apart model.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `de-hoogt-utrecht.glb` | Model in meters, Y omhoog, twee nodes: `building:de-hoogt-utrecht-toren` (toren, liftopbouw en de lage strook tegen de zuidoostgevel) en `building:de-hoogt-utrecht-sokkel` (kantoorsokkel rond de toren) |
| `de-hoogt-utrecht.json` | Catalogusitem |
| `de-hoogt-utrecht-1-1000.stl` | Los te printen op 1:1000 (35,5 × 50,3 × 67,9 mm), Z omhoog |

## Oorsprong en oriëntatie

De RD-oorsprong `[134803.57, 454678.18]` ligt in het hart van de BAG-contour, dus in het hart van de sokkel. De X-as loopt langs de korte torengevels naar het noordoosten (29,5° op RD-oost; de BAG-randen staan op 29,46° en 119,53°). De Y-as loopt langs de lange gevels naar het noordwesten. Lokaal z = 0 is NAP +1,36 m, het maaiveld uit de 3D BAG (AHN-DTM rondom 1,3–2,2). `groundHeight` is 44,81 m: NAP-maaiveld plus 43,45, de plaatselijke offset die ook het Piet van Dommelenhuis in Kanaleneiland gebruikt. `groundOffsetMetres` is −0,15.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Sokkel (pand `0344100000065643`) | BAG-contour, 35,5 × 50,3 m | +10,95 m | BAG; AHN-DSM 10,9–11,0, 3D BAG 10,95–11,03 |
| Toren, buitenrand van balkonplaten en dakrand | 23,5 × 34,5 m | +64,95 m | AHN-DSM 64,9–65,0 (scherpe randen aan de noordoost- en noordwestkant); 3D BAG 64,93–64,99, 70e percentiel 64,99 |
| Woonlagen | 18 lagen van 2,75 m vanaf het sokkeldak | +10,95 tot +60,45 m | foto's (18 balkonplaten onder de dakrand); 18 × 2,75 + 4,5 = 54,0 m |
| Dakrand | gesloten band van 4,5 m, gelijk met de balkonranden | +60,45 tot +64,95 m | foto's (circa 1,6 laag hoog) |
| Liftopbouw | 6,65 × 9,5 m | +68,0 m | AHN-DSM 67,98; 3D BAG 68,01–68,04 |
| Twee afzuigkokers tegen de liftopbouw | 1,15 × 1,0 m | +68,5 m | AHN-DSM |
| Lage strook tegen de zuidoostgevel | 23,0 × 5,3 m, één laag op de sokkel | +13,65 m | AHN-DSM 13,6–13,7; 3D BAG 13,64–13,70 |

Gevelreliëf:

- **Toren.** Per woonlaag een nis van 1,2 m diep achter de plaatrand, met een plafond onder 45° naar de plaat van de laag erboven. Zo blijft elke balkonplaat zonder steun printbaar. Waar een witte borstwering zit, begint de nis 1,3 m boven de vloer (plaat plus borstwering). Bij een open balkon begint hij 0,4 m boven de vloer, want het hek ontbreekt.
- **Indeling per gevel**, gemeten vanaf de hoek:
  - zuidwestgevel, vanaf de westhoek: wit 0–19,5, open 19,5–24, wit 24–28,8, open 28,8–34,5 m;
  - noordwestgevel, vanaf de noordhoek: open 0–5,5, wit 5,5–18, open 18–23,5 m.
- **Hoeken.** Een open balkon loopt om de hoek door als de buurgevel daar ook open is. Grenst het aan een witte borstwering, dan loopt de witte band om de hoek.
- **Sokkel.** Twee kantoorlagen van 4,8 m met vensters van 2,4 × 1,9 m op een travee van 3,6 m, als blinde nissen van 0,35 m.
- **Lage strook.** Een doorlopende glasstrook op de drie vrije gevels.

## Geschat en weggelaten

- De indeling van de noordoost- en zuidoostgevel is niet op foto's gevonden. Ze is puntsymmetrisch aangenomen met de zuidwest- en noordwestgevel.
- Geschat zijn:
  - de verdiepingshoogte van 2,75 m en de dakrand van 4,5 m, uit het aantal platen op foto's en de gemeten hoogtes;
  - de balkondiepte van 1,2 m, de hoogte van de borstwering en de stukken wit en open langs de gevels;
  - de vensters van de sokkel (2,4 × 1,9 m op 3,6 m) en de glasstrook van de lage strook.
- Buitenrand van de toren:
  - aan de noordoost- en noordwestkant is de rand scherp in het AHN;
  - aan de zuidwestkant vervuilen schuine treffers op de balkons het DSM over circa 1 m;
  - de maat 23,5 × 34,5 m gaat uit van een symmetrische toren. De 3D BAG geeft 22,6 × 33,4 m.
- Weggelaten:
  - de balkonhekken en het stalen frame op de noordoost- en noordwestrand van het dak, de oude draagconstructie van de lichtreclame (staven kleiner dan 0,9 m);
  - de ventilatiekastjes op het dak en op de liftopbouw (lager dan 0,9 m);
  - een lage opstand van circa 0,6 m op het sokkeldak langs de zuidwestkant van de toren;
  - de hellingbaan naar de parkeerkelder (op maaiveld);
  - de letters "Nationale-Nederlanden" en het N-logo, die op de foto van 1988 staan en in 2017 weg zijn.
- Entreeluifels zijn op de beschikbare foto's en de luchtfoto niet te herkennen en zitten niet in het model.

## Controle

`node scripts/generate-de-hoogt-utrecht.mjs` geeft per node `NoError` en één gesloten deel: de toren met genus 0, de sokkel als ring om de toren met genus 1.

De test `tests/landmark-models.test.ts` controleert:

- de hoogtes van torendak, liftopbouw, lage strook en sokkel;
- dat een open balkon en een witte borstwering op de zuidwestgevel na de printcorrectie op 45° hun diepte houden;
- één component per node en een volumegroei onder 1 %;
- de plaatsing op het maaiveld.

Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's van 1988 en 2017 gelegd.

## Bronnen

- PDOK BAG, pand `0344100000065643` (bouwjaar 1968); actuele orthoHR; AHN-DSM en -DTM 0,5 m; 3D BAG (LoD2.2, puntwolk AHN5 2023).
- [De Hoogt (toren)](https://nl.wikipedia.org/wiki/De_Hoogt_(toren)) op Wikipedia.
- Foto's op Wikimedia Commons (niet meegeleverd):
  - [Utrecht De Hoogt](https://commons.wikimedia.org/wiki/File:Utrecht_De_Hoogt.jpg) (2017);
  - [Toren De Hoogt te stad Utrecht](https://commons.wikimedia.org/wiki/File:Toren_De_Hoogt_te_stad_Utrecht.jpg) (1988, Het Utrechts Archief).
