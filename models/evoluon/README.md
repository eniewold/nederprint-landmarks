# Evoluon (Eindhoven)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `evoluon.glb` | Catalogusbron in meters: één node `building:evoluon` met schotel, dakkapellen, trommel en kolommen |
| `evoluon-1-1000.stl` | Het gebouw in één stuk op 1:1000, met de voet op het printbed (77,5 × 77,5 × 31,4 mm) |
| `evoluon.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong in het hart van de schotel op het maaiveld
(NAP +18,8 m) en de glTF-conventie Y omhoog; het model is noord-georiënteerd
(+X oost, +Y noord). Het hart is uit het AHN bepaald (de koepel is rond dat punt
het meest rotatiesymmetrisch). Het maaiveld wordt op drie punten in het gras
ten noorden van de schotel bemonsterd (`groundSamplePoints`), niet op de
gebouwen ernaast. Het catalogusitem vervangt BAG-pand
`NL.IMBAG.Pand.0772100000294873`; de gebouwen rond de schotel
blijven staan.

De onderschaal loopt maar circa 18 graden op. Het model houdt die echte vorm,
zodat de kaart klopt; de export zet er met de optie ‘Printbare overhang’ een
kraag onder de ingestelde hoek onder, zoals bij het Kraaiennest van de Euromast.
Op 1:1000 is dat bij 45 graden een kegel (op 3 mm hoogte een straal van 26 m)
en bij 65 graden een bijna zwevende schotel (17 m, net buiten de kolommen).
Daarom zit alles in één node.

Onderdelen in het model (hoogtes in NAP):

- Schotel van 77,5 m doorsnede (BAG; Wikipedia: 77 m) als omwentelingslichaam:
  het kapje tot +49,7 m, de koepel van +46,9 m op straal 5 m naar +37,3 m op
  straal 34,5 m (AHN, mediaan per straal) en de rand op +35,0 m tot straal
  38,75 m, met de onderkant van de rand op +34,0 m.
- 48 dakkapellen langs de rand, 2,4 m breed, van straal 33,5 tot 37,6 m, met de
  bovenkant op de verlengde koepellijn (AHN: hoogste punten tot +35,9 m op
  straal 37 m, daartussen de rand op +35,0 m; de luchtfoto toont de tanden).
- Onderschaal: vlakke onderkant op +27,7 m tot straal 17,5 m, dan flauw oplopend
  naar de rand (foto, schaal uit de diameter).
- Glazen trommel van 30 m doorsnede en tien V-kolommen op 36 graden onderling
  (foto), van de grond tot in de onderschaal.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Evoluon) (Kalff en De
Bever, 1966, 77 m, V-kolommen, twee schalen),
[Rijksmonumentenregister 532277](https://monumentenregister.cultureelerfgoed.nl/monumenten/532277),
PDOK BAG (contour), PDOK AHN (dsm en dtm 0,5 m via WCS: hart, koepelprofiel,
kapje, dakkapellen, rand en maaiveld), de PDOK luchtfoto en Wikimedia
Commons-foto's (`Cmglee Evoluon side.jpg`, `532277 Eindhoven Evoluon.jpg`) voor
de onderschaal, de trommel en de kolommen. Diameter en dakprofiel komen uit BAG
en AHN; de onderschaal, de trommel, het aantal en de vorm van de kolommen en de
vorm van de dakkapellen zijn uit foto's geschat. Het terras met de trappen, de
lichtstraat in het dak en de bijgebouwen zijn niet gemodelleerd.

Licentie van het model: eigen werk op basis van open bronnen.
