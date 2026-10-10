# Nationaal Militair Museum (Soesterberg)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `nationaal-militair-museum.glb` | Catalogusbron in meters: nodes `building:museum` (dak, glazen doos, toren, daklicht, kolommen, entreeblok) en `road:entreeterras en brug` |
| `nationaal-militair-museum-1-1000.stl` | Het hele model op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (250 × 161 × 33 mm) |
| `nationaal-militair-museum.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, vervangen BAG-pand, hoofdmaten en bronnen |

Gegenereerd door `scripts/generate-nationaal-militair-museum.mjs`.

## Oorsprong, assen en maaiveld

De GLB is in meters met de oorsprong op RD (147385,76, 460368,97), het midden
van het dak, op het maaiveld van het platform aan de zuidwestkant (NAP
+15,85 m), en de glTF-conventie Y omhoog. +X loopt langs de lange gevels naar
het zuidoosten (38,65 graden met de klok mee vanaf de RD-X-as; dat is de
richting van de BAG-gevels én van de vier dakranden in het AHN, binnen 0,1
graad) en +Y loodrecht daarop naar het noordoosten, de entreekant.

Het maaiveld wordt op zes punten 6 tot 10 m buiten de dakrand bemonsterd
(`groundSamplePoints`): twee op het platform (NAP +15,85 tot +15,9 m), één aan
elke kop en twee aan de noordoostkant (NAP +16,0 tot +16,5 m). De laagste is
het platform, waar ook de glazen pui op staat. `groundHeight` 59,08 is de
laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten, als terugval voor een
uitsnede die maar een deel van het model raakt. `groundOffsetMetres` is 0.
Vervangt de PDOK-reconstructie van `NL.IMBAG.Pand.0342100000026223` (de glazen
doos met het entreeblok); er liggen geen andere panden onder het dak.

## Onderdelen (hoogtes boven het platform)

- **Dak**: een vlakke plaat van 250,16 bij 110,26 m (Wikipedia: 250 bij 110 m),
  bovenkant +17,94 m (NAP +33,785 m, de mediaan van het hele dakvlak; het dak is
  binnen 0,15 m vlak). Het ruimtevakwerk eronder is 4,9 m diep; de onderkant
  ligt op +13,05 m (de glazen pui is 13 m hoog). De overstekken zijn ongelijk:
  44,9 m aan de noordwestkop, 14,8 m aan de zuidwestkant (het platform), 10 m
  aan de noordoostkant en 9,8 m aan de zuidoostkop.
- **Vakwerkrand**: rondom is de rand van het vakwerk zichtbaar (Warren-ligger met
  verticalen, foto's van alle kanten). In het model is de dakrand een band van
  4,9 m met staven van 0,9 m (boven- en onderregel, verticalen en wisselende
  diagonalen in een V-patroon) en daartussen driehoekige blinde nissen van 0,4
  m diep: 40 vakken van 6,25 m langs de lange randen en 18 van 6,13 m langs de
  koppen.
- **Glazen doos**: de BAG-contour, 195,46 bij 85,48 m, tot de onderkant van het
  dak. De zware stalen gevelstijlen staan op een raster van 5 m (39 vakken in de
  lange gevels, 17 in de koppen, geteld op frontale foto's) en zijn lisenen van
  1 m breed die 0,45 m voor het glas staan.
- **Kolommen** onder de noordwestkop: vier kolommen van 1 m vierkant halverwege
  de overstek (u = -102,6 m), in de lijnen van de lange gevels en op een derde
  van de kopgevel. In werkelijkheid slanker; dikker gemaakt om te printen.
- **Toren** boven de zwarte doos: 15,25 bij 20 m (u = -45 tot -29,75, v = 19,75
  tot 39,75 m), top +32,74 m (NAP +48,59 m, AHN). Onder een donkere kap van 3 m
  loopt een glazen band van 2,5 m rondom, 0,4 m teruggezet.
- **Daklicht** midden op het dak: 15 bij 4,75 m, 1 m boven het dakvlak
  (+18,95 m; in het AHN een gat van glas met een rand op NAP +34,6 tot +35,0 m).
- **Entreeblok, terras en brug** aan de noordoostkant: het BAG-deel buiten de
  doos (u = -25,05 tot -9,79, tot v = 70 m) als blok onder het terras; het
  terras van 24,75 bij 30 m (v = 45,1 tot 75 m) en de brug van 9,75 m breed naar
  het hoger gelegen wandelpad in het park (tot v = 106 m), samen een dek van
  1,2 m dik met de bovenkant van NAP +20,9 m aan de gevel aflopend naar +20,4 m
  op het wandelpad (AHN), op twee pijlers onder de brug. Node
  `road:entreeterras en brug`.

Alle onderdelen beginnen op dezelfde vlakke onderkant, 0,5 m onder het
maaiveld.

## Wat er niet in zit, en waarom

- De buitententoonstelling (vliegtuigen onder de noordwestkop en op het
  platform, tanks, de tank op het terras, de vlaggenmast): geen bouwwerk.
- Het park: schanskorfmuren, drakentanden, paden en het verhoogde wandelpad
  (dat zit in het PDOK-terrein; de brug landt erop).
- De zonnepanelen, de looppaden en kleine installaties op het dak en de kast op
  de toren: lager dan 0,9 m.
- De zwarte doos binnen het glas: in een massieve glazen doos niet zichtbaar,
  alleen de toren steekt boven het dak uit.
- De open vakwerkstaven onder de overstekken, de regels in het glas en de
  leuningen van terras en brug: dunner dan 0,9 m. De overstekken hebben een
  vlakke onderkant.

## Pasvorm op het AHN

De dakranden liggen binnen 0,15 m op lijnen in het AHN-DSM (0,5 m). In een
strook van 4 tot 9 m langs de dakrand ziet het AHN door het dak heen (waarden
van NAP +22 tot +33 m, het vakwerk); op de luchtfoto loopt het dak tot de rand
door. Het model heeft daar de volle dakplaat. Toren, terras en brug volgen het
AHN binnen 0,2 m.

## Printbaarheid

Op 1:1000 is het model 250 bij 161 bij 33 mm. De vakwerkrand is 4,9 mm hoog
met staven van 0,9 mm en nissen van 0,4 mm; de gevelstijlen en de kolommen
zijn 1 mm. De overstekken zijn vrij uitkragende vlakke platen; de export vult
die op (printcheck op 1:1000, `prepareMeshes` met printbare overhang:
`building:museum` NoError, 23 % extra volume; `road:entreeterras en brug`
NoError, 150 % extra, het dek op de pijlers). Elke node is een gesloten
manifold (genus 0).

## Geschat

- De diepte van het dakvakwerk (onderkant op +13,05 m, uit de glazen pui van
  13 m) en de indeling van de vakwerkrand (40 en 18 vakken).
- Raster en maat van de gevelstijlen (5 m, 1 m breed, 0,45 m voor het glas).
- Plaats, aantal en maat van de kolommen onder de noordwestkop.
- De kap en de glazen band van de toren (3 en 2,5 m).
- De dikte van het terras- en brugdek (1,2 m) en de twee pijlers.

## Bronnen

- https://nl.wikipedia.org/wiki/Nationaal_Militair_Museum (dak 110 bij 250 m,
  glazen pui van 13 m)
- PDOK BAG-pand 0342100000026223 (EPSG:28992)
- PDOK AHN DSM/DTM 0,5 m via WCS (dakranden, dakvlak, toren, daklicht, terras
  en brug, maaiveld)
- PDOK luchtfoto (Actueel_orthoHR)
- Wikimedia Commons, categorie Buildings of the Nationaal Militair Museum
  (foto's van alle kanten, alleen ter controle)
