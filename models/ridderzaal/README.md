# Ridderzaal (Den Haag)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `ridderzaal.glb` | Catalogusbron in meters: node `building:ridderzaal` met de zaal, de dakkapellen, de steunberen, de voorgevel met het portaal, de twee torens en de vleugels achter de zaal binnen hetzelfde BAG-pand |
| `ridderzaal-1-1000.stl` | Het pand in één stuk op 1:1000, met de onderkant (1 m onder het maaiveld) op het printbed (76 × 35 × 37 mm) |
| `ridderzaal.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (81364,57, 455124,30), midden op
de voorgevel van de zaal, op het maaiveld (NAP +2,7 m) en de glTF-conventie Y
omhoog. +X loopt langs de as van de zaal van de voorgevel naar achteren
(`xAxis` (0,86541, 0,50107), RD-richting 30,07 graden, naar het
oostnoordoosten, de richting van de BAG-gevels), +Y naar het
noordnoordwesten. De voorgevel met de twee torens kijkt naar het Binnenhof
(west-zuidwest); de noordtoren met het uurwerk staat aan de +Y-kant, het
traptorentje achter de zaal aan de zuidkant. Het maaiveld wordt op drie
punten bemonsterd (`groundSamplePoints`, NAP +2,7 tot +3,0 m: het Binnenhof
voor de voorgevel en de bestrating langs de noord- en zuidgevel);
`groundOffsetMetres` is -0,3. Het catalogusitem vervangt BAG-pand
`NL.IMBAG.Pand.0518100000211472`; dat pand omvat behalve de zaal ook de lage
vleugels naast de torens en de bouw achter de zaal, die daarom vereenvoudigd
meegemodelleerd zijn. De rest van het Binnenhof (Rolzaal, Eerste en Tweede
Kamer, de vleugels rond het plein) blijft als PDOK-reconstructie staan.

Onderdelen in het model (hoogtes in NAP, uit het AHN-DSM in een stelsel langs
de as):

- Alles binnen de BAG-contour tot +5 m (de lage tussenbouw achter de zaal).
- De zaal van 40,8 bij 20,3 m (inwendig 38,30 bij 17,89 m met muren van
  1,20 m) onder een zadeldak van 59 graden: goot +14,2 m, nok +31,3 m op de
  as van de voorgevel tot de achtergevel, met twee rijen dakkapellen per
  dakvlak (zes onderaan, vijf hoger, voorzijde tot +19,2 en +25,6 m) en de
  steunberen langs de zijgevels die van +12,8 m naar +11,2 m aflopen.
- De voorgevel met de topgevel, het roosvenster als nis met een spitse
  bovenkant (+14,7 tot +20,6 m), de twee spitsboognissen ernaast, twee
  vensters eronder en het portaal van 4,8 m diep onder een zadeldakje tot
  +12 m met de ingang als nis.
- De noordtoren op de noordhoek van de voorgevel: rond, 4,4 m tot +15,2 m,
  de bovengeleding van 4 m tot +27,4 m, de uurwerkgeleding van 4,6 m die
  0,3 m uitkraagt tot +29,8 m, de spits tot +35,6 m en de naald met de
  windvaan tot +38,8 m (36,1 m boven het maaiveld).
- De zuidtoren op de zuidhoek: rond, 4,4 m tot +14,3 m, de bovengeleding van
  3,9 m tot +25,6 m, een rand onder 45 graden tot +26,4 m, de kegelspits van
  4,1 m tot +33 m en de naald tot +37,9 m.
- De lage vleugels naast de torens met een schilddak dwars op de zaal (noord:
  goot +11 m, nok +15,7 m; zuid: goot +7,3 m, nok +11,3 m).
- Achter de zaal: de tussenbouw met een hoge vleugel aan de noordkant (nok
  +27,5 m) en lage delen tot +14 m, het ronde traptorentje aan de zuidkant
  (4,8 m, tot +22,5 m, spits en naald tot +35,9 m), de dwarsvleugel onder een
  zadeldak dwars op de as (goot +19,5 m, nok +27 m) en de vleugel daarachter
  langs de as (goot +15 m, nok +25,4 m).

Binnen de voetafdruk ligt 81,2 % van de DSM-cellen binnen 2 m van het model
(71,6 % binnen 1 m, mediaan +0,09 m); bij de zaal zelf 94,8 % (89,9 %
binnen 1 m, mediaan +0,16 m), bij de vleugels naast de torens 72,4 % en bij
de bouw achter de zaal 72,1 %. De torens wijken per cel het meest af: het
DSM ziet de steile leien spitsen nauwelijks en geeft rond de schacht
hoogtes tussen 11 en 24 m, terwijl de BAG-cirkels (straal 2,2 m) en de
frontale foto's de schachten en de brede voet van de spitsen tonen; de
toppen van het model (+38,8 en +37,9 m) zijn de hoogste AHN-punten.

Printbaar op 1:1000 zonder steun: de muren staan recht op, de daken lopen
onder 45 tot 67 graden omhoog, de torens worden per geleding smaller of
kragen onder 45 graden uit, de naalden zijn 0,9 m dik en de nissen hebben
een spitse bovenkant van 50 tot 60 graden. Alleen de uurwerkgeleding van de
noordtoren kraagt 0,3 m vlak uit; het script controleert dat geen ander vlak
boven de onderkant naar beneden wijst en dat alles op dezelfde onderkant
begint. Door die uitkraging gaat het pand als gesloten solid met
overhangopvulling door de export, zodat de nissen behouden blijven: een
uitsnede van 200 m op 1:1000 duurt circa 1,6 seconden (31,6 naar 34,6 cm³,
vooral de voet tot de onderplaat) en het vervangen pand zit niet meer in de
export. Het maaiveld van het model ligt 0,4 tot 0,6 m (noord) en 0,6 tot
0,8 m (Binnenhof en achterkant) onder het PDOK-maaiveld rondom; aan de
zuidkant bij het westelijke eind ligt een verdiept stuk (AHN NAP +1,8 m)
waar het PDOK-maaiveld tot 0,5 m onder het modelmaaiveld zakt, nog boven
de onderkant.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Ridderzaal) (grafelijke
zaal uit circa 1280-1288, inwendig 38,30 bij 17,89 m, muren van 1,20 m,
steunberen van 1,10 bij 1,55 m), het
[Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/17475)
(monument 17475), PDOK BAG (contour met de cirkels van de drie torens), PDOK
AHN (dsm en dtm 0,5 m via WCS: goot en nok van het zaaldak, de dakkapellen
als afwijkingen van het dakvlak, het portaal, de toppen van de torens, de
daken achter de zaal en het maaiveld), de PDOK-luchtfoto en twee frontale
foto's van de voorgevel op Wikimedia Commons (Denhaag ridderzaal.jpg en The
Hague Binnenhof - Ridderzaal.jpg). Geschat zijn de geledingen en breedtes van
de torens en de vorm van de spitsen (uit de foto's, geschaald op de breedte
van de voorgevel), de gevelnissen en het portaal, de hoogte van de
steunberen, de maten van de dakkapellen en de daken achter de zaal (uit het
AHN vereenvoudigd tot zadeldaken en vlakke blokken); de pinakels en
hogels op de topgevel, de arcaden en uurwerken van de torens, de open
portaalboog en de gevelindeling van de bouw achter de zaal zijn dicht of
weggelaten.

Licentie van het model: eigen werk op basis van open bronnen.
