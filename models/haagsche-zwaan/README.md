# De Haagsche Zwaan (Den Haag)

Vereenvoudigd, printbaar model van De Haagsche Zwaan, de kantoortoren van 20 lagen aan de Schenkkade 50 in het Beatrixkwartier (2010, ZZDP Architecten, ontwikkelaar OVG). De toren helt over de verdiepte Utrechtsebaan: de noordoostkop kraagt naar boven toe steeds verder uit, tot de bovenste laag ongeveer 12 m voorbij de voet van de gevel ligt. Op beide lange gevels loopt een witte trekdiagonaal van de bovenhoek naar de entree, waar hij als schuine plaat naar het maaiveld gaat; daaronder staat de glazen entree als omgekeerde V. Aan de zuidwestkant ligt een laagbouw van drie lagen met parkeren en kantoortjes langs de rand.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `haagsche-zwaan.glb` | Model in meters, Y omhoog, twee nodes: `building:haagsche-zwaan-toren` (toren met plint, entreehal, kolommen en dakopbouw) en `building:haagsche-zwaan-laagbouw` |
| `haagsche-zwaan.json` | Catalogusitem |
| `haagsche-zwaan-1-1000.stl` | Los te printen op 1:1000 (74,5 × 24,8 × 76,5 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[82845.0, 454910.0]`, midden op het torendak. De X-as loopt langs de lange gevels naar het noordoosten, naar de Utrechtsebaan (35,45° op RD-oost; de BAG-randen staan op 35,39° en 35,48°), Y naar het noordwesten. Lokaal z = 0 is NAP +0,70 m, het maaiveld langs de Schenkkade (AHN-DTM 0,6–0,9); `groundHeight` is 44,22 m (ellipsoïdisch, NAP + 43,52 zoals bij de Groene Toren) en `groundOffsetMetres` −0,15. De verdiepte Utrechtsebaan ligt direct naast de noordoostkop op NAP −5,1; daarom staan er twee `groundSamplePoints` op de stoep van de Schenkkade, anders zakt het model naar de weg.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Plattegrond | trapezium van 74,5 m lang, 19,9 m breed bij de kop en 24,4 m bij de laagbouw; zuidoostgevel recht, noordwestgevel 3,4° uit de as | — | BAG-contour (knikjes van 0,3–0,4 m weggelaten) |
| Torendak | 53,6 m lang van u −16,0 tot de BAG-rand op u 37,6 | +74,52 m | 3D BAG LoD2.2 (74,47–74,58, 70e percentiel 74,55), AHN-DSM 74–75 |
| Noordoostkop | helt 0,18 m per meter naar buiten, van u 26,35 aan de onderkant tot 37,6 bovenaan (11,25 m), de laatste 1,5 m boven de Utrechtsebaan | +12,0 tot +74,52 m | foto's (helling), BAG-rand, AHN-DTM (rand van de weg op u 36), Wikipedia en architect (12 m uitkraging) |
| Zuidwestgevel van de toren | helt 0,12 m per meter mee, van u −23,5 op de laagbouw tot −16,0 bovenaan | +12,0 tot +74,52 m | DSM (dakrand), foto's (helling), 3D BAG (schuin dakvlak op u −23 tot −15) |
| Onderkant toren / plint | plint tot de entree op u 12,2 | +12,1 m, onderkant toren +12,0 m | 3D BAG (dak laagbouw), foto's |
| Entreehal | omgekeerde V: schuine plaat van het maaiveld op u −3,5 naar u 12,2, schuine kant van u 12,8 naar het maaiveld op u 22,0 | tot +12,0 m | foto's, AHN-DTM (geen maaiveldpunten tot u 22) |
| Open doorgang | onder de kop van u 22 tot 26,35, kolommen van 1,0 m op beide hoeken en een V onder het midden | onderkant +12,0 m | foto's, AHN-DTM (maaiveld vanaf u 22) |
| Trekdiagonalen | 1,6 m breed, 0,5 m uit de gevel, van de voet boven de entree naar de bovenhoek boven de weg; onder de schuine plaat een kraag onder 45° | +0,7 tot +74,52 m | foto's, architect |
| Installatiekast | circa 8 × 7 m midden op het dak | +76,43 m | 3D BAG (76,42–76,45), DSM 76 |
| Verdiepte installatieplaats | circa 4 × 8 m in de zuidwesthoek van het dak | +73,4 m | 3D BAG (73,3–73,6), ortho (roosters) |
| Laagbouw | 13,4 × 24 m aan de zuidwestkant | +12,1 m | BAG, 3D BAG (12,09–12,14) |
| Dakopbouw laagbouw | circa 4 × 3,5 m | +13,6 m | 3D BAG (13,57–13,63), ortho |

Gevelreliëf: 17 lagen van 3,68 m boven de plint (20 bouwlagen in totaal). De glasgevel heeft stijlen op 1,8 m; per laag en per travee een blinde nis van 0,9 m breed en 0,35 m diep met een plafond onder ruim 45°, ook op de hellende kopgevels en niet achter de diagonalen. De grijze panelen van de plint en de laagbouw hebben verticale voegen op hetzelfde raster; daar één hoge sleuf per travee. Onder de schuine plaat ligt de glazen entree als nis van 0,4 m.

## Geschat en weggelaten

- De helling van beide kopgevels komt uit foto's (Utrechtsebaan, Schenkkade, Bezuidenhout) en de BAG-rand; de zuidwestgevel helt minder dan de kop. Het AHN ziet de hellende zuidwestgevel niet goed (glas boven het dak van de laagbouw), de 3D BAG legt daar een schuin dakvlak van 9,5–11,8 m neer op precies de voet van de gevel.
- De onderkant van de toren (+12,0 m), het aantal lagen boven de plint (17), de vorm van de entreehal, de plaats en het aantal kolommen, de breedte van de diagonaal en het gevelraster zijn geschat.
- De gevelindeling van de laagbouw (geen foto): het paneelraster van de plint is doorgezet op de Schenkkade- en de zuidwestgevel; de noordwestgevel is een gemene muur met pand `0518100000239895`.
- Weggelaten: de onderhoudsrails en borstwering rond de dakrand (circa 0,5 m), de dunne stijlen en de borstweringen in de glasgevel, de letters op de gevels, het kunstwerk *Prima Ballerina* en de rode knoop op het grasveld (geen deel van het pand), de terrassen op de laagbouw (kleiner dan 0,9 m).
- De printcorrectie op 45° vult onder het vlakke plafond van de open doorgang bij (circa 800 m³, net onder 1 % van de toren).

## Controle

`node scripts/generate-haagsche-zwaan.mjs` geeft per node `NoError`, genus 0 en één gesloten deel. In de webshop controleert de test in `tests/landmark-models.test.ts` het dak, de installatiekast en -plaats, de laagbouw, de helling van de kop, de open doorgang, de uitstekende diagonaal, een gevelnis die na de printcorrectie blijft, de volumegroei door de printcorrectie en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0518100000250152` (bouwjaar 2010); actuele orthoHR; AHN-DSM en -DTM 0,5 m.
- [3D BAG, pand 0518100000250152](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000250152) (LoD2.2, puntwolk AHN5 2023).
- [De Haagsche Zwaan op Wikipedia](https://nl.wikipedia.org/wiki/De_Haagsche_Zwaan): 73,5 m, 20 lagen, 12 m over de Utrechtsebaan.
- [Haagsche Zwaan bij jidipi](https://architectures.jidipi.com/j00033257/en/haagsche-zwaan): ZZDP, taps uitkragende vorm, trekdiagonalen op de lange gevels, entree als omgekeerde V.
- Foto's op Wikimedia Commons (niet meegeleverd): [categorie De Haagsche Zwaan](https://commons.wikimedia.org/wiki/Category:De_Haagsche_Zwaan).
