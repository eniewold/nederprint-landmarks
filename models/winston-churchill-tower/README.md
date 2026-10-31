# The Minister, voorheen Winston Churchill Tower (Rijswijk)

Vereenvoudigd, printbaar model van The Minister bij station Rijswijk, op de hoek van de Sir Winston Churchilllaan en de Prinses Beatrixlaan. Het gebouw is in 1971 gebouwd als kantoortoren voor het ministerie van CRM (later VWS), werd in 2001 tot op het casco gestript en opnieuw bekleed en heette toen de Winston Churchill Tower. In 2020–2022 heeft ZZDP Architecten het getransformeerd tot woontoren: om het bestaande casco kwam een nieuwe schil van erkers en balkons, en het oude installatiedak is vervangen door drie nieuwe lagen die rondom terugliggen. Met circa 84 m boven maaiveld is het het hoogste gebouw van Rijswijk.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `winston-churchill-tower.glb` | Model in meters, Y omhoog, één node `building:winston-churchill-tower` |
| `winston-churchill-tower.json` | Catalogusitem |
| `winston-churchill-tower-1-1000.stl` | Los te printen op 1:1000 (57 × 31 × 88 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[81366.8, 450096.0]`, in het hart van de toren. De X-as loopt langs de lange gevels naar het oostnoordoosten (26,03° op RD-oost; de BAG-randen zijn evenwijdig binnen 0,05°), Y haaks erop naar het noordnoordwesten. Lokaal z = 0 is NAP +0,5 m, het maaiveld aan de Prinses Beatrixlaan (AHN-DTM rondom: oost 0,52, noord 0,08, west −0,07, zuid 1,55 op de heuvel in het park). `groundHeight` is 43,9 m (NAP + 43,4, ellipsoïdisch; geoïde NLGEO2018 ter plekke 43,48, net als bij Hoogvoorde en De Generaal) en `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Onderste deel (begane grond en 20 lagen) | 3D BAG-grondvlak, 57,0 × 30,7 m | +73,55 m | 3D BAG (73,43–73,73) |
| Balkonkolommen van het onderste deel | vier per lange gevel, 5,4–6,9 m breed, en één in het midden van de westkop | bovenste balkonplaat +70,12 m | 3D BAG (70,04–70,22), foto's |
| Erkerkolommen | drie per lange gevel, 7,3–7,5 m breed, twee vensters per laag | tot +73,55 m, in de kroon tot +83,65 m | 3D BAG, foto's |
| Noordoosthelft en oostkop van het onderste deel | 5,0 en 2,9 m voor de kroon | +73,55 m | 3D BAG (73,47–73,65) |
| Drie nieuwe lagen (kroon) | 52,0 × 23,9 m, rondom 1,9–2,9 m terug | +73,55 tot +83,65 m | 3D BAG (83,65–83,66) |
| Dakterrassen in de bovenste laag | balkonkolommen 2,65 m (zuid) en 2,2 m (noord) terug, westkop 1,3 m | +80,06 m | 3D BAG (80,01–80,14), ortho |
| Installatiekast met zonnepanelen | 27,6 × 11,0 m | +87,31 m | 3D BAG (87,30–87,31), ortho |
| Installatieframe aan de westkant | 7,1 × 7,9 m | +86,04 m | 3D BAG (85,3–86,25), ortho |

Gevelreliëf: verdiepingshoogte 3,43 m (het hoogteverschil tussen de erkers en de balkonkolommen), begane grond 4,45 m, kroonlagen 3,26, 3,26 en 3,59 m. In de erkers per laag twee vensters van vloer tot plafond als blinde nissen van 0,35 m met een plafond onder 45° en kozijnen van 0,45–0,5 m; in de balkonkolommen per laag een open balkon van 1,6 m diep tussen de zijwanden van de erkers, met een plaat en borstwering van 1,0 m en een plafond onder 45°; op de begane grond een terugliggende pui. In de twintigste laag zijn de balkonkolommen van het onderste deel een open terras voor de kroon. Ingangen van de doorgaande lobby aan de zuid- en noordgevel als nis van 1,0 m.

## Geschat en weggelaten

- Naam: de opdracht noemt het gebouw Winston Churchill Tower; sinds de transformatie heet het The Minister (zo ook in de hoogbouwlijst van Haaglanden). Het BAG-bouwjaar 2001 is dat van de eerste renovatie; gebouwd in 1971.
- Het AHN4-DSM is van vóór de transformatie (oud dak op +77–78 m met een installatieverdieping tot +81,5 m); alle hoogtes en vormen komen uit de 3D BAG (AHN5, 2023).
- De BAG-contour is aan de westkant 3,6 m en aan de zuidkant 4,3 m ruimer dan het 3D BAG-grondvlak. Daar meten AHN4 en AHN5 geen dak (alleen maaiveld of geen punten); het gaat waarschijnlijk om de kelder of tuinmuren van de begane grond en het zit niet in het model.
- Verdiepingshoogte, venster- en balkonmaten zijn geschat uit de foto's van ZZDP. De gevelindeling van de oostkop en van het noordoostelijke deel staat op geen enkele foto: daar zijn gesloten gevelstroken met vensters aangenomen en op de noordoosthelft dezelfde afwisseling van erkers en balkons als op de zuidgevel.
- De kolomgrenzen zijn op beide lange gevels gelijk genomen (de 3D BAG wijkt op de noordgevel tot 0,4 m af); een terrasje van 4,6 × 1,4 m op +70,1 m aan de noordoostkant is weggelaten.
- De erkers en de voorkant van de balkonplaten liggen in één vlak; op foto's steken de balkonplaten soms iets verder uit.
- Weggelaten: glazen balkonhekken en dakrandhekwerk, de gevelonderhoudsinstallatie met haar rail op het dak, de lamellen van de installatiekast, lantaarns en de lage tuinmuren aan de voet (kleiner dan 0,9 m of los van het gebouw).

## Controle

`node scripts/generate-winston-churchill-tower.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert `tests/landmark-models.test.ts` het hoofddak, de installatiekast en het installatieframe, een dakterras en een erkertand in de kroon, het onderste deel en de bovenste balkonplaat, dat de balkons van de zuidgevel na de printcorrectie op 45° open nissen blijven (het printvolume groeit minder dan 1 %), en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG LoD2.2 en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0603100000005840`; actuele orthoHR; AHN-DSM en -DTM 0,5 m (AHN4); 3D BAG LoD2.2 (AHN5, 2023).
- [Lijst van hoogste gebouwen van Haaglanden](https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Haaglanden).
- [ZZDP Architecten, The Minister](https://www.zzdp.nl/project/the-minister) (foto's van de opgeleverde toren, niet meegeleverd).
- [Stedenbouw: The Minister, Rijswijk](https://stedenbouw.nl/en/?p=11248) en [SkyscraperPage](https://skyscraperpage.com/b6548).
- Foto op Wikimedia Commons van vóór de transformatie (niet meegeleverd): [Churchill Tower Rijswijk 2020](https://commons.wikimedia.org/wiki/File:Churchill_Tower_Rijswijk_2020.jpg).
