# Grote of Onze-Lieve-Vrouwekerk (Dordrecht)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `grote-kerk-dordrecht.glb` | Catalogusbron in meters: node `building:grote-kerk-dordrecht` met kapellen en aanbouwen, zijbeuken met topgevels en luchtbogen, schip en koor, kooromgang met straalkapellen, transept met dakruiter, Mariakoor en de stompe westtoren met uurwerkpaviljoens |
| `grote-kerk-dordrecht-1-1000.stl` | De kerk in één stuk op 1:1000, met de onderkant (1 m onder het maaiveld) op het printbed (109 × 47 × 64 mm) |
| `grote-kerk-dordrecht.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (104898,5, 425308,7), midden in de
kerk, op het maaiveld aan de zuidkant (NAP +2,6 m) en de glTF-conventie Y
omhoog. +X loopt langs de as naar het koor in het oostzuidoosten
(RD-richting -10,6 graden), +Y naar het noordnoordoosten; de toren staat aan de
-X-kant. Het maaiveld wordt op vier punten rondom bemonsterd
(`groundSamplePoints`, NAP +2,6 tot +3,1 m), niet op de lagere kade aan de
zuidkant. De toren is in de BAG een apart pand: het catalogusitem vervangt
`NL.IMBAG.Pand.0505100000013404` (kerk) en `NL.IMBAG.Pand.0505100000013971`
(toren).

Onderdelen in het model (hoogtes in NAP, uit dwars- en lengteprofielen van het
AHN-DSM in een stelsel langs de as, met de PDOK 3D-reconstructie (LoD2.2) en
foto's van de RCE als vergelijking):

- De lage kapellen en aanbouwen binnen de BAG-contour op +9,5 m.
- De zijbeuken langs het schip met een lessenaarsdak van +20,5 m (zuid) en
  +19,5 m (noord) naar +18,3 m, en langs de buitenmuur één topgevel per
  travee (top +21,5 m).
- De luchtbogen als volle steunmuren van 1 m dik, schuin van +21,5 m bij de
  buitenmuur naar +24,5 m bij de lichtbeuk, met pinakels (+23,8 m) op de
  buitenste steunberen; langs de zuidkant van het koor vijf luchtbogen boven
  de kapellen (lessenaarsdak +17,5 tot +16,5 m).
- Het schip en het koor onder één zadeldak: lichtbeukmuren tot +28,8 m, nok op
  +39,0 m, afgeschild over de koorsluiting als halve tienhoek, met
  spitsboognissen voor de vensters per travee en in de vijf vlakken van de
  koorsluiting.
- De kooromgang (+16,5 m) met vijf straalkapellen onder tentdaken (+22,5 m) en
  zes pinakels (+24,8 m) met luchtbogen naar de koorsluiting.
- Het Mariakoor ten noorden van het koor onder één hoog zadeldak (nok
  +29,2 m), aan de oostkant afgewolfd, met steunberen langs de noordgevel.
- Het transept met topgevels (nok +38,0 m), een groot venster als nis in
  beide topgevels, hoekpinakels en de dakruiter op de viering: een achtkantige
  lantaarn tot +45 m met een spits tot +56 m.
- De onvoltooide ‘stompe’ westtoren: de onderbouw tot +24 m op de BAG-contour,
  de romp tot het platform op +55,4 m met hoeksteunberen die bij +24 en +42 m
  terugspringen, nissen voor het westvenster en twee rijen van drie galmgaten
  op de vrije gevels, de balustrade met hoekpinakels op het platform en de
  uurwerkstoel (+60,5 m, laag tentdak) met vier uurwerkpaviljoens midden op de
  zijden, elk met een fronton tot +66 m.

Binnen de contouren ligt 83 % van het DSM boven NAP +8 m binnen 2 m van het
model (mediaan 0,8 m); de PDOK-reconstructie, die uit hetzelfde AHN is
afgeleid, volgt het DSM per cel nauwer (mediaan 0,3 m) maar mist de
luchtbogen, topgevels, pinakels, vensters, dakruiter en de vorm van de
torenbekroning. Mapbox Standard heeft voor deze kerk geen landmarkmodel.

Printbaar op 1:1000 zonder steun: alle onderdelen zijn minstens 0,9 m dik en
staan recht op of lopen schuin omhoog, en de nissen hebben een spitse
bovenkant van 60 graden. Alleen de frontons van de uurwerkpaviljoens kragen
0,3 m uit; daardoor vult de export op 1:1000 met de overhangopvulling in plaats
van verticaal, zodat de nissen blijven staan. Het script controleert dat er
verder geen vlak vlakker dan 45 graden naar beneden wijst. De export van een
uitsnede van 160 m op 1:1000 duurt circa 2 seconden.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Grote_of_Onze-Lieve-Vrouwekerk_(Dordrecht))
(kruisbasiliek in Brabantse gotiek met de stompe toren), PDOK BAG (contouren),
PDOK AHN (dsm en dtm 0,5 m via WCS), de PDOK 3D Basisvoorziening (LoD2.2,
ter vergelijking), RCE-foto's op Wikimedia Commons (luchtbogen, koor, toren) en
de PDOK luchtfoto. Geschat zijn de luchtbogen (dichtgezet), de hoogtes van de
pinakels, de vensternissen en de vorm van de dakruiter; de
balustrades langs de daken, de ballen op de frontons, de wijzerplaten en de
gevelindeling binnen de nissen zijn niet gemodelleerd.

Licentie van het model: eigen werk op basis van open bronnen.
