# Grote of Sint-Bavokerk (Haarlem)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `grote-kerk-haarlem.glb` | Catalogusbron in meters: node `building:grote-kerk-haarlem` met lage aanbouwen, zijbeuken en kooromgang, kapellen, schip en koor, transept en de vieringtoren |
| `grote-kerk-haarlem-1-1000.stl` | De kerk in één stuk op 1:1000, met de onderkant (1 m onder het maaiveld) op het printbed (119 × 59 × 80 mm) |
| `grote-kerk-haarlem.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (103933, 488399,2), op de viering
onder de toren, op het maaiveld aan de zuidkant (NAP +1,5 m) en de
glTF-conventie Y omhoog. +X loopt langs de as van de westgevel aan de Grote
Markt naar het koor in het oosten (RD-richting 2,2 graden), +Y naar het
noorden. Het maaiveld wordt op vier punten rondom bemonsterd
(`groundSamplePoints`, NAP +1,5 tot +2,5 m: de Grote Markt, de straat ten
noorden van het transept, de Oude Groenmarkt en de straat aan de zuidkant).
Het catalogusitem vervangt BAG-pand `NL.IMBAG.Pand.0392100000065734`; de
Vishal tegen de noordgevel, de huisjes tegen de zuidgevel en de aanbouw
ten zuiden van het koor zijn eigen panden en blijven als PDOK-reconstructie
staan.

Onderdelen in het model (hoogtes in NAP, uit dwarsprofielen van het AHN-DSM in
een stelsel langs de as):

- Lage aanbouwen en portalen binnen de BAG-contour op +7 m en de aanbouw aan
  de zuidoostkant van de kooromgang op +11 m.
- De zijbeuken en de kooromgang onder lessenaarsdaken van de hoge muur naar
  de buitenmuur (circa +14,3 m), met de hellingen uit een vlakfit op het DSM:
  langs het schip van +22,3 m met helling 0,95, langs het koor en rond de
  koorsluiting van +23,4 m met helling 1,08. Rond de koorsluiting bestaat het
  dak uit vijf vlakke dakvlakken evenwijdig aan de zijden van de halve
  tienhoek, met hoekkepers ertussen; de kooromgang is aan de oostkant 1 m
  dieper dan langs de zijkanten. Het DSM en de luchtfoto tonen hier geen
  dwarse zadeldaken: langs de as is het dak per travee vlak op 0,5 m na.
- De kapellen: twee langs de noordkant van het koor onder een tentdak (top
  +20,6 en +19,8 m), de derde daar en drie langs de zuidkant van het koor met
  dwarse zadeldaken (nok +16,3 tot +19,2 m), en twee langs de zuidkant van het
  schip met dwarse zadeldaken (nok +15,1 en +22,2 m).
- Het schip en het koor onder één zadeldak van 18 m breed: muren tot
  +30,8 m, nok op +43,2 m, afgeschild over de koorsluiting van een halve
  tienhoek.
- Het transept van 13,4 m breed met topgevels (goot +31,5 m, nok +43,1 m).
- De houten vieringtoren naar de omhullende per hoogte: de vierkante voet van
  7,6 m met de uurwerken tot +49 m, drie achtkantige geledingen die van 7,6
  naar 3,8 m doorsnede versmallen tot +65,5 m, de lantaarn met de kroon tot
  +69 m en de spits tot +80 m (Wikipedia: 78 m).

Binnen de contour ligt 87 % van het DSM boven NAP +8 m binnen 2 m van het
model (mediaan 0,45 m; was 86 % en 0,6 m met één doorlopend lessenaarsdak).
Op de zijbeuken van het schip is de mediane afwijking 0,2 m, op die van het
koor 0,25 m en op de kooromgang 0,3 m (99 % binnen 2 m); de grootste
afwijkingen zitten in de open kroon en de geledingen van de vieringtoren, de
topgevels van transept en kapellen en de hoektorentjes van de westgevel.
Alle dakvlakken krijgen in de GLB scherpe randen (normalen gesplitst boven
10 graden), zodat de koorsluiting op de kaart hoekig oogt.

Printbaar op 1:1000 zonder steun: alles staat recht op of loopt schuin omhoog,
elke geleding van de vieringtoren is smaller dan de vorige, en het script
controleert dat geen vlak boven de onderkant naar beneden wijst. De export van
een uitsnede van 220 m op 1:1000 duurt circa 2 seconden; de kerk gaat er als
gesloten solid met overhangopvulling doorheen (117,1 naar 118,2 cm³; zonder
naar beneden gerichte vlakken kiest de export zelf de gewone verticale
opvulling, met hetzelfde resultaat).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Grote_of_Sint-Bavokerk)
(kruisbasiliek in Brabantse gotiek, houten vieringtoren van 78 m uit 1520),
PDOK BAG (contour), PDOK AHN (dsm en dtm 0,5 m via WCS: dwarsprofielen,
omhullende van de vieringtoren, kapellen en maaiveld), de PDOK luchtfoto en
foto's op Wikimedia Commons. Geschat zijn de spits boven de kroon (het AHN
reikt tot +70,8 m), de achtkantige geledingen tussen de AHN-stappen, de
kapeldaken langs de zuidkant van het schip en de kleine knik van 0,5 m tussen
de traveeën van de zijbeukdaken (weggelaten); de steunberen, pinakels,
hoektorentjes, de open kroon en de gevelindeling zijn niet gemodelleerd.

Licentie van het model: eigen werk op basis van open bronnen.
