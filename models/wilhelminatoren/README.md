# Wilhelminatoren (Rotterdam)

Vereenvoudigd, printbaar model van de Wilhelminatoren aan het Wilhelminaplein op de Kop van Zuid (kantoren, 1997), aan het zuidelijke landhoofd van de Erasmusbrug naast de Maastoren: een rechthoekige witte toren met vensterkolommen tussen lisenen en aan de noordwestkant een lagere, afgeronde schijf met rood-witte raambanden. Tussen beide steekt de liftschacht boven de ronde schijf uit; op het dak staat een open installatiekader. De zuidwestelijke helft van het torendak ligt 3 m lager dan de noordoostelijke.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `wilhelminatoren.glb` | Model in meters, Y omhoog, één node `building:wilhelminatoren` |
| `wilhelminatoren.json` | Catalogusitem |
| `wilhelminatoren-1-1000.stl` | Los te printen op 1:1000 (48 × 24 × 90 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[93452.22, 435875.65]`, het hart van de BAG-contour. De lokale X-as loopt langs de zuidwestgevel van de toren naar het zuidoosten, −35° op RD-oost (de BAG-randen zijn binnen 0,1° evenwijdig of haaks); +Y wijst naar het noordoosten (de Maas). Lokaal z = 0 is NAP +3,9 m, het maaiveld aan de noordoostkant; het plein aan de zuidwestkant ligt op +4,7 m. `groundSamplePoints` liggen aan de noordoostkant, `groundHeight` is 47,6 m (ellipsoïdisch, PDOK-terrein) en `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Toren, noordoostelijke helft | 22,1 × 13,1 m | +83,5 m | BAG, AHN-DSM (83–84) |
| Toren, zuidwestelijke helft | 22,1 × 7,1 m | +80,5 m | AHN-DSM (79,5–82) |
| Afgeronde schijf | BAG-contour (vereenvoudigd tot 8 cm), 25,7 × 23,7 m | +75,3 m | BAG, AHN-DSM (75–76) |
| Liftschacht | 9,3 × 8,0 m | +84,0 m | AHN-DSM |
| Installatiekader | 19 × 1,6 m | +93,0 m | AHN-DSM (86–94, open kader) |

Gevelreliëf: de toren heeft per laag vensters van 1,4 m op een travee van 2,4 m (blinde nissen van 0,35 m met een plafond onder 45°), de afgeronde schijf een doorlopende raamband per laag van 0,35 m diep waarvan het plafond in drie stappen van 0,12 m terugloopt.

## Geschat en weggelaten

- De naam en het gebouw zijn niet op Wikipedia beschreven (de link in de backlog is een doorverwijspagina); het pand is herkend aan de BAG-contour, het AHN en foto's op Wikimedia Commons die bij het Wilhelminaplein zijn gemaakt. Nakijken of de naam klopt.
- Verdiepingshoogte (begane grond 5,0 m, daarboven 3,55 m), vensterstramien en raambanden zijn op foto's geschat.
- Het installatiekader is open; het model heeft een dichte plaat van 1,6 m dik.
- Weggelaten: de luifels en de glazen overkapping aan het plein (dun) en een eventuele doorgang op de begane grond (niet uit de bronnen te maten).

## Controle

`node scripts/generate-wilhelminatoren.mjs` geeft `NoError`, genus 1 en één gesloten deel. In de webshop controleert `tests/landmark-models.test.ts` de twee torendaken, de ronde schijf, de liftschacht en het kader, dat de raambanden na de printcorrectie op 45° open blijven, één component en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de PDOK-reconstructie en de foto's gelegd en het model is op de kaart en in een preview-export op 1:1000 bekeken.

## Bronnen

- PDOK BAG, pand `0599100000691047` (bouwjaar 1997); actuele orthoHR; AHN-DSM en -DTM 0,5 m; PDOK 3D-gebouwtegel (LoD2.2).
- [Wikipedia: Wilhelminaplein (Rotterdam)](https://nl.wikipedia.org/wiki/Wilhelminaplein_(Rotterdam)).
- Foto's op Wikimedia Commons (niet meegeleverd): [toren met ronde schijf](https://commons.wikimedia.org/wiki/File:Rotterdam,_The_Netherlands_(30580639771).jpg), [Wilhelminaplein](https://commons.wikimedia.org/wiki/File:Wilhelminaplein_-_panoramio.jpg), [plint](https://commons.wikimedia.org/wiki/File:-_panoramio_(2705).jpg).
