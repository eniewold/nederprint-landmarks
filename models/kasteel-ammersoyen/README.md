# Kasteel Ammersoyen (Ammerzoden)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `kasteel-ammersoyen.glb` | Catalogusbron in meters: node `building:kasteel` (het kasteel uit dakvlakken en bouwdelen) |
| `kasteel-ammersoyen-1-1000.stl` | Het kasteel op 1:1000 met de onderkant (1 m onder het water van de gracht) op het printbed (39 × 37 × 28 mm) |
| `kasteel-ammersoyen.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (144102, 418104), midden in het
kasteel, op het water van de slotgracht (NAP +1,6 m), en de glTF-conventie Y
omhoog. +X loopt langs de zuidgevel naar het oosten (1,75 graden rechtsom vanaf
de RD-X-as) en +Y loodrecht daarop. Het kasteel staat rondom in de gracht; het
maaiveld wordt op het water naast de zuidgevel, de zuidwesttoren en de oostgevel
bemonsterd (`groundSamplePoints`) en het model begint 1 m daaronder. Als geen van
die punten in de uitsnede valt, gebruikt de lader `groundHeight` 45,1 m (de
ellipsoïdische PDOK-hoogte van het water). Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0263100000009351`; de voorburcht en het koetshuis zijn eigen
BAG-panden en blijven als PDOK-model staan.

Onderdelen (hoogtes boven het water op NAP +1,6 m, 38,6 bij 36,8 m en 27,8 m hoog
met de onderkant):

- Zuidvleugel (v -14 tot -1,6 m) onder één nok op v = -7,4 m (+24,3 m, 54 tot
  56 graden) met schilden aan de west- en oostkant, drie dakkapellen op elke
  helling en twee schoorstenen op de nok.
- Westvleugel met de nok op u = -7,85 m (+21,6 m), twee dakkapellen en een
  schoorsteen; oostvleugel met de nok op u = 12,7 m (+16,3 m, 41 graden).
- Noordwestvleugel tussen de toren en de poort (nok +18,5 m) en noordoostvleugel
  (+14,6 m), beide met een lage weergang langs de gracht (+10,5 tot +10,8 m).
- Poortgebouw (u -0,8 tot 5,3 m, tot v = 18 m) met de nok langs v (+17,5 m), een
  trapgevel met vier treden tot +18,4 m aan de brug en de poortnis.
- Binnenplaats op +4,2 m.
- Vier ronde hoektorens: de noordwesttoren (straal 5,65 m) met muren tot +16 m,
  een kegel van 53 graden, een achtkantige lantaarn en een uitje tot +26,8 m; de
  noordoosttoren (4,8 m) met muren tot +12,6 m en een kegel van 55 graden tot
  +19,9 m; de zuidwest- en zuidoosttoren (4,35 en 3,95 m) met muren tot +16,2 en
  +15,9 m, een lage rok en een slanke holle spits tot +23,5 en +23 m.
- Vensternissen in twee rijen in de buitengevels en de torens.

Vergelijking met het AHN-DSM (raster op 0,5 m, alleen cellen boven 3 m met een
meetwaarde): 80,7 % ligt binnen 1 m en 88,2 % binnen 2 m. De afwijkingen zitten
in de randen van de binnenplaats (lage aanbouwen tegen de zuid- en oostvleugel
zijn weggelaten) en in de dakkapellen.

Printbaar op 1:1000: alle vlakken wijzen omhoog of staan verticaal, op de nissen
na (steiler dan 45 graden) en de onderkant van het uitje (18 graden uit het
lood). De export vult op 1:1000 en 1:1500 niets bij en op 1:2500 0,7 %. De STL
is 17,0 cm³, heeft 2.386 driehoeken en is één samenhangend deel (status
NoError, geslacht 0). Dunste delen op 1:1000: de bovenste trede van de trapgevel
en de schoorstenen 1 mm, de spitsen 0,9 mm bovenin.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Kasteel_Ammersoyen), PDOK
BAG, PDOK AHN (dsm en dtm 0,5 m via WCS), 3D BAG LoD2.2 (api.3dbag.nl), de PDOK
luchtfoto en foto's op Wikimedia Commons vanaf de noordoost-, west- en
noordkant. Geschat zijn de lantaarn en het uitje op de noordwesttoren, de hoogte
van de slanke spitsen op de zuidtorens (het AHN mist de punt; volgens de foto's
ruim 6 m boven de rok), de trapgevel, de dakkapellen, schoorstenen en
vensternissen. Weggelaten: de houten brug, de luiken en de kleine aanbouwen op
de binnenplaats.
