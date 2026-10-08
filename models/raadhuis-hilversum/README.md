# Raadhuis (Hilversum)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `raadhuis-hilversum.glb` | Catalogusbron in meters: node `building:raadhuis` (alle bouwdelen en de toren als gesloten solid) |
| `raadhuis-hilversum-1-1000.stl` | Het raadhuis op 1:1000 met de onderkant (NAP +13,5 m) op het printbed (120 × 100 × 47,5 mm); de oostelijke vleugels zijn losse delen |
| `raadhuis-hilversum-grondplaat-1-1000.stl` | Idem op een grondplaat van 1 mm, zodat de losse vleugels in één stuk printen |
| `raadhuis-hilversum.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (140148,50, 471250,75), het midden
van de klokkentoren, op het maaiveld (NAP +14,0 m), en de glTF-conventie Y
omhoog. +X loopt naar het oosten (RD-richting 2,4 graden, evenwijdig aan de
gevels); +Y wijst naar het noorden. De vijver ligt aan de zuidkant. Het
maaiveld wordt op het voorplein aan de noordkant, op de oostelijke
binnenplaats en op het pad langs de vijver bemonsterd (`groundSamplePoints`,
AHN NAP +14 tot +15 m), niet in de vijver (NAP +13 m). Vervangt de
PDOK-reconstructie van `NL.IMBAG.Pand.0402100001495707` (het raadhuis),
`NL.IMBAG.Pand.0402100001525323`, `NL.IMBAG.Pand.0402100001519068` en
`NL.IMBAG.Pand.0402100001494252` (de oostelijke vleugels).

Onderdelen (dakhoogtes in NAP, afgelezen als mediaan per 2 m in het AHN-DSM
en afgesneden op de BAG-contour); alle daken zijn plat:

- De raadzaal aan de vijver (+31 m) met een achterrand van +36 m en vijf hoge
  blinde vensters van 1,6 m breed (+19 tot +28 m) in de zuidgevel, de pyloon
  aan de westkant (+38 m) en de zuidwesthoek (+29 en +32 m).
- De vleugels rond de grote binnenplaats: west en noord +25 m, oost +25 en
  +28 m, de noordoosthoek +31 m, de gang achter de raadzaal +28 m en de lage
  galerij aan de noordkant van de binnenplaats +19 m; de binnenplaats zelf is
  open.
- De klokkentoren van 7 bij 8 m tot +61 m (47 m boven het maaiveld) met twee
  lagere steunberen (+45 en +53 m), drie blinde spleten per gevel van +49 tot
  +57 m en de klok als vierkante nis aan de zuid- en noordkant.
- De lage vleugels: aan de vijver in het westen (+21 m) en het oosten (+18 m)
  met een vensterband als nis, de noordelijke uitbouw (+20 m) en de
  noordoostvleugel (+20 en +23 m) aan de oostelijke binnenplaats.
- De dienstvleugels in het oosten op hun BAG-contour (+17,5 tot +21 m).

Vergelijking met het AHN-DSM: binnen de voetafdruk van het model ligt 81 % van
de circa 14.000 DSM-cellen binnen 1 m en 88 % binnen 2 m (mediaan +0,21 m); de
afwijkingen zitten vooral in de randen (dakoverstekken die buiten de
BAG-contour vallen) en in bomen over de dienstvleugels.

Printbaar op 1:1000 zonder steun: alle bouwdelen zijn rechte blokken op de
onderkant met vlakke daken; alleen de nissen hebben een vlakke bovenkant van
0,35 tot 0,4 m diep. Met overhangopvulling op 1:1000 blijft
37,0 cm³ over boven de onderplaat (recht naar beneden opgevuld 38,5 cm³). In
de kaart staan de raadzaal en de toren aan de vijver zoals op de foto's vanaf
de zuidkant, en de preview van een uitsnede van 180 m rond het complex toont
het model zonder de vervangen panden.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Raadhuis_van_Hilversum)
(Dudok, 1928-1931, gele baksteen, klokkentoren en twee binnenplaatsen), PDOK
BAG (de vier panden), PDOK AHN (dsm en dtm 0,5 m via WCS: dakhoogtes, toren,
maaiveld en vijver), de PDOK luchtfoto en foto's op Wikimedia Commons (de
zuidzijde met de vijver en de toren). Geschat zijn de plaats en maat van de
vensters, de spleten en de klok (uit foto's) en de grenzen tussen bouwdelen
op 1 tot 2 m. Vereenvoudigd: de overstekende dakplaten, de luifels, de
pergola en de terrassen aan de vijver en de top met vlaggenmast van de toren
zijn weggelaten.
