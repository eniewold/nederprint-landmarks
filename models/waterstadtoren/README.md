# Waterstadtoren (Rotterdam)

Vereenvoudigd, printbaar model van de Waterstadtoren aan de Wijnhaven (woontoren, 2004): een toren met een trapsgewijs oplopende kop — een lagere trede aan de oostkant, het hoofddak en daarop een glazen kopvolume — op een plint van zes delen met elk een eigen hoogte.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `waterstadtoren.glb` | Model in meters, Y omhoog, één node `building:waterstadtoren-toren-kop-en-plint` |
| `waterstadtoren.json` | Catalogusitem |
| `waterstadtoren-1-1000.stl` | Los te printen op 1:1000 (43 × 59 × 110 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[93131.83, 436890.01]`, het hart van het BAG-pand. De lokale X-as loopt langs de Wijnhaven, 19,2° linksom op RD-oost; +Y wijst naar het noordnoordwesten. Lokaal z = 0 is NAP +2,65 m. `groundSamplePoints` liggen op de stoepen rondom, `groundHeight` is 46,128 m (ellipsoïdisch), `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Hoogte (NAP) |
| --- | --- |
| Toren (plattegrond uit de 3D BAG, met de inham aan de noordoosthoek) | +106,2 m |
| Oostelijke trede en kleine trede in de zuidwesthoek | +97,4 m |
| Glazen kopvolume (trapezium van circa 15 × 7,5 m) | +111,4 m |
| Plint: noordblok / westvleugel / strook / midden / zuidmidden / zuidoost | +24,5 / +17,35 / +14,5 / +11,8 / +8,8 / +13,5 m |
| Lager dakdeel in het noordblok | +20,8 m |
| Twee dakopbouwen op het middendeel | +12,7 m |

Contouren en hoogtes uit de BAG en de 3D BAG (LoD2.2; deze reconstructie gebruikt de puntenwolk van 2011, de toren is van 2004).

## Geschat en weggelaten

- Verdiepingen: 32 lagen tot de trede, 3 tot het hoofddak en 2 in de kop (circa 3,0 m); in de plint circa 3,4 m. Vensters als blinde nissen van 0,35 m op een travee van 2,9 m met penanten van 1,0 m; de glazen kop krijgt een doorlopende band per laag. Elke nis heeft minstens 1 m materiaal achter zich, zodat er geen doorgangen door dunne delen ontstaan.
- De gestapelde hoekbalkons verspringen per laag met minder dan 0,9 m en zijn vereenvoudigd tot het vensterstramien; de blauwe glasstrook op de gevel is alleen kleur.
- Dakapparatuur kleiner dan 0,9 m is weggelaten.

## Controle

`node scripts/generate-waterstadtoren.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert `tests/landmark-models.test.ts` alle dakhoogtes, dat een venster na de printcorrectie op 45° een blinde nis blijft, genus 0, één component en de plaatsing. Vier schuine aanzichten zijn naast de PDOK-reconstructie (met schuine reconstructievlakken) en de foto's gelegd; de kaart met landmarks aan en een preview-export op 1:1000 (ondersteuning 0,06 % van het volume) zijn bekeken.

## Bronnen

- PDOK BAG, pand `0599100000702531` (bouwjaar 2004); actuele orthoHR.
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000702531).
- [Wikipedia: Waterstadtoren](https://nl.wikipedia.org/wiki/Waterstadtoren).
- Foto's op Wikimedia Commons (niet meegeleverd): [in Rotterdam](https://commons.wikimedia.org/wiki/File:Waterstadtoren_in_Rotterdam.jpg), [Waterstadtoren - Rotterdam](https://commons.wikimedia.org/wiki/File:Waterstadtoren_-_Rotterdam.jpg), [Rotterdam - Waterstadtoren](https://commons.wikimedia.org/wiki/File:Rotterdam_-_Waterstadtoren.jpg), [Waterstadtoren](https://commons.wikimedia.org/wiki/File:Waterstadtoren.jpg).
