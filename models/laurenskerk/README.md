# Grote of Sint-Laurenskerk (Rotterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `laurenskerk.glb` | Catalogusbron in meters: node `building:laurenskerk` met zijbeuken, kooromgang, kapellen, schip en koor, transept, dakruiter en de westtoren |
| `laurenskerk-1-1000.stl` | De kerk in één stuk op 1:1000, met de onderkant (1 m onder het maaiveld) op het printbed (96 × 56 × 70 mm) |
| `laurenskerk.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (92975,1, 437394,4), op de viering
onder de dakruiter, op het maaiveld (NAP +0,7 m) en de glTF-conventie Y omhoog.
+X loopt langs de as van de toren naar het koor in het oostnoordoosten
(RD-richting 15,1 graden), +Y naar het noordnoordwesten; de toren staat aan de
-X-kant, aan het Grotekerkplein. Het maaiveld wordt op vier punten rondom
bemonsterd (`groundSamplePoints`, NAP +0,6 tot +0,8 m: het Grotekerkplein, de
straten aan de noord- en zuidkant en het plein achter het koor). Het
catalogusitem vervangt BAG-pand `NL.IMBAG.Pand.0599100000702379`; de lage
aanbouw tegen de noordbeuk (pand `0599100100015073`) blijft als
PDOK-reconstructie staan.

Onderdelen in het model (hoogtes in NAP, uit dwarsprofielen van het AHN-DSM in
een stelsel langs de as):

- Alles binnen de BAG-contour tot +13,5 m, met de steunberen uit de contour;
  daarop pinakels tot +18,6 m langs de zijbeuken en op de hoeken van de
  kooromgang.
- De zijbeuken langs schip en koor, 13,6 m breed, elk onder een eigen zadeldak
  van de kil tegen de lichtbeuk (+19,6 m) over de nok (+24,7 m langs het schip,
  +25,2 m langs het koor) naar de goot aan de buitenmuur (+14,8 m), met een
  balustrade van 0,9 m dik tot +15,9 m en een spitsboognis per travee.
- De kooromgang als halve tienhoek (apothema 14,1 m) onder een lessenaarsdak
  van +18,6 m naar +14,8 m, met balustrade en nissen, en de kapellen in de
  oksels van transept en koor (+20 m naar +15,5 m).
- Het schip en het koor onder één zadeldak van 14,8 m breed: muren tot
  +24,5 m, nok op +35,1 m, afgeschild over de koorsluiting van een halve
  tienhoek, met nissen voor de koorvensters.
- Het transept van 15,3 m breed met topgevels (nok +35,1 m, kruis +36,8 m),
  een groot venster als nis in elke gevel en vier achtkantige traptorentjes
  op de hoeken tot +30 m.
- De dakruiter op de viering: lantaarn tot +41 m, bovenlantaarn tot +44 m en
  spits tot +49,5 m (geschat uit foto's; het AHN reikt tot +44,5 m).
- De westtoren rond een hart 43,2 m ten westen van de viering: de onderbouw van
  14,2 m in het vierkant tot +36,5 m met portaal, westvenster en drie nissen
  per gevel, de derde geleding van 13,2 m tot de omloop op +51,6 m met een
  borstwering tot +52,8 m, de vierde geleding van 11,5 m tot +62,8 m met een
  balustrade tot +64,1 m die 0,3 m uitkraagt, hoekpinakels, en de koperen
  bekroning tot +69,8 m. Diagonale steunberen op de vier hoeken springen per
  geleding terug (2,6, 1,8 en 1,0 m) en eindigen in pinakels tot +57 m.

Binnen de contour ligt 90 % van de DSM-cellen binnen 2 m van het model (76 %
binnen 1 m, mediaan 0,6 m); per deel 78 % bij de toren, 94 % bij schip en
transept en 90 % bij koor en kooromgang. De zuidhellingen van de leien daken
hebben geen AHN-punten (23 % van de cellen); daar is het model gespiegeld van
de noordkant. De grootste afwijkingen zitten in de pinakels, de bekroning en
de randen van de toren.

Printbaar op 1:1000 zonder steun: alles staat recht op of loopt schuin omhoog,
elke geleding van de toren is smaller dan de vorige en de nissen hebben een
spitse bovenkant van 60 graden. Alleen de balustrade van de vierde geleding
kraagt 0,3 m uit; het script controleert dat geen ander vlak boven de onderkant
naar beneden wijst. Door die uitkraging gaat de kerk als gesloten solid met
overhangopvulling door de export, zodat de nissen behouden blijven: een
uitsnede van 200 m op 1:1000 duurt circa 3,5 seconden (97,2 naar 98,1 cm³),
het vervangen pand zit niet meer in de export en de voet staat 0,2 tot 0,8 m
in het PDOK-maaiveld.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Grote_of_Sint-Laurenskerk_(Rotterdam))
(laatgotische kruisbasiliek met kooromgang, toren van 64 tot 65 m in vier
geledingen, de vierde uit 1645-1646, na 1940 herbouwd),
[Rijksmonumentenregister 32783](https://monumentenregister.cultureelerfgoed.nl/monumenten/32783),
PDOK BAG (contour), PDOK AHN (dsm en dtm 0,5 m via WCS: dwarsprofielen,
raster van de toren en de dakruiter, maaiveld), de PDOK luchtfoto en foto's op
Wikimedia Commons. Geschat zijn de hoogtes van de geledingen onder de omloop
(uit foto's), de spits van de dakruiter, de traptorentjes van het transept,
de pinakels en de zuidhellingen (gespiegeld); de dakkapellen, de open
balustrades, de vensterindeling en de traptoren aan de zuidkant van de toren
zijn weggelaten of als dichte wand en nis vereenvoudigd.

Licentie van het model: eigen werk op basis van open bronnen.
