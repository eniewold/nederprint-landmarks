# Blaak 8 (Rotterdam)

Vereenvoudigd, printbaar model van de kantoortoren Blaak 8 aan de Blaak bij de Oude Haven (2012, GROUP A met Dreissen Architecten), het hoofdkantoor van Stedin. De toren is opgebouwd als voet, romp en kop: een trapeziumvormige sokkel van zes lagen evenwijdig aan de verlengde Willemsbrug, met aan de zuidoostkant een lager deel met parkeergarage en installaties op het dak; daarop een rechthoekige romp van elf lagen die aan de westhoek over de sokkel uitkraagt; bovenop een kop van drie lagen waarvan de gevel aan de Blaak is weggedraaid, zodat aan de westhoek een driehoekig terras overblijft. De witte betonnen gevel draagt zelf en heeft smalle staande vensters op een travee van 1,8 m.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `stedin-blaak.glb` | Model in meters, Y omhoog, één node: `building:stedin-blaak-toren` |
| `stedin-blaak.json` | Catalogusitem |
| `stedin-blaak-1-1000.stl` | Los te printen op 1:1000 (27 × 61 × 73 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[93240.81, 437122.82]`, in het hart van de romp. De X-as loopt langs de gevel aan de Blaak van de noordhoek naar de westhoek (221,56° op RD-oost; de BAG-randen van de romp zijn binnen 0,3° evenwijdig), de Y-as langs de lange gevels naar het zuidoosten; de gevel met de ingang aan de Blaak ligt aan −Y. Lokaal z = 0 is NAP +3,9 m, het maaiveld langs de noordwest- en zuidwestgevel (AHN-DTM 3,9–4,05; 3D BAG 3,87). `groundHeight` is 47,43 m (ellipsoïdisch: NAP + 43,53, geoïde NLGEO2018 43,60, geijkt op de modellen OurDomain Rotterdam Blaak en De Witte Keizer) en `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Sokkel met lager deel | BAG-contour; zuidwestgevel in één lijn van het lagere deel tot de gevel aan de Blaak | +24,85 m | BAG, 3D BAG (24,80–25,02), foto (plafond uitkraging circa 24,7) |
| Romp | 23,75 × 39,75 m; kraagt aan de westhoek 5,9 m uit over de sokkel (vlak plafond) | +63,7 m | BAG, 3D BAG (terras 63,62–63,84) |
| Kop | romp met de gevel aan de Blaak gedraaid van de noordhoek tot 5,6 m terug aan de westhoek | +74,33 m | 3D BAG (74,30–74,40), foto's |
| Koelerblok op het dak | 2,1 × 9,1 m | +75,94 m | 3D BAG (75,90–75,97), ortho |
| Installatiesleuf in het dak | 3,7 × 9,9 m aan de zuidwestkant, met twee treden | +70,78, +72,06 en +73,52 m | 3D BAG |
| Installatiekast op het lagere deel | 7,7 × 4,9 m | +27,40 m | 3D BAG (27,33–27,46), foto |
| Drie installatietanks | Ø 2,6 m, op een rij naast de kast | +28,42 m | 3D BAG (28,40–28,44), foto |
| Twee lichtstraten op het lagere deel | 1,2 en 1,4 m breed, 15–19 m lang | +25,85 m | 3D BAG (25,15–26,40), AHN-DSM (+1 m) |
| Ingang aan de Blaak | portaal 4,4 m breed, 3,9 m hoog, 0,6 m diep | maaiveld | foto |

Gevelreliëf: begane grond 4,4 m, daarboven vijf sokkellagen tot +24,85 m, elf romplagen van 3,53 m en drie kooplagen van 3,54 m. Per laag staande vensters van 0,9 m breed op een travee van 1,8 m (een kwart van de basismaat van 7,2 m; 13 vensters per laag op de korte gevel, zoals op de foto's) als blinde nissen van 0,35 m met een plafond onder 45°; ongeveer één op de elf posities is een dicht paneel. Geen nissen in de noordoostgevel van de sokkel (buurpand tot NAP +23,7 m ertegen) en alleen in de bovenste sokkellaag van de zuidoostkop (buurpand tot +20,5 m).

## Geschat en weggelaten

- Naam: de taak noemde het gebouw "Kantoor Stedin (Blaak 8)"; het gebouw heet Blaak 8 en staat niet in de hoogbouwlijst van Rotterdam. Bouwjaar in de BAG 2011, oplevering 2012.
- De zuidwestgevel van de sokkel is als rechte voortzetting van die van het lagere deel genomen; dat geeft een uitkraging van 5,9 m aan de westhoek (op de frontale foto circa 5,4 m).
- Verdiepingshoogtes, het vensterraster, de plaats van de dichte panelen en de ingang zijn geschat; de echte vensters zijn trapeziumvormig en wisselen in breedte (zeven typen), hier één type van 0,9 m.
- Vorm van de installatiekast, de tanks en de lichtstraten op het lagere deel zijn uit de dakvlakken van de 3D BAG en één foto afgeleid.
- De sleuf in het dak houdt een wand van 0,94 m naar de zuidwestgevel; of die in het echt open is, is niet te zien.
- Weggelaten: de dakrand met de rail van de gevelonderhoudsinstallatie en de geparkeerde installatie zelf, de zonnepanelen, de schuine "boom"-voegen in de gevel en het opschrift STEDIN (kleiner dan 0,9 m of vlak in de gevel).

## Controle

`node scripts/generate-stedin-blaak.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert de test de dakhoogtes (kop, koelerblok, terras, sleuf, lagere deel en tanks), dat het plafond van de uitkraging open blijft, dat de vensternissen in de gevel aan de Blaak de printcorrectie op 45° overleven, dat het volume daarbij minder dan 1 % groeit (1,0028), één component en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0599100000755012` (bouwjaar 2011); actuele orthoHR; AHN-DSM en -DTM 0,5 m.
- 3D BAG LoD2.2, `NL.IMBAG.Pand.0599100000755012` (puntwolk AHN5 2023).
- [Lijst van hoogste gebouwen van Rotterdam](https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Rotterdam).
- [Blaak 8 op Divisare](https://divisare.com/projects/210530-group-a-ossip-van-duivenbode-blaak-8) (opbouw voet, romp en kop; gevel als boomstructuur, basismaat 7,2 m) en [PSS-archi](https://www.pss-archi.eu/immeubles/NL-599-43079.html) (70 m, twintig lagen, 2012).
- Foto's op Wikimedia Commons (niet meegeleverd): [Blaak 8 vanaf de Blaak](https://commons.wikimedia.org/wiki/File:1503_Blaak_8,_Rotterdam_026.jpg), [Kantoorgebouw Blaak 8](https://commons.wikimedia.org/wiki/File:Kantoorgebouw_Blaak_8.jpg), [Rotterdam - Blaak 8](https://commons.wikimedia.org/wiki/File:Rotterdam_-_Blaak_8.jpg).
