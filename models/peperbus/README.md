# Peperbus (Zwolle)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `peperbus.glb` | Catalogusbron in meters: node `building:kerk` (de Peperbus met de Onze-Lieve-Vrouwebasiliek, uit dakvlakken en bouwdelen) |
| `peperbus-1-1000.stl` | Toren en kerk op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (73 × 29 × 76 mm) |
| `peperbus.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De toren en de basiliek liggen in één BAG-pand, dus het model bevat beide. De GLB
is in meters met de oorsprong op RD (202696, 502952), het midden van de toren,
op het maaiveld (NAP +2,9 m), en de glTF-conventie Y omhoog. +X loopt van de
toren langs de nok van de kerk naar het koor (20 graden rechtsom vanaf de
RD-X-as, gemeten aan de normalen van de LoD2.2-dakvlakken) en +Y loodrecht
daarop. Het maaiveld wordt rond de toren en langs de kerk bemonsterd
(`groundSamplePoints`, NAP +2,9 tot +3,2 m); als geen van die punten in de
uitsnede valt, gebruikt de lader `groundHeight` 45,58 m (de ellipsoïdische
PDOK-terreinhoogte op die punten). Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0193100000000171`.

Onderdelen (hoogtes boven het maaiveld op NAP +2,9 m, 73 bij 29,1 m en 75,5 m
hoog met de onderkant):

- Onderbouw van de toren (u -6,35 tot 6,15 m): vierkant van 12,7 m in drie
  geledingen, op +18,6 en +34,8 m telkens 0,15 m teruggezet op een schuine
  waterlijst, met per zijde drie blinde spitsbogen per geleding (in de bovenste
  de middelste ondiep en de buitenste als galmgaten van 0,8 m diep).
- Eerste omgang op +52 m: een borstwering van 0,8 m tot +53,3 m met vier
  hoekpinakels.
- Achtkant van 9,8 m over de vlakke zijden van +51,5 tot +65 m met galmgaten op de
  vier hoofdzijden, een kroonlijst op een kraag van 0,3 m en de borstwering van
  de tweede omgang tot +66,1 m.
- De koepel (de peperbus): achtkantig, van 9,4 m op +66,2 m via 6,4 m op +68,8 m
  naar 2,8 m op +70,9 m, een lantaarn van 1,8 m tot +73 m en een bol tot +75 m.
  Het profiel volgt het AHN (+66 m op 4,8 m van de as, +70 m op 2,6 m, +75 m op
  de top).
- Kerk: schip (u 5,9 tot 39,4 m, 12,4 m breed), dwarsschip (u 39,2 tot 50 m, v
  -12,7 tot 13,8 m) en koor onder één nok op +28,5 m (55 graden, volgens het AHN
  en de 3D BAG); de nok van schip en koor loopt door de viering, zodat met het
  dwarsschip kilgoten in een kruis ontstaan. Topgevels aan beide kopse kanten
  van het dwarsschip (+29,3 m), een koor met een 3/8-sluiting rond (60,4, 0,5),
  steunberen langs het schip (1,1 bij 1,5 m), diagonale steunberen met een punt
  op de hoeken van het dwarsschip en steunberen met pinakels rond de sluiting.
  Lage kapellen naast het koor met een zadeldak (nok +9,5 en +8,8 m).
- Vensternissen als spitsbogen, 0,5 m diep: per travee in het schip, in de
  gevels van het dwarsschip en in de drie zijden van de sluiting.

Vergelijking met het AHN-DSM (raster op 0,5 m, alleen cellen boven 3 m met een
meetwaarde): 78,3 % ligt binnen 1 m en 85,5 % binnen 2 m. Het DSM heeft op de
leien daken van de kerk grote gaten; de afwijkingen zitten vooral op de randen
van de toren, de omgangen en de kapellen.

Printbaar op 1:1000: alle vlakken wijzen omhoog of staan verticaal, op de
spitsbogen en de kraag onder de tweede omgang na (steiler dan 45 graden). De
export vult op 1:1000 en 1:1500 niets bij en op 1:2500 0,5 %. De STL is 31,8 cm³,
heeft 2.224 driehoeken en is één samenhangend deel (status NoError, geslacht 0).
Dunste delen op 1:1000: de pinakels 0,8 mm en de top van de bol 0,9 mm.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Peperbus_%28Zwolle%29) (75 m,
omgangen op 51 en 65 m, koepel na de brand van 1815), PDOK BAG, PDOK AHN (dsm en
dtm 0,5 m via WCS), 3D BAG LoD2.2 (api.3dbag.nl), de PDOK luchtfoto en foto's op
Wikimedia Commons. Geschat zijn de hoogtes van de waterlijsten, het profiel van
de koepel tussen de AHN-punten, de lantaarn en de bol, de steunberen, de
kapellen en de nissen. Weggelaten: de open balustrades (dicht), de wijzerplaten,
het maaswerk en de banden van witte natuursteen.
