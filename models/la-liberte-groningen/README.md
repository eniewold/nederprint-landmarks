# La Liberté (Groningen)

Vereenvoudigd, printbaar model van de hoge toren van La Liberté aan de Laan van de Vrijheid bij het Vrijheidsplein, schuin tegenover het Gasuniegebouw (Dominique Perrault, 2011). De toren bestaat uit drie op elkaar gestapelde blokken op dezelfde vierkante plattegrond van 25,2 m: een glazen kantoorsokkel met horizontale strepen, een rondom teruggelegen glazen terrasverdieping, een donker woonblok dat daar overheen kraagt en een wit woonblok dat 1,4 m naar het noordwesten is verschoven. Beide woonblokken hebben een vrij verspreid patroon van kleine vensters en brede balkonramen.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `la-liberte-groningen.glb` | Model in meters, Y omhoog, één node: `building:la-liberte-groningen` |
| `la-liberte-groningen.json` | Catalogusitem |
| `la-liberte-groningen-1-1000.stl` | Los te printen op 1:1000 (25 × 27 × 76 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[233015.91, 579933.24]`, het hart van de BAG-contour. De X-as loopt langs de zuidoostgevel naar het noordoosten (`xAxis` `[15.3, 19.99]`, 52,6° op RD-oost; de vier BAG-randen staan haaks), de Y-as langs de zuidwestgevel naar het noordwesten. Lokaal z = 0 is NAP −0,15 m, het plein rondom (AHN-DTM −0,36 tot +0,12). `groundHeight` is 40,6 m (ellipsoïdisch): NAP −0,15 plus 40,75; de geoïde NLGEO2018 geeft hier 40,80, De Oosterpoort en Vera gebruiken 40,61–40,68. `groundOffsetMetres` is −0,15.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Glazen sokkel | BAG-contour, 25,18 × 25,18 m | tot +11,77 m | BAG; 3D BAG-dakvlak langs de zuidwestrand (11,76–11,81) |
| Terrasverdieping | rondom 3,0 m teruggelegen, 19,2 × 19,2 m | +11,77 tot +14,6 m | foto's (geschat) |
| Donker woonblok | BAG-contour | +14,6 tot +45,6 m | 3D BAG-dakvlak langs de zuidoostrand (45,54–45,84); onderkant uit foto's |
| Wit woonblok | 25,18 × 25,18 m, 1,4 m naar het noordwesten verschoven | +45,6 tot +72,5 m | 3D BAG-dak (72,47–72,52), AHN-mediaan 72,50; verschuiving uit het AHN-dak (noordwestrand bij y ≈ 13,8), de 3D BAG-strook van 1,46 m en foto's |
| Dakrand | 0,9 m breed | +73,3 m | AHN-DSM langs de randen 73–75 (geschat) |
| Koelers | 2,2 × 7,2 m | +74,92 m | 3D BAG-dakvlak, DSM |
| Opbouw | 4,4 × 3,4 m | +74,27 m | 3D BAG-dakvlak, DSM |
| Gevelliftkraan | 1,3 × 1,5 m | +74,2 m | 3D BAG-dakvlak, luchtfoto |

Gevelreliëf: in de sokkel per laag (4,4, 3,75 en 3,77 m) een glasband van 0,3 m diep die om de hoeken doorloopt, met een borstwering van 0,9 m en een plafond onder 45°. In het donkere blok 10 lagen van 3,1 m en in het witte blok 9 lagen van 2,99 m, per gevel en per laag zes tot acht openingen: kleine vensters van 1,5 × 1,6 m en brede balkonramen van 2,7 × 2,05 m, als blinde nissen van 0,35 m met een plafond onder 45°, minstens 0,9 m uit elkaar en 1,0 m uit de hoeken.

De onderkant van het donkere blok boven de terrasverdieping en de overstek van het witte blok aan de noordwestkant zijn in het model vlak en open; de printexport vult ze op met een wig onder 45° (samen 0,9 % van het volume).

## Geschat en weggelaten

- De onderkant van het donkere blok (+14,6 m) en de terugsprong van de terrasverdieping (3,0 m) komen uit foto's; Perrault noemt een terras van 5 m hoog, de foto's geven circa 2,8 m boven het sokkeldak.
- De verschuiving van het witte blok (1,4 m) ligt tussen het AHN-dak (1,2 m) en de vrije dakstrook in de 3D BAG (1,46 m); de andere richting heeft geen meetbare verschuiving.
- Verdiepingshoogtes en de dakrand (+73,3 m) zijn geschat.
- Het vensterpatroon komt uit een vaste pseudo-willekeurige reeks met de dichtheid en maten van de foto's; de echte posities van de vensters zijn niet overgenomen.
- Weggelaten: de gepolijste stalen panelen haaks op de gevels, de balkonhekken en het glazen hek langs het sokkeldak (dunner dan 0,9 m); de richel van 0,55 m die de sokkel volgens de 3D BAG aan de zuidwestkant uitsteekt (kleiner dan 0,9 m); de rail van de gevelliftinstallatie op het dak (dunner dan 0,9 m).
- Niet in dit model: de lage toren van La Liberté (circa 36 m, BAG-pand `0014100010982673`) en de loopbrug op circa +12 m die beide sokkels verbindt; die horen niet bij dit pand.

## Controle

`node scripts/generate-la-liberte-groningen.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert een test de daken, de dakrand en de installaties, de vrije dakstrook en de overstek van het witte blok, de glasband van de sokkel en de terugliggende terrasverdieping, dat de vensternissen na de printcorrectie op 45° blijven, dat de printcorrectie minder dan 1 % volume toevoegt, één component en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0014100010982642` (bouwjaar 2011); actuele orthoHR; AHN-DSM en -DTM 0,5 m.
- [3D BAG, pand 0014100010982642](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0014100010982642) (LoD2.2, TU Delft/3DGI, CC BY 4.0).
- [La Liberté (gebouw)](https://nl.wikipedia.org/wiki/La_Libert%C3%A9_(gebouw)) op Wikipedia.
- [La Liberté](https://perraultarchitecture.com/en/projects/la-liberte/) bij Dominique Perrault Architecture.
- Foto's op Wikimedia Commons (niet meegeleverd): [vanaf het zuidwesten (2012)](https://commons.wikimedia.org/wiki/File:20120326_La_Libert%C3%A9_Groningen_NL.jpg), [vanaf het westen (2011)](https://commons.wikimedia.org/wiki/File:La_Libert%C3%A9_20110719.jpg), [beide torens](https://commons.wikimedia.org/wiki/File:La_Libert%C3%A9_Groningen.JPG).
