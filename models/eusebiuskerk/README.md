# Eusebiuskerk (Arnhem)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `eusebiuskerk.glb` | Catalogusbron in meters: node `building:eusebiuskerk` met zijbeuken, middenschip en koor, transept, kapellen en de westtoren |
| `eusebiuskerk-1-1000.stl` | De kerk in één stuk op 1:1000, met de onderkant (1 m onder het maaiveld) op het printbed (84 × 53 × 97 mm) |
| `eusebiuskerk.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (190932, 443533,5), midden in het
schip, op het maaiveld aan de oostkant (NAP +12,7 m) en de glTF-conventie Y
omhoog. +X loopt langs de as naar het koor in het oosten (RD-richting
-1,0 graad), +Y naar het noorden; de toren staat aan de -X-kant. Het maaiveld
wordt op vier punten rondom bemonsterd (`groundSamplePoints`, NAP +12,7 tot
+13,5 m). Het catalogusitem vervangt BAG-pand `NL.IMBAG.Pand.0202100000253372`.

Onderdelen in het model (hoogtes in NAP, uit dwarsprofielen van het AHN-DSM in
een stelsel langs de as):

- De zijbeuken van de hallenkerk binnen de BAG-contour, van de westgevel naast
  de toren tot rond de koorsluiting, met een lessenaarsdak van de goot op
  +28,5 m naar +33,3 m tegen het middenschip.
- Het middenschip en het koor onder één zadeldak: muren tot +39,5 m, nok op
  +49,6 m, afgeschild over de veelhoekige koorsluiting.
- Het transept van 14 m breed met topgevels aan beide kanten (nok +50,0 m) en
  de dakruiter op de viering (tot +56 m, geschat).
- De lage kapellen tussen de steunberen (+17,5 m), het zuidportaal (+24,5 m),
  de kapel ten zuiden van het koor (+24,0 m) en de aanbouwen aan de noordkant
  (+19,5 m).
- De westtoren in vijf geledingen naar de omhullende per hoogte: 15,6 × 16,0 m
  tot +52 m, 14,3 × 14,0 m tot +64 m, 13,0 × 13,0 m tot +72 m, 10,7 × 10,6 m
  tot +95 m en de bekroning van 6,6 × 8,0 m tot +99 m met een spits tot +108,4 m
  (Wikipedia: 93 m boven het maaiveld).

Binnen de contour ligt 78 % van het DSM boven NAP +16 m binnen 2 m van het
model (mediaan 0,1 m); de grootste afwijkingen zitten in de dwarse
zadeldaken van de zijbeuken, die als één lessenaarsdak zijn gemodelleerd, en
in de open bekroning van de toren.

Printbaar op 1:1000 zonder steun: alles staat recht op of loopt schuin omhoog,
elke geleding van de toren is smaller dan de vorige, en het script
controleert dat geen vlak boven de onderkant naar beneden wijst. De export van
een uitsnede van 130 m op 1:1000 duurt circa 2 seconden.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Sint-Eusebiuskerk)
(laatgotisch, begonnen omstreeks 1452, na de Tweede Wereldoorlog herbouwd),
PDOK BAG (contour), PDOK AHN (dsm en dtm 0,5 m via WCS: dwarsprofielen,
omhullende van de toren, kapellen en maaiveld) en de PDOK luchtfoto. Geschat
zijn de hoogtes tussen de gemeten stappen van de torenomhullende, de
dakruiter en de hoogtes van de lage kapellen; de dwarse zadeldaken op de
zijbeuken, de steunberen, de pinakels, de glazen balkons in de toren en de
gevelindeling zijn niet gemodelleerd.

Licentie van het model: eigen werk op basis van open bronnen.
