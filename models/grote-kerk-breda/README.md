# Grote of Onze-Lieve-Vrouwekerk (Breda)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `grote-kerk-breda.glb` | Catalogusbron in meters: node `building:grote-kerk-breda` met kapellen met kapelgevels en pinakels, zijbeuken en luchtbogen, kooromgang met straalkapellen, schip en koor, transept met dakruiter en de westtoren met lantaarn en ui-bekroning |
| `grote-kerk-breda-1-1000.stl` | De kerk in één stuk op 1:1000, met de onderkant (1 m onder het maaiveld) op het printbed (84 × 45 × 95 mm) |
| `grote-kerk-breda.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (112595, 400194,2), midden in het
schip, op het maaiveld aan de westkant (NAP +3,3 m) en de glTF-conventie Y
omhoog. +X loopt langs de as naar het koor in het oosten (RD-richting
2,3 graden), +Y naar het noorden; de toren staat aan de -X-kant, de Grote Markt
aan de zuidkant. Het maaiveld wordt op vier punten rondom bemonsterd
(`groundSamplePoints`, NAP +3,3 tot +4,3 m). Het catalogusitem vervangt
BAG-pand `NL.IMBAG.Pand.0758100000024659`.

Onderdelen in het model (hoogtes in NAP, uit het AHN-DSM in een stelsel langs
de as, met de PDOK 3D-reconstructie (LoD2.2) en foto's op Wikimedia Commons als
vergelijking):

- De kapellen langs de zijgevels binnen de BAG-contour op +16,8 m, met
  één kapelgevel per travee tussen de steunberen uit de BAG (top +19,8 m) en
  pinakels (+24 m) op de steunberen, en een lage strook langs de zuidkant van
  het koor op +10,0 m.
- De zijbeuken met een lessenaarsdak van +19,0 m tegen de lichtbeuk naar
  +17,8 m, en langs het koor vier luchtbogen per kant als volle steunmuren
  van 1 m dik (+21 tot +24 m).
- Het schip en het koor onder één zadeldak: muren tot +24,5 m, nok op
  +35,4 m, afgeschild over de veelhoekige koorsluiting, met vensternissen in
  de lichtbeuk per travee.
- De kooromgang met vijf straalkapellen onder tentdaken (+20 m) en pinakels
  ertussen.
- Het transept van 12 m breed met topgevels (nok +35,0 m), hoekpinakels en
  een groot venster als nis in beide topgevels, en de dakruiter op de viering:
  een achtkantige schacht met een uitje en een pinakel tot +44 m.
- De westtoren naar de omhullende per hoogte: vier vierkante geledingen van
  15,2 × 12,8 m tot +34 m, 12,6 × 12,1 m tot +42 m, 11,4 × 10,6 m tot +58 m en
  10,0 × 9,4 m tot +66 m, met hoekpinakels op de bovenste drie geledingen
  (tot +47,5, +64 en +73,5 m), galmgaten als nissen en het westvenster; de
  achtkantige lantaarn (straal 4,6 m tot +73 m, met vensters en een omgang,
  daarboven straal 3,8 m tot +77 m) met vier luchtbogen naar de hoekpinakels;
  de bekroning met een ui (straal 3,4 m rond +79 m), een open lantaarntje
  (straal 1,8 m tot +88 m), een kleinere ui en de spits tot +97,6 m
  (Wikipedia: 97 m).

Binnen de contour ligt 73 % van het DSM boven NAP +8 m binnen 2 m van het
model (mediaan 1,0 m); de PDOK-reconstructie, die uit hetzelfde AHN is
afgeleid, volgt het DSM per cel nauwer (mediaan 0,4 m) maar heeft geen
pinakels, luchtbogen, vensters of de vorm van de lantaarn en de uien. Mapbox
Standard heeft voor deze kerk geen landmarkmodel.

Printbaar op 1:1000 zonder steun: alle onderdelen zijn minstens 0,9 m dik en
staan recht op of lopen schuin omhoog, de nissen hebben een spitse bovenkant
van 60 graden en de uien worden onderaan onder hoogstens 45 graden breder.
Alleen de omgang rond de lantaarn kraagt 0,3 m uit; daardoor vult de export
op 1:1000 met de overhangopvulling in plaats van verticaal, zodat de nissen
blijven staan. Het script controleert dat er verder geen vlak vlakker dan
45 graden naar beneden wijst. De export van een uitsnede van 160 m op 1:1000
duurt circa 3 seconden.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Grote_Kerk_(Breda))
(kruisbasiliek in Brabantse gotiek, toren van 97 m), PDOK BAG (contour en
steunberen), PDOK AHN (dsm en dtm 0,5 m via WCS: dwarsprofielen, rasters van
de kapellen, omhullende van toren, lantaarn en bekroning, maaiveld), de PDOK 3D
Basisvoorziening (LoD2.2, ter vergelijking), foto's op Wikimedia Commons en de
PDOK luchtfoto. Geschat zijn de hoogtes van kapelgevels en pinakels, de
luchtbogen, de vensters, de straalkapellen en de vorm van de uien en de
dakruiter; de Prinsenkapel als apart volume, de balustrades, de
open traceringen van de lantaarn en de gevelindeling zijn niet gemodelleerd.

Licentie van het model: eigen werk op basis van open bronnen.
