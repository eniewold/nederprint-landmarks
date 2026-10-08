# Grote of Sint-Stevenskerk (Nijmegen)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `stevenskerk.glb` | Catalogusbron in meters: node `building:kerk` (de kerk met de westtoren, uit dakvlakken en bouwdelen) |
| `stevenskerk-1-1000.stl` | De kerk op 1:1000 met de onderkant (2,2 m onder het maaiveld) op het printbed (79 × 55 × 67 mm) |
| `stevenskerk.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (187768, 428930), de viering, op het
maaiveld (NAP +28,5 m), en de glTF-conventie Y omhoog. +X loopt langs de nok van
schip en koor naar het oosten (3 graden linksom vanaf de RD-X-as, gemeten aan de
normalen van de LoD2.2-dakvlakken) en +Y loodrecht daarop naar het noorden. Het
maaiveld wordt ten westen, oosten en zuidoosten bemonsterd (`groundSamplePoints`,
NAP +28,5 tot +29 m); naar de Grote Markt (zuidwest) zakt het terrein 1,8 m,
daarom begint het model 2,2 m onder het maaiveld. Als geen van die punten in de
uitsnede valt, gebruikt de lader `groundHeight` 72,2 m (de ellipsoïdische
PDOK-terreinhoogte). Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0268100000009359`.

Onderdelen (hoogtes boven het maaiveld op NAP +28,5 m, 79,3 bij 55,1 m en 67,4 m
hoog met de onderkant):

- Schip en koor van de hallenkerk onder één nok op +24,6 m (56 graden), 11 m
  breed, van de toren (u = -27 m) tot de sluiting met vijf zijden van een
  twaalfhoek rond (30, 0). Dwarsschip met de nok langs v door de viering (+24,4
  m), topgevels tot +25,2 m, een portaal aan de zuidkant (+12,5 m) en een lage
  voorbouw aan de noordkant; een achtkantige dakruiter op de viering tot +33 m.
- Noordbeuk (van de toren tot het dwarsschip) met een eigen zadeldak (nok +22 m
  op v = 9,75 m, 55 graden) en een topgevel naar het westen; de beuken langs het
  koor met zadeldaken (+22,4 m), in de eerste travee naast het dwarsschip met een
  dwarse kap (+20,5 m).
- Zuidbeuk: zes dwarse kappen (traveeën van 5,6 m) met de nok op +19,7 m en een
  schild naar de buitenmuur (v = -15,5 m), met steunberen ertussen.
- Kooromgang (twaalfhoek met apothema 8,5 m, lessenaarsdak van +18 naar +15,5 m)
  met zeven straalkapellen met tentdaken (goot +13,5 m) en steunberen ertussen.
- Kapellen en aanbouwen: ten westen van het zuidelijke dwarsschip (schilddak +19,5
  m), ten zuiden van het koor (zadeldak +17 m), ten noorden van het koor (+15,5 m)
  en een lage aanbouw ten noorden van het schip (+7 m).
- Westtoren: een onderbouw van 10,2 m met getrapte hoeksteunberen tot de omgang
  op +38 m (borstwering en vier hoekpinakels), een achtkant van 8,6 m met
  galmgaten tot +45 m met een kroonlijst, een kap naar een lantaarn van 5,4 m
  (+48,3 tot +51 m), een tweede lantaarn van 4,2 m (+52,6 tot +56,8 m) en een spits
  tot +65,2 m (NAP +93,7 m, het hoogste AHN-punt).
- Vensternissen als spitsbogen, 0,5 m diep: in de zuidbeuk, de noordbeuk, de
  gevels van het dwarsschip, de lichtbeuk van de sluiting en de straalkapellen;
  galmgaten en blinde bogen in de toren.

Vergelijking met het AHN-DSM (raster op 0,5 m, alleen cellen boven 3 m met een
meetwaarde): 63,5 % ligt binnen 1 m en 79,7 % binnen 2 m. De afwijkingen zitten
vooral in de kooromgang en de straalkapellen, de kapellen aan de zuidkant, de
lage aanbouwen en de toren.

Printbaar op 1:1000: alle vlakken wijzen omhoog of staan verticaal, op de
spitsbogen na (steiler dan 45 graden). De export vult op 1:1000 en 1:1500 niets
bij en op 1:2500 0,6 %. De STL is 59,7 cm³, heeft 2.772 driehoeken en is één
samenhangend deel (status NoError). Dunste delen op 1:1000: de pinakels 0,8 mm en
de spitsen 0,9 mm bovenin.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Grote_of_Sint-Stevenskerk)
(hallenkerk, kooromgang met zeven straalkapellen, torenspits naar voorbeeld van de
Oude Kerk in Amsterdam), PDOK BAG, PDOK AHN (dsm en dtm 0,5 m via WCS), 3D BAG
LoD2.2 (api.3dbag.nl) en de PDOK luchtfoto. Geschat zijn de lantaarns en kappen
van de toren tussen de AHN-punten, de dakruiter, de straalkapellen, de kapellen
en aanbouwen, de steunberen en de vensternissen. Weggelaten: maaswerk, de
wijzerplaten, de omgangen van de lantaarns en kleine dakkapellen.
