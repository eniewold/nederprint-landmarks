# Mariënburgkapel (Nijmegen)

Landmark voor de kapel van het voormalige klooster Mariënburg (circa 1431, rijksmonument 31158), BAG-pand `0268100000002938`. De kapel staat vrij op het Mariënburgplein; het model vervangt alleen dit pand.

## Bestanden

- `marienburgkapel-nijmegen.glb`: één node `building:kapel`, meters, Y omhoog.
- `marienburgkapel-nijmegen.json`: catalogusitem.
- `marienburgkapel-nijmegen-1-1000.stl`: los printbestand op 1:1000 in millimeters, Z omhoog.
- Generator: `scripts/generate-marienburgkapel-nijmegen.mjs`.

## Oorsprong en oriëntatie

Oorsprong RD [188023,94; 428622,31], midden tussen de lange muren. +X loopt langs de nok van de westgevel naar de koorsluiting (`xAxis` [0,9461; -0,3239], 18,9 graden onder het oosten, gemeten aan de muren in de BAG-contour). +Y wijst naar de noordgevel. z = 0 is het plein op NAP +31,65 m (AHN-DTM rondom); de voet loopt tot -0,5 m door, `groundOffsetMetres` is 0.

## Onderdelen

- Schip van 29,25 x 10,6 m met een driezijdige (3/8) koorsluiting, binnenstraal 5,3 m rond x = 11,55.
- Steil zadeldak van 60 graden met nok op NAP +55,08 m (z = 23,43). Daarop sluiten de drie koorschilden met dezelfde helling aan, met een pinakel op de top.
- Westgevel als puntgevel met een afdekking boven het dak en een schoorsteen met zadelkapje op de top.
- Dakruiter op x = -8,5 m: vierkante voet, achtkantige lantaarn met lijst, vier wimpergen en een achtkante naald tot z = 35,5.
- Vierkante traptoren aan de zuidzijde (BAG-uitbouw van 2,6 x 2,0 m) met een leien naald tot z = 20,95 (AHN NAP +52,3).
- Steunberen volgens de BAG-contour: zes aan de noordzijde en vijf naast de traptoren aan de zuidzijde, diagonale hoekberen aan de westgevel en radiale beren op de hoeken van het koor. Elke beer heeft een versnijding op 6,5 m en een schuine afdekking onder de goot.
- Plint met waterlijst op 2,6 m, en een daklijst als schuine kraag onder het overstek.
- Vijf dakkapellen: twee op elke lange zijde en één op het noordoostschild van het koor.
- Vensters en deur als blinde nissen van 0,3 tot 0,5 m:
  - spitsboogvensters in de zeven noordtraveeën, de drie koorzijden en de westgevel, plus een venstertje in de top van de westgevel;
  - lage vensters van de benedenkerk aan beide zijden;
  - de ingang met spitsboognis in de tweede noordtravee.

## Geschat en weggelaten

De nokhoogte, de dakhelling en de hoogte van de traptoren komen uit het AHN-DSM en de 3D BAG. De goot volgt uit nok en helling. De hoogte van de dakruiter, de lantaarn en de wimpergen is geschat uit foto's en de AHN-piek (NAP +65,5). Ook de romphoogte van de traptoren, de profielen van de beren, de plaats en maat van de vensters en de dakkapellen zijn uit foto's geschat. De zuidgevel van het schip heeft op foto's geen hoge vensters en is daarom op de lage vensters na dicht gelaten.

Weggelaten zijn het kruis en de haan op de dakruiter, het maaswerk, de pinakels op de lantaarn (kleiner dan 0,9 m) en de banieren aan de gevels. De lantaarnbogen zijn niet open uitgevoerd, omdat ze op 1:1000 te klein zijn.

## Controle

De generator maakt één gesloten volume met genus 0 en een vlakke voet. Het volume is 6756 m³; de 3D BAG LoD2.2 komt op 6719 m³. De printcontrole met `supportedSolid` op 1:1000 en 45 graden voegt geen opvulling toe (verhouding 1,00). Het model is van vier kanten vergeleken met de 3D BAG-reconstructie en met foto's uit het zuidwesten, het noorden en het zuidoosten.

Controleer op [de kaart](http://localhost:3000/kaart/51.84520/5.86645/200/1x1/0) de plaatsing, de traptoren aan de zuidzijde en de hoogte van de voet ten opzichte van het plein.

## Bronnen

- [Wikipedia: Mariënburgkapel](https://nl.wikipedia.org/wiki/Mari%C3%ABnburgkapel)
- [Rijksmonumentenregister 31158](https://monumentenregister.cultureelerfgoed.nl/monumenten/31158)
- [3D BAG-pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0268100000002938)
- [BAG-WFS (PDOK)](https://service.pdok.nl/lv/bag/wfs/v2_0)
- [AHN DSM/DTM 0,5 m via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0)
- [Foto's op Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Mari%C3%ABnburgkapel)
