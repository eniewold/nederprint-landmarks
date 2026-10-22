# Oosterbaken (Hoogvliet, Rotterdam)

Vereenvoudigd, printbaar model van de Oosterbaken aan het Oedevlietsepark (woontoren, 2007, 33 lagen): een plattegrond als pijlpunt met een rechte noordwest- en noordoostgevel in baksteen en aan de parkkant twee inspringende gevels met een donker paneel en glasstroken. Bovenin kragen drie glazen kopvolumes met een witte rand uit, langs de holle zuidgevels springt de bovenste laag terug achter een terras, en onderaan staan de lage westvleugel en de entree aan de noordkant.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `oosterbaken.glb` | Model in meters, Y omhoog, één node `building:oosterbaken` |
| `oosterbaken.json` | Catalogusitem |
| `oosterbaken-1-1000.stl` | Los te printen op 1:1000 (40 × 35 × 103 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[83721.19, 430909.54]`, het hart van de BAG-contour. De lokale X-as loopt langs de noordwestgevel, 39,3° linksom op RD-oost (de BAG-randen zijn binnen 0,1° evenwijdig of haaks); +Y wijst naar het noordwesten, de holle gevels kijken naar het zuiden over de vijver. Lokaal z = 0 is NAP +0,1 m, het maaiveld aan de parkkant. De straat aan de noordkant ligt op NAP +3,3 m en de vijver tegen de zuidwestgevel op −0,8 m; `groundSamplePoints` liggen daarom op de grasstrook langs de holle gevels (zonder die punten zou de lader de vijver nemen), `groundHeight` is 43,8 m (ellipsoïdisch, PDOK-terrein op die strook) en `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Toren | BAG-contour vanaf u = −13,3 m, 26,8 × 28,5 m | dak +97,2 m | BAG, AHN-DSM (97,2–97,6), PDOK |
| Terras langs de holle zuidgevels | bovenste laag 2,5 m terug | +91,6 m | AHN-DSM (91,4–92,6), PDOK |
| Installatieopbouwen | 5,4 × 5,5 m en 3,0 × 3,8 m, strook 1,6 × 5,2 m | +102,1, +100,2 en +98,5 m | AHN-DSM |
| Kopvolume noordhoek | 4,9 × 5,3 m, 1,2 m uitkragend | +66,0 m tot het dak | foto's, luchtfoto |
| Kopvolume zuidpunt oostarm | 8,1 × 7,4 m, 1,0–1,2 m uitkragend | +70,0 m tot het dak | foto's |
| Kopvolume westkop | 5,2 × 6,7 m, 1,2 m uitkragend | +68,0 m tot het dak | foto's |
| Westvleugel | 6,1 × 7,1 m en 5,7 × 7,1 m | +6,5 en +9,4 m | BAG, PDOK (het AHN heeft hier geen meting) |
| Entree noordkant | 5,6 × 5,8 m | +8,4 m | BAG, PDOK |

Onder elk kopvolume loopt een kraag onder 45° naar de gevel, zodat het zonder steun print. In de bakstenen gevels en het donkere paneel staan vensters als blinde nissen van 0,35 m diep (1,2 m breed, travee 2,2–2,4 m); de glasstroken en de kopvolumes hebben per laag een doorlopende glasband. Elke nis heeft een plafond onder 45°.

## Geschat en weggelaten

- De onderkant en de uitkraging van de drie kopvolumes zijn op foto's geschat (circa negen lagen onder het dak, 1,0–1,2 m); het AHN ziet alleen het dak.
- Verdiepingen: begane grond 4,0 m en daarboven 2,9 m, zodat er 33 lagen tot het dak passen; het vensterstramien is op foto's geteld en per gevel gelijk verdeeld.
- De terugsprong boven het terras is als één strook van 2,5 m langs beide holle gevels gemodelleerd; de glazen bovenste laag heeft daar geen eigen gevelreliëf.
- Weggelaten: de slangvormige reliëfs in de baksteen, balkonhekken en de antenne op het noordelijke kopvolume (kleiner dan 0,9 m).

## Controle

`node scripts/generate-oosterbaken.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert `tests/landmark-models.test.ts` de dak-, terras- en installatiehoogtes, de lage vleugels, de uitkraging van het oostelijke kopvolume, dat de vensternissen na de printcorrectie op 45° open blijven, één component en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de PDOK-reconstructie en de foto's gelegd en het model is op de kaart en in een preview-export op 1:1000 bekeken.

## Bronnen

- PDOK BAG, pand `0599100000431103` (bouwjaar 2007); actuele orthoHR; AHN-DSM en -DTM 0,5 m; PDOK 3D-gebouwtegel (LoD2.2).
- [Wikipedia: Oosterbaken](https://nl.wikipedia.org/wiki/Oosterbaken).
- Foto's op Wikimedia Commons (niet meegeleverd): [vanaf het zuidwesten](https://commons.wikimedia.org/wiki/File:Rotterdam_toren_hoogvliet_oosterbaken.jpg), [vanaf het park](https://commons.wikimedia.org/wiki/File:Oosterbaken_1.jpg), [noordgevels](https://commons.wikimedia.org/wiki/File:Oosterbaken_4_copy.jpg), [lente 2007](https://commons.wikimedia.org/wiki/File:Hoogvliet_De_Oosterbaken_lente_2007.jpg), [langs de vaart](https://commons.wikimedia.org/wiki/File:Hoogvliet_Oosterbaken.jpg).
