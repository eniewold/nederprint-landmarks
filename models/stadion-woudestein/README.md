# Stadion Woudestein (Rotterdam)

Thuisstadion van Excelsior in Kralingen. Van 2017 tot 2025 heette het Van
Donge & De Roo Stadion; sinds het seizoen 2025/26 draagt het weer de
historische naam Stadion Woudestein.

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `stadion-woudestein.glb` | Catalogusbron in meters: node `building:stadion` (vier tribunes met zitrang onder de daken, pylonen met tuidraden, het achtergebouw van de hoofdtribune, dug-outs en vier vakwerk-lichtmasten) |
| `stadion-woudestein-1-1000.stl` | Het stadion op 1:1000 met de onderkant (0,5 m onder het parkmaaiveld) op het printbed (136 × 115 × 36 mm, met de losse masten en tribunes) |
| `stadion-woudestein-grondplaat-1-1000.stl` | Idem met een grondplaat van 1 mm, omdat de hoofdtribune, de noordtribune, de L van zuid- en oosttribune en de vier masten los van elkaar staan |
| `stadion-woudestein.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (95375,87, 436864,47) in het hart
van de veldopening, en de glTF-conventie Y omhoog. +X loopt langs de lengteas
van het veld naar het noordnoordoosten (67,15 graden vanaf de RD-X-as, gemeten
op de voorranden van de vier tribunes in het AHN) en +Y dwars daarop naar het
westnoordwesten, naar de hoofdtribune. z = 0 ligt op het maaiveld van het park
ten oosten van het stadion (NAP −1,2 m): het stadion staat op een terrein dat
2,2 m hoger ligt (veld en parkeerplaats op NAP +1,0 tot +1,1 m), met aan de
oostkant een sloot direct achter de oosttribune. Het maaiveld wordt op vier
punten bemonsterd (`groundSamplePoints`: het park in het oosten, de noordkant,
de parkeerplaats in het westen en de straat in het zuiden); het laagste punt,
het park, bepaalt de hoogte, zodat de achterwand van de oosttribune niet boven
de sloot zweeft en de rest van de onderkant in het hogere terrein zakt.
`groundHeight` (42,38 m ellipsoïdisch, het PDOK-maaiveld op dat punt) is de
vaste terugval. Vervangt de PDOK-reconstructie van de BAG-panden
`NL.IMBAG.Pand.0599100010029704` (hoofdtribune met achtergebouw),
`…0599100100015795` (zuidelijke kop van de hoofdtribune, 2020),
`…0599100010033787` en `…0599100010014268` (onder de zuidtribune) en
`…0599100100015796` (achter de zuidtribune). Alleen de hoofdtribune had een
PDOK-reconstructie; de andere tribunes zijn geen BAG-pand.

Onderdelen (hoogtes boven het parkmaaiveld; het veld ligt op +2,2 m; AHN-DSM op
0,5 m, luchtfoto en foto's; alles in blokken, prisma's en convexe rompen van
vlakken, geen hoogteveld):

- Elke tribune is een doorsnede die langs de voorrand is uitgetrokken: een
  zitrang in treden die onder het dak open blijft, een achterwand en een
  dakplaat van 1,5 tot 1,65 m dik die over de zitrang uitkraagt en licht naar
  achteren afloopt (AHN).
- De hoofdtribune (Henk Zon-tribune, v = 40,6 tot 51,0 m, u −49,5 tot 44,5 m):
  zes treden van +3,0 tot +7,0 m, de glazen band van de lounges (0,45 m diep,
  +7,4 tot +8,9 m) tussen de pylonen, het dak van +11,0 m aan de veldkant naar
  +10,75 m aan de achterrand. Twaalf betonnen pylonen (0,9 m, steek 8,8 m) achter
  de dakrand tot +13,4 m met elk twee tuidraden (0,9 m) naar het dak. Het
  bakstenen achtergebouw (u −39,5 tot 42,5 m, gevel op v = 59,3 m) tot +9,5 m
  met het zwarte glazen volume boven de ingang (u −17 tot 19 m, 1,7 m uitkragend
  vanaf +5,4 m, het middendeel tot v = 62,6 m), de ingang en negentien raamnissen
  (1,4 × 1,6 m, 0,35 m diep) in de onderbouw, een installatie tot +12,0 m en een
  verhoogd dakdeel; de zuidelijke kop (2020) op dakhoogte tot v = 54 m; twee
  dug-outs langs het veld.
- De zuid- en oosttribune als één L (voorrand u = −57,4 en v = −40,8 m,
  achterrand u = −65,8 en v = −49,3 m) met de overkapte zuidoosthoek uit 2016: de
  voorrand loopt daar in een boog (straal 4,9 m), de achterkant is afgeschuind
  (AHN). Vijf treden van +2,9 tot +5,6 m, het dak van +9,65 naar +9,4 m. Achter de
  zuidtribune een lage aanbouw met lessenaarsdak (+7,4 naar +6,2 m) en twee
  binnenplaatsen, een dieper blok onder het dak bij de noordwestkop, en de
  noordwestkop zelf schuin afgesneden langs de lichtmast. Aan de parkzijde van de
  oosttribune een zuilengang (de achterwand 0,7 m terug tussen de pylonen, vanaf
  +1,8 m, onder een dakrand van 1,8 m) en een dichte noordelijke gevel met deur,
  bordes en buitentrap naar het park. Pylonen tot +11,6 m (oost, elf) en +11,65 m
  (zuid, acht) met tuidraden.
- De noordtribune (u = 57,6 tot 66,0 m, v −27,5 tot 25,5 m): vijf treden, de
  voorste rij buiten het dak, het dak van +9,6 naar +9,45 m, kopgevels, zeven
  pylonen tot +11,65 m met tuidraden, het scorebord op de dakrand (7 × 0,9 m, tot
  +12,3 m) en een lage aanbouw in de noordwesthoek (+4,9 m).
- Vier vakwerk-lichtmasten op de hoeken: vier poten van 0,9 m (2,8 m breed
  onderaan, 2,0 m bovenaan), ringbalken en kruisdiagonalen van 0,9 m en een
  lampenbank van 4,4 × 1,2 × 3,6 m die naar het veld wijst, tot +35,4 m
  (zuidwest), +34,4 m (zuidoost) en +33,5 m (noordwest en noordoost) (AHN).

Geschat: de plaats en hoogte van de treden, de onderkant van de dakplaten, de
hoogte van de pylonen boven het dak (het AHN ziet de slanke pylonen maar half),
de doorsnede van de masten en hun lampenbanken, het scorebord (luchtfoto:
schaduw op het dak; niet in het AHN), de lengte van de zuilengang, de buitentrap
en de deels nieuwere aanbouw in de noordwesthoek (op de luchtfoto groter dan in
het AHN). Weggelaten: de reclameborden langs het veld en op de dakranden, de
stoelen, leuningen en trappen op de zitrang, de letters en het clublogo op het
achtergebouw (dunner dan 0,9 m), de hekken en ballenvangers, de haag achter de
noordtribune (vegetatie) en de losse panden naast het stadion: het clubgebouw
uit 1905 achter de zuidwesthoek en het gebouwtje in de noordoosthoek blijven de
PDOK-reconstructie. De tuidraden zijn in werkelijkheid dunne staven en zijn als
balken van 0,9 m gemodelleerd om printbaar te blijven.

Pasvorm op het AHN: de voorranden van de vier tribunes vallen binnen 0,3 m op
de randen in het DSM (hoofdas 67,15 graden), de dakhoogtes per tribune binnen
0,1 m op de mediaan van het DSM over de middelste 60 m.

Printbaar op 1:1000: onder +4 m wijst geen vlak onder 45 graden naar beneden;
daarboven hangen de dakplaten, de tuidraden, het glazen volume, het scorebord
en de lampenbanken bedoeld uit (`OVERHANG_OK`). De export vult op 1:1000 13,5 %
volume op (35,6 naar 40,4 cm³, 4,8 s, status NoError); de treden onder de daken
blijven zichtbaar. De STL is 32,6 cm³ (status NoError).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Stadion_Woudestein)
(4.700 plaatsen, twee hoeken gedicht in 2016, naam sinds 2025/26), PDOK BAG
(de vervangen panden), PDOK AHN (dsm en dtm 0,5 m via WCS), de PDOK luchtfoto
(pylonen, dug-outs, scorebord, zuidoosthoek) en foto's van Wikimedia Commons
(Rotterdam stadion woudestein, Van Dongen de Roo Stadion, KNVB finale vrouwen
18-19: gevel met glazen volume, zitrang en lounges, pylonen met tuidraden,
masten) en van stadiumdb.com (zuilengang en buitentrap van de oosttribune,
noordtribune met scorebord).
