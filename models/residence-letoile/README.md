# Résidence L'Étoile (Amsterdam)

Vereenvoudigd, printbaar model van de woontoren Résidence L'Étoile aan de Van Leijenberghlaan 20–84 in Buitenveldert (1997, Ellerman Lucas Van Vugt), aan de noordoosthoek van winkelcentrum Gelderlandplein. De toren heeft 23 lagen: een beige schijf in noord-zuidrichting met een verticale naad in de kopgevels, aan weerszijden vleugels die in drie stappen naar buiten springen (de "ster") en naar buiten toe lager eindigen, glazen erkers op de buitenste stap, in de twee zuidelijke binnenhoeken een stapel balkons met glazen borstwering, en op het dak een opbouw met de penthouse aan de noordkop.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `residence-letoile.glb` | Model in meters, Y omhoog, één node `building:residence-letoile` |
| `residence-letoile.json` | Catalogusitem |
| `residence-letoile-1-1000.stl` | Los te printen op 1:1000 (25 × 24 × 73 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[120353.1, 482775.0]`, in het hart van de schijf. De X-as loopt langs de kopgevels naar het oosten (−0,35° op RD-oost; de BAG-randen zijn binnen 0,1° evenwijdig), Y langs de schijf naar het noorden. Lokaal z = 0 is NAP −0,65 m, het maaiveld rondom (AHN-DTM −0,86 tot −0,58, 3D BAG −0,62); `groundHeight` is 42,4 m (NAP −0,65 plus de geoïde NLGEO2018 van 43,05 m ter plekke) en `groundOffsetMetres` −0,15.

## Onderdelen en maten

De plattegrond is de BAG-contour, vereenvoudigd en gespiegeld om de lengteas (de twee helften wijken minder dan 0,05 m af).

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Schijf | 11,4 × 23,6 m | +67,95 m | BAG, 3D BAG (67,93–67,96) |
| Dakopbouw midden op de schijf | 4,9 × 10,0 m | +69,65 m | 3D BAG (69,62–69,68) |
| Penthouse aan de noordkop | 3,5 × 6,1 m, gelijk met de noordgevel | +71,2 m | 3D BAG (71,19–71,24), AHN-DSM |
| Installatiekast aan de zuidkant | 1,5 × 2,5 m | +70,3 m | AHN-DSM (69–71) |
| Binnenste stap van de vleugels | 2,7 m breed, tot 1,5 m voor de noordgevel | +65,0 m | BAG, 3D BAG (64,84–65,05) |
| Middelste stap en noordkant van de vleugels | 2,7 m breed | +62,3 m; midden (7,5 m lang) +65,0 m | BAG, 3D BAG (61,6–62,7), AHN-DSM |
| Buitenste stap (glazen erker) | 1,3 × 8,7 m | +59,2 m | BAG, 3D BAG (59,10–59,19) |
| Balkonstapels in de zuidelijke binnenhoeken | L-vorm 3,8 × 3,2 m plus 1,1 × 4,0 m, buiten de BAG-contour | +4,5 m boven maaiveld tot +59,2 m | AHN-DSM (59–60 buiten de contour), foto's |

Gevelreliëf: begane grond 4,5 m, daarboven lagen van 3,0 m. Per laag vensters van 1,5 m op een travee van 2,4 m als blinde nissen van 0,35 m met een plafond onder 45°, ook op elke trede van de getrapte hoeken; achter een terugsprong begint het venster boven het lagere dak. Op de buitenste stap en rond de penthouse per laag een doorlopende raamband. In de kopgevels een verticale naad van 0,9 × 0,4 m vanaf de eerste verdieping tot boven de dakrand. In de balkonstapels per laag een open balkon van 0,9 m diep achter een borstwering van 1,0 m, rondom de hoek zonder hoekkolom; onder de stapels een kraag onder 45° naar de gevels. De ingang aan de Van Leijenberghlaan is een nis van 3,0 × 3,0 m onder de oostelijke erker.

## Geschat en weggelaten

- Naam: Résidence L'Étoile (opschrift boven de ingang; in de hoogbouwlijst "Residence l'Etoile", 72 m, 23 lagen, 1997).
- Verdiepingshoogte (4,5 m en 3,0 m) en het vensterraster zijn geschat; de foto's tonen één venster per trede van de getrapte hoeken.
- De glazen erker aan de westkant is gespiegeld van de oostkant (aan de westkant geen foto).
- De plaats van de naad (0,6 m westelijk van het midden) komt uit twee schuine foto's; de echte naad is smaller dan 0,9 m.
- De onderkant van de balkonstapels (eerste verdieping) en hun kraag zijn geschat; volgens een foto staan ze op een kolom.
- De plaats en maat van de ingang zijn geschat.
- Weggelaten: de mast en de schotels op het dak en de glazen borstweringen zelf (kleiner dan 0,9 m), de stijlen van de glasgevels (vlak in de gevel). Het aangebouwde winkelcentrum Gelderlandplein (pand `0363100012241555`, +6 m) hoort er niet bij.

## Controle

`node scripts/generate-residence-letoile.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert `tests/landmark-models.test.ts` de dakhoogtes van alle bouwdelen, dat de balkonstapel en de naad na de printcorrectie op 45° open blijven, dat het volume minder dan 1 % groeit, één component en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0363100012092125` (bouwjaar 1997, Van Leijenberghlaan 20–84); actuele orthoHR; AHN-DSM en -DTM 0,5 m; 3D BAG LoD2.2 (AHN5, 2023).
- [Lijst van hoogste gebouwen van Amsterdam](https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Amsterdam).
- Foto's op Wikimedia Commons (niet meegeleverd): [Van Leijenberghlaan 20-84](https://commons.wikimedia.org/wiki/File:Van_Leijenberghlaan_20-84.jpg), [Winkelcentrum Gelderlandplein, noordgevel (1)](https://commons.wikimedia.org/wiki/File:Winkelcentrum_Gelderlandplein,_noordgevel_(1).jpg), [Gelderlandplein (panoramio)](https://commons.wikimedia.org/wiki/File:Gelderlandplein_-_panoramio.jpg).
