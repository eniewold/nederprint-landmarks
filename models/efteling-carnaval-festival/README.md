# Carnaval Festival (Efteling, Kaatsheuvel)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `efteling-carnaval-festival.glb` | Catalogusbron in meters: nodes `building:showhal` (de vlakke showhal met kroonlijst, plint, dakrand, lichtstraten en ventilatoren), `building:station` (de lagere ronde opstaphal in de zuidwesthoek), `building:entree` (de entreegevel met het rode doek, draperieën en franje, de reuzenkop met hoge hoed, strik en handen, Jokie, de poort, de toiletboog, de uitgangsdeur met boogbordje en het lage uitgangsgebouwtje), `building:wachtrij` (de lage overdekte wachtrij en toiletten met de uitsparing voor de boom, luchtkanalen en lichtkoepels) en `building:winkel` (Jokies Wereld met de veelhoekige pui, markies, blauwe lijst en kuif) |
| `efteling-carnaval-festival-1-1000.stl` | Het model op 1:1000 met de onderkant (1,8 m onder het plein) op het printbed (86,9 × 45,0 × 10,8 mm) |
| `efteling-carnaval-festival.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

Generator: [`scripts/generate-efteling-carnaval-festival.mjs`](../../scripts/generate-efteling-carnaval-festival.mjs)
(met de gedeelde hulpfuncties uit `scripts/efteling-kit.mjs`).

De GLB is in meters met de oorsprong op RD (131817, 407108), in de westhoek
van de showhal, op het maaiveld van het plein (NAP +9,45 m), en de
glTF-conventie Y omhoog. +X loopt langs de lange zuidgevel van de hal naar het
oost-noordoosten (11,67 graden linksom vanaf de RD-X-as), +Y loodrecht daarop
naar het noord-noordwesten; de entreegevel kijkt naar −Y, naar het plein met
Sirocco en Vogel Rok. Het terrein achter de hal (personeelsparkeerplaats) ligt
circa 1,6 m lager (NAP +7,8 m): de onderkant ligt daarom op 1,8 m onder het
plein en de vijf `groundSamplePoints` liggen allemaal op het plein voor de
entree en de winkel, `groundOffsetMetres` 0. Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0809100000017621` (het hele complex: hal van 1984, entree en
winkel van 1998). De panden `0809100000017626` (1991, dienstgebouwen met
zadeldaken achter het park) en `0809100000017624` (1997, loods ten noorden van
de parkeerplaats) horen niet bij de attractie. De Vogel Rok-gevel met de vogel
en het platte gebouwtje tussen die gevel en de hal staan niet in de BAG en
horen bij Vogel Rok; ze zitten niet in dit model.

Onderdelen (hoogtes boven het plein):

- De showhal (50,5 × 35 m, BAG-contour): wanden met een plint tot 0,5 m en een
  kroonlijst op 7,2–7,5 m op een kraag van 45 graden, dakrand op 8,1 m (AHN NAP
  +17,55 m), afgeronde noordhoeken (straal 5,1 m), elf lichtstraten met een
  zadeldakje en zeven ronde ventilatoren (luchtfoto) tot 8,65 m. Boven de
  opstaphal volgt de dakrand een flauwe boog (straal 32,6 m, uit de DSM).
- De opstaphal in de zuidwesthoek (12 × 16 m, afgeschuinde hoek), plat op
  7,0 m (AHN +16,45 m) met een kroonlijst en een lichtstraat.
- De entreegevel (20,8 m breed, 5,6 m hoog, AHN +15,05 m) met afdekking. Het
  rode doek (6,4 m breed, onderrand 4,0 m, bovenrand met twee zwieren tot 6,0 m)
  met een gele draperierol, franje van halve schijven en twee gele
  zijdraperieën tot 2,1 en 2,45 m. Daarachter op het dak de reuzenkop: hemd en
  strik, kop van 1,85 m met oren en rode neus, hoge hoed met rand tot 9,0 m
  (AHN +18,3 m; positie van de hoed op de luchtfoto); de linkerhand met drie
  vingers omhoog boven de middelste piek, de rechterhand op de rechterhoek, en
  Jokie (rood lijf, kraag, kop, neus, narrenkap met twee punten en bellen) op
  de linkerhoek. Onder het doek de spitse poort (2,4 × 3,65 m, nis 0,6 m),
  links de boog naar de toiletten, rechts de uitgangsdeur met het rode
  boogbordje. Het uitgangsgebouwtje ernaast is 2,8 m hoog.
- De wachtrij en toiletten (plat op 4,7 m, AHN +14,15 m) met een dakrand, de
  uitsparing van 4 × 4 m waar de boom door het dak steekt, de luchtkanalen
  (0,9 m breed) en tien lichtkoepels.
- De winkel Jokies Wereld: vier puifacetten 1,3 m achter de BAG-rand, de rode
  markies van 3,4 naar 2,75 m met een valletje tot 2,4 m, de blauwe lijst met
  gele onderrand tot 5,0 m, een rond naambord, en de uitgezaagde kuif tot 6,0 m
  met spitse torentjes tot 6,9 m en een ronde clownskop met rode neus tot
  7,1 m (AHN circa 7 m).

Printbaar op 1:1000 en 1:500 zonder steun: muren staan recht op; kroonlijsten,
afdekking, doek, draperieën, franje, markies, lijst en naambord rusten op een
kraag van 45 graden; kop, neus, hoedrand en de kraag van Jokie hebben een
onderkant van 45 graden en de vingers lopen steiler dan 45 graden omhoog. Poort
en toiletboog zijn spitse nissen, deur en vensters blinde nissen. De export
vult op 1:1000 0,01 % (hal), 0,65 % (opstaphal), 0,06 % (entree), 0 %
(wachtrij) en 1,5 % (winkel) op, op 1:500 0,01, 1,0, 0,08, 0 en 0,9 %. De STL
is 22,4 cm³ en één samenhangend deel.

Bronnen: PDOK BAG (het pand), PDOK AHN (DSM en DTM 0,5 m via WCS, als raster
in het stelsel van de hal), de PDOK-luchtfoto (8 cm), foto's op
[Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Carnaval_Festival)
(Category:Carnaval Festival en Category:Jokie, Jokies Wereld, Reizenrijk
(2024)) en [Eftepedia](https://www.eftepedia.nl/lemma/Carnaval_Festival).
Uit het AHN: alle dak- en gevelhoogtes, de voetafdruk van opstaphal, gevel en
uitgangsgebouwtje, de boog tussen hal en opstaphal, de hoogte van de hoed en de
kuif, en het lagere terrein achter de hal. Uit de luchtfoto: lichtstraten,
ventilatoren, kanalen, koepels, de markies en de positie van hoed en Jokie.
Geschat uit foto's (schaal uit de AHN-gevelhoogte en de hoedbreedte op de
luchtfoto): doek, draperieën en franje, de maten van kop, hoed, strik, handen
en Jokie, poort, toiletboog en uitgangsdeur, markies, lijst en kuif van de
winkel en de kroonlijsten. Weggelaten: de confettistippen en letters
(beschildering), de lantaarns, de boom zelf en de hekken. De opdracht noemde
torentjes en bolle daken op de entreegevel; die zijn er niet (foto's en AHN):
de gevel is een vlakke crèmekleurige wand met het doek en de reuzenkop; alleen
de kuif van de winkel heeft spitse torentjes.
