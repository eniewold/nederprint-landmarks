# Lloydtoren (Rotterdam)

Vereenvoudigd, printbaar model van de Lloydtoren op de kop van de Lloydpier (De Zwarte Hond, 2010), met de lagere woonblokken langs de Kratonkade die in hetzelfde BAG-pand liggen. De toren heeft 23 woonlagen in donker metselwerk met horizontale vensterbanden, balkonstapels op het zuiden, oosten en noorden, glazen loggia's in de bovenste lagen en op de westkop een dakterras binnen een gemetselde kroon met een groot venster naar het westen. Achter de toren liggen een westvleugel, twee sokkels van vijf lagen, twee oranje blokken van twaalf lagen en twee blokken van acht lagen, waarvan het zuidelijke een poort van vier lagen naar de binnentuin heeft.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `lloydtoren.glb` | Model in meters, Y omhoog, drie nodes: `building:lloydtoren-toren` (toren, westvleugel en westelijke sokkel), `building:lloydtoren-blok-a` (westelijk oranje blok) en `building:lloydtoren-blok-b` (oostelijk oranje blok, oostelijke sokkel en de twee blokken van acht lagen) |
| `lloydtoren.json` | Catalogusitem |
| `lloydtoren-1-1000.stl` | Los te printen op 1:1000 (160 × 61 × 77 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[90829.0, 435177.0]`, in het hart van de toren. De lokale X-as loopt langs de zuidgevel aan de Kratonkade (−3,33° op RD-oost, `xAxis` `[0.998312, -0.058087]`), Y haaks daarop naar het noorden. Lokaal z = 0 is NAP +3,6 m, het maaiveld langs de gevels (AHN-DTM 3,5–3,7; 3D BAG 3,56). `groundHeight` is 47,1 m (NAP 3,6 plus 43,52: geoïde 43,62 m, geijkt op Koninginnetoren en Hoofdpoort Rotterdam), `groundOffsetMetres` −0,15. `groundSamplePoints` liggen op straat en stoep rond het complex (DTM 3,6–3,8), niet op de lagere kade aan de Maas of in het water.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Toren | circa 32 × 12–23 m, noordgevel evenwijdig aan de schuine BAG-noordrand | +77,0 m | 3D BAG (76,99–77,03), AHN-DSM |
| Kroon om het dakterras | wanden 1,4 m, langs zuid-, west- en noordrand | +78,5 m | 3D BAG (78,49–78,51) |
| Dakterras westkop | 7,8 m breed, twee niveaus | +70,7 en +73,8 m | 3D BAG (70,4–71,1 en 73,75–73,89), AHN-DSM |
| Venster in de westwand | 8,8 × 4,6 m, posten 1,5 m, latei 3,2 m | +70,7 tot +75,3 m | foto's uit het westen en noordwesten |
| Loggiaband onder de zuidelijke latei | 20,6 m lang, 1,6 m diep | +70,7 tot +75,3 m | foto uit het zuidoosten |
| Installaties op het dak | 5,6 × 9,4 m, 2,8 × 4 m, 1,8 × 4,1 m | +78,5, +79,9, +77,85 m | 3D BAG |
| Balkonstapel zuid | 11 m breed, 2,0 m uit de gevel, lagen 5–17 | +20 tot +57 m | AHN-DSM (randen buiten de gevel), foto |
| Balkonstapel oost | 12 m breed, 2,2 m uit de gevel, op de sokkel, lagen 5–16 | +20 tot +54 m | AHN-DSM, foto |
| Balkonstapel noord | 12 m breed, 1,6 m uit de gevel, lagen 5–14 | +20 tot +48 m | AHN-DSM, foto uit het noordwesten |
| Glazen loggia's | oostgevel lagen 17–22, noordgevel lagen 16–22, 1,2 m diep | — | foto's |
| Westvleugel | circa 7 × 10 m | +26,1 m | 3D BAG (26,03–26,12) |
| Sokkels west en oost | 3D BAG-dakvlak, met dakrand langs de kade | +20,13 m (rand +20,77) | 3D BAG |
| Oranje blokken A en B | 3D BAG-dakvlak, hoekloggia's in de bovenste laag (tot +37,6), liftopbouwen | +40,87 en +40,81 m (lift +42,7) | 3D BAG |
| Noordoostblok | 3D BAG-dakvlak, dakrand 0,9 m, installatie | +28,95 m (rand +30,02, installatie +30,86) | 3D BAG |
| Zuidoostblok | onderbouw met terugliggende bovenlaag, installatie | +26,1 en +29,0 m (installatie +30,83) | 3D BAG |
| Poort zuidoostblok | 10 m breed, door het hele blok | tot +13,7 m | foto vanaf de Maas (vier van de acht lagen) |
| Opbouw op de oostelijke sokkel | circa 3,5 × 3,5 m | +22,0 m | 3D BAG |

Gevelreliëf: per laag vensters als blinde nissen van 0,35 m met een plafond onder 45°, alleen waar de gevel op die hoogte buitengevel is. Toren: brede vensterbanden van 3,4 m op 4,8 m (begane grond 4,4 m, daarboven 23 lagen van 3,0 m); woonblokken en sokkels: vensters van 1,8 m op 3,6 m. In de balkonstapels per laag een open balkon met een borstwering van 1,1 m en een plafond onder 45°; onder de zuid- en noordstapel een kraag onder 45° naar de gevel, de oostelijke staat op de sokkel.

## Geschat en weggelaten

- Het hele BAG-pand `0599100000754407` is gemodelleerd, want het vervangt de PDOK-reconstructie van het hele complex; de binnentuinen en de doorgang tussen de oranje blokken liggen in de BAG-contour (parkeergarage eronder) maar op maaiveld en zitten niet in het model.
- De oostgevel van de toren komt uit het DSM (dak tot 1,5–3 m binnen de 3D BAG-rand); de strook daarbuiten is de oostelijke balkonstapel. De 3D BAG trekt het dak daar door tot de BAG-rand.
- Breedte, uitsteek en bovenkant van de balkonstapels, de lagen met glazen loggia's, de maten van het westvenster, de loggiaband en de poort komen uit foto's en zijn geschat.
- Verdiepingshoogtes en de vensterrasters zijn geschat; de werkelijke gevels hebben onregelmatige vensterbanden (toren) en doorlopende balkons met glazen borstweringen (zuidoostblok).
- De poort heeft een vlak plafond zoals in het echt; de printcorrectie op 45° vult van beide open einden een wig naar binnen, waarna in het midden circa 3,3 m doorgang overblijft.
- Weggelaten: balkonhekken, de borstweringen in de loggia's en twee kleine insnijdingen in de bovenste laag van de oranje blokken (4 en 8 m², niet herkenbaar op 1:1000).

## Controle

`node scripts/generate-lloydtoren.mjs` geeft per node `NoError` en één gesloten deel (toren genus 2 door het westvenster en de loggiaband die in het terras uitkomt). In de webshop controleert de test de daken en het terras, het westvenster, de open balkons van de oostelijke stapel na de printcorrectie op 45°, de poort, de volumegroei door die correctie (toren 0,3 %, blok A 0 %, blok B 1,1 % door de wig in de poort) en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0599100000754407` (bouwjaar 2010); actuele orthoHR; AHN-DSM en -DTM 0,5 m.
- 3D BAG, `NL.IMBAG.Pand.0599100000754407` (LoD2.2, puntenwolk AHN5 2022).
- [Lloydtoren op Wikipedia](https://nl.wikipedia.org/wiki/Lloydtoren).
- Foto's op Wikimedia Commons (niet meegeleverd): [Lloydtoren vanaf de Maas](https://commons.wikimedia.org/wiki/File:Lloydtoren_Rotterdam.jpg), [Lloydkwartier vanaf het noordwesten](https://commons.wikimedia.org/wiki/File:Lloydkwartier_Rotterdam_2018_3.jpg), [Schiehaven vanaf de Maas](https://commons.wikimedia.org/wiki/File:Schiehaven,_Rotterdam-8156.jpg), [Schiehoofd](https://commons.wikimedia.org/wiki/File:2026_Schiehoofd,_Rotterdam_langs_Niewe_Maas_met_Lloydpier,_Katendrecht_en_Charloissehoofd.jpg).
