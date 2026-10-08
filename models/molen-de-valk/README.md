# De Valk (Leiden)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `molen-de-valk.glb` | Catalogusbron in meters: node `building:molen` (romp, stelling, kap, staart, wiekenkruis en aanbouw als gesloten solid) |
| `molen-de-valk-1-1000.stl` | De molen op 1:1000 met een printsteun onder de onderste wiekpunten, met de onderkant (1 m onder het maaiveld) op het printbed (17,0 × 23,7 × 38,6 mm) |
| `molen-de-valk.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (93369,48, 464418,24), het hart
van de romp (het middelpunt van de cirkel in de BAG-contour), op het maaiveld
van het Valkenburger bolwerk (NAP +3,3 m), en de glTF-conventie Y omhoog; +X
wijst naar het oosten en +Y naar het noorden (de assen van RD). Het bolwerk
zit al in het PDOK-terrein en loopt naar de voet af tot NAP +1,7 m; het
maaiveld wordt daarom alleen op het bolwerk 10 tot 11 m rond het hart
bemonsterd (`groundSamplePoints`, AHN NAP +3,2 tot +3,4 m), zoals bij de
motte van de Burcht. `groundOffsetMetres` is 0, want de molen loopt 1 m onder
het maaiveld door. Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0546100000044130` (romp en aanbouw).

Onderdelen (hoogtes in NAP; het maaiveld ligt op circa NAP +3,3 m):

- De ronde stenen romp, aan de voet de BAG-cirkel van 6,36 m straal, taps
  toelopend tot 3,8 m onder de kap op +27,5 m.
- De achtkante stelling (apothema 8,5 m) als dichte plaat van 0,6 m met de
  bovenkant op +16,4 m (AHN; Wikipedia noemt een stellinghoogte van 14,6 m,
  gemeten vanaf de voet van het bolwerk), op een kraag van 50 graden vanaf de
  romp vanaf +12,1 m. De echte stelling is een open houten omloop op schoren.
- De rietgedekte kap tot +32,2 m (AHN), de as op +29,8 m en het wiekenkruis
  met een vlucht van 27,0 m als platen van 2,4 × 1,0 m in X-stand onder 50
  graden, 5,2 m oostelijk van het hart (zoals op de PDOK-luchtfoto). Het
  onderste wiekpunt ligt op +18,7 m, ruim boven de stelling.
- De staart van de achterkant van de kap naar de rand van de stelling.
- De aanbouw aan de noordwestkant binnen de BAG-contour met een zadeldak langs
  de lange as: goot +6,0 m, nok +9,0 m.

Een vergelijking met het AHN-DSM per cel zegt bij een molen weinig: het DSM
toont de wieken in een andere stand en de open stelling als losse punten.
Per straal rond het hart klopt het model wel: de kap op +32,1 tot +32,2 m in
het hart, de stelling met het 90e percentiel op +16,1 tot +17,1 m tussen 6,5
en 8,5 m van het hart en daarbuiten het maaiveld.

Printbaar op 1:1000 zonder steun: de romp loopt taps toe, de kraag onder de
stelling en de onderrand van de kap lopen onder 50 graden, de staart onder
circa 68 graden en de schuine wieken hangen onder 50 graden. Alleen de punten
van de onderste wieken hangen vrij: de export vult daar met overhangopvulling
een paaltje op (3,0 cm³ tegen 8,5 cm³ bij verticale opvulling op een uitsnede
van 200 m op 1:1000) en de STL heeft een eigen printsteun naar de onderplaat.
Op 1:1500 en grover komen die paaltjes net buiten de hoeken van de stelling
uit; sinds oktober 2026 eindigen ze daar op een voet op de stelling (een kegel
van 45 graden vanaf de hoek), in plaats van ernaast te zweven (1:2450) of tot
de onderplaat door te lopen (1:1500). Op precies 1:2500 zijn de wieken één
printlijn dik (0,4 mm) en komt er geen paaltje; de punt hangt dan 0,2 mm vrij.
In de preview van de controle-uitsnede (132 m) staat de molen op het bolwerk
en zit het vervangen pand niet meer in de export.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/De_Valk_%28Leiden%29)
(ronde stenen stellingmolen uit 1743, vlucht 27,0 m, stellinghoogte 14,6 m,
Rijksmonument 25655), PDOK BAG (de romp als cirkel en de aanbouw), PDOK AHN
(dsm en dtm 0,5 m via WCS: de kap, de stelling, de aanbouw en het maaiveld op
en rond het bolwerk), de PDOK luchtfoto (stand van kap en wieken) en foto's op
Wikimedia Commons (de molen vanaf de Singel, de aanbouw met de ingang).
Geschat zijn de straal van de romp onder de kap, de hoogte van de
bovenkant van de romp en van de as, de vorm van de kap, de breedte en dikte
van de wieken en de goot en nok van de aanbouw. Vereenvoudigd: de stelling
is een dichte plaat op een kraag, de wieken zijn dichte platen in X-stand
(de kap draait met de wind; de luchtfoto toont ze aan de oostkant), en de
vensters, deuren, de baliehekken en de schoren zijn weggelaten.
