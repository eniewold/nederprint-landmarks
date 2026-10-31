# Hoogvoorde (Rijswijk)

Vereenvoudigd, printbaar model van Hoogvoorde aan het Bogaardplein in Rijswijk: de kantoortoren die Jan Lucas (Lucas & Niemeijer) ontwierp voor het ministerie van CRM, opgeleverd in 1971 en in 2003 door Alynia-Lerou gerenoveerd; sinds de renovatie zit het stadhuis van Rijswijk erin. Een rechthoekige toren met per laag een doorlopende witte vloerrand, lichtblauwe pilasters op een raster van zeven bij drie traveeën en bovenin een glazen kroon van tweeënhalve laag die naar buiten helt, met uitlopende stijlen. Op het dak staat een groen bekleed installatiehuis met een hoger middendeel en twee rijen koelers. Aan de voet een begane grond met vier ronde uitbouwen ("Stadhuis Rijswijk") en aan de noordwestelijke helft een eerste verdieping met een fascia ("Hoogvoorde") die als luifel over de twee ingangen met hun ronde trappenhuizen doorloopt.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `hoogvoorde-rijswijk.glb` | Model in meters, Y omhoog, één node `building:hoogvoorde-rijswijk` |
| `hoogvoorde-rijswijk.json` | Catalogusitem |
| `hoogvoorde-rijswijk-1-1000.stl` | Los te printen op 1:1000 (57 × 34 × 83 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[81616.52, 450229.19]`, in het hart van de toren. De X-as loopt langs de lange gevels naar het zuidoosten (−59,7° op RD-oost; de randen van de BAG-contour, de 3D BAG en het AHN-DSM liggen binnen 0,3° evenwijdig), Y haaks erop naar het noordoosten. Lokaal z = 0 is NAP +0,65 m, het maaiveld rondom (AHN-DTM 0,64–0,73 m, 3D BAG 0,67 m); `groundHeight` is 44,05 m (ellipsoïdisch, NAP + 43,4) en `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Toren tot de vloerranden | 53,7 × 24,5 m | tot +66,31 m | AHN-DSM (randen), 3D BAG (rand onder de kroon 66,1–66,4) |
| Lagen | 17 lagen van 3,38 m boven de eerste verdieping, vloerrand 0,9 m | +8,85 tot +66,31 m | foto's (17 witte randen), hoogtes AHN/3D BAG |
| Kroon | helt 0,9 m naar buiten over 9,1 m; per travee een glasvlak tussen stijlen van 0,9 → 2,0 m | +66,31 tot +75,4 m | 3D BAG (75,40), foto's |
| Dakvlak binnen de kroon | rand 1,2–2,7 m breed | +74,25 m | 3D BAG (74,22–74,28), DSM |
| Koelers | twee rijen van 2,6 × 9,9 m | +77,1 m | 3D BAG (77,18), DSM |
| Kast aan de zuidoostkant | 3,3 × 1,9 m | +77,0 m | 3D BAG (76,7–77,1) |
| Installatiehuis, onderbouw | 27,8 × 11,4 m, dak naar de noordoostrand aflopend | +78,5 m (rand +77,4) | DSM (78–79), 3D BAG (helling 27°) |
| Installatiehuis, schouders | 27,4 × 8,2 m, steile zuidwestflank | +81,6 m | 3D BAG (81,57–81,65, flank 65°) |
| Installatiehuis, middendeel | 14,1 × 8,0 m | +83,15 m | 3D BAG (83,17–83,19), DSM (83,1) |
| Eerste verdieping met fascia | 36,2 × 28,8 m, fascia 1,5 m, luifel met kraag onder 45° | +8,85 m | 3D BAG (8,79–8,90), DSM (8–9) |
| Begane grond met ronde uitbouwen | BAG-contour, fascia 1,2 m | +5,43 m | BAG, 3D BAG (5,42–5,49) |

Gevelreliëf: per laag een glasband 0,9 m achter de vloerrand tussen pilasters van 0,9 m die 0,45 m achter de vloerrand staan, met een plafond onder 45°; zeven traveeën van 7,41 m op de lange en drie van 7,55 m op de korte gevels. Op de begane grond staat het glas 0,35 m achter de fascia van de ronde uitbouwen, op de eerste verdieping 0,5 m achter de fascia. Waar de toren buiten de begane grond steekt (de zuidoostkop, 1,4 m) en onder de luifel boven de ingangen loopt een kraag onder 45°.

## Geschat en weggelaten

- AHN4 (DSM) en de 3D BAG (AHN5, 2023) tonen dezelfde vorm: de renovatie van 2003 ligt vóór beide opnames.
- Verdiepingshoogte (3,38 m, uit 17 witte randen tussen +8,85 en +66,31), pilasterbreedte en -diepte, glasdiepte, de helling van de kroon en de breedte van de stijlen zijn geschat op foto's.
- De zuidwestrand van de eerste verdieping (2,3 m buiten de toren) en het einde van de eerste verdieping halverwege de vijfde travee: de toren bedekt het DSM aan de zuidwestkant; uit de 3D BAG, de noordoostkant en de foto.
- De onderbouw van het installatiehuis en de flank naar het zuidwesten zijn vereenvoudigd tot een blok met een schuin dak en een steile flank.
- Weggelaten: de twee antennemasten op het installatiehuis, de rails van de gevelonderhoudsinstallatie en een randje van 0,8 m aan de zuidoostkant van het dak (kleiner dan 0,9 m); het kegelvormige kunstwerk naast het zuidwestelijke trappenhuis (slank, punt kleiner dan 0,9 m); de belettering.
- De Winston Churchill Tower (pand `0603100000005840`) staat circa 250 m westzuidwestelijk aan de Sir Winston Churchilllaan en heeft geen gedeelde sokkel of plint met Hoogvoorde.

## Controle

`node scripts/generate-hoogvoorde-rijswijk.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert een test de dakhoogtes (installatiehuis, koelers, dakvlak, kroonrand, eerste verdieping, ronde uitbouw), dat een glasband op de zuidwestgevel 0,9 m achter de vloerrand ligt en na de printcorrectie op 45° blijft, dat de kroon naar buiten helt, één component, een volumegroei onder 1 % en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0603100000007372` (bouwjaar 1970); actuele orthoHR; AHN-DSM en -DTM 0,5 m (AHN4); 3D BAG LoD2.2 (AHN5, 2023).
- [Hoogvoorde (gebouw)](https://nl.wikipedia.org/wiki/Hoogvoorde_(gebouw)) op Wikipedia.
- Foto's op Wikimedia Commons (niet meegeleverd): [Nieuwe gemeentehuis](https://commons.wikimedia.org/wiki/File:Nieuwe_gemeentehuis.jpg), [Hoogvoorde en De Generaal Rijswijk](https://commons.wikimedia.org/wiki/File:Hoogvoorde_en_De_Generaal_Rijswijk.jpg).
