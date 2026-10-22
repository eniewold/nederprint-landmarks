# Avérotoren (Leeuwarden)

Vereenvoudigd, printbaar model van de Avérotoren aan de Lange Marktstraat in Leeuwarden (kantoren, 1991, Bonnema architecten, 17 lagen): een donkere glazen kubus in een zwart raster van grote vakken, met bovenop een open zwart kader rond de omloop. Aan de noordkant staat een smallere, hogere schacht met een verbindingsdeel naar de kubus; onderaan liggen lage vleugels aan de west- en oostkant, een lager deel aan de noordkant en een glazen entreehal.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `averotoren.glb` | Model in meters, Y omhoog, één node `building:averotoren` |
| `averotoren.json` | Catalogusitem |
| `averotoren-1-1000.stl` | Los te printen op 1:1000 (34 × 43 × 77 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[181925.93, 579114.73]`, het hart van de BAG-contour. De lokale X-as loopt langs de zuidgevel naar het oosten, −4,6° op RD-oost (de BAG-randen zijn binnen 0,2° evenwijdig of haaks); +Y wijst naar het noorden. Lokaal z = 0 is NAP +1,1 m, het maaiveld rondom; `groundHeight` is 42,3 m (ellipsoïdisch, PDOK-terrein) en `groundOffsetMetres` −0,15.

Het Achmeatoren-model (124 m oostelijker) vervangt alleen pand `0080100000352634` en reikt niet tot deze toren; er is geen overlap.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Glazen kubus | 22,8 × 22,5 m | +71,0 m | BAG, AHN-DSM (70,5–71,5) |
| Open dakkader | rand en kruisbalken van 1 m, 3 × 3 vakken | +73,0 m | AHN-DSM (72–73), foto's |
| Schacht | 9,4 × 8,2 m | +77,5 m | AHN-DSM (76–78), PDOK (76,2) |
| Verbindingsdeel | 6,5 × 4,2 m | +70,0 m | AHN-DSM |
| Lager noorddeel | BAG-contour tussen kubus en entreehal | +17,0 m | AHN-DSM (17–19) |
| Vleugels west en oost | BAG-contour | +15,0 m | AHN-DSM |
| Glazen entreehal | rest van de BAG-contour | +5,5 m | AHN-DSM (5–6), foto's |

Gevelraster: elke gevel van de kubus is drie vakken breed (stijlen van 0,9 m op de lijnen van het dakkader) en zes vakken hoog (regels van 0,9 m, elk vak circa drie lagen). Elk vak is een blinde nis van 0,35 m met een plafond onder 45°. De schacht heeft in de oost- en westgevel een smalle verticale vensterstrook.

## Geschat en weggelaten

- De verdeling van het raster in zes vakken hoog en de dikte van stijlen, regels en dakkader zijn op foto's geschat; de lijnen van het dakkader staan in het DSM.
- Het dakkader is open; het model heeft massieve balken van 1 m op het dak.
- Weggelaten: de nestkast voor de slechtvalk, de luifel van de entreehal en installaties kleiner dan 0,9 m.

## Controle

`node scripts/generate-averotoren.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert `tests/landmark-models.test.ts` de hoogtes van kubus, dakkader, schacht, verbindingsdeel, vleugels, noorddeel en entreehal, dat de rastervakken na de printcorrectie op 45° achter het kader blijven liggen, één component en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de PDOK-reconstructie en de foto's gelegd en het model is op de kaart en in een preview-export op 1:1000 bekeken.

## Bronnen

- PDOK BAG, pand `0080100000336057` (bouwjaar 1990); actuele orthoHR; AHN-DSM en -DTM 0,5 m; PDOK 3D-gebouwtegel (LoD2.2).
- [Wikipedia: Avérotoren](https://nl.wikipedia.org/wiki/Averotoren).
- Foto's op Wikimedia Commons (niet meegeleverd): [vanaf de straat](https://commons.wikimedia.org/wiki/File:Averotoren_Leeuwarden.jpg), [raster](https://commons.wikimedia.org/wiki/File:Averotoren_achmeatoren.jpg), [vanaf de Achmeatoren](https://commons.wikimedia.org/wiki/File:20130608_Uitzicht_Achmeatoren_Leeuwarden_NL_(2).jpg), [met de schacht](https://commons.wikimedia.org/wiki/File:20180721_540_leeuwarden.jpg).
