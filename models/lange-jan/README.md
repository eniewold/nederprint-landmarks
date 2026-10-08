# Lange Jan (Middelburg)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `lange-jan.glb` | Catalogusbron in meters: nodes `building:toren` (de abdijtoren als gesloten solid) en `building:abdij` (de PDOK-reconstructie van de rest van het abdijcomplex) |
| `lange-jan-1-1000.stl` | De toren in één stuk op 1:1000, met de onderkant (0,5 m onder het maaiveld) op het printbed (16 × 16 × 91 mm) |
| `lange-jan.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (31935,8, 391557,0), in het hart
van de achtkantige onderbouw op het maaiveld van Onder den Toren (NAP +4,5 m),
en de glTF-conventie Y omhoog. +X staat loodrecht op de oostgevel van de
achtkant (RD-richting 13,3 graden), zodat de acht gevels op de assen en de
diagonalen liggen; -Y wijst naar het plein Onder den Toren (zuidzuidoosten).
Het maaiveld wordt op drie punten op dat plein bemonsterd
(`groundSamplePoints`, 11 m ten zuiden en 11 m ten zuidwesten en zuidoosten
van het hart); aan de noordkant staan de kerken.

De toren is geen eigen BAG-pand: hij hoort bij `NL.IMBAG.Pand.0687100000029292`,
het hele abdijcomplex met de Nieuwe Kerk, de Koorkerk, het Zeeuws Museum en de
abdijgebouwen rond het Abdijplein (115 × 160 m). De kaart en de export kunnen
alleen hele panden verbergen, en de PDOK-reconstructie van de toren (een
blokkige schacht tot 8,9 m uit het hart en 88 m hoog) zou anders om het nieuwe
model heen staan. Het catalogusitem vervangt daarom dat hele pand, en de GLB
neemt de rest ervan over als node `building:abdij`: de driehoeken uit de
PDOK-gebouwtegel (3D Basisvoorziening, CC BY 4.0), zonder alles binnen de
voetafdruk van de toren plus 0,25 m, zonder alles ten zuidoosten van de lijn
door de steunberen in het zuidwesten en noordoosten (daar staat alleen de
toren) en zonder de torendelen boven de kerkdaken (binnen 8 m van het hart
boven 25 m, binnen 9 m boven 32,3 m). Die node is net als de PDOK-panden geen
gesloten solid en staat op dezelfde hoogte als in de tegel: de vloer van het
pand ligt 2 m onder het maaiveld bij de toren, dus de node begint lokaal op
-1,74 m (`ABBEY_DZ` in het script, met het PDOK-maaiveld van 48,75 m
ellipsoïdisch op de bemonsteringspunten).

Onderdelen van de toren (hoogtes boven het maaiveld; apothema is de afstand
van het hart tot een gevel):

- De stenen achtkant van 12,6 m over de vlakken (BAG), in drie geledingen die
  telkens iets terugwijken: tot 22,5 m met hoge spitsboogvensters aan de vrije
  zijden, tot 36,5 m met blinde spitsbogen en tot 51 m met de galmgaten aan
  alle acht zijden.
- De steunberen op de acht hoeken, 1,5 m breed en tot 8,45 m uit het hart
  (BAG), met waterslagen op 10, 22,5, 36 en 47,5 m, die op 49,5 m in de gevel
  verdwijnen.
- De band met de wapenschilden (apothema 4,95 m), de uitgekraagde lijst en de
  dichte balustrade van de omloop tot 60,8 m, met acht pinakels op de hoeken.
- De achtkantige opbouw (apothema 4,2 m) tot 65,3 m met een dakrand, het eerste
  lantaarntje (3,85 m, met blinde spitsbogen) tot 71,8 m, het tweede (2,7 m) tot
  76,4 m en de klokvormige kap tot 80,6 m; de dakranden kragen onder hooguit
  40 graden uit.
- De keizerskroon (straal 1,45 m) tot 85,2 m, de rijksappel en de windvaan als
  spits tot 90,4 m (Wikipedia).

Vergelijking met het AHN-DSM: per ring van 0,5 m rond het hart (aan de vrije
zijden) ligt het 90e percentiel van het DSM bij 9 van de 18 ringen binnen 2 m
van het model, met een mediane afwijking van 2,0 m. Per cel ligt 23 % binnen
2 m en 53 % binnen 5 m, en het DSM ligt in de mediaan 2,8 m lager: het
AHN-oppervlak van een slanke toren is een afgevlakte kegel, die aan de rand
van elke trede (omloop, dakranden, steunberen) wegzakt. De top van het DSM
(89,7 m) bevestigt de hoogte van de windvaan.

Printbaar op 1:1000 zonder steun: elke geleding is smaller dan de vorige, de
dakranden kragen onder hooguit 40 graden uit en de nissen hebben een spitse
top; het script controleert dat de massa zonder nissen geen vlak heeft dat
vlakker dan 45 graden naar beneden wijst. De export van een uitsnede van
260 m op 1:1000 duurt circa 2,5 seconden; de toren gaat er als gesloten solid
met overhangopvulling doorheen (8,43 naar 8,73 cm³, vooral de voet tot de
onderplaat), de abdij-node met de verticale opvulling zoals de PDOK-panden, en
het vervangen pand zit niet meer in de export. De voet staat 0,3 tot 0,5 m in
het PDOK-maaiveld.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Abdijtoren) (90,4 m,
achtkantig, bekroning na 1940 herbouwd),
[Rijksmonumentenregister 28674](https://monumentenregister.cultureelerfgoed.nl/monumenten/28674)
(achtkant vanaf de grond, drie geledingen, steunberen op de hoeken), PDOK BAG
(achtkant en steunberen binnen de contour van het abdijpand), PDOK AHN (dsm en
dtm 0,5 m via WCS: omhullende per richting en hoogte, maaiveld), de PDOK
3D Basisvoorziening (de abdij) en foto's op Wikimedia Commons. Geschat zijn de
hoogtes van de geledingen en waterslagen (uit een frontale foto met een
eenvoudig perspectiefmodel, gecontroleerd met het DSM), de breedte van de
lantaarns en de kap, en de vorm van de kroon; de kleine vensters, de
wapenschilden, de open arcaden van de lantaarns (als blinde nissen) en het
lichte verloop van het hart naar boven (circa 0,4 m volgens het DSM) zijn
weggelaten of vereenvoudigd.

Licentie van het model: de toren is eigen werk op basis van open bronnen; de
node `building:abdij` is afgeleid van de 3D Basisvoorziening van het Kadaster
(CC BY 4.0).
