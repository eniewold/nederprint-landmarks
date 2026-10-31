# Helicon (Den Haag)

Vereenvoudigd, printbaar model van Helicon aan de Turfmarkt en het Parnassusplein (1998, Soeters Van Eldonk), het kantoor van het ministerie van VWS naast Castalia. Drie slanke bakstenen torens van 15 verdiepingen staan dwars op de Turfmarkt en zijn verbonden door laagbouw van zes lagen met tussen de torens een glazen tongewelf. Aan de Turfmarkt trappen de torens in vier treden van twee lagen terug, elk met een witte natuurstenen lijst; op het dak ligt een plat tongewelf, en op een lijn over elke toren staan vijf witte naalden boven een strook witte lisenen op de lange gevels.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `helicon-den-haag.glb` | Model in meters, Y omhoog, vijf nodes: `building:helicon-toren-zuidwest`, `building:helicon-toren-midden`, `building:helicon-toren-noordoost`, `building:helicon-laagbouw-west` en `building:helicon-laagbouw-oost` |
| `helicon-den-haag.json` | Catalogusitem |
| `helicon-den-haag-1-1000.stl` | Los te printen op 1:1000 (85 × 49 × 68 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[81927.94, 455135.86]`, het hart van de BAG-contour. De X-as loopt langs de Turfmarktgevel naar het noordoosten (37,4° op RD-oost; de BAG-randen lopen op 37,35–37,47°), de Y-as naar het noordwesten, richting Castalia. Lokaal z = 0 is NAP +0,6 m (AHN-DTM rondom: Turfmarkt 0,76, noordoost 0,53, noordwest 0,62; 3D BAG-maaiveld 0,46); `groundHeight` is 44,05 m (ellipsoïdisch, NAP + 43,45) en `groundOffsetMetres` −0,2. Het model is gebouwd in dit gebouwstelsel: alle gevels lopen evenwijdig aan of haaks op de assen.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Drie torens (pand `0518100001754311`) | 13,9 × 48,3 m elk, op x −42,32…−28,43, −6,92…6,96 en 28,47…42,32 | dak +57,6 m, dakrand +59,0 m | BAG, 3D BAG (57,57–57,62), AHN-DSM |
| Inham noordwestgevel | 6,4 m breed, 1,15 m diep | volle hoogte | BAG (0,15 m dieper, vrij van Castalia) |
| Treden aan de Turfmarkt | gevels op y −24,13 / −22,75 / −21,2 / −19,3 / −17,4 | +26,3 / +33,05 / +39,8 / +46,65 m | 3D BAG (AHN5), randen uit het AHN-DSM, foto |
| Tongewelf op elk torendak | 8,4 × 20,4 m | zijwanden +59,0, kruin +60,0 m | AHN-DSM (3D BAG-nok 60,2), luchtfoto |
| Witte balk met vijf naalden | op y = −2,0, naalden op 3,3 m | balk +59,0, naalden tot circa +68 m | AHN-DSM (treffers tot +67,3), foto |
| Witte lisenen | drie van 0,9 m op y −3,8 / −2,0 / −0,2, 0,4 m uit de lange gevels | tot +59,0 m | foto |
| Witte lijsten | 0,4 m uit de gevel rond elke trede en de dakrand | bovenkant trede + 0,3 m | foto, AHN-DSM (randen 0,4 m boven de treden) |
| Laagbouw tussen de torens | 21,5 × 46,3 m, Turfmarktgevel 0,7 m terug | +22,76 m, lijst +23,3 m | 3D BAG, AHN-DSM |
| Glazen tongewelf | cirkelsegment over y −11,6…7,6, 1 m vrij van de torens, holle kopse kanten | kruin +26,1 m | AHN-DSM, luchtfoto |

Gevelreliëf: zestien lagen (begane grond tot +5,95 m, daarboven 3,39 m, twee lagen per trede). Per laag vensters van 1,2 m op een raster van 2,5 m (torens) en 1,5 m op 2,6 m (laagbouw aan de Turfmarkt) als blinde nissen van 0,35 m met een plafond onder 45°, alleen waar de gevel buitengevel is. De lijsten en de voet van de lisenen op het laagbouwdak hebben een kraag onder 45°.

## Geschat en weggelaten

- Verdiepingshoogte en vensterraster zijn geschat uit de treden en de foto's; de werkelijke vensters zijn per twee lagen gegroepeerd in verticale stroken.
- De hoogte van de naalden (+68 m) is geschat: het DSM raakt de dunne naalden maar tot +67,3 m. Ze zijn als vierkante spits op een voet van 1,0 m gemodelleerd.
- De witte lisenenstrook is vereenvoudigd tot drie lisenen; de werkelijke strook heeft meer en slankere stijlen.
- De kopse kanten van het glazen tongewelf zijn als holle ellips van 3 × 5 m gemodelleerd naar de luchtfoto; de 3D BAG maakt er schuine vlakken van.
- Treden en lijsten: de 3D BAG (AHN5) meet de treden 0,4 m lager dan het AHN4-DSM op de randen; de treden staan op de 3D BAG-hoogte en de lijsten steken 0,3 m boven de trede uit.
- Weggelaten: dakopstanden en davits (kleiner dan 0,9 m), de winkelpuien en de luifels aan de straat (geen eigen volume op foto's, kleiner dan 0,9 m), de noordwestgevels van de laagbouw (tegen de onderbouw van Castalia aan).

## Controle

`node scripts/generate-helicon-den-haag.mjs` geeft per node `NoError`, genus 0 en één gesloten deel. In de webshop controleert de test de daken, treden, het dakgewelf, een naald, de laagbouw en de kruin van het glazen gewelf, dat een vensternis in een trede na de printcorrectie op 45° diep blijft, dat de print minder dan 1 % groeit, één component per node en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd. Het model blijft buiten de bestaande modellen van Castalia en JuBi.

## Bronnen

- PDOK BAG, pand `0518100001754311` (bouwjaar 1998); actuele orthoHR; AHN-DSM en -DTM 0,5 m.
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100001754311) (TU Delft/3D geoinformatie, CC BY 4.0): dakvlakken, treden, laagbouw.
- [Lijst van hoogste gebouwen van Den Haag](https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Den_Haag).
- [Rijksoverheid: gebouwen van VWS](https://www.rijksoverheid.nl/ministeries/ministerie-van-volksgezondheid-welzijn-en-sport/organisatie/gebouwen) (Soeters ontwierp Helicon, Graves Castalia).
- Foto's op Wikimedia Commons (niet meegeleverd): [Helicon1.jpg](https://commons.wikimedia.org/wiki/File:Helicon1.jpg), [De Resident](https://commons.wikimedia.org/wiki/File:Den_Haag_-_De_Resident_(28056663929).jpg), [Turfmarkt 2016](https://commons.wikimedia.org/wiki/File:Turfmarkt_The_Hague_2016_1.jpg).
