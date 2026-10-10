# Fatih-moskee (Amsterdam)

De voormalige rooms-katholieke Sint-Ignatiuskerk (De Zaaier, H.W. Valk, 1929)
aan de Rozengracht in de Jordaan, sinds 1981 de Fatih-moskee, met de
voormalige pastorie (Rozengracht 150) die in hetzelfde BAG-pand ligt.

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `fatih-moskee.glb` | Catalogusbron in meters: nodes `building:kerk` (de kerk uit dakvlakken en bouwdelen) en `building:pastorie` (de voormalige pastorie) |
| `fatih-moskee-1-1000.stl` | Kerk en pastorie op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (49,6 × 40,7 × 40,1 mm, twee delen die tegen elkaar staan) |
| `fatih-moskee.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (120370,99, 487361,78), het midden
van de voorgevel aan de Rozengracht op de as van het schip, op het maaiveld
(NAP +0,6 m), en de glTF-conventie Y omhoog. +X loopt van de voorgevel naar de
Bloemstraat (111,1 graden linksom vanaf de RD-X-as, gemeten aan de normalen van
de LoD2.2-dakvlakken van het schip en de BAG-gevels) en +Y loodrecht daarop
naar het westzuidwesten, de kant van de pastorie. Het maaiveld wordt
bemonsterd op de Rozengracht voor het front en in de Bloemstraat achter de
koortoren (`groundSamplePoints`, NAP +0,5 tot +0,6 m); valt geen van die punten
in de uitsnede, dan gebruikt de lader `groundHeight` 43,44 m (de laagste
ellipsoïdische PDOK-terreinhoogte op die punten). Vervangt de
PDOK-reconstructie van `NL.IMBAG.Pand.0363100012167944` (kerk en pastorie);
de buurpanden staan in PDOK op of onder hun AHN-hoogte en blijven staan.

Onderdelen (hoogtes boven het maaiveld op NAP +0,6 m; 49,6 bij 40,7 m en 40,1 m
hoog met de onderkant):

- Schip: één zadeldak van de voorgevel tot in de koortoren, nok +20,82 m,
  57,6 graden, goot +11,53 m op y = ±5,9 m, met een lichtbeuk met een spitse
  nis per travee van 4,4 m.
- Zijbeuken achter de torens onder lessenaarsdaken van 39 graden vanaf +9,1 m
  aan de lichtbeuk: de oostbeuk tot de muur op y = -10,52 m (+5,3 m), de
  bredere westbeuk tot y = +12,2 m (+3,9 m), langs de pastorie en de
  binnenplaats ingesprongen zoals het BAG-pand.
- Twee vierkante torens aan de Rozengracht (romp 6,2 bij 7,4 m op y = ±7,47
  m): een band op een kraag op +23,6 m, een klokkenverdieping met vijf
  galmgaten per zijde, een verdiepte nis eronder, een goot op een kraag van
  48 graden tot +28,2 m (0,5 m uitstek), een steile vierzijdige spits tot +37,0
  m met een dakkapel met topgeveltje midden op elke zijde en een makelaar met
  een bol tot +39,6 m. Aan de straat per toren een paar rondboogvensters, twee
  paren rechte vensters en de winkelpui als nissen; aan de buiten- en
  achterzijde een vensterpaar boven het buurpand en de zijbeuk.
- Front tussen de torens: een topgevel van 1 m dik met schouders op +17,2 m en
  een top op +21,6 m (45 graden) met een pinakel tot +23,4 m, het roosvenster
  (3,2 m, middelpunt +15,0 m) als trechtervormige nis, een arcade van vier
  spitse vensternissen (+7,2 tot +10,3 m) en drie ingangsbogen van 2,4 m tot
  +5,3 m (0,9 m diep).
- Koortoren boven het koor aan de Bloemstraat: over de hele breedte van het
  schip (10,6 m, x = 39 tot 48,9 m), muren tot +17,3 m met een borstwering voor
  en achter, vijf kantelen op elke zijmuur tot +18,6 m, een tentdak tot +27,0 m
  en drie hoge vensternissen in de gevel aan de Bloemstraat. Er is geen koepel:
  luchtfoto, 3D BAG en de foto's uit de Bloemstraat tonen deze vierkante toren
  met tentdak.
- Vleugels aan de Bloemstraat naast de koortoren onder een dwars zadeldak (nok
  x = 44,1 m, +13,45 m, 51 graden) met topgevels op de kopse kanten; de
  oostvleugel met vier spitse vensters, de westvleugel met twee vensterparen,
  een poort en een deur. Platte aanbouwen ervoor (+6,3 m oost, +8,36 m west).
  De achtergevel volgt de BAG-hoeken (0,57 m scheef over 28,9 m).
- Pastorie (eigen node): voorhuis met schilddak (voorschild 60 graden,
  zijvlakken 44 graden, nok +19,26 m) en een dakkapel aan de straat, vensters
  op drie verdiepingen en een winkelpui; daarachter een plat dak (+18,1 m) met
  een trappenhuis (+20,3 m) en een achtervleugel met zadeldak (nok +16,57 m) en
  een lage strook (+7,8 m).

Wat er niet in zit en waarom: de halve manen en kruisjes op de makelaars, de
dakgoten, luifels en reclame aan de winkelpuien en de schoorsteentjes op de
pastorie zijn kleiner dan 0,9 m; maaswerk, het stermotief in het roosvenster
en de stenen banden en lijsten in de gevels zijn vlak of kleiner dan 0,9 m;
de lage overkapping van de binnenplaats tussen de westbeuk en de pastorie
(circa +5 m) hoort niet bij het BAG-pand en blijft PDOK-terrein. De zijmuren
van de zijbeuken staan tegen de buurpanden en hebben daarom geen vensters.

Pasvorm op het AHN: nok van het schip, hellingen en goten van schip en
zijbeuken, de vleugels en de pastorie komen uit de LoD2.2-vlakken van de 3D BAG
en kloppen binnen enkele decimeters met het DSM (0,5 m); de torenspitsen
eindigen op +37,0 m tegenover +37,5 m in het DSM (de makelaar en de bol staan
daar boven het hoogste AHN-punt), het tentdak van de koortoren op +27,0 m
tegenover +27,1 m.

Printbaar op 1:1000: alle vlakken wijzen omhoog of staan verticaal, op de nissen
(spitse toppen van 58 graden, rechte nissen en het roosvenster met een
plafond van 48 graden) en de kragen onder de goten en de band van de torens na
(48 graden). De printcheck (`prepareMeshes` met printbare overhangopvulling op
1:1000) vult niets bij: kerk 17.930 mm³, pastorie 3.572 mm³, extraPct 0, status
NoError. De STL is 20,5 cm³ en heeft 3.360 driehoeken; kerk en pastorie zijn
elk één samenhangend deel (genus 0). Dunste delen op 1:1000: de makelaars
0,9 mm.

Geschat: de geledingen van de torens (band, galmgaten, nis, vensters), de
breedte van de torenromp boven de BAG-voet, de dakkapellen op de spitsen, de
makelaars, de hoogtes van de topgevel (uit een frontale foto), het roosvenster,
de arcade en de ingangsbogen, de kantelen en de borstwering van de koortoren,
de dakkapel van de pastorie en alle vensternissen.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Fatih-moskee_%28Amsterdam%29)
(voormalige Sint-Ignatiuskerk van H.W. Valk, 1929, dubbeltorenfront van 40 m),
PDOK BAG, PDOK AHN (dsm en dtm 0,5 m via WCS), 3D BAG LoD2.2 (api.3dbag.nl), de
PDOK luchtfoto en foto's op Wikimedia Commons in de categorieën
Rozengracht 144-154 en Bloemstraat 147 (Amsterdam).
