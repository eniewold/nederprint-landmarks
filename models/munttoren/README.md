# Munttoren (Amsterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `munttoren.glb` | Catalogusbron in meters: nodes `building:toren` (de toren met bovenbouw, lantaarn en kroon) en `building:wachthuis` (het wachthuis met de tussenvleugel en de doorgang), elk een gesloten solid |
| `munttoren-1-1000.stl` | Toren en wachthuis in één stuk op 1:1000, met de onderkant (2,5 m onder het maaiveld) op het printbed (28,5 × 8,2 × 37,7 mm) |
| `munttoren.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (121354,79, 486689,10), het hart
van de ronde toren (de cirkel door de BAG-contour, tevens het hoogste
DSM-punt), op het maaiveld van het Muntplein (NAP +2,2 m), en de
glTF-conventie Y omhoog. +X loopt langs het wachthuis naar het oosten
(RD-richting 2,0 graden, evenwijdig aan de lange gevels), zodat het wachthuis
aan -X ligt; +Y wijst naar het noorden, het Muntplein. Het maaiveld wordt
alleen 6 m ten noorden, oosten en zuiden van de toren bemonsterd
(`groundSamplePoints`, AHN NAP +2,1 tot +2,4 m), niet in de Amstel onder de
zuidgevel van het wachthuis en niet aan de lagere Singelkant (NAP +1,2 m).
`groundOffsetMetres` is 0, want alles begint al 2,5 m onder het maaiveld.
Vervangt de PDOK-reconstructie van `NL.IMBAG.Pand.0363100012168045` (de
toren) en `NL.IMBAG.Pand.0363100012253928` (het wachthuis met de
tussenvleugel).

Onderdelen (hoogtes boven het maaiveld, NAP +2,2 m):

- De ronde bakstenen toren van de Regulierspoort (straal 3,0 m, bovenaan
  2,9 m) tot 14,4 m met de band tot 14,9 m (0,2 m uitkragend), het vierkante
  aanbouwsel aan de noordwestkant tot 9,0 m met een dakje tot 11,5 m en het
  portaaltje aan de zuidoostkant tot 3,0 m met een tentdak tot 4,2 m.
- De achtkante bovenbouw van Hendrick de Keyser (5,3 m over de vlakken,
  naar boven 5,1 m) met in elk vlak een spitsboognis van 1,3 m breed, de
  gootlijst tot 20,4 m (5,6 m over de vlakken) en de ingesnoerde kap tot
  21,5 m.
- De uurwerkgeleding (4,0 m over de vlakken) tot 24,6 m met vier
  wijzerplaten van 2 m doorsnede, 0,25 m voor de gevels.
- De lantaarn (3,6 m over de vlakken) met een galmnis in elk vlak, de
  gootlijst tot 28,5 m (NAP +30,7 m), de kap tot 29,4 m, de kroon (straal
  1,15 m) tot 32,5 m, de bol tot 33,45 m en de windvaan tot 35,2 m (NAP
  +37,4 m, het hoogste DSM-punt).
- Het wachthuis aan de westkant (x = -23,9 tot -9,7, 7,7 m breed) met
  zadeldak, goot 8,3 m en nok 13,2 m (NAP +10,5 en +15,4 m), en de lagere
  tussenvleugel naar de toren (x = -9,9 tot de toren) met goot 6,8 m en nok
  9,4 m (NAP +9,0 en +11,6 m); de goten steken aan de noord- en zuidkant
  0,25 m over. Door de tussenvleugel loopt de voetgangersdoorgang van 3,2 m
  breed met een spitse top op 3,6 m, van het Muntplein naar het terras aan de
  Amstel, tot de onderkant open.

Vergelijking met het AHN-DSM: binnen de voetafdruk van het model ligt 84 % van
de 614 DSM-cellen binnen 2 m (mediaan +0,17 m, mediane absolute afwijking
0,35 m): het wachthuis 90 % (+0,15 m) en de toren 64 % (+0,49 m). Bij de
toren zitten de grote afwijkingen in de randcellen van de achtkante
bovenbouw en de lantaarn, die in het DSM half op de toren vallen, en in de
open lantaarn en de opengewerkte kroon, waar het DSM tussen de stijlen door
lager meet; de zuidhelft van de toren heeft geen DSM-cellen. Het model dekt
115 van de 119 DSM-cellen boven NAP +12 m binnen 5 m van het hart.

Printbaar op 1:1000 zonder steun: de muren en de toren staan recht op, de
geledingen springen naar boven terug, de daken lopen onder 50 graden of
steiler omhoog, de nissen en de doorgang hebben een spitse top (de ronde boog
gaat op 40 graden over in rechte stukken onder 50 graden) en de wijzerplaten,
de kappen en de kroon lopen steiler dan 45 graden uit; alleen de band boven
het metselwerk, de gootlijsten van de bovenbouw en de lantaarn (0,15 tot
0,2 m) en de goten van het wachthuis (0,25 m) kragen vlak uit. Het script
controleert dat er buiten die uitkragingen geen vlak vlakker dan 45 graden
naar beneden wijst en dat alles op dezelfde onderkant begint. De export van
een uitsnede van 120 m op 1:1000 duurt circa 0,8 seconden; toren en
wachthuis gaan er elk als gesloten solid met overhangopvulling doorheen
(766 naar 775 mm³ en 1658 naar 1699 mm³, de onderkant tot de onderplaat en
onder de uitkragingen) en de twee vervangen panden zitten niet meer in de
export. Het model staat op het laagste bemonsteringspunt (ten noorden van de
toren); de voet staat rond de toren 2,6 tot 2,7 m, langs de noord- en
westgevel van het wachthuis 1,7 tot 2,4 m en aan de Amstel 0,4 m of meer in
het terrein of het water.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Munttoren_%28Amsterdam%29)
(35 m hoog, toren van de Regulierspoort van 1480-1487, na de brand van 1618
in 1619-1620 voorzien van een achtkante bovenbouw en een open lantaarn,
wachthuis van Willem Springer uit 1885-1887, doorgang in 1938-1939),
[Rijksmonumentenregister 3729](https://monumentenregister.cultureelerfgoed.nl/monumenten/3729)
(ronde onderbouw, achtkante ommanteling, houten opbouw met open lantaarn en
carillon), PDOK BAG (de twee panden), PDOK BGT (het wachthuis zonder de
tussenvleugel en het voetpad door de doorgang), PDOK AHN (dsm en dtm 0,5 m
via WCS: metselwerk, bovenbouw, lantaarn, kroon, daken en maaiveld), de PDOK
luchtfoto en foto's op Wikimedia Commons (vanaf het Muntplein en de
Vijzelstraat). Geschat zijn de hoogtes van de band, de uurwerkgeleding, de
kroon en de bol (uit foto's, op het DSM afgesteld), de breedte en de hoogte
van de doorgang, de maten van de wijzerplaten en de nissen en de hoogte van
het aanbouwsel en het portaaltje. Vereenvoudigd: de open lantaarn en de
opengewerkte kroon zijn dicht (met blinde galmnissen en een massieve kroon),
de vergulde bollen op de hoeken van de lantaarn, de dakkapellen, de schoorstenen,
de vensters en de vlaggenmast zijn weggelaten, de bovenbouw is een
regelmatige achthoek met de vlakken op de assen, de ronde toren is een
cilinder en het wachthuis heeft eenvoudige zadeldaken met rechte topgevels.

Licentie van het model: eigen werk op basis van open bronnen.
