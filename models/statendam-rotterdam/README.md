# De Statendam (Rotterdam)

Vereenvoudigd, printbaar model van De Statendam aan de Botersloot (Hans Kollhoff, 2009), de woontoren van 22 lagen achter de Blaaktoren, naast de Centrale Bibliotheek. Een vierkante toren van 28 × 28 m op een grijze natuurstenen plint met afgeschuinde hoeken, per gevel twee bakstenen vleugels met erkers en een grijze middenstrook, en een koperen mansardekap met acht steile bakstenen topgevels.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `statendam-rotterdam.glb` | Model in meters, Y omhoog, één node: `building:statendam-rotterdam-toren` |
| `statendam-rotterdam.json` | Catalogusitem |
| `statendam-rotterdam-1-1000.stl` | Los te printen op 1:1000 (29 × 29 × 75 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[93135.84, 437382.75]`, het hart van de vier BAG-hoekpunten. De X-as loopt langs de gevels naar het oostnoordoosten (22,5° op RD-oost; de BAG-randen liggen op 22,3–22,6°), Y haaks erop naar het noordnoordwesten. Lokaal z = 0 is NAP +1,3 m, het maaiveld aan de Botersloot (AHN-DTM 1,15–1,4; 3D BAG 1,29; de Binnenrotte ligt op circa +1,7). `groundHeight` is 44,83 m (ellipsoïdisch: NAP + 43,53, NLGEO2018 geijkt op Blaak 10) en `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Toren | BAG-contour, 28,06 × 27,86 m | kroonlijst +65,0 m | BAG, 3D BAG (voet van de kap 64,85) |
| Plint | drie lagen (4,8 + 4,4 + 2,8 m), stenen band 0,3 m uit | tot +13,3 m, band +10,5–11,0 m | foto's |
| Afgeschuinde hoeken | 5,7 m langs beide gevels, begane grond; schuin vlak onder 46° tot de hoek | +6,1 tot +10,3 m | BAG-tussenpunten, foto's |
| Erkers | acht, 3,0 m breed (voorkant 1,8 m), 0,6 m uit, kraag onder 45° | +12,7 tot +62,2 m | foto's |
| Grijze middenstrook | 5,2 m breed, 0,4 m terug, plafond onder 45° | boven de plint tot de kroonlijst | foto's |
| Kroonlijst | 0,4 m uit, kraag onder 45° | +63,7 tot +65,0 m | foto's |
| Mansardekap | van de gevel tot een plat dak van 16,6 × 16,6 m, circa 59° | plat dak +74,48 m | 3D BAG (74,47–74,49; 59,6°), AHN-DSM |
| Lichthof in het dak | 5,3 × 4,4 m | vloer +71,86 m | 3D BAG, AHN-DSM, luchtfoto |
| Topgevels | twee per gevel, as 8,3 m uit het hart, zadeldak onder 57,5°; bij elke hoek een kilgoot | nok +74,75 m, afdekking +75,3 m | 3D BAG (nokken 74,6–74,9; toppen 75,1–75,5; 57,3–57,7°) |

Gevelreliëf: 21 lagen onder de kroonlijst (drie in de plint, 18 woonlagen van 2,82 m). Per laag en per bakstenen vleugel een dubbel venster aan de binnenkant en bij de hoek en een venster in de voorkant van de erker, in de middenstrook twee vensters; alle als blinde nis van 0,35 m met een plafond onder 45°. In elke topgevel een halfrond boogvenster van 6,4 m breed op de kroonlijst, als nis waarvan het plafond onder 45° naar binnen zakt. Het model volgt het AHN-DSM (AHN4) binnen de contour met een mediaan van 0,01 m (96 % binnen 1 m).

## Geschat en weggelaten

- Verdiepingshoogtes en de verdeling van de plint zijn geschat uit foto's (22 lagen volgens Wikipedia: 3 plint, 18 woonlagen, de penthouses in de topgevels).
- Vensterraster, erkermaten (0,6 m uit), de terugligging van de middenstrook (0,4 m) en de uitsteek van kroonlijst en band zijn geschat uit foto's.
- De helling onder de afgeschuinde hoeken lijkt op de foto's iets flauwer dan 45°; ze is op 46° gezet zodat ze zonder steun print.
- De koperen kap is als één mansardevlak per kant gemodelleerd; de topgevels steken als zadeldaken door de kap tot het platte dak.
- Weggelaten: de glazen dakramen in de kap (vlak in het dakvlak), de balustrades op de erkers en de loggia's in de bovenste laag, de vensterstijlen en zijvensters van de erkers, en de luifels van de winkels (kleiner dan 0,9 m of zonder reliëf).

## Controle

`node scripts/generate-statendam-rotterdam.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert een test de dakhoogtes (plat dak, lichthof, nok, kilgoot, mansardevlak, afdekking), dat een erker 0,6 m uitsteekt en zijn vensternissen na de printcorrectie op 45° houdt, de terugliggende middenstrook, de afgeschuinde hoek, een volumegroei door de printcorrectie onder 1 %, één component en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0599100000754175` (bouwjaar 2009, Botersloot/Hoogstraat/Binnenrotte); actuele orthoHR; AHN-DSM en -DTM 0,5 m; 3D BAG LoD2.2 (puntenwolk AHN5, 2023).
- [De Statendam op Wikipedia](https://nl.wikipedia.org/wiki/De_Statendam) (73 m, 22 lagen, Hans Kollhoff, 2007–2009).
- Foto's op Wikimedia Commons (niet meegeleverd): [De Statendam](https://commons.wikimedia.org/wiki/File:De_Statendam.jpg), [Woontoren De Statendam Rotterdam](https://commons.wikimedia.org/wiki/File:Woontoren_De_Statendam_Rotterdam.jpg), [Woontoren Statendam – Binnenrotte](https://commons.wikimedia.org/wiki/File:Woontoren_Statendam_-_Binnenrotte_-_City_of_Rotterdam_(22159316163).jpg).
