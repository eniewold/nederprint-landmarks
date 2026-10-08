# Vredespaleis (Den Haag)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `vredespaleis.glb` | Catalogusbron in meters: node `building:vredespaleis` met het paleis rond de binnenplaats, de klokkentoren, de kleine toren en de latere uitbreidingen (bibliotheek en Academiegebouw) binnen hetzelfde BAG-pand |
| `vredespaleis-1-1000.stl` | Het pand in één stuk op 1:1000, met de onderkant (2 m onder het maaiveld) op het printbed (156 × 162 × 82 mm) |
| `vredespaleis.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (80201,12, 455937,92), midden op
de voorgevel in de as van de ingang en de dakruiter, op het maaiveld (NAP
+3,4 m) en de glTF-conventie Y omhoog. +X loopt van de achtergevel naar de
voorgevel (`xAxis` (0,95697, 0,29020), RD-richting 16,87 graden, naar het
oostnoordoosten, de richting van de BAG-gevels), +Y naar het
noordnoordwesten. De voorgevel kijkt naar het Carnegieplein; de hoge
klokkentoren staat op de zuidhoek van de voorgevel, de kleine toren aan de
noordgevel achter het paviljoen op de noordhoek, de bibliotheekvleugel met
de ovale zaal en het Academiegebouw liggen achter het paleis aan de zuid- en
noordwestkant. Het maaiveld wordt op drie punten bemonsterd
(`groundSamplePoints`, NAP +3,4 tot +3,5 m: aan de zuidgevel, in de tuin
achter het paleis en aan de zuidkant van de bibliotheek), niet aan de vijver
aan de noordkant (NAP +2,1 m) of op het terras voor de ingang (NAP +5,3 m);
`groundOffsetMetres` is -0,3. Het catalogusitem vervangt BAG-pand
`NL.IMBAG.Pand.0518100000210611`; dat pand omvat behalve het paleis ook de
bibliotheek, de ovale zaal en het Academiegebouw, die daarom vereenvoudigd
meegemodelleerd zijn.

Onderdelen in het model (hoogtes in NAP, uit het AHN-DSM in een stelsel langs
de gevels):

- Alles binnen de paleiscontour tot +14 m (de galerijen langs de
  binnenplaats), de binnenplaats met een vloer op +3,9 m en het verhoogde
  middendeel op +5,9 m.
- De voorvleugel aan het Carnegieplein onder een zadeldak met schilden (goot
  +20 en +21,5 m, nok +35,8 m, 9 m achter de voorgevel) met de achtkantige
  dakruiter tot +48,5 m in de as van de ingang en twee schoorstenen tot
  +40 m ernaast.
- De noord-, zuid- en achtervleugel onder gebroken daken (goten +19,7 tot
  +22 m, bovenkant +29,4 tot +30,5 m), met schilden op de achterhoeken, twee
  schoorstenen tot +38 m en de ronde erkers tot +19 m.
- De hogere blokken op de noord- en zuidhoek achter de voorvleugel (+32,8 en
  +33,3 m), het paviljoen op de noordhoek met de nok loodrecht op de
  voorgevel (+33,7 m) en het bordes ervoor op +6,5 m.
- De uitbouw van de voorvleugel in de binnenplaats (nok +30 m, bovenkant
  +33 m) en die van de achtervleugel (+23,8 m) met een torentje tot +33 m.
- De klokkentoren op de zuidhoek van de voorgevel: vierkante schacht van
  10,6 m tot +42,3 m, de klokkenverdieping die 0,3 m uitkraagt tot +50,5 m
  met vier hoektorentjes met kegeldaken tot +58,5 m, de bovengeleding van
  6,2 m tot +63 m, de achtkantige spits tot +80 m en de windvaan tot NAP +83 m
  (79,6 m boven het maaiveld).
- De kleine toren aan de noordgevel: een voet van 5,7 bij 4,2 m tot +34 m,
  daarboven achtkantig (4,2 m) tot +40 m, spits en naald tot +52,4 m.
- De uitbreidingen als blokken: de bibliotheekvleugel (+19,9 m), de ovale zaal
  (+13,8 m), het driehoekige tussenlid naar het paleis (+12,8 m), de lage
  verbinding naar het noorden (+9,5 m), het tussenblok (+14,4 m) en het
  Academiegebouw in vlakken van +14,4 tot +18,8 m met een lessenaarsdak van
  +15 naar +22 m aan de zuidkant.

Binnen de voetafdruk ligt 83,3 % van de DSM-cellen binnen 2 m van het model
(72,3 % binnen 1 m, mediaan +0,02 m); bij het paleis 79,9 % (68,3 % binnen
1 m, mediaan +0,02 m), bij de uitbreidingen 87,9 % (bibliotheek 91,7 %,
Academiegebouw 81,8 %). De klokkentoren wijkt per cel het meest af (21,5 %
binnen 2 m, mediaan +1,8 m): het DSM ziet de open klokkenverdieping, de
hoektorentjes en de spits als een rafelige omhullende, terwijl het model
dichte geledingen heeft; de breedtes per hoogte volgen die omhullende en de
top (+83 m) is het hoogste AHN-punt. Het Academiegebouw heeft schuine
dakvlakken die als vlakke delen en één lessenaarsdak zijn benaderd.

Printbaar op 1:1000 zonder steun: de gevels staan recht op, de daken van de
vleugels lopen onder 50 tot 60 graden omhoog, de torens worden per geleding
smaller, de spitsen en de dakruiter zijn piramides en de schoorstenen en
torentjes zijn minstens 1,4 m dik. Alleen de klokkenverdieping kraagt 0,3 m
vlak uit; het script controleert dat geen ander vlak boven de onderkant naar
beneden wijst en dat alles op dezelfde onderkant begint. Door die
uitkraging gaat het pand als gesloten solid met overhangopvulling door de
export: een uitsnede van 260 m op 1:1000 duurt circa 1,6 seconden (176,5
naar 178,9 cm³, vooral de voet tot de onderplaat) en het vervangen pand zit
niet meer in de export. Het PDOK-maaiveld ligt aan de zuidgevel, de
achtergevel, in de binnenplaats en bij de bibliotheek 0,2 tot 0,5 m boven
het modelmaaiveld (de vloer van de binnenplaats blijft er net boven), op het
terras voor de ingang 0,7 tot 2,4 m erboven en aan de vijver aan de
noordkant en naast het Academiegebouw tot 1 m eronder, nog boven de
onderkant.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Vredespaleis)
(neorenaissancepaleis van Louis Cordonnier en Johan van der Steur,
1907-1913, toren 80 m; uitbreidingen van Michael Wilford, 2007), het
[Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/333074)
(monument 333074), PDOK BAG (contour van paleis, binnenplaats en
uitbreidingen), PDOK AHN (dsm en dtm 0,5 m via WCS: dwarsprofielen van de
vleugels, de omhullende van beide torens per hoogte, de dakruiter, de
schoorstenen, de daken van de uitbreidingen en het maaiveld), de
PDOK-luchtfoto en foto's op Wikimedia Commons (Friedenspalast Den Haag.jpg
frontaal, Den Haag Peace Palace.jpg, Peace Palace (side view).JPG en Peace
Palace back side 04152014.JPG). Geschat zijn de geledingen van de
klokkentoren (kroonlijst, klokkenverdieping, hoektorentjes en bovengeleding
uit de frontale foto, geschaald op de AHN-hoogte), de vorm van de kleine
toren en het torentje op de uitbouw, de dakruiter en de schoorstenen (uit
AHN-pieken), de vereenvoudiging van de daken tot gebroken daken en schilden
per vleugel en de daken van de uitbreidingen (AHN-mediaan per deel); de
dakkapellen, de topgevels met pinakels, de hoektorentjes op de gevels, de
arcade van de ingang, de uurwerken en de gevelindeling zijn weggelaten.

Licentie van het model: eigen werk op basis van open bronnen.
