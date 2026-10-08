# Kasteel Radboud (Medemblik)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `kasteel-radboud.glb` | Catalogusbron in meters: nodes `building:kasteel` (het kasteel uit dakvlakken en bouwdelen) en `road:brug` (de brug over de slotgracht) |
| `kasteel-radboud-1-1000.stl` | Kasteel en brug op 1:1000 met de onderkant (1 m onder het water van de gracht) op het printbed (36 × 63 × 20 mm, twee losse delen) |
| `kasteel-radboud-grondplaat-1-1000.stl` | Idem op een grondplaat van 1 mm, zodat kasteel en brug één stuk zijn |
| `kasteel-radboud.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (136500, 531715), in de binnenhoek
van het kasteel, op het maaiveld van het kasteeleiland (NAP +2,1 m), en de
glTF-conventie Y omhoog. +X loopt langs de nokken van de oostvleugel naar het
oostnoordoosten (26 graden linksom vanaf de RD-X-as, gemeten aan de dakvlakken
in het AHN; de BAG-contour volgt dezelfde richting) en +Y loodrecht daarop, naar
de binnenplaats. Het maaiveld wordt op het eiland ten noorden van het kasteel
bemonsterd (`groundSamplePoints`, NAP +2,05 tot +2,1 m); de west- en zuidgevel en
de drie torens staan in de slotgracht (water NAP 0,0 m), daarom begint het model
1 m onder het water. Als geen van die punten in de uitsnede valt, gebruikt de
lader `groundHeight` 44,4 m (de laagste ellipsoïdische PDOK-terreinhoogte op die
punten). Vervangt de PDOK-reconstructie van `NL.IMBAG.Pand.0420100000015201`;
er staan geen andere panden tegen het kasteel. De brug is geen BAG-pand (BGT
overbruggingsdeel) en ligt in PDOK als een verlaagd wegvlak over het water.

Onderdelen (hoogtes in NAP, het eiland op +2,1 m; het kasteel is 36,0 bij 26,7 m
en 20 m hoog met de onderkant, met de brug 63 m lang):

- Westvleugel met de Ridderzaal (u -11,6 tot 0,3 m, v -7 tot 12,9 m): zadeldak
  met de nok langs v op u = -5,6 m (+16,2 m, 56 graden), een steil schild (69
  graden) aan de zuidkant tegen de ronde toren, een trapgevel met zes treden van
  1,08 m en een schoorsteen tot +19 m aan de binnenplaats, twee spitse vensters
  in die gevel en drie in de oostgevel, dakkapellen op beide hellingen.
- Oostvleugel, westelijk deel (u tot 9,1 m): zadeldak met de nok langs u op
  v = -1,63 m (+14,9 m, 52 graden) dat met een kilgoot in het dak van de
  westvleugel loopt, de ingang en een spits venster aan de binnenplaats, een
  schoorsteenlisene tot +13,4 m, twee dakkapellen op elke helling.
- Oostvleugel, oostelijk deel (u 9,1 tot 18,9 m): hogere nok op v = -2,75 m
  (+15,9 m, 55 graden), aan de noordkant geknikt op +10,9 m naar 39 graden over de
  lage noordaanbouw tot de goot op +6,85 m (v = 5,5 m), met twee dakkapellen en
  vier vensternissen in twee lagen; een trapgevel als tussengevel naar het
  lagere deel, een trapgevel aan de oostkant met een spits venster, een
  schoorsteen tot +18,6 m op de noordhelling en een dakkapel op de zuidhelling.
- Hoekblok aan de noordoostkant (tot +10 m) met een schoorsteen tot +13,4 m.
- Borstweringen van 0,9 m op een kraag van 50 graden (0,25 m uitkragend) met
  kantelen van 1,6 m breed en 1,1 m hoog (tussenruimte 1 m) aan de westgevel
  (+9,2/+10,3 m), de zuidgevel (+9,3/+10,4 m) en de noordgevel en de oostgevel van
  de westvleugel aan de binnenplaats (+9,4/+10,5 m).
- Vierkante noordwesttoren (4,8 × 4,4 m) met muren tot +11 m, een kraag en een
  tentdak tot +16,5 m; vierkante zuidtoren (4,8 × 5 m) tot +10,3 m met een kraag
  en een tentdak tot +16,2 m.
- Ronde zuidwesttoren (straal 4,75 m) met een kraag op +8,7 m, een borstwering
  tot +9,9 m met negen kantelen tot +10,9 m en een achtkante spits tot +18,2 m;
  ernaast een schoorsteen met een kap tot +16,3 m.
- Brug over de slotgracht naar de Oosterdijk (u 7,4 tot 11,15 m, v 35,9 tot
  50,8 m): dek op +2,2 m, gemetselde borstweringen van 0,9 m tot +3,1 m op het
  noordelijke deel, twee poortpijlers tot +3,6 m in het midden, vleugelmuren op
  het eiland en drie bogen aan elke kant als spitse nissen boven het water.

Vergelijking met het AHN-DSM (raster op 0,5 m, alleen cellen boven 3 m met een
meetwaarde): 84,1 % ligt binnen 1 m en 90,9 % binnen 2 m. De afwijkingen zitten
in de kantelen (grover dan in het echt), het schild aan de zuidkant en de randen
van de leien daken, waar het DSM gaten heeft.

Printbaar op 1:1000: alle vlakken wijzen omhoog of staan verticaal, op de kragen
(49 tot 50 graden) en de spitse tops van de nissen na. De export vult op 1:1000
en 1:1500 niets bij en op 1:2500 1,0 % (kasteel) en 3,7 % (brug). De STL is
7,4 cm³, heeft 2.602 driehoeken en bestaat uit twee delen (kasteel en brug,
status NoError); de STL met grondplaat is één deel (geslacht 0). Dunste delen op
1:1000: de kantelen, treden en borstweringen 0,9 mm, de schoorstenen 1 tot 1,2 mm.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Kasteel_Radboud), PDOK BAG,
PDOK AHN (dsm en dtm 0,5 m via WCS), PDOK BGT (overbruggingsdeel), de PDOK
luchtfoto en foto's op Wikimedia Commons vanaf de noord-, noordoost-, oost-,
zuid- en westkant. Geschat zijn de kantelen (breder en met grotere tussenruimtes
dan in het echt), de kragen onder de borstweringen en de tentdaken, de treden
van de trapgevels (0,94 tot 1,08 m in plaats van circa 0,5 m), de schoorsteen
naast de ronde toren (hoogte uit een foto), de dakkapellen en vensternissen, de
vleugelmuren en poortpijlers van de brug en de bogen (spits in plaats van rond).
Weggelaten: het torentje met windvaan in de binnenhoek, de trappen aan de
binnenplaats, de luiken, de houten leuningen van de brug en de lage muurresten
van de verdwenen vleugels op het eiland (alle smaller dan 0,9 m of lager dan
1 m).
