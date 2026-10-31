# Woontoren Waterfront (Terneuzen)

Vereenvoudigd, printbaar model van de woontoren Waterfront (Waterfront 200, Roodbeen Architectuur, opgeleverd 2005) aan de Westerscheldedijk in Terneuzen, met 26 lagen en circa 79 m het hoogste gebouw van Zeeland. De toren bestaat uit een slanke schijf en een lagere vleugel die 60° gedraaid staat, met een verbindingsdeel ertussen. Hij staat in een halfverdiepte parkeergarage (het tweede BAG-pand), een kwartcirkel tegen het dijklichaam waarvan het dek met zonnepanelen en gras aan de dijkkant op maaiveld ligt. In de hoek tussen garagewand, schijf en vleugel zit de entree onder een hellend glasdak.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `waterfront-terneuzen.glb` | Model in meters, Y omhoog, drie nodes: `building:waterfront-terneuzen-toren`, `building:waterfront-terneuzen-parkeergarage` en `building:waterfront-terneuzen-entree` |
| `waterfront-terneuzen.json` | Catalogusitem |
| `waterfront-terneuzen-1-1000.stl` | Los te printen op 1:1000 (57,5 × 47,1 × 82 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[46763.0, 373243.0]`, in het hart van de schijf. De lokale X-as loopt langs de korte noord- en zuidgevel van de schijf naar het oosten (3,96° op RD-oost; de BAG-randen zijn evenwijdig binnen 0,1°), Y langs de lange gevels naar het noorden. Lokaal z = 0 is NAP +2,95 m, het plein aan de zuidkant; de onderkant ligt op −1,5 m zodat de garagewand ook langs de vijver doorloopt. `groundSamplePoints` liggen op het plein ten zuiden van de toren. `groundHeight` is 47,29 m: de NLGEO2018-geoïde ter plekke (44,46 m) min de afwijking die het model van SnowWorld Terneuzen ten opzichte van zijn geoïde heeft (−0,12 m), plus het pleinniveau. `groundOffsetMetres` is −0,15.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Schijf (pand `0715100000024539`) | BAG-contour, 10,8 × 22,8 m, plus het verbindingsdeel tot het hoge dak | +82,07 m | 3D BAG-dakvlak (82,05–82,10), AHN-DSM p50 82,06 |
| Installatiekast op de schijf | L-vorm, 2,4 × 4,5 m en 2,0 × 1,6 m | +83,45 m | 3D BAG (83,37–83,43), AHN-DSM 83,3–84,0 |
| Vleugel en laag deel van de verbinding | rechthoek 10,2 × 17,1 m, 60° gedraaid | +70,65 m | BAG, 3D BAG (70,60–70,73), AHN-DSM p50 70,65 |
| Dakopbouwen op de vleugel | 2,2 × 2,7 m en 3,0 × 2,2 m | +72,05 m en +72,6 m | AHN-DSM 71,9–72,0 en 72,2–73,8 |
| Parkeergarage (pand `0715100000041714`) | BAG-contour (kwartcirkel, 57 × 40 m) min de toren | dek +6,25 m | AHN-DSM p50 6,21 |
| Entree | driehoek van 8,3 × 5,6 m tussen garagewand, schijf en vleugel | glasdak +6,5 naar +5,2 m | luchtfoto, vlak door het AHN-DSM |
| Plein | — | +2,95 m | AHN-DTM 2,9–3,0, 3D BAG-maaiveld |

Gevelreliëf: een entreelaag van 4,2 m en 25 woonlagen van 2,95 m (26 lagen, R+25 volgens de hoogbouwlijsten); de vleugel heeft 21 woonlagen. Per laag kleine vensters in kolommen als blinde nissen van 1,3 m breed en 0,35 m diep met een plafond onder 45°. Op de westgevel van de schijf staan vier kolommen op 3,2, 8,3, 13,2 en 19,1 m van de noordhoek en op de noordgevel twee kolommen, zoals op de foto vanaf de dijk; de andere gevels hebben kolommen op een stramien van circa 4 m.

## Geschat en weggelaten

- Naam: de taak noemde het "Woontorens Waterfront". Het is één woontoren met een lagere vleugel, met de naam Waterfront (adres Waterfront 200); het tweede pand is de parkeergarage eronder.
- Verdiepingshoogtes en de verdeling over entreelaag en woonlagen zijn geschat uit de totale hoogte en het aantal lagen.
- De vensterkolommen komen alleen voor de west- en noordgevel van een foto; voor de zuid- en oostgevels en de vleugel zijn ze geschat (er zijn geen bruikbare foto's van die kanten).
- De vorm van de dakopbouwen is uit het DSM geschat; de dakopbouw B is als blok tot +72,6 m genomen.
- De entree staat er als dicht volume onder het glasdak; of de ruimte eronder open of beglaasd is, is niet nagekeken. De entree is geen BAG-pand.
- De gevels van de parkeergarage zijn vlak gelaten.
- Weggelaten: de glazenwasinstallatie op het dak van de schijf (open stalen frame tot circa +86 m in de 3D BAG, staven kleiner dan 0,9 m), de dakranden met hekwerk (geen hoogteverschil in het DSM, hekken kleiner dan 0,9 m), de zonnepanelen op het parkeerdek (minder dan 0,9 m hoog) en eventuele balkons (niet op foto's of in het DSM te zien).
- Niet in het model: de loopbrug over de vijver naar het parkeerdek (geen deel van de twee panden).

## Controle

`node scripts/generate-waterfront-terneuzen.mjs` geeft per node `NoError`, genus 0 en één gesloten deel. In de webshop controleert de test de daken van schijf, vleugel en installatiekasten, het parkeerdek en het glasdak van de entree, dat een vensternis in de westgevel na de printcorrectie op 45° blijft, één component per node, een volumegroei door de printcorrectie onder 1 % en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie gelegd.

## Bronnen

- PDOK BAG, panden `0715100000024539` (woontoren, bouwjaar 2004) en `0715100000041714` (parkeergarage, bouwjaar 2004); actuele orthoHR; AHN-DSM en -DTM 0,5 m.
- 3D BAG (LoD2.2, AHN5 2024) van beide panden.
- [PSS-archi: Waterfront, Terneuzen](https://www.pss-archi.eu/immeubles/NL-715-63550.html) (architect, R+25, 79 m, 2005).
- NLGEO2018-geoïde (Kadaster/RWS) voor `groundHeight`.
- Foto's op Wikimedia Commons (niet meegeleverd): [Terneuzen, dijk met de toren](https://commons.wikimedia.org/wiki/File:TerneuzenDeich.JPG), [Skyline langs de Westerschelde](https://commons.wikimedia.org/wiki/File:Terneuzen_-_Skyline_langs_de_Westerschelde.jpg).
