# Weenacenter (Rotterdam)

Vereenvoudigd, printbaar model van het Weenacenter aan het Weena (woontoren, 1987–1990, Ector Hoogstad Architecten; 34 verdiepingen, 104 m): een toren met een halfronde kop aan de Weenakant, twee hogere flanken aan de noordkant met een verdiepte sleuf ertussen, een middenkern die het hoogst reikt, en een lagere vleugel aan de noordkant met een trappenhuiskop.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `weenacenter.glb` | Model in meters, Y omhoog, één node `building:weenacenter-toren-ronde-kop-en-vleugel` |
| `weenacenter.json` | Catalogusitem |
| `weenacenter-1-1000.stl` | Los te printen op 1:1000 (30 × 39 × 107 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[92225.43, 437715.71]` (hart van de BAG-panden in de buurt; het model ligt op u 5,5–35,7 en v −39,2 tot −0,3). De lokale X-as loopt langs het Weena, 16,9° linksom op RD-oost; de ronde kop wijst naar −Y, het Weena. Lokaal z = 0 is NAP −0,5 m. `groundSamplePoints` liggen op de stoepen en straten rondom, `groundHeight` is 43,18 m (ellipsoïdisch, stoep langs het Weena), `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Vorm | Hoogte (NAP) |
| --- | --- | --- |
| Toren met halfronde kop | 30,1 m breed, kop met straal 15,05 m (gefit op de BAG-contour) | +97,2 m |
| Twee flanken aan de noordkant | 30,1 × 7,3 m, met een sleuf van 7,5 m breed en 1,5–2,4 m diep boven de vleugel | +101,8 m |
| Middenkern | 11,0 × 15,4 m | +105,4 m |
| Lagere vleugel | 30,1 × 12,0 m | +41,45 m |
| Trappenhuiskop op de vleugel | 15,5 × 5,2 m en 7,1 × 4,4 m | +46,65 m en +50,8 m |
| Installatie op de vleugel | 4,0 × 5,4 m | +43,15 m |

Contour uit de BAG, hoogtes uit de 3D BAG (LoD2.2); de sleuf volgt uit het ontbrekende dakvlak tussen de flanken in de 3D BAG en de PDOK-reconstructie.

## Geschat en weggelaten

- Verdiepingen: 33 gelijke lagen tot de ronde kop (circa 2,96 m) en één laag in de flanken erboven. Vensters als blinde nissen van 0,35 m op een travee van 3,0 m met penanten van 0,95 m; de ronde kop heeft per facet (16 facetten over de halve cirkel) één venster per laag.
- De gestapelde witte erkerstrook aan de westflank, de kleurverdeling van de gevel (donker graniet, lichtgrijze panelen) en de luifel bij de ingang zijn kleiner dan 0,9 m of alleen kleur.

## Controle

`node scripts/generate-weenacenter.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert `tests/landmark-models.test.ts` alle dakhoogtes, de sleuf in de noordgevel, dat een venster in een facet van de ronde kop na de printcorrectie op 45° een blinde nis blijft, genus 0, één component en de plaatsing. Vier schuine aanzichten zijn naast de PDOK-reconstructie en de foto gelegd; de kaart met landmarks aan en een preview-export op 1:1000 (ondersteuning 0,06 % van het volume) zijn bekeken.

## Bronnen

- PDOK BAG, pand `0599100000689019` (bouwjaar 1990); actuele orthoHR.
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000689019).
- [Wikipedia: Weenacenter](https://nl.wikipedia.org/wiki/Weenacenter).
- Foto op Wikimedia Commons (niet meegeleverd): [Weenacenter](https://commons.wikimedia.org/wiki/File:Weenacenter.jpg).
