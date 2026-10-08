# Kasteel Helmond (Helmond)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `kasteel-helmond.glb` | Catalogusbron in meters: nodes `building:kasteel` (het kasteel uit dakvlakken en bouwdelen) en `road:dam` (de dam met borstweringen naar de voorhof) |
| `kasteel-helmond-1-1000.stl` | Het kasteel met de dam op 1:1000 met de onderkant (2,8 m onder de binnenplaats, in de gracht) op het printbed (44 × 57 × 27 mm) |
| `kasteel-helmond.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (173473,5, 387595), midden in het
kasteel, op het maaiveld van de binnenplaats (NAP +18,2 m), en de glTF-conventie
Y omhoog. +X loopt langs de noord- en zuidgevel naar het oosten (6,2 graden
linksom vanaf de RD-X-as, gemeten aan de nokken en de normalen van de
LoD2.2-dakvlakken) en +Y loodrecht daarop naar het noorden, waar de poort en de
dam liggen. Het maaiveld wordt op de binnenplaats bemonsterd
(`groundSamplePoints`); het kasteel staat rondom in de slotgracht (PDOK-water
1,55 m onder de binnenplaats), daarom begint het model 2,8 m onder de
binnenplaats. Als geen van die punten in de uitsnede valt, gebruikt de lader
`groundHeight` 62,0 m (de ellipsoïdische PDOK-terreinhoogte van de
binnenplaats). Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0794100000389999`; de twee vierkante torens van de voorburcht aan
de overkant van de voorhof zijn eigen BAG-panden en blijven als PDOK-model staan.

Onderdelen (hoogtes boven de binnenplaats op NAP +18,2 m, 44 bij 44 m voor het
kasteel, 57 m lang met de dam, 26,6 m hoog met de onderkant):

- Vier ronde hoektorens (middelpunt en straal 3,8 tot 4,4 m uit de BAG-contour):
  een boogfries op een kraag van 0,3 m (+11,1 m), de goot op +12,7 m, een
  flauwe achtkantige rok tot +14,6 m en een achtkantige leien spits tot +23,3 m
  (noordwest), +23,8 m (noordoost), +22,6 m (zuidwest) en +21,4 m (zuidoost);
  vensternissen in twee rijen.
- Zuidvleugel over de hele breedte onder één nok op v = -12 m (+15,8 m, 47 en
  49 graden) met een vlakke goot aan de binnenplaatszijde, trapgevels van vijf
  treden aan beide kopse kanten, drie gevelkapellen van 2,8 m in de zuidgevel
  (nokken +12,3 m) en twee schoorstenen tot +18,9 m op de nok.
- Westvleugel met de nok op u = -13,2 m (+15,8 m, 52 graden) en oostvleugel met
  de nok op u = 13,8 m (+15 m, 55 graden), beide met kilgoten in de zuidvleugel
  en een trapgevel aan de noordgevel; een schoorsteen op de westvleugel.
- Noordvleugel met de nok op v = 15,35 m (+11,9 m) en in het midden het
  poortgebouw: een risaliet van 4,9 m aan de brug en aan de binnenplaats met een
  trapgevel (vier treden en twee pinakels, tot +13,1 m), een spitse blinde boog
  met de poortnis aan de brug en een poortnis aan de binnenplaats. Aan
  weerszijden een vierkante toren van 4 m met een tentdak tot +15,6 m.
- Aan de binnenplaats: de vlakke gang langs de zuidvleugel (+10,2 m), de
  galerij met de nok op v = -2,2 m (+12,7 m) en een dwarskap (+12,9 m), de gang
  langs de oostvleugel (+9,5 m), het portaal in de zuidwesthoek (+7,5 m) en het
  ronde traptorentje (1,6 m straal) met een boogfries, een achtkant dak tot
  +20 m en een vierkante schacht tot +19 m.
- De dam (BGT: 4,9 m breed, van de poort tot de voorhof op v = 34,8 m) met een
  dek dat van -0,05 naar -0,55 m daalt en borstweringen van 0,9 m breed en 1 m
  hoog, aan het eind schuin naar de oevers.
- Vensternissen van 0,4 m diep in twee rijen in alle buitengevels.

Vergelijking met het AHN-DSM (raster op 0,5 m, alleen cellen boven 3 m met een
meetwaarde): 81,9 % ligt binnen 1 m en 89,7 % binnen 2 m. De afwijkingen zitten
vooral in de spitsen (het AHN heeft gaten op de steile leien) en rond de
trapgevels en schoorstenen.

Printbaar op 1:1000: alle vlakken wijzen omhoog of staan verticaal, op de nissen
en de kraag onder de boogfries na (steiler dan 45 graden). De export vult op
1:1000 en 1:1500 niets bij en op 1:2500 0,8 % (kasteel) en 4,4 % (dam). De STL
is 18,5 cm³, heeft 4.884 driehoeken en sluit (status NoError, geslacht 1: de
vleugels vormen een ring om de binnenplaats). Dunste delen op 1:1000: de
borstweringen, de pinakels en de bovenste treden van de trapgevels 0,9 mm.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Kasteel_Helmond) (vierkante
waterburcht van circa 35 bij 35 m, hoektorens van circa 8 m), PDOK BAG, PDOK AHN
(dsm en dtm 0,5 m via WCS), 3D BAG LoD2.2 (api.3dbag.nl), PDOK BGT
(overbruggingsdeel en waterdeel), de PDOK luchtfoto en foto's op Wikimedia
Commons van de noord-, west-, zuid- en oostkant en de binnenplaats. Geschat zijn
de goothoogte en de kraag van de hoektorens, de spits van de zuidwesttoren (het
AHN mist de punt), de trapgevels, de gevelkapellen, het portaal en de schacht
bij het traptorentje en de vensternissen. Weggelaten: de doorgang onder de dam
(minder dan 0,9 m boven het water), de muren langs de voorhof (buiten het
kasteel), de dakkapellen aan de binnenplaatszijde en in de tentdaken (kleiner
dan 0,9 m), de overstekende goten van de torens (vrije overhang) en de pinakels
op de spitsen.
