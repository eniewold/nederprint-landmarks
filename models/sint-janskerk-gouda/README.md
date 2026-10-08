# Sint-Janskerk (Gouda)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `sint-janskerk-gouda.glb` | Catalogusbron in meters: node `building:kerk` (de kerk met de westtoren, uit dakvlakken en bouwdelen) |
| `sint-janskerk-gouda-1-1000.stl` | De kerk op 1:1000 met de onderkant (0,8 m onder het maaiveld) op het printbed (141 × 52 × 50 mm) |
| `sint-janskerk-gouda.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (108610, 447146,5), in het schip vlak
voor het dwarsschip, op het maaiveld (NAP +0,1 m), en de glTF-conventie Y
omhoog. +X loopt langs de nok van schip en koor naar het oosten (2 graden
linksom vanaf de RD-X-as, gemeten aan de normalen van de LoD2.2-dakvlakken) en
+Y loodrecht daarop naar het noorden. Het maaiveld wordt ten westen, noorden en
noordoosten bemonsterd (`groundSamplePoints`, NAP -0,1 tot +0,2 m; aan de
zuidkant ligt het tot 0,5 m lager, daarom begint het model 0,8 m onder het
maaiveld). Als geen van die punten in de uitsnede valt, gebruikt de lader
`groundHeight` 43,4 m (de ellipsoïdische PDOK-terreinhoogte op die punten).
Vervangt de PDOK-reconstructie van `NL.IMBAG.Pand.0513100011121085`.

Onderdelen (hoogtes boven het maaiveld op NAP +0,1 m, 141,3 bij 52 m en 49,8 m
hoog met de onderkant; de kerk zelf is van toren tot koor 115,5 m lang):

- Schip en koor: één nok op +28,4 m (v = 1,25 m, 55 graden), 11 m breed tussen de
  muren, van de toren (u = -57,6 m) tot de 3/8-sluiting rond (45, 1,25).
- Dwarsschip (u 7,4 tot 19,6 m, v -22,6 tot 26,2 m): nok langs v op u = 13 m
  (+28,6 m) met topgevels tot +29,4 m en een achtkantige dakruiter van 2,8 m op
  de viering met een spits tot +39,3 m (het AHN-maximum daar).
- De kappen: rijen dwarse zadeldaken op de zijbeuken, elk met de nok langs v in
  het midden van de travee, een schild (53 graden) naar het schip en een
  topgevel met een groot venster aan de buitenmuur. Tussen de westpartij en het
  dwarsschip vier grote kappen per kant (traveeën van 10,3 m, nok +19,8 m,
  buitenmuren v = -22,8 en +25,5 m, met steunberen), in de westpartij drie
  kleinere per kant (nok +19,6 m, tot v = -14,2 en +18 m) en langs het koor vier
  per kant (nok +18,3 m, traveeën van 6,9 m). Tussen de kappen een langsdak op de
  binnenste zijbeuken (nok +18,6 m op 3,6 m van de schipmuur), zodat de kilgoten
  naast het schip hoog blijven, zoals in het AHN (+15,6 tot +18,4 m).
- Kooromgang: een lage rand (+13,5 m) met vijf straalsgewijze kappen rond de
  sluiting (nok +18,5 m, helling 1,3) met topgevels naar buiten; lage kapellen
  ten zuiden van het koor (+9,8 m), een oostelijk bijgebouw met zadeldak (nok
  +12 m) en een lage aanbouw aan de noordwestkant (+8 m).
- Westtoren (7,6 m in het vierkant) tot +33,5 m met een omgang (borstwering tot
  +34,4 m) en vier hoekpinakels, een achtkantige lantaarn van 5,4 m tot +40,5 m
  en een achtkantige spits tot +49 m.
- Vensternissen als spitsbogen, 0,5 m diep: een groot venster in elke topgevel
  van de kappen, in de gevels van het dwarsschip en in de sluiting; galmgaten en
  een westvenster in de toren.

Vergelijking met het AHN-DSM (raster op 0,5 m, alleen cellen boven 3 m met een
meetwaarde): 73,6 % ligt binnen 1 m en 90,0 % binnen 2 m. De afwijkingen zitten
vooral op de kilgoten tussen de kappen, de gevelranden en in de kooromgang.

Printbaar op 1:1000: alle vlakken wijzen omhoog of staan verticaal, op de
spitsbogen na (steiler dan 45 graden). De export vult op 1:1000 en 1:1500 niets
bij en op 1:2500 0,6 %. De STL is 96,5 cm³, heeft 2.886 driehoeken en is één
samenhangend deel (status NoError, geslacht 0). Dunste delen op 1:1000: de
pinakels en de spitsen 0,9 mm.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Sint-Janskerk_%28Gouda%29)
(123 m buitenwerks, kruiskerk met kappen), PDOK BAG, PDOK AHN (dsm en dtm 0,5 m
via WCS), 3D BAG LoD2.2 (api.3dbag.nl) en de PDOK luchtfoto. Geschat zijn de
lantaarn en de spits van de toren tussen de AHN-punten, de dakruiter, de hellingen
van de binnenste zijbeuken, de kooromgang, de steunberen en de vensternissen.
Weggelaten: maaswerk, de glazen, dakkapellen en schoorstenen onder 0,9 m.
