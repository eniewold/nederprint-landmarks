# Eschertoren (Leiden)

Vereenvoudigd, printbaar model van de Eschertoren aan de Willem de Zwijgerlaan in Leiden-Noord (2000–2002, Patrick Barras & Partners, 17 lagen), het enige hoge gebouw dat bij de sloop van de Groenoordhallen bleef staan. Gebouwd als kantoor, nu woningen. De toren is getrapt: een middenblok tot NAP +64,5 m, een lichte oost- en noordvleugel met horizontale vensterbanden tot +54,2 m en een glazen blok op de zuidwesthoek tot +61,15 m. Tussen het glazen blok en de oostvleugel springt de zuidgevel 3 m terug. Aan de westkant staat de toren op een sokkel van twee lagen met een gebogen gevel langs het plein.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `eschertoren-leiden.glb` | Model in meters, Y omhoog, twee nodes: `building:eschertoren-leiden-toren` en `building:eschertoren-leiden-sokkel` |
| `eschertoren-leiden.json` | Catalogusitem |
| `eschertoren-leiden-1-1000.stl` | Los te printen op 1:1000 (39 × 29 × 67 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[93912.0, 464908.0]`, in het middenblok. De X-as loopt langs de zuid- en noordgevel naar het oostzuidoosten (-24,1° op RD-oost; de BAG-randen liggen tussen -24,02 en -24,17°), Y naar het noordnoordoosten; de zuidgevel aan de Eschertoren is de voorkant (-Y). Lokaal z = 0 is NAP +0,15 m (3D BAG-maaiveld 0,14, AHN-DTM rondom 0,19); `groundHeight` is 43,6 m (ellipsoïdisch, NAP + circa 43,45) en `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Oost- en noordvleugel | BAG-contour, 26,3 × 25 m met een sleuf van 5 × 1 m in de oostgevel en een inham van 1 m in de noordgevel | +54,2 m, dakrand +55,25 | 3D BAG (54,18–54,22), AHN-DSM |
| Middenblok | 17,8 × 15,7 m, noordwesthoek een trede lager; aan de westkant tot op de sokkel | +64,5 m, dakrand +65,55 | 3D BAG (64,42–64,57), AHN-DSM (65,5 tot u = -8,5) |
| Glazen blok zuidwest | 9,9 × 9,7 m | +61,15 m, dakrand +62,25 | 3D BAG (61,11–61,18), AHN-DSM |
| Terugsprong zuidgevel | 6,5 m breed, 3 m diep, over de volle hoogte | — | BAG-contour, luchtfoto 2025 |
| Sokkel | westelijk deel van de BAG-contour, gebogen gevel met straal 24,5 m om het plein | +9,25 m | 3D BAG (9,20–9,34) |
| Ventilatorblok | 4,8 × 2,6 m, noordoosthoek vleugeldak | +56,5 m | 3D BAG (56,49–56,50), luchtfoto (8 ventilatoren) |
| Koelunits | twee blokken 2,7 × 5 en 2,7 × 2 m langs de oostrand | +55,6 m | 3D BAG (55,34–55,66), luchtfoto |
| Kast op het middenblok | 3,0 × 1,6 m | +65,9 m | AHN-DSM (65,8–65,9) |
| Dakranden | 0,9 m breed, circa 1,05 m hoog, op alle drie de daken | zie boven | AHN-DSM |

Gevelreliëf (blinde nissen van 0,35 m met een plafond onder 45°), per laag: begane grond 4,6 m, daarboven 3,5 m.

- Vleugels en middenblok: een doorlopende vensterband per laag (borstwering 1,0 m, latei 0,4 m), op de begane grond grote ramen van 2,0 m op 3,0 m.
- Glazen blok: ruiten van 1,5 m op een travee van 2,4 m met een borstwering van 0,6 m, zodat het raster zich onderscheidt van de banden.
- Terugsprong: per laag twee vensters van 2,0 m met een penant ertussen.
- Sokkel: grote ramen op de begane grond en een vensterband op de verdieping, ook langs de gebogen gevel.
- De bovenste laag van het middenblok (installatielaag tot +64,5) is dicht.

## Geschat en weggelaten

- Naam: de straat en het gebouw heten Eschertoren (naar M.C. Escher); de hoogbouwlijst noemt 60 m, 17 lagen en Patrick Barras & Partners (alleen die bron en skyscraperpage, niet verder nagekeken).
- Dakvorm: het dak is getrapt, niet hellend. De twee schuine vlakken van 66,6° in de 3D BAG liggen op de westgevel, tussen de daken op +54/+64 en de sokkel; het DSM meet daar een verticale gevel (65,5 tot op 9 m binnen 1 m). Ze zijn als verticale gevels gebouwd.
- Verdiepingshoogtes en het aantal banden: op de luchtfoto van 2025 zijn op de zuidgevel van de vleugel circa 15 banden te tellen; 14 lagen van 3,5 m boven een begane grond van 4,6 m is een schatting. Er zijn geen bruikbare schuine foto's op Wikimedia Commons; de gevels komen uit de luchtfoto's 2021–2026, waarop de toren telkens naar een andere kant helt.
- De gevel van de sokkel (ramen, verdiepingsband) is geschat; de begane grond langs het plein kan een galerij met kolommen hebben, zoals de buurgebouwen, maar dat is niet te zien.
- Weggelaten: de buismast met antennes op het middenblok (DSM tot +69,6; dunner dan 0,9 m), de hekwerken op de daken en de stijlen van de vliesgevel (kleiner dan 0,9 m), en een gestreept element op het sokkeldak tegen de westgevel (op de luchtfoto niet te duiden, waarschijnlijk een trap of rooster lager dan 0,9 m).
- De hal van Groenoordplaza ten noorden van de sokkel is een ander pand (`0546100000025645`) en zit niet in het model.

## Controle

`node scripts/generate-eschertoren-leiden.mjs` geeft per node `NoError`, genus 0 en één gesloten deel. In de webshop controleert de test in `tests/landmark-models.test.ts` de daken, dakranden en installaties, dat een vensterband in de zuidgevel na de printcorrectie op 45° zijn diepte houdt, dat het volume minder dan 1 % groeit, één component per node en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de luchtfoto's gelegd.

## Bronnen

- PDOK BAG, pand `0546100000025644` (bouwjaar 2001), [BAG-viewer](https://bagviewer.kadaster.nl/lvbag/bag-viewer/?objectId=0546100000025644); orthoHR 2021–2026; AHN-DSM en -DTM 0,5 m; 3D BAG LoD2.2 (AHN4, 2020).
- [Lijst van hoogste gebouwen van Leiden](https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Leiden) en [Groenoordhallen](https://nl.wikipedia.org/wiki/Groenoordhallen).
- [Eschertoren op SkyscraperPage](https://skyscraperpage.com/b9564).
