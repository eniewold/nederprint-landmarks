# Oude Kerk (Amsterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `oude-kerk-amsterdam.glb` | Catalogusbron in meters: node `building:oude-kerk-amsterdam` met middenschip, zijbeuken, kapellen, transept, koor, kooromgang, aanbouwen, dakruiter en de westtoren |
| `oude-kerk-amsterdam-1-1000.stl` | De kerk in één stuk op 1:1000, met de onderkant (1 m onder het maaiveld) op het printbed (82 × 66 × 68 mm) |
| `oude-kerk-amsterdam.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (121656,59, 487499,92), bij de
toren (het hart van de onderbouw ligt 0,3 m oostelijker), op het maaiveld
(NAP +1,4 m) en de glTF-conventie Y omhoog. +X loopt langs de as van de
toren naar het koor (RD-richting 2,8 graden, net ten noorden van oost), +Y
naar het noorden; de toren staat aan de -X-kant, aan het Oudekerksplein, en
het koor aan de Oudezijds Voorburgwal. Het maaiveld wordt op drie punten
bemonsterd (`groundSamplePoints`, NAP +1,3 tot +1,6 m: het plein voor de
toren en langs de noord- en zuidkant); de kade aan de oostkant ligt 0,4 m
lager en blijft buiten beschouwing. Het catalogusitem vervangt BAG-pand
`NL.IMBAG.Pand.0363100012178469`; de kerkhuisjes tegen de kerk zijn eigen
panden en blijven als PDOK-reconstructie staan.

Onderdelen in het model (hoogtes in NAP, uit dwarsprofielen van het AHN-DSM in
een stelsel langs de as):

- Alles binnen de BAG-contour tot +5 m: de aanbouwen en kerkhuisjes die bij
  het kerkpand horen, met een lage aanbouw aan de noordkant tot +8,5 m, de
  lagere kapellen aan de zuidkant tot +10 m, het portaal voor het
  zuidtransept tot +9,5 m, een aanbouw tot +10,5 m en een traptoren tot +15 m
  naast de toren.
- Het middenschip van 12,2 m breed: muren tot +20,5 m, zadeldak met de nok
  op +27,7 m (oostelijk van de viering +27 m), met negen dwarse kruiskappen
  tot de nok, de breedste over de viering, en de dakruiter met een
  achtkantige spits tot +37 m.
- De zijbeuken onder zadeldaken langs de as (nok +23,3 m noord, +23,5 m
  zuid, kil tegen het middenschip +15,5 m) en daarachter de kapellen, per
  travee van circa 10 m een dwars zadeldak (nok +23,8 m, ten oosten van het
  transept +24 m) met een topgevel en een vensternis in de buitenmuur.
- Het transept van 11,7 m breed (goot +14,5 m, nok +24 m) met topgevels en
  een groot venster als nis aan de noord- en zuidkant.
- Het koor met de afgeschilde koorsluiting (halve tienhoek, straal 6,1 m,
  goot +19,5 m), de kooromgang tot de BAG-contour onder een dak van +16 tot
  +17 m, en de zuidkant van het koor onder een zadeldak tot +23,5 m.
- De westtoren rond een hart 0,3 m ten oosten van de oorsprong: de bakstenen
  onderbouw van 9,8 × 9,7 m tot +36 m met het portaal en twee rijen nissen in
  de west-, noord- en zuidgevel, een borstwering tot +37 m die 0,3 m
  uitkraagt met vier hoekpinakels tot +42 m, een loden rok naar de
  uurwerkgeleding van 8 m met afgeschuinde hoeken tot +45,5 m met een nis
  voor het uurwerk in elke gevel en vier pinakels tot +50 m, de achtkantige
  klokkenlantaarn (5,6 m over de vlakken) tot +52,5 m met galmgaten, de
  peer (straal 2,7 m op +54 m), de bovenste lantaarn tot +60,5 m, de kap en
  de naald tot 67 m boven het maaiveld (NAP +68,4 m).

Binnen de voetafdruk ligt 83 % van de DSM-cellen binnen 2 m van het model
(59 % binnen 1 m, mediaan +0,46 m); per deel 88 % bij het westelijke schip
met de zijbeuken en kapellen, 84 % bij het transept en 82 % bij het koor en
de oostelijke kapellen. De toren wijkt het meest af (43 % binnen 2 m): de
loden geledingen zijn opengewerkt met galerijen, pinakels en open lantaarns
waar het model dichte vlakken heeft, en het hoogste AHN-punt ligt op
+65,8 m. Het model komt tot op 1 m bij 81 % van de DSM-cellen boven
+37 m, 80 % boven +50 m en 84 % boven +60 m. Op de leien daken heeft het DSM
776 cellen zonder punten, vooral langs de kilgoten.

Printbaar op 1:1000 zonder steun: alles staat recht op of loopt schuin omhoog,
elke geleding van de toren is smaller dan de vorige, de naald is 0,9 m dik en
de nissen hebben een spitse bovenkant van 60 graden. Alleen de borstwering
boven de bakstenen onderbouw kraagt 0,3 m uit; het script controleert dat
geen ander vlak boven de onderkant naar beneden wijst en dat alles op
dezelfde onderkant begint. Door die uitkraging gaat de kerk als gesloten
solid met overhangopvulling door de export, zodat de nissen behouden blijven:
een uitsnede van 200 m op 1:1000 duurt circa 1,5 seconden (73,0 naar
74,9 cm³, vooral de voet tot de onderplaat), het vervangen pand zit niet meer
in de export en de kerkhuisjes er wel. De voet staat 0,9 tot 1,6 m in het
PDOK-maaiveld; aan de kade in het oosten ligt het modelmaaiveld 0,1 m boven
het PDOK-terrein, maar de onderkant nog 0,9 m eronder.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Oude_Kerk_(Amsterdam))
(hallenkerk uit de 14e eeuw, kapellen en transept uit de 15e eeuw, het koor
in 1550-1560 uitgebreid, toren van 67 m met een spits van Joost Bilhamer uit
1565), [Rijksmonumentenregister 3990](https://monumentenregister.cultureelerfgoed.nl/monumenten/3990),
PDOK BAG (contour), PDOK AHN (dsm en dtm 0,5 m via WCS: dwarsprofielen,
omhullende van de toren per hoogte, maaiveld), de PDOK luchtfoto en foto's
op Wikimedia Commons (de toren van dichtbij en vanaf de Oudezijds
Voorburgwal). Geschat zijn de grenzen tussen de torengeledingen en de vorm
van de peer (uit het AHN en foto's), de naald boven het hoogste AHN-punt,
de pinakels, de breedte van de kruiskappen, de topgevels en vensters van de
kapellen, de kooromgang als één dak en de hoogtes van de aanbouwen; de open
lantaarns en galerijen zijn dicht, de uurwerken, balustrades, dakkapellen en
de haan zijn weggelaten, en het vlakke stuk tussen de twee kapeldaken ten
oosten van het noordtransept is als kil vereenvoudigd.

Licentie van het model: eigen werk op basis van open bronnen.
