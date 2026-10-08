# Hovenring (Eindhoven)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `hovenring.glb` | Catalogusbron in meters: node `road:fietspad` (de bovenste 0,5 m van het dek op het BGT-fietspad, met `extras.attributes` `bgt_functie` fietspad en `bgt_fysiekvoorkomen` gesloten verharding) en node `building:hovenring` met de rest: het ringvormige dek, de vier aanbruggen met hun landhoofden, de pyloon met de barrière aan de voet en de 24 tuien |
| `hovenring-1-1000.stl` | De brug in één stuk op 1:1000 met een printvoet onder het dek, met de onderkant (0,5 m onder het wegdek) op het printbed (99 × 99 × 71 mm) |
| `hovenring.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (157232,38, 382695,58), in het
hart van de ring (BGT) aan de voet van de pyloon, op het verdiepte wegdek
onder de ring (NAP +18,9 m) en de glTF-conventie Y omhoog. De assen zijn die
van RD (`xAxis` (1, 0)): +X naar het oosten, +Y naar het noorden. De vier
aanbruggen wijzen naar het oostnoordoosten (10,7 graden), het noordnoordwesten
(100,7 graden), het westzuidwesten en het zuidzuidoosten; de pyloon staat in
het hart. Het maaiveld wordt op vier punten op het verdiepte kruispunt onder
de ring bemonsterd (`groundSamplePoints`, 20 m uit het hart tussen de
aanbruggen, NAP +18,95 tot +19,0 m), niet op de taluds van de hellingbanen
rond de landhoofden (tot NAP +24,4 m); `groundOffsetMetres` is 0. De
Hovenring is geen BAG-pand en vervangt dus niets.

Onderdelen in het model (hoogtes in NAP):

- Het ringvormige dek met binnenstraal 27,15 m en buitenstraal 36 m (BGT;
  binnendiameter 54,3 m en buitendiameter 72 m volgens de bron), het fietspad
  vlak op +24,65 m (AHN). De onderkant volgt de dwarsdoorsnede: 0,2 m dik aan
  de buitenrand, 0,7 m bij de tuiaansluiting en 1,33 m onder het
  contragewicht, met een steile binnenrand van 0,13 m; de doorrijhoogte is
  4,4 m.
- Vier rechte aanbruggen van 5,45 m breed (BGT) met afrondingen van 3 m
  tegen de ring, 0,6 m dik, dalend van +24,65 naar +24,45 m aan het eind op
  50 m uit het hart (AHN), met daaronder een landhoofd van 1,5 m dat tot de
  onderkant doorloopt in het talud.
- De pyloon van 70 m (tot NAP +88,9 m): een ronde schacht van 2,2 m die tot
  2,5 m aanzwelt, de tuiaansluitingen op 54 en 57 m en een naald tot een top
  van 0,6 m; aan de voet een ronde barrière van 4,8 m tot +20,9 m.
- 24 tuien als staven van 1 m dik van de tuiaansluiting in het dek (straal
  30,5 m) naar de pyloon op 54 en 57 m, om en om, in de richtingen 3 + k·15
  graden (luchtfoto).
- Het fietspad als eigen node `road:fietspad` met de attributen van het
  BGT-wegdeel in `extras.attributes` (`bgt_functie` fietspad,
  `bgt_fysiekvoorkomen` gesloten verharding; `plus_fysiekvoorkomen` is in de
  BGT leeg), zodat de kleurregels van een thema (fietspaden rood) op de ring
  werken. Op het dek ligt één actueel wegdeel met relatieve hoogteligging 1:
  `G0772.f20f10c2f74e400291c2f96edb926c62` (fietspad), de ring van straal
  31,0 tot 35,45 m en de vier aanbruggen tussen hun randstroken (4,45 m
  breed), vereenvoudigd tot 5 cm. Een rijbaan ligt er niet. De node is de
  bovenste 0,5 m van het dek binnen die contour; buiten straal 32,6 m, waar
  de onderplaat dunner wordt dan 0,5 m, is het fietspad het hele dek (een
  strook die daar op 0,5 m ophield, liet van de constructie een wig zonder
  dikte over). De tuien blijven constructie, met 2 cm vrij. De binnenrand
  van het dek (straal 27,15 tot 31,0 m, met de tuiaansluitingen; BGT
  onbegroeid terreindeel) en de randstroken van 0,5 m langs de buitenrand en
  de aanbruggen (BGT ondersteunend wegdeel verkeerseiland, met het hek) zijn
  geen wegdeel en horen bij `building:hovenring`. Samen vormen de twee nodes
  precies de brug (2687,5 + 564,0 = 3251,5 m³); de STL bevat de brug als
  geheel en is ongewijzigd.

Binnen de BGT-contour van het dek ligt 87,7 % van de DSM-cellen binnen 2 m
van het model (74,9 % binnen 1 m, mediaan +0,12 m); op het fietspad van de
ring (straal 30 tot 36 m) 93,4 % (mediaan +0,02 m) en op de aanbruggen 94,1 %
(mediaan +0,05 m). Op de binnenrand (straal 27 tot 30 m) ligt het model
mediaan 1,0 m boven het DSM, omdat de laser door het open lamellenvlak tot op
het contragewicht kijkt. Het AHN ziet de pyloon tot NAP +81,4 m (62,5 m boven
het wegdek, nog circa 1 m breed); de naald daarboven tot 70 m komt uit de
bron. De tuien zijn te dun voor het AHN.

Printbaarheid op 1:1000: het dek zweeft 4,4 m boven het wegdek en hangt aan
de tuien, die er pas boven beginnen, dus zonder steun is het niet te
printen. De tuien van 50 mm zijn staven van 1 m (op 1:1000 net breder dan de
0,8 mm die de export als dragend deel telt) die onder 58 tot 60 graden van
het dek naar de pyloon lopen en vanaf het dek zonder steun printen; de
pyloon en de landhoofden staan recht op de onderkant. Het script controleert
dat alleen de onderkant van het dek en de aanbruggen naar beneden wijst en
dat alles op dezelfde onderkant begint. In de export gaat het model als
gesloten solid met overhangopvulling door: onder het dek komt een wig van 45
graden die in een scherm van circa 1 mm tot de onderplaat uitloopt, en onder
de aanbruggen hetzelfde. Een uitsnede van 130 m op 1:1000 duurt circa 16
seconden inclusief het laden van de PDOK-tegels (3,2 naar 7,4 cm³: de wig
onder het dek verdubbelt het volume). Sinds het fietspad een eigen node is,
vult de export beide onderdelen samen op en gaat de opvulling naar de
constructie: in de printcheck op 1:1000 (uitsnede 129 m) krijgt
`building:hovenring` 87 % extra (3,69 naar 6,91 cm³, eerder de hele brug
4,26 naar 7,71 cm³) en het fietspad 0 % (0,56 cm³), beide NoError, in
4,4 seconden. De ring is daarmee van boven en van
opzij herkenbaar (ring, aanbruggen, pyloon en tuienwaaier), maar staat in de
print op een dichte wig en sluit de wegen eronder af. De STL heeft dezelfde
printvoet (wig van 45 graden en een scherm van 1 m onder de ring en de
aanbruggen). Het PDOK-maaiveld ligt onder de ring op het modelmaaiveld (0 tot
+0,15 m), bij de pyloon 0,4 m erboven (de voet zit 0,9 m in het terrein) en
op de taluds net voorbij de landhoofden 0,6 m onder tot 0,15 m boven het
eind van de aanbruggen.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Hovenring) en de
[Engelse Wikipedia](https://en.wikipedia.org/wiki/Hovenring) (zwevende
fietsrotonde van ipv Delft, geopend in 2012, pyloon 70 m, 24 tuien, ring
72 m), de inzending voor de Staalbouwwedstrijd 2012 (Infosteel, laureaat
categorie E: dwarsdoorsnede van het dek met binnen- en buitendiameter,
breedte 8,85 m en hoogtes, en een overzicht met de pyloon, de
tuiaansluitingen op twee niveaus, de aanbruggen van 16 m en de
landhoofden), PDOK BGT (overbruggingsdeel: ring en aanbruggen), PDOK AHN
(dsm en dtm 0,5 m via WCS: dek, aanbruggen, pyloon en het wegdek eronder) en
de PDOK-luchtfoto (richtingen van de tuien, barrière rond de pyloon).
Geschat zijn de vorm van de pyloon (diameters en de hoogte van de
tuiaansluitingen uit het overzicht, de naald boven het AHN-punt), de
barrière aan de voet, de dikte van de aanbruggen en de landhoofden; de
tuien zijn veel dikker dan in werkelijkheid, en de leuningen, het
lamellenvlak met verlichting, de M-vormige steunpunten onder de aanbruggen
en de trillingsdempers zijn weggelaten.

Licentie van het model: eigen werk op basis van open bronnen.
