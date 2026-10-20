# Lighthouse (Eindhoven)

Vereenvoudigd, printbaar model van Lighthouse (ook Toren Niko) aan het Machinekamerplein op Strijp-S, naast het Klokgebouw (woontoren, 2022–2025, De Zwarte Hond): een schijf van 58,4 × 23,8 m met 34 lagen tot 109 m, die naar het westen in twee lagere blokken afloopt, een getande noordoosthoek, een teruggezette noordwesthoek, een kroon van drie penthouselagen boven de westelijke helft, een colonnade van twee lagen langs de hele zuidgevel en doorlopende balkonbanden op de zuidgevel van het oostdeel.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `lighthouse-eindhoven.glb` | Model in meters, Y omhoog, één node `building:lighthouse-eindhoven-getrapte-woontoren-met-kroon-en-colonnade` |
| `lighthouse-eindhoven.json` | Catalogusitem |
| `lighthouse-eindhoven-1-1000.stl` | Los te printen op 1:1000, Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[159800.3, 384421.66]`, in het midden van de plattegrond. De lokale X-as loopt langs de zuidgevel (de colonnade) van west naar oost, −28,24° op RD-oost; alle 28 pijlerhoekpunten van de BAG-contour liggen op die lijn. Lokaal z = 0 is NAP +18,3 m: het AHN-DTM op de straten rondom (18,22–18,48 m). De 3D BAG geeft 17,83 m (`b3_h_maaiveld`), gemeten in 2024 toen het terrein nog bouwplaats was. `groundSamplePoints` liggen op de stoep langs de zuid-, noord- en westgevel, `groundHeight` is 61,97 m (ellipsoïdisch, laagste PDOK-terrein op de stoep aan de zuidkant), `groundOffsetMetres` −0,15.

`replacesBuildings` bevat alleen het pand zelf (`0772100001039863`); de PDOK-reconstructie daarvan is één vlak blok tot circa NAP +125,7 m. Het Klokgebouw (`0772100000302690`) en het pand ten zuidoosten (`0772100000301565`) hebben in hun PDOK-reconstructie geen punten van de toren: geen enkel hoekpunt van het Klokgebouw ligt binnen 8 m van de toren, en het andere pand raakt hem op 3 m met zijn eigen dakhoogte (NAP +29,3 m, 3D BAG +29,9 m). Ze blijven dus staan.

## Onderdelen en maten

| Onderdeel | Vorm | Hoogte (NAP) |
| --- | --- | --- |
| Plint | BAG-contour: 58,38 × 23,80 m, noordoosthoek getand in zes treden van 4,1 × 1,665 m; begane grond en eerste verdieping samen 7,45 m | +25,75 m |
| Westblok W1 | u 0–8,0 m over de volle diepte, tot en met de 3e laag | dak +31,60 m, dakrand +32,52 m |
| Westblok W2 | u 8,0–16,24 m over de volle diepte, tot en met de 10e laag | dak +52,60 m, dakrand +53,52 m |
| Noordwesthoek | u 16,24–24,24 m, v 20,95–23,80 m, tot en met de 18e laag | +78,25 m |
| Schijf | alles oostelijk van W2 behalve de noordwesthoek, 31 lagen van 3,035 m boven de plint | dak +116,8 m, dakrand (1,0 m breed) +117,8 m |
| Trappenhuis op het dak van het oostdeel | 2,9 × 5,5 m naast de kroon | +120,4 m |
| Kroon | westelijke 21,6 m van de schijf, aan de noordkant 2,85 m terug (v ≤ 20,95), met een uitstulping tot u = 41,98 tussen v 5,6 en 18,2; drie penthouselagen van 3,2 m | dak +126,4 m, dakrand (0,8 m breed) +127,1 m |
| Colonnade | langs de hele zuidgevel, pijlers van 1,4 m om de 4,1 m, openingen van 2,7 m, als nis van 1,5 m diep met een kop onder 45° | +23,7 m achterin, +25,2 m aan de gevel |
| Balkonbanden | zuidgevel van het oostdeel (u 37,88–58,38), op elke vloer van de 2e tot en met de 31e laag, 0,7 m vóór de gevel, bovenkant 1,15 m boven de vloer, buitenrand 0,9 m dik, onderkant onder 45° | vloeren +25,75 tot +113,8 m, bovenkant hoogste band +114,9 m |
| Vensters | staande ramen tussen bakstenen penanten: per gevelzijde verticale nissen van 0,4 m diep en circa 1,1 m breed tussen penanten van 0,9 m, doorlopend over de lagen waar de gevel vrij ligt; in de plint ramen van twee lagen, in de kroon ramen van drie lagen boven een band van 1,9 m | |

Contour uit de BAG. De opbouw komt uit de plattegronden van De Zwarte Hond (begane grond, 4e, 19e en 32e verdieping, 1:200) en de doorsnede (1:500), geschaald op de BAG-maten (58,38 m bij 23,80 m). De doorsnede geeft de plint (7,45 m), dertig woonlagen tot +98,5 m boven maaiveld, drie penthouselagen tot het kroondak op +108,1 m en de dakrand op +108,8 m (Wikipedia: 109 m). De dakhoogtes van W1 en W2 komen uit de 3D BAG (AHN5, 2024), toen die blokken al af waren; ze passen op 3 en 10 lagen van de doorsnede. De actuele luchtfoto toont de afgebouwde toren: de kroon met installaties, het trappenhuis ernaast, het lagere oostdeel met de getande rand en de balkonbanden op de zuidgevel.

## Geschat en weggelaten

- Het AHN van de PDOK-WCS is van vóór de bouw (bouwterrein, DSM circa NAP +18 tot +21 m), en de 3D BAG toont de toren in aanbouw (tot +82,7 m boven maaiveld). Voor de schijf, de noordwesthoek en de kroon zijn de hoogtes daarom uit de doorsnede en de plattegronden gehaald, niet gemeten.
- De noordwesthoek is op de plattegrond van de 4e verdieping nog volledig en op die van de 19e een terras; hij is tot en met de 18e laag gemodelleerd, met een dakrand van 0,9 m. Foto's van het westen bevestigen een trede rond die hoogte.
- Het trappenhuis op het dak van het oostdeel staat op de plattegrond van de 32e verdieping; de hoogte (één penthouselaag plus 0,4 m) is geschat.
- De colonnade is in werkelijkheid een overdekte gang van circa 4,5 m diep onder een vlak plafond; ze is als nis van 1,5 m gemodelleerd zodat de export er geen steun onder hoeft te zetten. Pijlerbreedte en stramien uit de plattegrond van de begane grond.
- Gevelstramien: de penanten volgen het stramien van 4,1 m niet precies; per zijde is de lengte gelijk verdeeld in nissen van circa 1,1 m tussen penanten van 0,9 m. Op de korte oostzijden van de tanden (1,665 m) staan geen nissen. Elke nis heeft minstens 1 m materiaal erachter.
- Balkonbanden: de uitkraging (0,7 m) uit de plattegrond van de 19e verdieping, het aantal (2e tot en met 31e laag) uit foto's. De glazen balustrades en de loggia's met balkons in de westelijke helft zijn als nissen weergegeven.
- Weggelaten: de glazen hekken op het dak van het oostdeel (doorsnede tot circa +100,5 m boven maaiveld) en het lichte frame op het kroondak (tot circa +110,9 m), dunner dan 0,9 m; de leidingen en kleine installaties op beide daken (lager dan 1 m boven de dakrand); de inspringende kozijnen, donkere borstweringspanelen en lamellen in de nissen.

## Controle

`node scripts/generate-lighthouse-eindhoven.mjs` geeft `NoError`; het model is één gesloten deel met genus 0 (3742 driehoeken, 172 nissen). In de webshop controleert `tests/landmark-models.test.ts` de daken en dakranden van W1 en W2, de noordwesthoek, het dak en de dakrand van de schijf, het trappenhuis, het kroondak en de kroonrand, de getande noordoosthoek, de teruggezette noordgevel van de kroon, de balkonbanden 0,7 m vóór de zuidgevel, dat een colonnadeopening en een vensternis na de printcorrectie op 45° open blijven, genus 0, één component, de volumeverhouding print/model (1,000) en de plaatsing. Vier schuine aanzichten zijn naast de PDOK-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0772100001039863` (bouwjaar 2025); actuele orthoHR; AHN-DTM 0,5 m (PDOK WCS).
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0772100001039863).
- [Wikipedia: Lighthouse (Eindhoven)](https://nl.wikipedia.org/wiki/Lighthouse_(Eindhoven)).
- [De Zwarte Hond: Lighthouse](https://dezwartehond.nl/en/projecten/lighthouse/) (projectbeschrijving, plattegronden en doorsnede).
- Foto's op Wikimedia Commons (niet meegeleverd): [Toren Niko (2025) (1)](https://commons.wikimedia.org/wiki/File:Toren_Niko_(2025)_(1).jpg), [Toren Niko (2025) (2)](https://commons.wikimedia.org/wiki/File:Toren_Niko_(2025)_(2).jpg), [Toren Niko (2025) (3)](https://commons.wikimedia.org/wiki/File:Toren_Niko_(2025)_(3).jpg), [Woontoren Niko in aanbouw](https://commons.wikimedia.org/wiki/File:Woontoren_NIko_in_aanbouw.jpg), [Toren Niko en Klokgebouw (2024)](https://commons.wikimedia.org/wiki/File:Toren_Niko_en_Klokgebouw_(2024).jpg).
