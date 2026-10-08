# Rijksmuseum van Oudheden (Leiden)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `rijksmuseum-van-oudheden.glb` | Catalogusbron in meters: node `building:museum` (het hele complex als gesloten solid) |
| `rijksmuseum-van-oudheden-1-1000.stl` | Het complex in één stuk op 1:1000, met de onderkant (0,5 m onder het maaiveld) op het printbed (62,0 × 60,1 × 19,5 mm) |
| `rijksmuseum-van-oudheden.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (93325, 463748), midden in het
complex, op het maaiveld (NAP +0,5 m), en de glTF-conventie Y omhoog; +X
wijst naar het oosten en +Y naar het noorden (de assen van RD). Het maaiveld
wordt op de kade aan het Rapenburg en de straten ten zuiden, oosten en noorden
bemonsterd (`groundSamplePoints`, AHN NAP +0,3 tot +0,6 m), niet in de gracht.
`groundOffsetMetres` is 0, want alles begint al 0,5 m onder het maaiveld.
Vervangt de PDOK-reconstructie van `NL.IMBAG.Pand.0546100000042566`
(Rapenburg 28, het hele complex).

Onderdelen (hoogtes in NAP; het maaiveld ligt op circa NAP +0,5 m), allemaal
binnen de BAG-contour, een parallellogram van circa 60 × 52 m:

- De vleugels langs de buitenrand onder mansardedaken: de goot op +11,0 m op
  de gevel, het steile dakvlak (53 graden) tot +16,1 m op 3,8 m binnen de
  gevel, vlak tot 6 m van de gevel en dan de glazen lichtstraat omlaag naar
  het dak van de noordhof op 9 m. Ten zuiden van de middenvleugel liggen de
  vleugels lager: het dakvlak loopt daar tot +14,8 m door in het platte terras
  naast de zuidhof (AHN).
- 25 dakkapellen op de mansardevlakken van de west-, zuid- en oostgevel, op de
  plaatsen uit de luchtfoto: 1,6 m breed, haaks op de gevel, met wanden tot
  +13,6 m en een zadeldakje tot +14,3 m.
- De overdekte noordhof onder een plat dak op +13,3 m, met ten oosten ervan de
  bredere oostvleugel, vlak op +16,0 m.
- De hogere middenvleugel tussen de hoven, plat op +19,5 m, het hoogste deel,
  in een dwarsvleugel op +16,1 m die de west- en oostvleugel verbindt.
- De zuidhof onder een scheef tentdak (glas aan de westkant, zink aan de
  oostkant) van het terras op +14,8 m naar een nok op +18,0 m die van
  zuidwest naar noordoost loopt.

Vergelijking met het AHN-DSM: binnen de voetafdruk van het model ligt 91 % van
de circa 11.300 DSM-cellen binnen 2 m (73 % binnen 1 m); de afwijkingen zitten
in de schoorstenen en installaties, de lichtstraten langs de noordhof en de
glasroeden van de zuidhof (gaten in het DSM).

Printbaar op 1:1000 zonder steun: alles staat recht op of loopt naar boven
smaller toe en de dakkapellen staan op het dakvlak, er kraagt niets uit; met
overhangopvulling blijft de STL op 42,8 cm³. In de preview van de
controle-uitsnede (132 m) staat het complex aan het Rapenburg op het maaiveld
en zit het vervangen pand niet meer in de export.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Rijksmuseum_van_Oudheden)
(herenhuis en voormalig begijnhof aan het Rapenburg), PDOK BAG (de contour van
het complex), PDOK AHN (dsm en dtm 0,5 m via WCS: de goot en de bovenkant van
de vleugels, de daken van de hoven, de middenvleugel en het maaiveld) en de
PDOK luchtfoto (de indeling van de daken, de nok van de zuidhof en de
plaatsen van de dakkapellen). Geschat zijn de maten van de dakkapellen, de
diepte van de vleugels en de breedte van het steile dakvlak. Vereenvoudigd:
de schoorstenen, de installaties, het rode pannendak tussen de oostvleugel en
de noordhof (als vlak dak op +16,0 m) en de gevels met vensters zijn
weggelaten, en de lichtstraat en het glazen dak van de zuidhof zijn dicht.
