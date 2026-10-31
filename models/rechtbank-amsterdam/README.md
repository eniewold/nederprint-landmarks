# Rechtbank Amsterdam (Amsterdam)

Vereenvoudigd, printbaar model van het gerechtsgebouw aan de Parnassusweg 280 op de Zuidas (KAAN Architecten, opgeleverd eind 2020, in gebruik sinds mei 2021, BAG-bouwjaar 2022). Het gebouw bestaat uit twee even grote blokken van circa 43 × 65 m die in elkaar geschoven zijn; de noordwest- en de zuidoosthoek blijven open, en in de zuidoosthoek ligt het verhoogde plein met het beeld "Love or Generosity". In elk blok is een hof uit het dak gespaard. De gevels zijn een donker bronskleurig raster in drie zones; aan het plein staat de onderzone achter een reuzenorde van witte natuurstenen pijlers, met een entreeluifel voor de zuidgevel van het noordoostblok.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `rechtbank-amsterdam.glb` | Model in meters, Y omhoog, één node: `building:rechtbank-amsterdam` |
| `rechtbank-amsterdam.json` | Catalogusitem |
| `rechtbank-amsterdam-1-1000.stl` | Los te printen op 1:1000 (87 × 87,5 × 52,5 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[119581.73, 483690.77]`, in de binnenhoek van de twee blokken aan het plein. De X-as loopt langs de zuidgevels naar het oosten (3,17° op RD-oost; de BAG-randen zijn binnen 0,05° evenwijdig), Y langs de oost- en westgevels naar het noorden. Lokaal z = 0 is NAP +0,5 m, het maaiveld langs de noord- en oostgevel (AHN-DTM 0,48–0,52). `groundHeight` is 43,54 m: NAP +0,5 plus de NLGEO2018-geoïde ter plekke (43,04). `groundOffsetMetres` is −0,15. `groundSamplePoints` liggen langs de noord-, oost- en zuidgevel, omdat aan de westkant een verdiepte inrit (NAP −3,9) tegen de gevel ligt.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Zuidwestblok | 43,2 × 65,7 m | +50,75 m | 3D BAG-dakrand en BGT-pand; AHN4-DSM 50,67, 3D BAG 50,80 |
| Noordoostblok | 65,3 × 43,9 m | +50,75 m | idem |
| Hof zuidwestblok | 18,3 × 29,2 m, vloer | +34,3 m | 3D BAG (34,30), DSM |
| Plantenbak langs de noordwand van die hof | 8,7 × 1,9 m | +36,4 m | 3D BAG |
| Lichtschacht in die hof | 8 × 9 m, tot het glasdak van de hal | +11,8 m | 3D BAG (11,8), DSM 7–12 |
| Hof noordoostblok | 28,4 × 17,8 m, vloer | +29,75 m | 3D BAG (29,75), DSM 29–30 |
| Twee lichtschachten in die hof | elk 4,0 × 9,3 m | +11,5 m | 3D BAG (11,5), DSM 11–12 |
| Luchtbehandelingskasten en andere dakinstallaties | zeven blokken, 2–6,5 m | +51,7 tot +52,2 m | AHN4-DSM (componenten ≥ 0,9 m boven het dak) |
| Reuzenorde aan het plein | pijlers van 1,0 m op de travee, glaspui 1,0 m terug | tot +19,9 m | foto's (hoogte en diepte geschat) |
| Entreeluifel | 19,9 × 3,1 m voor de pijlers, 1,5 m dik | bovenkant +4,4 m | 3D BAG (4,40–4,45), foto |

Gevelreliëf: elf traveeën van circa 3,96 m op de korte gevels (geteld op foto's), op de lange gevels evenveel per meter. Per laag blinde nissen van 0,35 m met een plafond onder 45°: in de onderzone (hal van 7,4 m en twee lagen van 6,0 m) één venster per travee, in de twee overgangslagen (5,0 en 4,85 m) en de vijf kantoorlagen (3,85 m) twee vensters per travee, met een borstwering van 1,75 m bovenaan. De hofwanden hebben vanaf de hofvloer lagen van 3,6 m met dezelfde halve vensters. Aan het plein (oostgevel van het zuidwestblok, zuidgevel van het noordoostblok) is de onderzone tussen de pijlers 1,0 m uitgespaard, met een plafond onder 45° tot +19,9 m. De luifel kraagt vrij uit zoals in het echt; de export vult eronder op.

## Geschat en weggelaten

- Verdiepingshoogtes: de drie zones zijn op foto's geteld en met de hofvloeren (+29,75 en +34,3) in lijn gebracht; de afzonderlijke laaghoogtes zijn geschat.
- Het traveeraster (3,96 m) is geteld op foto's; het fijne lamellenraster van de kantoorlagen (circa 1 m) is vereenvoudigd tot twee vensters per travee, omdat lamellen en vensters van elk 0,5 m onder de 0,9 m blijven.
- Pijlerbreedte (1,0 m), de diepte van de glaspui erachter (1,0 m) en de bovenkant van de reuzenorde zijn geschat.
- De luifel is op foto's een dunne plaat (circa 0,4 m); hier 1,5 m dik met de bovenkant op de gemeten hoogte.
- De gevels in de open noordwesthoek zijn als gewone buitengevel gemodelleerd; er was geen foto van die hoek.
- Weggelaten: de ronde daklichten en de zonnepanelen (minder dan 0,9 m boven het dak), de gevelonderhoudsinstallatie op het dak (dunne arm), de getrapte randen in de hof van het zuidwestblok (in het DSM niet eenduidig), de verdiepte inrit en het verhoogde plein (terrein, al in PDOK).

## Controle

`node scripts/generate-rechtbank-amsterdam.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert een test in `tests/landmark-models.test.ts` het dak, de hofvloeren, de lichtschachten, de dakinstallaties en de luifel; verder dat het plein open blijft, dat de pijlers aan het plein en een venster in de kantoorzone na de printcorrectie op 45° blijven staan, één component, en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd. Het AHN4-DSM is opgenomen in de bouwfase (er staan nog een bouwkraan en een strook op +9 tot +10 m langs de oostgevel van het zuidwestblok in, die op de foto's van 2021 ontbreekt), maar dak en hoven staan er al in; de 3D BAG gebruikt AHN5 (2023) en komt binnen 0,1 m overeen.

## Bronnen

- PDOK BAG, pand `0363100012252557` (bouwjaar 2022); BGT-pand en -erf; actuele orthoHR; AHN4-DSM en -DTM 0,5 m; 3D BAG LoD2.2 (AHN5, 2023); NLGEO2018.
- [Rechtbank Amsterdam](https://nl.wikipedia.org/wiki/Rechtbank_Amsterdam) op Wikipedia.
- [Gerichtsgebäude in Amsterdam](https://www.baunetzwissen.de/treppen/objekte/buero-gewerbe/gerichtsgebaeude-in-amsterdam-8231951) (Baunetz Wissen): hoogte 50 m, twee in elkaar geschoven blokken, drie gevelzones, twee hoven.
- Foto's op Wikimedia Commons (niet meegeleverd): [Parnassusweg 280 (1)](https://commons.wikimedia.org/wiki/File:2021_Rechtbank_Amsterdam,_Parnassusweg_280_(1).jpg), [Parnassusweg 280 (3)](https://commons.wikimedia.org/wiki/File:2021_Rechtbank_Amsterdam,_Parnassusweg_280_(3).jpg), [Love or generosity (1)](https://commons.wikimedia.org/wiki/File:2021_Love_or_generosity_(1).jpg).
