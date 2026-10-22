# 2Amsterdam (Amsterdam)

Vereenvoudigd, printbaar model van 2Amsterdam aan de Eduard van Beinumstraat op de Zuidas: twee kantoortorens uit 1992 (W.Th. Ellerman, toen de Stibbe Torens) die in 2018–2021 door KCAP zijn verbouwd. De naar elkaar gekeerde gevels zijn gebogen. De westelijke toren is verhoogd tot hoteltoren met een glasgevel met verticale vinnen; de oostelijke is kantoor gebleven, met een gebogen glazen schild dat lager is dan het blok erachter. Beide torens hebben lage vleugels, en aan de noordkant staat het toegangspaviljoen van de parkeergarage die sinds 2021 onder het complex ligt.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `2amsterdam.glb` | Model in meters, Y omhoog, drie nodes: `building:2amsterdam-hoteltoren`, `building:2amsterdam-kantoortoren` en `building:2amsterdam-garagepaviljoen` |
| `2amsterdam.json` | Catalogusitem |
| `2amsterdam-1-1000.stl` | Los te printen op 1:1000 (67 × 92 × 86 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[119840.0, 483700.0]`, tussen de twee torens. De lokale X-as loopt naar het oosten langs de zuidgevels, 3,0° linksom op RD-oost (de BAG-randen zijn binnen 0,1° evenwijdig of haaks); +Y wijst naar het noorden. Lokaal z = 0 is NAP +0,8 m, het maaiveld rondom; `groundHeight` is 43,6 m (ellipsoïdisch, PDOK-terrein) en `groundOffsetMetres` −0,15.

`replacesBuildings` bevat beide torens en ook de parkeergarage (pand `0363100012252214`): de PDOK-reconstructie van dat pand neemt de punten van de kantoortoren mee tot circa 70 m boven maaiveld en zou anders door het model steken. De garage zelf ligt onder het maaiveld; alleen het toegangspaviljoen staat erboven en zit als eigen node in het model.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Hoteltoren | 22,9 × 43,4 m, rechte westgevel, gebogen oostgevel | +75,3 m | BAG-boog (noordhelft, zuidhelft gespiegeld), AHN-DSM (74–76), hoogbouwlijst (73,4 m) |
| Installatieopbouw hoteltoren | 9,5 × 13 m | +86,0 m | AHN-DSM (82–87) |
| Lage vleugels hoteltoren | oost 11,8 × 20,4 m, noord 8 × 27 m | +9,2 en +8,3 m | BAG, AHN-DSM |
| Kantoortoren | gebogen schild (BAG-boog) tot u = 10 m, blok tot u = 20,5 m, 43,5 m lang | schild +61,0, blok +65,5 m | BAG, AHN-DSM (60–63 en 64–66) |
| Installatiekast kantoortoren | 3 × 9 m | +68,0 m | AHN-DSM |
| Lage vleugels kantoortoren | rest van de BAG-contour, tot u = 29,9 m | +22,5 m | BAG, AHN-DSM (19–23) |
| Garagepaviljoen | 6,9 × 12,5 m | +7,0 m | AHN-DSM |

Gevelreliëf: de hoteltoren heeft smalle vensterkolommen (1,0 m op een travee van 1,8 m) voor de vinnen, de kantoortoren en de lage vleugel een doorlopende glasband per laag; langs beide bogen loopt per laag een band van 0,35 m diep waarvan het plafond in drie stappen van 0,12 m terugloopt. De rechte nissen hebben een plafond onder 45°.

## Geschat en weggelaten

- De BAG geeft van de hoteltoren alleen de noordelijke helft van de boog (de oostvleugel ligt tegen de zuidhelft); de zuidhelft is gespiegeld en klopt met de dakrand in het AHN-DSM.
- De grens tussen het lage schild en het blok van de kantoortoren (u = 10 m) komt uit het DSM.
- Verdiepingshoogtes (hotel 3,4 m, kantoor 3,6 m, begane grond 4,5 m), de vinnen en de banden zijn op foto's geschat.
- Weggelaten: de groene inrichting en de bomen op het terrein boven de garage, luifels en de entreepuien (kleiner dan 0,9 m).

## Controle

`node scripts/generate-2amsterdam.mjs` geeft per toren `NoError`, genus 0 en één gesloten deel. In de webshop controleert `tests/landmark-models.test.ts` de daken van beide torens, hun opbouwen en vleugels en het paviljoen, de bolling van de gebogen hotelgevel, dat de glasbanden langs het schild na de printcorrectie op 45° open blijven, één component per node en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de PDOK-reconstructie en de foto's gelegd en het model is op de kaart en in een preview-export op 1:1000 bekeken.

## Bronnen

- PDOK BAG, panden `0363100012081222` (1985), `0363100012075036` (1992) en `0363100012252214` (2021); actuele orthoHR; AHN-DSM en -DTM 0,5 m; PDOK 3D-gebouwtegels (LoD2.2).
- [Wikipedia: 2Amsterdam](https://nl.wikipedia.org/wiki/2Amsterdam) en de [lijst van hoogste gebouwen van Amsterdam](https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Amsterdam).
- Foto's op Wikimedia Commons (niet meegeleverd): [hoteltoren 2025](https://commons.wikimedia.org/wiki/File:2Amsterdam_hoteltoren_in_2025.jpg), [kantoortoren 2019](https://commons.wikimedia.org/wiki/File:2Amsterdam_II_(2019.06.09).jpg), [vanaf de A10](https://commons.wikimedia.org/wiki/File:Zuidas_Strawinsky_01.jpg), [Strawinskylaan](https://commons.wikimedia.org/wiki/File:Zuidas_Strawinsky_02.jpg).
