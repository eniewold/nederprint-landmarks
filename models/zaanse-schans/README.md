# Zaanse Schans (Zaandam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `zaanse-schans.glb` | Catalogusbron in meters: zes nodes `building:<molen>`, één per molen (`De Huisman`, `De Gekroonde Poelenburg`, `De Kat`, `De Zoeker`, `Het Jonge Schaap`, `De Bonte Hen`) met onderbouw, stelling, romp, kap, staart, wiekenkruis en de schuur uit hetzelfde BAG-pand |
| `zaanse-schans-1-1000.stl` | De zes molens los naast elkaar op 1:1000 (drie per rij, wiekenvlak langs X), elk met zijn onderkant op het printbed en een printsteun onder de twee onderste wiekpunten (97 × 53 × 27,1 mm) |
| `zaanse-schans.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, vervangen panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (116160, 498810) (WGS84 52,47565
N, 4,81554 O), op de Zaan voor de molenrij, en de glTF-conventie Y omhoog.
+X wijst naar het oosten en +Y naar het noorden (`xAxis` (1, 0), geen
draaiing). z = 0 ligt op het maaiveld bij de molens (NAP circa 0,0 m volgens
het AHN-DTM; rond elke molen -0,1 tot +0,1 m). Het maaiveld wordt op zes
punten bemonsterd (`groundSamplePoints`), één naast elke molen op 10 tot
13 m van de rompas, buiten de stelling en de schuur, op een vlak stuk
maaiveld (AHN-DTM binnen 0,1 m). De lader neemt het laagste punt; in het
PDOK-terrein is dat het punt naast De Zoeker (42,70 m ellipsoïdisch), en
dat is ook `groundHeight` voor een uitsnede zonder een van de punten.
`groundOffsetMetres` is 0. Alle onderdelen beginnen op z = -1,0 m, de vlakke
onderkant van elke node, zodat een molen op een iets hoger maaiveld niet
zweeft.

De zes molens en hun BAG-panden (`replacesBuildings`), van zuid naar noord
langs de Kalverringdijk:

- De Huisman (0479100000003293, Kalverringdijk 23): de specerij- en
  mosterdmolen, een klein achtkant op de noordoostkop van een lange schuur
  (x = 75, y = -266).
- De Gekroonde Poelenburg (0479100000004691, Kalverringdijk 27): de
  houtzaagmolen, een paltrok (x = 141, y = -160).
- De Kat (0479100000002702, Kalverringdijk 29): de verfmolen met een hoge
  onderbouw, op de noordkop van een rechthoekig pand met de schuur naar het
  zuiden (x = 153, y = -69).
- De Zoeker (0479100000002971, Kalverringdijk 31): de oliemolen met een
  lage stelling en een schuur van ruim 20 m naar het zuidoosten (x = 137, y = 40).
- Het Jonge Schaap (0479100000002959, Kalverringdijk 31a): de houtzaagmolen
  uit 2007, een zeskant met schuren aan beide kanten (x = 69, y = 56).
- De Bonte Hen (0479100000003084, Kalverringdijk 39): de oliemolen 330 m
  noordwestelijker, met de schuur naar het zuidoosten (x = -150, y = 268).

De houten huisjes, pakhuizen en loodsen rond de molens zijn aparte panden en
blijven PDOK. Elke molen staat op het hart van zijn kap in het AHN-DSM en is
gedraaid naar de richting van de as zoals het DSM die toont (het wiekenvlak
ligt als een lijn voor de kap, 2,6 tot 3,7 m voor de rompas): De Kat naar
het noorden (85 graden linksom vanaf het oosten), Het Jonge Schaap naar het
noordnoordoosten (76), De Huisman, De Gekroonde Poelenburg en De Zoeker naar
het noordoosten (65, 58 en 55) en De Bonte Hen ook naar het noordoosten
(33). Bij De Huisman toont het DSM geen wieken; zijn as komt uit de
luchtfoto.

Onderdelen per stellingmolen (hoogtes boven het maaiveld):

- Een achtkante onderbouw (apothema 4,0 tot 5,6 m) en een stelling als
  dichte achtkante plaat van 0,6 m dik op 7,5 m (De Huisman, op de schuur),
  7,2 m (De Kat), 4,3 m (De Zoeker), 5,9 m (Het Jonge Schaap) en 4,9 m (De
  Bonte Hen), met een apothema van 4,8, 8,0, 8,5, 7,5 en 7,8 m. Onder het
  deel dat buiten de onderbouw steekt, loopt een kraag van 50 graden naar de
  onderbouw; de open stelling op schoren is op 1:1000 niet printbaar.
- Een achtkant (Het Jonge Schaap een zeskant) van apothema 4,2 tot 4,3 m op
  de stelling naar 2,9 tot 3,1 m bovenaan op 14,0 tot 16,1 m (De Huisman
  2,6 naar 1,8 m tot 11,9 m), een rietgedekte kap tot 16,9 m (De Zoeker),
  17,3 m (De Bonte Hen), 17,4 m (Het Jonge Schaap), 19,0 m (De Kat) en
  13,9 m (De Huisman), en een staart van 0,9 m van de achterkant van de kap
  naar de rand van de stelling (58 tot 65 graden).
- Het wiekenkruis als plaat van 1,0 m dik en 2,2 m breed (De Huisman 0,9 en
  1,4 m) in X-stand onder 50 graden met de horizontaal, 2,9 tot 4,3 m voor
  de rompas, met de as 2,0 m onder de nok (De Huisman 1,0 m) en de vlucht
  uit de molendatabase: 11,4 m (De Huisman), 21,8 m (De Kat), 22,5 m (De
  Zoeker), 20,6 m (Het Jonge Schaap) en 23,0 m (De Bonte Hen). De onderste
  wiekpunten blijven 0,6 tot 1,3 m boven de stelling.
- De schuur: de BAG-contour tot een zadeldak met de nok langs de lange as,
  met nok en dakhelling uit het DSM (nok 5,6 m bij Het Jonge Schaap tot
  8,3 m bij De Kat, goot 2 tot 4 m), zonder het deel binnen de stelling.

De paltrok De Gekroonde Poelenburg: een voet op de BAG-contour tot 1,0 m,
de onderkast van 7,3 m lang en 11 m breed met een dak van 6,0 m aan de
zijkant naar 7,0 m, de rokken die aan beide kanten tot 2,5 m op 7,5 m uit de
as aflopen, het smalle bovenhuis van 5 m breed tot een goot op 12,5 m en een
nok op 15,2 m, en het wiekenkruis (vlucht 20,36 m) met de as op 13,6 m. Het
hoogste punt van de rij is de bovenste wiek van De Kat, 26,1 m boven het
maaiveld (NAP circa +26,1 m).

Wat er niet in zit: de open stelling met leuning en schoren (een dichte
plaat op een kraag), het kruirad en de kettingen, de helling van de as
(het wiekenvlak staat verticaal), het hekwerk en de zeilen van de wieken
(de plaat is dicht), de luiken en deuren, de losse houten huisjes en
pakhuizen rond de molens en de draaibare voet van de paltrok.

Vergelijking met het AHN-DSM (0,5 m, buiten een strook van 1,6 m rond het
wiekenvlak, waar de wieken in het AHN in willekeurige standen staan): over
alle cellen waar het model staat ligt 84 % binnen 2 m van het DSM (57 %
binnen 1 m, mediaan +0,56 m, mediaan absoluut 0,78 m); per molen 74 % (De
Huisman, waarvan de schuur in het DSM gemiddeld lager is) tot 89 % (De
Zoeker). Rond de rompas (binnen 4 m: romp en kap) ligt 76 % binnen 2 m
(mediaan +0,13 m).

Printbaarheid op 1:1000: de wiekplaten zijn 1,0 m dik en hangen nergens
vlakker dan 50 graden, de kraag onder de stelling hangt onder 50 graden, de
kap en de as hebben een onderkant van 50 graden of steiler en de staart
loopt onder 58 tot 65 graden naar de stelling. Het script controleert per
molen dat alles op z = -1,0 m begint, dat alleen de schuine eindvlakken van
de twee onderste wiekpunten (4,4 m², bij De Huisman 2,5 m²) vlakker dan 45
graden hangen en dat de printversie geen overhang heeft: daar loopt onder
elke onderste wiekpunt een steun van de plaatdikte tot het printbed. In twee
uitsneden op 1:1000 (380 × 380 m rond De Huisman tot Het Jonge Schaap,
3,8 seconden; 220 × 220 m rond De Bonte Hen, 1,7 seconden) gaat elke molen
als gesloten solid met overhangopvulling door (steile overhang aanwezig, de opvulling slaagt): het volume groeit met 4 tot 5 % (59 tot 168 mm³
op 1136 tot 3157 mm³; bij De Bonte Hen 11 %, 275 mm³, omdat de onderplaat
daar 0,8 mm onder de voet ligt), voor het grootste deel de voet die onder
het maaiveld doorloopt tot de onderplaat en verder de paaltjes onder de
wiekpunten. De zes vervangen PDOK-panden zitten niet in de export. In de
zuidelijke uitsnede staan alle vijf molens op het PDOK-maaiveld naast De
Zoeker (42,70 m); het terrein rond de voet ligt daar 0,3 m onder tot 0,65 m
boven de voet (mediaan +0,08 tot +0,19 m, dus de voet iets in het
maaiveld). Rond De Bonte Hen alleen ligt het terrein 0,3 m onder tot 0,1 m
boven de voet (mediaan -0,19 m); de fundering loopt daar 1 m onder door,
zodat er geen spleet zichtbaar is.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Zaanse_Schans) (de
molens langs de Zaan), de [molendatabase](https://www.molendatabase.nl)
(type, vlucht en stellinghoogte per molen: De Huisman 11,40 m en 7,40 m, De
Gekroonde Poelenburg 20,36 m, De Kat 21,80 m en 7,10 m, De Zoeker 22,50 m en
4,30 m, Het Jonge Schaap 20,50 tot 20,68 m en 5,50 m en een zeskant, De Bonte
Hen 22,90 tot 23,05 m en 5,00 m), [De Zaansche
Molen](https://www.zaanschemolen.nl) (adressen en bouwjaren), PDOK BAG
(pand-id, adres en contour per molen), PDOK AHN (dsm en dtm 0,5 m via WCS:
stelling, schuur, kap, asrichting, wiekenvlak, maaiveld), de PDOK-luchtfoto
(stelling en as van De Huisman), het PDOK-terrein van de 3D
Basisvoorziening (maaiveldpunten) en Wikimedia Commons-foto's (De Kat and
De Zoeker at Zaanse Schans, viewed from the southeast (2004).jpg; Zaandijk -
Zaanse Schans - Kalverringdijk - View WSW on Paltrok or Post Mill 'De
Gekroonde Poelenburg' 1869 - There used to be 200 of these Saw-Mills around
here.jpg). De stellinghoogtes in het model komen uit het DSM en liggen bij
Het Jonge Schaap 0,4 m boven de opgegeven 5,50 m. Geschat zijn de maten van
de romp (apothema onder en boven) en de hoogte van de bovenkant van de romp
(2,9 m onder de nok, bij De Huisman 2,0 m), de hoogte van de as (2,0 m onder
de nok, bij De Huisman 1,0 m), de vorm van de kap, de apothema van de
onderbouw (uit de BAG-contour), de stand en breedte van de wieken, de
schuurdaken als één zadeldak per pand, de vorm van de paltrok (onderkast,
rokken en bovenhuis uit het DSM) en de asrichting van De Huisman (uit de
luchtfoto).

Licentie van het model: eigen werk op basis van open bronnen.
