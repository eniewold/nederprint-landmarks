# Pier van Scheveningen (Den Haag)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `pier-scheveningen.glb` | Catalogusbron in meters: nodes `building:pier` (dekken, pijlerjukken, eilanden, toren en platform) en `building:reuzenrad` |
| `pier-scheveningen-1-1000.stl` | De pier op 1:1000 met de onderkant (NAP -1 m) op het printbed (285 × 281 × 49 mm) |
| `pier-scheveningen.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (79166,88, 459355,50), bij de kop
van de pier, op het zeeoppervlak van het PDOK-terrein (NAP -0,45 m: 42,95 m
ellipsoïdisch tegen 48,0 m op het strand, waar het AHN NAP +4,6 m geeft), en
de glTF-conventie Y omhoog; +X wijst naar het oosten en +Y naar het noorden.
Het maaiveld wordt op het zeeoppervlak rond de kop en op het natte strand
halverwege bemonsterd (`groundSamplePoints`). Eerst stonden de punten op het
droge strand bij het begin van de pier; die vielen in een uitsnede rond de
kop buiten de geladen terreintegels, en dan liet de preview het hele model
weg. Vervangt de PDOK-reconstructie van `NL.IMBAG.Pand.0518100001644879`
(pier), `NL.IMBAG.Pand.0518100001647057` (zuidereiland) en
`NL.IMBAG.Pand.0518100000255328` (torenreiland).

Onderdelen (hoogtes in NAP, uit het AHN-DSM):

- De pier op de BAG-contour van het strand tot de kop (as van 296 m): dek
  van +11 tot +13,5 m met het middendeel van 7 m breed tot +17 m (de eerste
  60 m vanaf de kop), +15,5 m (tot 125 m) en +14,5 m (naar het strand), op
  pijlerjukken van 1,2 m dik om de 20 m vanaf NAP -1 m, en een kiosk op de
  kop tot +21 m.
- De loopbrug naar het zuidereiland en de tak naar het torenreiland (8 m
  breed, dek +12,5 m) op jukken.
- Het zuidereiland op de BAG-contour: rand +12,3 m, gebouw 5 m binnen de
  rand tot +15,5 m en het dak 12 m binnen de rand tot +20 m (mediaan van het
  DSM langs de ingesprongen contouren).
- Het torenreiland op de BAG-contour (+15 m) met een kiosk tot +19 m en de
  uitkijktoren: schacht met 4 m straal tot +42 m, cabine met 5,5 m straal op
  een kraag van 45 graden tot +48 m en de mast tot +53 m.
- Het platform van het reuzenrad (44 bij 14 m langs het rad, +9 m) met de
  helling vanaf het pierdek, en het reuzenrad (aparte node): 40 m doorsnede,
  naaf op +28,5 m, top op +48,5 m, een ring van 1,4 m breed en 1,5 m dik met
  acht spaken, op een A-bok.

Vergelijking met het AHN-DSM: binnen de voetafdruk ligt 50 % van de circa
32.000 DSM-cellen binnen 1 m en 66 % binnen 2 m (mediaan +0,17 m); de
afwijkingen zitten in de leuningen en kioskjes op de dekken, het open
vakwerk van het rad en de toren en de randen van de eilanden.

Printbaar op 1:1000: eilanden, platform en toren staan op de onderkant; de
dekken hangen tussen de pijlerjukken en de export zet onder hun vlakke
onderkant en onder de bovenkant van het rad een wig met een wandje. Het
script laat alleen die ondervlakken toe en controleert dat de pier één
samenhangend deel is. Met overhangopvulling op 1:1000 wordt de pier 20,6 cm³
(recht naar beneden opgevuld 36,3 cm³) en het rad 0,4 cm³. In de preview van
een uitsnede rond het hele model staan de pier, beide eilanden, de toren en
het reuzenrad zonder de vervangen panden.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Pier_van_Scheveningen)
(1961, eilanden en toren, reuzenrad sinds 2016), PDOK BAG (de drie panden),
PDOK AHN (dsm en dtm 0,5 m via WCS) en de PDOK luchtfoto. Geschat zijn de
onderkant van de dekken, de plaats en dikte van de jukken, de vorm van de
cabine en de A-bok, en de dikte van de ring van het rad. Vereenvoudigd: de
dekken zijn dicht (geen leuningen of open onderdek), de pijlers zijn
doorgaande jukken, het rad heeft geen gondels en de zipline-arm aan de toren
ontbreekt.
