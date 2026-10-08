# Hooglandse Kerk (Leiden)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `hooglandse-kerk.glb` | Catalogusbron in meters: node `building:kerk` (de hele kerk als gesloten solid) |
| `hooglandse-kerk-1-1000.stl` | De kerk in één stuk op 1:1000, met de onderkant (0,5 m onder het maaiveld) op het printbed (82,2 × 71,3 × 50,0 mm) |
| `hooglandse-kerk.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (93892,93, 463687,05), het hart van
de kruising, op het maaiveld (NAP +1,5 m), en de glTF-conventie Y omhoog. +X
loopt langs de as van de toren naar het koor (RD-richting 13,5 graden, net ten
noorden van oost); +Y wijst naar het noorden. Het maaiveld wordt op de
Nieuwstraat voor de toren, het plein ten zuiden van het schip en de straten
aan de noord- en oostkant bemonsterd (`groundSamplePoints`, AHN NAP +1,4 tot
+1,6 m). `groundOffsetMetres` is 0, want alles begint al 0,5 m onder het
maaiveld. Vervangt de PDOK-reconstructie van `NL.IMBAG.Pand.0546100000038521`.

Onderdelen (hoogtes in NAP; het maaiveld ligt op circa NAP +1,5 m), allemaal
binnen de BAG-contour:

- Het lage schip (10 m breed) met de goot op +17,8 m en de nok op +22,7 m,
  waarvan het dak in de laatste travee oploopt tot +28,5 m tegen de
  dwarsbeuk.
- De hoge dwarsbeuk (13,5 m breed, 67 m lang) met goot +27,6 m en nok
  +38,6 m.
- Het noord- en zuidportaal aan de koppen van de dwarsbeuk: de topgevel (1 m
  dik) steekt 1,5 m boven de goot en 1,6 m boven de nok uit, met pinakels op
  de hoeken en halverwege de schuine kanten en een makelaar tot +41 m (AHN
  aan de zuidkant tot +40,9 m). Op de hoeken staan achtkante traptorens
  (2,6 m) tot +32 m met spitsen tot +36,7 m (noord) en +38,5 m (zuid), op de
  plaatsen uit de BAG-contour. In de gevel een spitsboogvenster van 6,4 m
  breed tot +27,5 m (nis van 0,5 m) en het portaal als spitsboognis tot
  +8,9 m, aan de noordkant 0,9 m diep zoals in de BAG.
- Het hoge koor (13,7 m breed) met goot +28,5 m en nok +38,4 m en de
  veelhoekige koorsluiting met een schilddak; daaromheen de kooromgang met
  een lessenaarsdak van +19,5 m tot +15,5 m.
- De zijbeuken langs schip, koor en dwarsbeuk met per travee (6 m langs het
  schip, 5,5 m langs het koor, 6,5 m langs de dwarsbeuk) een dak dwars op de
  muur, goot +16,2 m en nok +19,5 m, met een schild naar buiten; in de hoeken
  tegen de kruising plat op +17,7 m.
- De torenstomp aan de westkant (5 × 7 m) tot +28,3 m met een tentdak tot
  +33 m en het lage portaal ervoor (lessenaarsdak +9 tot +12,3 m).
- De dakruiter op de kruising: een achtkante lantaarn van 3 m tot +44 m en
  een spits tot +51 m, het hoogste punt.
- De lage aanbouwen ten zuiden van het koor en op de zuidoosthoek (+10 m).

Vergelijking met het AHN-DSM: binnen de voetafdruk van het model ligt 87 % van
de circa 11.500 DSM-cellen binnen 2 m (74 % binnen 1 m, mediaan +0,04 m); de
afwijkingen zitten in randcellen langs gevels en goten, in de zijbeuken in de
hoeken bij de kruising en in het DSM-gat op de zuidhelling van het koor.

Printbaar op 1:1000 zonder steun: de muren staan recht op, de daken van
dwarsbeuk en koor lopen onder 58 graden omhoog, die van schip en zijbeuken
onder 45 tot 50 graden en de lessenaarsdaken flauwer maar naar boven; toren
en dakruiter worden naar boven smaller en er kraagt niets uit. Met
overhangopvulling op een uitsnede van 200 m op 1:1000 blijft het volume gelijk
(69,9 cm³); de STL met de portalen blijft met overhangopvulling op 71,3 cm³. In de preview van de controle-uitsnede (132 m) staat de kerk op
het maaiveld en zit het vervangen pand niet meer in de export.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Hooglandse_Kerk) (gotische
kruiskerk vanaf 1377, 70,7 × 65,7 m, laag schip en lage toren tegen het hoge
koor en transept), PDOK BAG (de contour met steunberen, toren en aanbouwen),
PDOK AHN (dsm en dtm 0,5 m via WCS: de dwarsprofielen van schip, dwarsbeuk en
koor, de daken van de zijbeuken en de kooromgang, de toren, de dakruiter, de
aanbouwen en het maaiveld) en de PDOK luchtfoto. Geschat zijn de lantaarn en
de spits van de dakruiter (het DSM mist de dunne punt), de grenzen van de
travees, de vorm van het oplopende dak tussen schip en dwarsbeuk en bij de
portalen het aantal pinakels, de hoogte van de traptorenrompen en de maten
van venster en portaal (foto's op Wikimedia Commons van het noord- en
zuidportaal). Vereenvoudigd: de toren heeft een tentdak, de steunberen lopen
tot +9 m, de aanbouwen hebben één plat dak, en de overige vensters, het
maaswerk en de dakkapellen zijn weggelaten.
