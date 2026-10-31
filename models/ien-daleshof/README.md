# Parktoren (Rotterdam)

Vereenvoudigd, printbaar model van de Parktoren aan het Ien Daleshof in Prinsenland (Prins Alexander, 2009), de woontoren van 76 m en 24 lagen aan de noordrand van het Prinsenpark en het hoogste gebouw van Prins Alexander. Een donkerrode baksteentoren op een glazen plint van twee lagen met witte kolommen. De zuidgevel is bol en grotendeels glazen: in de westhelft een stapel grote balkons onder een bakstenen kroon op de 61-meterlijn, dan een bakstenen lisene en een smalle stapel kleine balkons tot de top. Aan de oostkant staat een lagere vleugel die met zijn zuidoosthoek op hoge kolommen boven het park hangt, en in de noordwesthoek een nog lagere vleugel. De taak noemde het gebouw naar zijn straat; in de hoogbouwlijst en op Commons heet het Parktoren.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `ien-daleshof.glb` | Model in meters, Y omhoog, één node: `building:ien-daleshof-parktoren` |
| `ien-daleshof.json` | Catalogusitem |
| `ien-daleshof-1-1000.stl` | Los te printen op 1:1000 (30 × 32 × 79 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[96977.0, 439168.0]`, in het hart van de BAG-contour. De lokale assen vallen samen met de RD-assen (X naar het oosten, Y naar het noorden), omdat de gevels niet haaks op elkaar staan: de oostgevel staat op 104°, de westgevel op 81°, de oostgevel van de noordoostvleugel op 115° en de zuidgevel is een boog. Lokaal z = 0 is NAP −6,2 m (AHN-DTM rondom −6,18, 3D BAG-maaiveld −6,23). `groundHeight` is 37,25 m (ellipsoïdisch: NAP −6,2 plus 43,45) en `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Hoofdtoren | BAG-contour van circa 16 × 25 m, bolle zuidgevel (pijl circa 1,1 m) | +69,95 m | BAG, 3D BAG-dakvlak (69,90–70,02) |
| Westelijke strook | circa 5,5 × 23 m langs de westgevel | +60,97 m | 3D BAG (60,89–61,04) |
| Noordoostvleugel | circa 13 × 14 m, steekt 6 m oostelijk uit | +60,97 m | BAG, 3D BAG (60,97–60,98) |
| Noordwestvleugel | circa 11 × 11 m | +55,0 m | BAG, 3D BAG (54,97–55,02) |
| Installatiekast | 5,1 × 5,7 m | +72,38 m | 3D BAG (72,37–72,40) |
| Kleine kast en dakluik | 3,1 × 1,5 m en 1,6 × 1,8 m | +71,51 m en +71,0 m | 3D BAG |
| Glazen plint | twee lagen, 7,3 m hoog, 1,2 m achter de gevellijn | tot +1,1 m | foto's |
| Kolommen | 1,0 m, om de 4,6 m (zuid) en 3,2 m (oost), twee onder de vleugelhoek | tot +1,1 m | foto's |
| Grote balkonstapel | zuidgevel west, 10,7 m breed, 2,0 m uit de gevel, met lisene van 1,5 m | +1,1 tot +60,97 m | foto, AHN4-DSM (balkonranden tot 1–2 m buiten de contour) |
| Kleine balkonstapel | zuidgevel, 3,1 m breed, 1,4 m uit de gevel | +1,1 tot +68,15 m | foto |
| Loggia's | zuidgevel van de noordoostvleugel, 4,4 m breed, 1,2 m diep | per laag tot +60 m | foto's |
| Kleine balkons | oostgevel van de noordoostvleugel, om de twee lagen, 1,6 × 1,2 m | per laag | foto |

Gevelreliëf: 22 woonlagen van 3,05 m boven de plint. Op de glazen delen van de zuidgevel en de zuidoosthoek per laag een glasband van 0,35 m diep achter een vloerrand van 0,9 m; in de bakstenen gevels (oost, noord, west en de vleugels) per laag vensters van 1,2 × 1,5 m op een travee van 2,4 m als blinde nissen van 0,35 m. Alle nissen, balkons, loggia's en de plint hebben een plafond onder 45°; onder de balkonstapels en de kleine balkons loopt een kraag onder 45°, en onder de grote balkonstapel loopt het plafond van de plint in hetzelfde vlak door.

## Geschat en weggelaten

- Naam: de taak noemde het gebouw naar de straat (Ien Daleshof); het heet Parktoren (hoogbouwlijst, Commons, verhuurder). Het staat niet bij station Rotterdam Alexander maar ongeveer 1,5 km zuidelijker in Prinsenland.
- Het AHN4-DSM heeft binnen de contour veel gaten (waarden op maaiveldhoogte midden op het dak); alle dakhoogtes komen daarom uit de 3D BAG (AHN5, 2023).
- Laaghoogte (plint 7,3 m, daarboven 3,05 m), vensterraster, kolomafstand, balkondiepte en de breedtes van de balkonstapels zijn geschat uit foto's. Van de noord- en westgevel zijn geen foto's gevonden; daar staat hetzelfde bakstenen vensterraster als op de oostgevel.
- De grote balkons verspringen in het echt per laag in diepte en volgen de bolling; in het model is het één stapel van 2,0 m met per laag een open balkon van 1,2 m diep.
- De open ruimte onder de noordoostvleugel is in het echt de volle plinthoogte diep tot de glazen gevel; in het model is het een inham van 2,5 m met een plafond onder 45°, zodat het zonder steun print.
- Weggelaten: de glazen entreeluifel (dunner dan 0,9 m en binnen de inham van de plint), balkonhekken van glas, de gevelonderhoudskraan op het dak en de kleine installaties op de daken (kleiner dan 0,9 m).

## Controle

`node scripts/generate-ien-daleshof.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert `tests/landmark-models.test.ts` de dakhoogtes van de vijf bouwdelen, dat de grote balkonstapel 2 m uitsteekt en zijn open balkons na de printcorrectie op 45° houdt, dat de glazen plint achter de kolommen terugligt, de volumegroei bij de printcorrectie (0,07 %) en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0599100000753214` (bouwjaar 2009, Ien Daleshof); actuele orthoHR; AHN-DSM en -DTM 0,5 m.
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000753214) (LoD2.2, AHN5 2023; TU Delft/3DGI, CC BY 4.0).
- [Lijst van hoogste gebouwen van Rotterdam](https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Rotterdam) (Parktoren, 76 m, 24 verdiepingen, 2009).
- Foto's op Wikimedia Commons (niet meegeleverd): [Parktoren Rotterdam](https://commons.wikimedia.org/wiki/File:Parktoren_Rotterdam.jpg) en de [categorie Parktoren Rotterdam](https://commons.wikimedia.org/wiki/Category:Parktoren_Rotterdam).
