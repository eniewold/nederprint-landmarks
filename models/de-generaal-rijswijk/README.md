# De Generaal (Rijswijk)

Vereenvoudigd, printbaar model van De Generaal aan de Generaal Spoorlaan / Prinses Ariane Promenade in Rijswijk: het voormalige CRM-gebouw en belastingkantoor van Jan Lucas (Lucas & Niemeijer, 1966), het eerste jackblockgebouw van Nederland. Mei architecten bouwden het van 2016 tot 2021 om tot een woontoren van circa 200 appartementen: de oude gevel is gesloopt, de vloeren zijn tot de kelderrand verlengd en de nieuwe gevel is glas van vloer tot plafond tussen witte vloerranden. Op de korte gevels hangen balkonstapels in een verspringend patroon, in de lange gevels zit midden een strook loggia's en de bovenste laag springt midden in de lange gevels terug voor een dakterras.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `de-generaal-rijswijk.glb` | Model in meters, Y omhoog, één node `building:de-generaal-rijswijk-toren` |
| `de-generaal-rijswijk.json` | Catalogusitem |
| `de-generaal-rijswijk-1-1000.stl` | Los te printen op 1:1000 (52 × 29 × 66 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[81393.98, 450609.92]`, in het hart van de toren (de BAG-contour zonder de balkonstroken). De lokale X-as loopt langs de lange gevels naar het oostnoordoosten, 30,8° op RD-oost (gemiddelde van de lange BAG-randen, 31,2° en 30,4°); Y wijst naar het noordnoordwesten. Lokaal z = 0 is NAP +0,5 m (3D BAG-maaiveld 0,52, AHN-DTM rondom 0,29–0,59); `groundHeight` is 43,9 m (ellipsoïdisch) en `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Toren (pand `0603100000005789`) | 46,6 × 29,3 m, BAG-randen binnen 0,3 m recht gemaakt | +63,28 m | BAG, 3D BAG (dakvlak 63,27–63,30) |
| Balkonstroken op de korte gevels | 26,8 m breed, 2,52 m diep | stapels tot +22,1 / +35,7 / +59,5 m (vloer van het bovenste balkon) | BAG-contour, 3D BAG (59,45–59,56 en 21,98–22,46), foto's |
| Dakterras bovenste laag | midden in beide lange gevels, 13,8 m breed, 2,7 m diep | +59,5 m | 3D BAG (59,48–59,90) |
| Verdiepingen | eerste verdieping +5,1 m, daarna 17 lagen van 3,4 m | — | afgeleid uit de balkonhoogtes (laag 6 op +22,1, laag 17 op +59,5) |
| Loggiastrook | midden in de lange gevels, 6,2 m breed, lagen 1–16, 1,5 m diep | — | foto's (breedte), diepte geschat |
| Plint | lange gevels 1,5 m terug achter 8 kolommen per gevel, tot 0,9 m onder de eerste verdieping | +4,2 m | foto's, diepte en kolomafstand geschat |
| Stalen bordes op het dak | 26,4 × 13,4 m rond een platform van 19,5 × 7,6 m | +65,53 m, platform +63,67 m | 3D BAG |
| Installatiekast | 3,4 × 7,4 m op het bordes | +65,9 m | 3D BAG |
| Leidingkokers en kasten | zeven, 1,3–7 m breed | +64,04 tot +64,4 m | 3D BAG, ortho |

Balkonstapels per korte gevel (beide gelijk): lagen 1–10 twee buitenste stapels van 4,6 m, lagen 1–6 een middelste van 9,8 m, lagen 7–10 twee binnenste van 5,1 m, en lagen 11–17 twee brede blokken van 10,3 m met daartussen een glazen middenstrook van 6,2 m. Elk balkon is een open ruimte van 1,5 m diep met een plafond onder 45°, ook door de zijkanten heen; onder elke stapel loopt een kraag onder 45° naar de gevel.

Gevelreliëf: per laag een glasband als blinde nis van 0,35 m met een plafond onder 45°, tussen witte vloerranden van 0,9 m. De gevel is vrijwel helemaal glas van vloer tot plafond met smalle zwarte kozijnen die per woning verschillen; daarom is er per laag één doorlopende band per gevelvlak, met penanten van 0,9 m alleen op de hoeken en naast de loggia's. Op de korte gevels staan de banden alleen waar de gevel tussen de balkonstapels vrij is.

## Geschat en weggelaten

- Het AHN4-DSM is opgenomen tijdens de verbouwing (2018–2021): midden op het dak staat een bouwkraan tot NAP +86,1 m (p99 79,4), het zuidwestelijke eind van het dak en de zuidoostelijke gevelstrook zijn nog niet dicht. De 3D BAG (AHN5 2023) en de actuele ortho tonen geen kraan; alle hoogtes komen daarom uit de 3D BAG.
- Verdiepingshoogte en eerste verdieping zijn afgeleid uit twee balkonhoogtes van de 3D BAG en het aantal lagen op de foto's.
- Breedtes van de balkonstapels zijn geschat uit een frontale foto van een korte gevel; de andere korte gevel is gelijk verondersteld (de 3D BAG meet daar dezelfde hoogtes).
- De balkonstroken volgen de BAG-contour (1,25 m binnen de lange gevels); op de foto lijken ze bijna tot de hoeken te lopen.
- Bovenste balkons: de dichte rand van 0,9 m (plaat plus onderkant van de borstwering) staat 0,5 m boven de gemeten balkonvloer.
- Diepte van de loggia's en de plint, de kolomafstand en de kraag onder de balkonstapels zijn geschat; de echte balkonplaten hebben een vlakke onderkant.
- Weggelaten: de glazen borstweringen boven de dichte rand, de kozijnen en de ronde kolommen (kleiner dan 0,9 m; de kolommen staan er als blokken van 0,9 m in), de dakrand en de dunne liggers van het bordes (kleiner dan 0,9 m).
- Het winkelcentrum In de Bogaard en de parkeergarage ernaast zijn andere BAG-panden en zitten niet in het model.

## Controle

`node scripts/generate-de-generaal-rijswijk.mjs` geeft `NoError`, genus 12 (het bordes en de kolommen van de plint) en één gesloten deel. In de webshop controleert een test het dak, het bordes, het platform en de kast, het dakterras, de bovenkanten van de balkonstapels, dat een open balkon en een loggia na de printcorrectie op 45° open blijven, één component en de plaatsing op het maaiveld. Vier schuine aanzichten en de korte gevels zijn naast de 3D BAG-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0603100000005789` (bouwjaar 1968); 3D BAG LoD2.2 (AHN5 2023); actuele orthoHR; AHN-DSM en -DTM 0,5 m.
- [De Generaal (gebouw)](https://nl.wikipedia.org/wiki/De_Generaal_(gebouw)) op Wikipedia.
- Mei architecten: [De Generaal opgeleverd](https://mei-arch.eu/en/de-generaal-in-rijswijk-completed/) en [De Generaal in aanbouw](https://mei-arch.eu/en/generaal-under-construction/) (foto's niet meegeleverd).
