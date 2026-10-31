# OurDomain Rotterdam Blaak (Rotterdam)

Vereenvoudigd, printbaar model van de woontoren OurDomain Rotterdam Blaak (Tangram Architekten, opgeleverd 2021–2022) op de kop van de Wijnhaven, tussen de André van der Louwbrug en de Gapersteeg, naast de Willem de Kooning Academie (Blaak 10, waarnaar de slug verwijst). Een schijf van 20 m breed met witte lisenen aan de zuidwestgevel en aan de zuidoostkant een iets hoger blok met aluminium panelen met een vlekkenprint. Rondom lopen drie banden: een onderbouw van zes lagen, een teruggezette middenzone en een bovenzone van acht lagen die aan de zuid- en de noordoostgevel uitkraagt. Langs de Gapersteeg staat de onderbouw buiten de toren op schuine kolommen; op de noordwestpunt staat een glazen paviljoen.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `blaak-10.glb` | Model in meters, Y omhoog, twee nodes: `building:blaak-10-toren` en `building:blaak-10-paviljoen` |
| `blaak-10.json` | Catalogusitem |
| `blaak-10-1-1000.stl` | Los te printen op 1:1000 (72 × 27 × 80 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[93232.0, 437050.0]`, in het hart van de BAG-contour. De X-as loopt langs de lange gevels naar het zuidoosten (−54,61° op RD-oost; de BAG-randen van beide lange gevels zijn evenwijdig binnen 0,01°), Y naar het noordoosten (de brugzijde). Lokaal z = 0 is NAP +2,47 m, het 3D BAG-maaiveld (AHN-DTM aan de Gapersteeg 2,6–2,8 m; aan de André van der Louwbrug ligt het trottoir op 4,2–5,2 m). `groundHeight` is 46,0 m (ellipsoïdisch, NAP + 43,5) en `groundOffsetMetres` −0,15.

## Onderdelen en maten

Het AHN4 van PDOK dateert van vóór de bouw (het DSM meet binnen de contour nog circa NAP +9,5 m); alle hoogtes komen uit de LoD2.2-dakvlakken van de 3D BAG, die de AHN5-puntwolk van 2023 gebruikt.

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Schijf, zuidwestelijke helft | BAG-contour, 20 × 40 m (samen met de noordoosthelft) | +75,22 m | 3D BAG-dakvlak (229 m², 75,12–75,36) |
| Schijf, noordoostelijke helft | idem | +75,88 m | 3D BAG (299 m², 75,79–76,08) |
| Inham naast het hoge blok | 6,5 × 2,8 m aan de noordoostgevel | +75,26 m | 3D BAG (47 m²) |
| Dakopbouw midden over de schijf | 39,5 × 3,4 m | +79,01 m | 3D BAG (114 m², 78,96–79,06), ortho |
| Trappenhuis noordwestpunt | 7,4 × 4,8 m | +78,32 m | 3D BAG (17,5 m²) |
| Hoog blok aan de zuidoostkant | 26 × 27 m, zuidgevel in lijn met BAG-rand 2 | +78,06 m | 3D BAG (365 m², 78,00–78,14) |
| Installaties en liftopbouw | zes kasten van 2–6 m | +79,0 tot +81,32 m | 3D BAG-dakvlakken |
| Onderbouw (laag 0–6) | rondom; langs de Gapersteeg 2,3 m buiten de toren | +24,76 m | 3D BAG (dakvlak 40 m², 24,63–24,98), foto's |
| Middenzone (laag 7–15) | 2,0 m achter de zuidgevel, 1,0 m achter de noordoostgevel | +24,76 tot circa +52,2 m | foto's (geschat) |
| Bovenzone (laag 16–23) | buitenlijn van de BAG, kraag onder 45° | vanaf circa +52,2 m | foto's (geschat) |
| Glazen paviljoen noordwestpunt | 6,5 × 9 m | +8,68 m | 3D BAG (33 m², 8,56–8,82), foto Vissteeg |

Gevelreliëf, per laag als blinde nissen van 0,35 m met een plafond onder 45°: de lisenengevels (zuidwestgevel van de schijf, onderbouw en bovenzone aan de zuidgevel en aan de noordoostgevel van de schijf) als hoge vensters van 1,8 m op 2,7 m, met lisenen van 0,9 m; de printgevels (het hoge blok aan de Gapersteeg en de brugzijde, de middenzone, de noordwestkop) als losse ramen van 1,4 m op 3,4 m die per laag verspringen. In de begane grond een galerij van 1,5 m diep langs de Gapersteeg (kolommen 1,4 m) en een glazen pui van 1,0 m diep aan de zuidgevel. Begane grond 4,0 m, daarboven 23 lagen van 3,05 m.

## Geschat en weggelaten

- Naam: de opdracht heette ‘Blaak 10’; dat is het adres van de Willem de Kooning Academie ernaast. Het pand is OurDomain Rotterdam Blaak (Commons, hoogbouwlijst); de slug is ongewijzigd gebleven.
- De hoogte van de bovenzone (laag 16, circa NAP +52,2 m) en de terugsprongen van de middenzone (2,0 en 1,0 m) zijn geschat uit twee schuine foto's; de 3D BAG ziet ze niet, omdat de bovenzone de richel afdekt.
- Verdiepingshoogtes, vensterraster, de verspringing van de ramen in de print en de galerij langs de Gapersteeg zijn geschat.
- De noordwestgevel van de schijf en de gevels aan de brugzijde zijn alleen op één schuine foto gezien.
- Weggelaten: het terras ten zuidoosten van de zuidgevel dat binnen de BAG-contour valt (geen dakvlak in de 3D BAG; de ortho toont stoelen en een plantenbak op maaiveld); kleine verhogingen tot 0,8 m op het dak van de schijf en de dakrandjes van 0,4 m; een inham van 2,8 m² in de schuine hoek bij de noordwestpunt; de zittrap aan de Vissteeg (terrein); de schuine stand van de kolommen en de lisenen zelf (smaller dan 0,9 m).

## Controle

`node scripts/generate-blaak-10.mjs` geeft voor beide nodes `NoError`, genus 0 en één gesloten deel; de STL is één deel. In de webshop controleert een test de daken, de dakopbouw, de installaties, de onderbouw aan de Gapersteeg en het paviljoen, dat de middenzone aan de zuidgevel na de printcorrectie op 45° 2 m terugligt onder de bovenzone, één component per node, een volumegroei door de printcorrectie onder 1 % en de plaatsing op het maaiveld. Schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0599100100015362` (bouwjaar 2021, oorspronkelijk 2022); actuele orthoHR; AHN-DTM 0,5 m.
- 3D BAG LoD2.2, [NL.IMBAG.Pand.0599100100015362](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100100015362) (puntwolk AHN5, 2023).
- [Lijst van hoogste gebouwen van Rotterdam](https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Rotterdam).
- Foto's op Wikimedia Commons (niet meegeleverd): [vanaf de Wijnhaven](https://commons.wikimedia.org/wiki/File:OurDomain_Rotterdam_Blaak.jpg), [vanaf de Maaskade](https://commons.wikimedia.org/wiki/File:Woongebouw_van_OurDomain_aan_de_Blaak.jpg), [Gapersteeg](https://commons.wikimedia.org/wiki/File:2025_Gapersteeg,_Rotterdam_vanaf_de_Wijnhaven_tot_aan_de_Wijnstraat.jpg), [Vissteeg](https://commons.wikimedia.org/wiki/File:2025_Vissteeg,_Rotterdam_vanaf_de_Blaak_tot_aan_de_Wijnstraat.jpg).
