# XO Hotels Rivium, voormalig Braingate (Capelle aan den IJssel)

Vereenvoudigd, printbaar model van de gebogen kantoorschijf aan de Rivium Boulevard 301-321 op het Rivium, aan de voet van de Van Brienenoordbrug (2003, business centre Braingate; sinds 2021 in verbouwing tot het viersterrenhotel XO Hotels Rivium met kantoren, plan JaW architecten). De schijf staat als een brug over de straat die van de Rivium Boulevard naar het noorden loopt. De PDOK-reconstructie extrudeert de BAG-contour vanaf het laagste maaiveld en zet zo een dicht blok over die straat; dit model laat de doorgang open.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `xo-hotels-rivium.glb` | Model in meters, Y omhoog, twee nodes: `building:xo-hotels-rivium-schijf` en `building:xo-hotels-rivium-entree-en-parkeerdek` |
| `xo-hotels-rivium.json` | Catalogusitem |
| `xo-hotels-rivium-1-1000.stl` | Los te printen op 1:1000 (156 × 40 × 45 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[97156, 436558]`, op de rijbaan in de doorgang; de assen lopen langs RD (de doorgang en de straat lopen noord-zuid). Lokaal z = 0 is NAP +5,2 m, de rijbaan in de doorgang (AHN-DTM 5,2-5,4); `groundHeight` is 48,7 m (NAP + circa 43,5, geoïde als bij Gemini I en II op het Rivium Quadrant) en `groundOffsetMetres` −0,15. Het maaiveld rond het gebouw verschilt sterk: het plein aan de noordkant ligt op NAP +4,5 à +4,9, de westkant op +0,5 tot +4, de oost- en zuidkant (onder de Rivium Boulevard, die hier op een dek ligt) op −0,8 tot −1,5. Daarom liggen de `groundSamplePoints` op de rijbaan en het voetpad in en direct ten noorden van de doorgang, en loopt de onderkant van het model door tot NAP −2,0 (lokaal −7,2): de kolommen in het westen, de garage onder het parkeerdek en de onderste laag van het oostdeel staan zo op het lagere maaiveld.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Zuidgevel | cirkelboog, middelpunt RD 97177,78 / 436679,39, straal 137,8 m | | BAG (27 hoekpunten binnen 0,35 m) |
| Noordgevel | concentrische boog, straal 123,5 m (schijf 14,3 m diep) | | 3D BAG-dakranden (123,0-124,2) |
| Westdeel van de schijf (x 97106-97174) | van de westkopgevel tot de sprong bij x ≈ 97171-97175 | +42,0 m, lamellenband tot +43,25 m | 3D BAG, AHN-DSM |
| Doorgang | x 97140,2-97171 (30,5 m), rijbaan, fietspaden en voetpaden op hoogteligging 0 | open tot +19,1 m (laag 5) | BGT (pand-vlakken en wegdelen), render |
| Oostdeel van de schijf (x 97171-97233) | tot de oostkopgevel (97233,4/436554,1 - 97221,4/436564,4) | +37,1 m, band tot +38,3 m | 3D BAG, DSM |
| Lage zuidwestvleugel | voor de boog, x 97105-97137, op vijf kolommen | +29,9 m, borstwering 0,9 m | BAG, BGT (kolommen), 3D BAG, DSM |
| Noordwestdriehoek | 97105/436565 - 97118,5/436571 - 97108/436578, op kolommen | +29,9 m | 3D BAG, BGT |
| Lift- en trappentoren | 5,6 × 17 m aan de noordgevel bij de doorgang, glasstroken 0,4 m | +41,5 m | 3D BAG (40,6-41,5), DSM, render |
| Trappenhuizen op het brugdeel, opbouw oostdak | 6 × 6 en 6 × 3,5 m; 2 × 7 m | +42,9 m; +39,5 m | 3D BAG |
| Entreepaviljoen | 8,6 × 7,3 m ten noorden van de toren | +10,5 m | 3D BAG (8,8-10,9) |
| Luifel | 13,7 × 8,7 m en 17,7 × 7,3 m, 1,1 m dik, op twee staanders | +7,2 tot +8,3 m | 3D BAG, luchtfoto |
| Parkeerdek en garage | 80 × 24 m aan de noord- en oostkant | dek +4,6 m | BGT-pand, 3D BAG (4,42-4,69), DSM |

Lagen van 3,6 m vanaf het plein-/entreeniveau +4,7: de daken op +29,9 en +37,1 vallen op laag 7 en 9; het westdeel heeft daarboven nog een laag tot +40,7 met een dakrand tot +42,0. Vensterbanden per laag als blinde nissen van 0,35 m diep (glas van +1,3 tot +3,1 m boven de vloer, plafond onder 45°) op beide bogen, de kopgevels, de wanden van de doorgang, de vleugel en de driehoek; de entreelaag van het oostdeel (+4,7 tot +8,3) is een glasband van 0,5 m diep. De lamellenbanden op de dakranden zijn als dichte plaat van 1,25 m dik gemodelleerd, 2,5 m naar binnen en 1,0 m buiten de gevel met de onderkant onder 45°.

## Geschat en weggelaten

- De hoogte van de doorgang (+19,1 m, vijf lagen boven de rijbaan en zes lagen brugdeel erboven) komt uit de render van de gemeente; het AHN ziet alleen het dak erboven. De breedte en de wanden komen uit de BGT.
- Verdiepingshoogte, de vensterbanden, de glasstroken van de toren en de opbouw van het paviljoen en de luifel zijn geschat uit de luchtfoto, de schuine luchtfoto en de renders; de hotelverbouwing verandert de hoofdvorm niet.
- De lamellen op de dakranden zijn open roosters; in het model zijn ze een dichte plaat (delen onder 0,9 m printen niet).
- Weggelaten: de buitentrap aan de zuidwesthoek van de doorgang (BAG-uitstulping van 1-4 m), de leuningen van het parkeerdek, de kleine luifel aan de westkant van de toren (3D BAG 7,7 m, 5 × 1,5 m), dakinstallaties kleiner dan 0,9 m en de hellingbaan van de garage.

## Controle

`node scripts/generate-xo-hotels-rivium.mjs` geeft voor beide nodes `NoError` en één gesloten deel (schijf genus 4, entree en dek genus 1); twee keer draaien geeft byte-identieke bestanden. In de webshop controleert de test de daken van alle bouwdelen, dat de doorgang van de rijbaan tot +19,1 m open is over de volle breedte, dat de vensternissen op de boog na de printcorrectie op 45° blijven, het printvolume (schijf minder dan 5 % groei: de vlakke onderkant van het brugdeel en de colonnade onder de vleugel krijgen een wig; entree en dek minder dan 4 %: de luifel krijgt een voet op het dek) en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de schuine luchtfoto en de renders gelegd.

## Bronnen

- PDOK BAG, pand `0502100000021132` (bouwjaar 2003; Rivium Boulevard 301, logies-, bijeenkomst- en kantoorfunctie); BGT (pand-vlakken, kolommen, wegdelen in de doorgang); actuele orthoHR; AHN-DSM en -DTM 0,5 m; 3D BAG LoD2.2 (AHN5 2023).
- [Rivium Boulevard 301-321](https://capellebouwtaandestad.nl/project/rivium-boulevard-301-321), gemeente Capelle aan den IJssel: transformatie van het Braingate-gebouw naar hotel (omgevingsvergunning januari 2021, plan JaW architecten), met een schuine luchtfoto en renders (niet meegeleverd).
- [XO Hotels Rivium](https://xohotels.com/hotel/xo-hotels-rivium/) (adres, parkeergarage aan de achterzijde) en [Deskfinder](https://deskfinder.nl/kantoorruimte-huren/capelle-aan-den-ijssel/rivium-boulevard-301-320/) (business centre Braingate).
