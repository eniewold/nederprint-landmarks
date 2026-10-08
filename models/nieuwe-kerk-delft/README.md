# Nieuwe Kerk (Delft)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `nieuwe-kerk-delft.glb` | Catalogusbron in meters: node `building:nieuwe-kerk-delft` met schip, zijbeuken, transept, koor, koorzijbeuken, kooromgang, sacristie en de westtoren |
| `nieuwe-kerk-delft-1-1000.stl` | De kerk in één stuk op 1:1000, met de onderkant (1 m onder het maaiveld) op het printbed (113 × 36 × 110 mm) |
| `nieuwe-kerk-delft.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (84543,63, 447609,12), op de
viering, op het maaiveld (NAP +0,3 m) en de glTF-conventie Y omhoog. +X loopt
langs de as van de toren naar het koor in het oostnoordoosten (RD-richting
31,66 graden), +Y naar het noordnoordwesten; de toren staat aan de -X-kant,
aan de Markt. Het maaiveld wordt op vier punten rondom bemonsterd
(`groundSamplePoints`, NAP +0,2 tot +0,8 m: de Markt voor de toren, de straat
langs de zuidbeuk en het transept en de straat langs de noordkant van het
koor). Het catalogusitem vervangt BAG-pand `NL.IMBAG.Pand.0503100000000209`,
het enige pand onder de kerk.

Onderdelen in het model (hoogtes in NAP, uit dwarsprofielen van het AHN-DSM in
een stelsel langs de as):

- Alles binnen de BAG-contour tot +9 m, met de steunberen uit de contour; de
  lage kluis tussen de zuidelijke koorzijbeuk en de sacristie tot +4,5 m.
- Het schip van 13 m breed: muren tot +19,8 m, zadeldak met de nok op
  +30,5 m, van de toren tot de viering, met spitsboognissen in de lichtbeuk.
- De zijbeuken langs het schip, elk onder een eigen zadeldak evenwijdig aan de
  as: van de kil tegen de lichtbeuk (+13,6 en +14 m) over de nok (+17,5 m
  noord, +17,7 m zuid) naar de goot aan de buitenmuur (+10,4 en +11,3 m), met
  een nis per travee; de zuidbeuk loopt langs de toren door tot de westgevel.
- Het transept van 12,5 m breed (goot +20 m, nok +30,6 m) met een topgevel,
  een groot venster als nis en twee traptorentjes tot +25,5 m aan de
  zuidkant, en een afgewolfd noordeind met een lager portaal tot +18 m.
- Het koor van 13,8 m breed, hoger dan het schip: muren tot +25 m, nok op
  +36 m, afgeschild over de koorsluiting van een halve tienhoek, met nissen
  voor de lichtbeukvensters.
- De koorzijbeuken en de kooromgang (straal 15,2 m) onder lessenaarsdaken van
  +20,6 m naar +13,4 en +13 m, met een nis per travee en pinakels tot +17 m op
  de steunberen, en de sacristie aan de zuidoostkant onder een schilddak tot
  +17 m.
- De westtoren rond een hart 56,3 m ten westen van de viering: de bakstenen
  onderbouw van 12,2 m in het vierkant tot +39,5 m met steunberen op de
  hoeken (1,5 m uitspringend tot +29 m en 0,8 m tot +38,5 m), het portaal en
  twee hoge nissen per gevel, een borstwering tot +40,7 m die 0,3 m
  uitkraagt, de witstenen vierkante geleding van 11,6 m tot +52 m met vier
  achtkantige hoektorentjes tot +60,5 m, de achtkantige klokkengeleding
  (9,2 m over de vlakken) tot +75,5 m met galmgaten en acht pinakels tot
  +80,5 m, en de achtkantige spits die van 6 m via 4 m op +88 m naar 0,9 m op
  +101 m versmalt en eindigt in een naald tot +108,75 m. Een traptoren tot
  +13,5 m staat op de zuidwesthoek.

Binnen de contour ligt 85 % van de DSM-cellen binnen 2 m van het model (77 %
binnen 1 m, mediaan 0,4 m); per deel 41 % bij de toren, 90 % bij schip en
transept en 89 % bij koor, kooromgang en sacristie. De toren wijkt het meest
af: de hoektorentjes, pinakels, galerijen en het opengewerkte natuursteen
geven in het DSM een grillig patroon waar het model vlakke geledingen heeft,
en de randen van de geledingen liggen op een halve cel. De omhullende per
hoogte (onderbouw 15 m met steunberen, vierkante geleding 12 m, achtkant
9 m, spits van 6 m op +80 m tot het hoogste AHN-punt op +103 m) volgt het
model wel.

Printbaar op 1:1000 zonder steun: alles staat recht op of loopt schuin omhoog,
elke geleding van de toren is smaller dan de vorige, de naald is 0,9 m dik en
de nissen hebben een spitse bovenkant van 60 graden. Alleen de borstwering
boven de bakstenen onderbouw kraagt 0,3 m uit; het script controleert dat
geen ander vlak boven de onderkant naar beneden wijst. Door die uitkraging
gaat de kerk als gesloten solid met overhangopvulling door de export, zodat de
nissen behouden blijven: een uitsnede van 200 m op 1:1000 duurt circa 5
seconden (68,2 naar 68,9 cm³), het vervangen pand zit niet meer in de export
en de voet staat 0,1 tot 0,9 m in het PDOK-maaiveld.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Nieuwe_Kerk_(Delft))
(toren van 108,75 m, gebouwd 1396 tot 1496, de bovenste achtkant van
Bentheimer zandsteen, de spits na blikseminslag in 1872 door Cuypers
vernieuwd), [Rijksmonumentenregister 11872](https://monumentenregister.cultureelerfgoed.nl/monumenten/11872),
PDOK BAG (contour), PDOK AHN (dsm en dtm 0,5 m via WCS: dwarsprofielen,
omhullende van de toren per hoogte, maaiveld), de PDOK luchtfoto en foto's van
de Rijksdienst voor het Cultureel Erfgoed op Wikimedia Commons (overzicht van
de toren en de zuidgevel). Geschat zijn de grenzen tussen de torengeledingen
(uit het AHN en foto's), de naald boven het hoogste AHN-punt, de hoektorentjes
en pinakels, het afgewolfde noordeind van het transept met het portaal, de
traptorentjes van het transept en de traptoren van de toren, en de sacristie
als één schilddak; de klokken, de galerijen en balustrades van de toren, de
trapgevel van het transept, de dakkapellen en de vensterindeling zijn
weggelaten of als dichte wand en nis vereenvoudigd.

Licentie van het model: eigen werk op basis van open bronnen.
