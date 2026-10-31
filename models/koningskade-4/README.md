# Kantoor Koningskade 4 (Den Haag)

Vereenvoudigd, printbaar model van het kantoorgebouw aan de Koningskade 4 bij het Malieveld (1967–1970, Gouwetor, Mulder en Tielman), gebouwd voor Rijkswaterstaat en sinds 2019 onder meer het hoofdkantoor van de Nederlandse Emissieautoriteit. Het gebouw heeft geen eigen naam en staat niet in de hoogbouwlijst van Den Haag. Een toren van 18 lagen met een vliesgevel van grijze borstweringen en vensters op een stramien van 1,8 m en een hogere kroonverdieping met verticale lamellen; op het dak een teruggezette installatieopbouw met een schoorsteenbundel. Aan de noordoostkant ligt een lange laagbouw van zes lagen met een ronde trommel en een installatiekast, via een tussenlid aan de toren gekoppeld.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `koningskade-4.glb` | Model in meters, Y omhoog, twee nodes: `building:koningskade-4-toren` en `building:koningskade-4-laagbouw` |
| `koningskade-4.json` | Catalogusitem |
| `koningskade-4-1-1000.stl` | Los te printen op 1:1000 (64 × 94 × 71 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[81504.0, 456077.0]`, in het hart van de toren. De X-as loopt langs de zuidoostgevel van de toren naar het noordoosten (25,9° op RD-oost; alle BAG-randen zijn evenwijdig of haaks binnen 0,2°), de Y-as haaks erop naar het noordwesten. Lokaal z = 0 is NAP +0,85 m, de ventweg en het parkeerterrein aan de noord- en oostkant; de tuin en de Koningskade aan de zuid- en westkant liggen op circa +2,45 m. `groundHeight` is 44,27 m (NAP +0,85 plus de lokale geoïdehoogte 43,42) en `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Toren (pand `0518100000302196`) | 39,8 × 29,0 m | +63,05 m | BAG, AHN-DSM (mediaan 63,02), 3D BAG (63,03–63,11) |
| Installatieopbouw | 27,9 × 17,3 m, 5,9 m terug van de lange gevels | +67,28 m | AHN-DSM (67,22), 3D BAG (67,27–67,29) |
| Twee liftopbouwen tegen de noordwestkant van de opbouw | 5,9 × 3,1 m en 5,6 × 2,5 m | +64,9 m | AHN-DSM (64,6–65,0), 3D BAG |
| Losse installatie bij de zuidwesthoek | 1,8 × 2,8 m | +64,5 m | 3D BAG (64,1–64,7) |
| Schoorsteenbundel (vier pijpen als één blok) | 3,5 × 1,1 m | +70,5 m | AHN-DSM (70,3–71,1), foto |
| Laagbouw | 15,6 × 88,4 m | +23,95 m | BAG, AHN-DSM (23,8–24,1) |
| Ronde trommel op de laagbouw | straal 4,9 m | +29,75 m | AHN-DSM (29,73–29,79), 3D BAG |
| Installatiekast op de laagbouw | 11,2 × 15,9 m | +28,15 m | AHN-DSM (28,09–28,26) |
| Verdiepte glazen strook langs de oostrand | 2,7 m breed, twee stukken | +22,75 m | AHN-DSM (12–21 met gaten), diepte geschat |
| Tussenlid tussen toren en laagbouw | 9,0 × 11,0 m | +23,0 m | AHN-DSM (mediaan 22,94), 3D BAG |
| Laag entreedeel | 9,0 × 5,9 m | +3,75 m | AHN-DSM (3,6–3,9), 3D BAG |

Gevelreliëf: op alle gevels per vak van 1,8 m een venster van 0,9 m breed als blinde nis van 0,35 m met een plafond onder 45° (22 vakken op de lange en 16 op de korte torengevels, 49 en 8 op de laagbouw). Toren: begane grond vanaf de tuin (+2,45) 3,9 m, 16 kantoorlagen van 3,2 m en een kroonverdieping van 5,5 m met hoge smalle vakken onder een dichte dakrand van 0,6 m. Laagbouw en tussenlid: begane grond vanaf +2,8 van 4,5 m en vijf lagen van 3,3 m.

## Geschat en weggelaten

- Naam: het gebouw heeft geen eigen naam; de taak noemt het naar het adres. Bouwjaren, architect en het aantal lagen komen van SkyscraperPage, het huidige gebruik van de foto van de NEa op Commons.
- Verdiepingshoogtes en de hoogte van de kroon zijn uit de foto's geschat en sluiten aan op de gemeten dakhoogte; het stramien van 1,8 m is geteld op een frontale foto van de zuidoostgevel (22 vakken). De echte vensters zijn breder dan 0,9 m met smalle stijlen; de nissen houden een penant van 0,9 m.
- De kroonlamellen staan in het echt op circa 0,9 m; in het model is het één hoge nis per vak van 1,8 m.
- De verdiepte strook langs de oostrand van de laagbouw is waarschijnlijk een glazen dak; het DSM meet daar 12–21 m met gaten. De diepte van 1,2 m is geschat.
- De vier schoorsteenpijpen zijn elk smaller dan 0,9 m en staan als één blok van 3,5 × 1,1 m in het model.
- Weggelaten: dakrandhekken, gevelonderhoudsrails en ventilatoren op de laagbouw, vlaggenmasten en een klein schuin dakje naast de trommel (kleiner dan 0,9 m of in het DSM maar één pixel). De beeldengroep van Joop Beljon in de tuin is geen deel van het pand.

## Controle

`node scripts/generate-koningskade-4.mjs` geeft per node `NoError`, genus 0 en één gesloten deel. In de webshop controleert een test de dakhoogtes van de toren, de opbouw, de liftopbouwen, de schoorsteenbundel, de laagbouw, de trommel, de installatiekast, het tussenlid en de glazen strook, dat een vensternis in de zuidoostgevel na de printcorrectie op 45° open blijft, dat het printvolume minder dan 1 % groeit, één component per node en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0518100000302196` (bouwjaar 1968); actuele orthoHR; AHN-DSM en -DTM 0,5 m; 3D BAG (LoD2.2, AHN5 2023).
- [SkyscraperPage: Rijkswaterstaat, Koningskade 4](https://skyscraperpage.com/b8339).
- [Lijst van hoogste gebouwen van Den Haag](https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Den_Haag) (het gebouw staat er niet in).
- Foto's op Wikimedia Commons (niet meegeleverd): [Hoofdkantoor Nederlandse Emissieautoriteit](https://commons.wikimedia.org/wiki/File:Hoofdkantoor_Nederlandse_Emissieautorieit.jpg), [Fontein Joop Beljon, Koningskade 4](https://commons.wikimedia.org/wiki/File:Fontein_Joop_Beljon_Koningskade-4_Den_Haag_zijaanzicht.jpg), [Objectengroep](https://commons.wikimedia.org/wiki/File:Denhaag_kunstwerk_objectengroep.jpg).
