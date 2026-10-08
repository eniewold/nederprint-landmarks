# Stadion De Vijverberg (Doetinchem)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `stadion-de-vijverberg.glb` | Catalogusbron in meters: node `building:stadion` (vier tribunes met de zitrang onder het dak, vier dichte hoeken, de hoofdtribune met dakspanten en skyboxen, het hoofdgebouw, het lage gebouw achter de westtribune en vier vakwerk-lichtmasten) |
| `stadion-de-vijverberg-1-1000.stl` | Het stadion op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (160 × 145 × 41 mm) |
| `stadion-de-vijverberg-grondplaat-1-1000.stl` | Idem met een grondplaat van 1 mm |
| `stadion-de-vijverberg.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (218419,27, 441211,01), in het hart
van het veld op het maaiveld (NAP +13,0 m), en de glTF-conventie Y omhoog. +X
loopt langs de lengteas van het veld naar het noordoosten (49,0 graden vanaf
de RD-X-as, uit de voorranden van de vier daken in het AHN) en +Y dwars daarop
naar het noordwesten, naar de Roodbergentribune; de hoofdtribune (Vijverberg)
ligt aan de −Y-kant, de Spinnekop (west) aan de −X-kant en de
Groenendaaltribune aan de +X-kant. Het maaiveld wordt op vier punten rond het
stadion bemonsterd (`groundSamplePoints`: het parkeerterrein, het pad achter
het lage gebouw, het bospad achter de noordtribune en het pad bij de
zuidwesthoek); `groundHeight` is de laagste PDOK-terreinhoogte daar (56,71 m
ellipsoïdisch). Vervangt de PDOK-reconstructie van BAG-pand
`NL.IMBAG.Pand.0222100000574507` (tribunes, hoeken, laag gebouw en
hoofdgebouw zijn één pand).

Onderdelen (hoogtes boven het veld; AHN-DSM op 0,5 m, luchtfoto op 0,08 m en
foto's; alles in blokken, prisma's, convexe rompen en gebogen prisma's van
vlakken, geen hoogteveld):

- De vier tribunes met dezelfde doorsnede langs de zijde uitgetrokken. De
  voorranden van de daken liggen op u = ±55,65 m (oost en west), v = 37,0 m
  (noord) en v = −39,1 m (zuid), de achterwanden op de BAG-contour (u = 74,1
  en −74,2 m, v = 55,65 en −57,7 m). Het dak is een lessenaarsdak dat van
  +12,45 m aan de veldkant met 0,078 per meter naar +11,0 m aan de achterrand
  afloopt (zuid: +12,30 m op v = −39,1 m, 0,070 per meter; gemeten in het DSM
  met een afwijking van 2 tot 3 cm), een dakplaat van 1,6 m met een boeiboord
  van 0,9 × 2,6 m aan de voorrand. Daaronder een zitrang van acht treden
  (2,06 m diep, van +1,0 tot +8,0 m) met een borstwering van +1,2 m, die onder
  het dak open blijft, en de achterwand tot onder het dak. Aan de buitenkant
  kraagt de gevelbekleding 1,7 tot 2,9 m uit boven de teruggelegen onderbouw
  (onderkant +4,5 m, schuin oplopend iets steiler dan 45 graden), gedragen
  door steunposten van 0,9 m om de 9 m.
- De vier dichte hoeken: het dak is een kegelvlak rond de binnenhoek van het
  veld (in het DSM valt de hoogte met de afstand tot die hoek, zoals de
  waaiervormige dakvakken op de luchtfoto), in vlakken van ten hoogste 18
  graden, met de zitrang in kwartringen eromheen en de schuin afgesneden
  buitenhoek van de BAG-contour (benen van 12 m). De helling loopt in de waaier
  lineair van de ene zijde naar de volgende.
- Kolommen van 0,9 m aan de voorrand van de noordtribune (u = 0, ±18,5 en
  ±37 m), de oost- en westtribune (v = −20, −1 en 18 m) en op de vier
  binnenhoeken, tot in het boeiboord.
- De westtribune (Spinnekop): twee lichtstraten van 2 m breed en 36 m lang op
  het dak (+1,0 m), en het lage gebouw erachter (u −86,1 tot −72,4 m, v −23,3
  tot 21,2 m, +4,0 m) met deurnissen in de westgevel.
- De hoofdtribune (Vijverberg): de dakrand steekt tussen u = −40 en 40 m tot
  v = −37,0 m over het veld (de overgangen naar de hoeken lopen schuin over
  10 m), tien witte dakspanten (buizen van 0,9 m om de 8,8 m, van de voet op
  het hoofdgebouw tot +13,6 m boven de achterrand en over het dak naar voren
  tot v = −46 m) en een rij skyboxen bovenaan de zitrang (u −30 tot 30 m) met
  glazen nissen tussen penanten van 1,0 m.
- Het hoofdgebouw: een strook van 80 m achter de hoofdtribune (+10,8 m), twee
  ronde trappenhuizen op de uiteinden (straal 1,8 m, +12,2 m), de driehoekige
  vleugel naar het zuiden tot v = −88,9 m (+10,8 m) met de afgeronde punt
  (straal 1,9 m), de lagere glazen rand langs de oostgevel (3 m breed,
  +10,25 m), de ingang en de glazen pui als nissen in de oostgevel, raamnissen
  in drie verdiepingen (1,6 × 1,6 m, 0,35 m diep, met een schuin plafond) in
  de lichte baksteen, twee dakopbouwen (+13,6 m) en het zonnepaneelrek
  (+12,5 m).
- Vier vakwerk-lichtmasten op de buitenhoeken (vier poten van 0,9 m, 2,8 m
  breed onderaan en 1,9 m bovenaan, ringbalken en kruisdiagonalen van 0,9 m,
  een lampenbank van 5,2 × 2,2 m die naar het veld wijst), tot +40,7 (noordoost),
  +40,8 (zuidoost), +39,8 (zuidwest) en +38,6 m (noordwest), vast aan de
  schuine hoekwanden.

Geschat zijn de treden van de zitrang (+1,0 tot +8,0 m, uit de foto's met
circa twintig rijen), de dikte van de dakplaat en het boeiboord, de plaats van
de kolommen (uit de foto's: vier vakken aan de kopse kanten, zes aan de
noordkant), de hoogte en de vorm van de dakspanten (het DSM ziet ze als een
lijn van +0,5 tot +1,7 m boven het dak; de schaduwen op de luchtfoto zijn
langer), de onderkant van de gevelbekleding (+4,5 m), de skyboxen, de
raamnissen en de ingang van het hoofdgebouw, de doorsnede van de masten en de
hoogte van de noordwestmast (het DSM raakt de lampenbank daar mogelijk niet
helemaal). Weggelaten: de reclameborden en het scorebord aan het boeiboord, de
stoelen, trappen en hekken op de zitrang, de spelerstunnel en de dug-outs, de
tuidraden en de dunne buizen van de dakspanten, de luifel boven de hoofdingang
(dunner dan 0,9 m), de zonnepanelen zelf, het veldhek, de losse tent en de
keten rond het stadion. De afwisselend blauwe en witte dakvakken zijn kleur,
geen vorm.

Pasvorm: de dakranden en dakhellingen komen uit doorsneden van het AHN-DSM
(per zijde 60 tot 80 m breed gemiddeld) en vallen binnen 0,1 m samen met het
DSM; de hoekdaken volgen het kegelvlak binnen 0,1 m. Het PDOK-terrein langs de
gevel ligt 0,4 tot 1,8 m boven de onderkant van het model (aan de oostkant ligt
het terrein 1,1 tot 1,7 m hoger dan het veld), dus de voet staat overal in het
terrein en zweeft nergens. Het veld zelf ligt niet verdiept (NAP +13,0 m, het
maaiveld rondom +12,9 tot +14,7 m); de onderkant blijft op 0,5 m onder het
maaiveld.

Printbaar op 1:1000: onder +4 m wijst geen vlak onder 45 graden naar beneden
(de onderkant van de uitkragende gevelbekleding en de plafonds van de
raamnissen lopen iets steiler dan 45 graden op); daarboven hangen de
dakplaten, de boeiboorden, de dakspanten, de skyboxen en de lampenbanken
bedoeld uit (`OVERHANG_OK`). De export vult op 1:1000 21,8 % volume op (88,9 naar
108,2 cm³, 5,2 s, status NoError). De STL is 72,8 cm³ (16.900 driehoeken, status
NoError), één stuk met de masten tegen de hoekwanden.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Stadion_De_Vijverberg)
(12.600 plaatsen, verbouwing 1998–2000 met dichte hoeken), PDOK BAG (het pand
van het stadion), PDOK AHN (dsm en dtm 0,5 m via WCS), de PDOK luchtfoto
(dakspanten, lichtstraten, hoekdaken) en Wikimedia Commons-foto's (De
Vijverberg Doetinchem, De Vijverberg 2017, De Vijverberg.JPG, Vijverberg.JPG,
Vijverberg in het donker, De Graafschap sfeeractie, Doetinchem Abandoned
Station Stadion JUN16, Station Doetinchem Stadion 2016: zitrang onder het dak,
kolommen, boeiboord, skyboxen, uitkragende achterwand en hoofdgebouw).
