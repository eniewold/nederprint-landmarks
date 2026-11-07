# Johannes de Doperkerk (Vledder)

Hervormde dorpskerk aan het Lesturgeonplein (nr. 4), een van de oudste kerken van Drenthe. De romaanse zadeldaktoren (circa 1350) is het oudste deel en een van de weinige zadeldaktorens in de provincie; het eenbeukige gotische schip werd vanaf 1425 tegen de toren gebouwd en het koor rond 1475 voltooid. Na een brand in 1621 stortte de kerk deels in en werd het dak vernieuwd; begin achttiende eeuw en rond 1820 is ze hersteld. Kerk en toren zijn rijksmonument 37474 en 37475. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters; vervangt BAG-panden 1701100000208934 (schip en koor) en 1701100000208933 (toren). Geen buurpand raakt de kerk (het dichtstbijzijnde pand, 1701100000205616, staat 8 m ten noordoosten).
- STL op 1:1000: circa 33,2 × 12,1 × 29,6 mm.
- Genereren: `node scripts/generate-johannes-de-doperkerk-vledder.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (210270; 541569), lat/lon 52,858470 / 6,207820, in het schip op maaiveld (NAP +7,4 m). +X loopt langs de nok van de toren naar het koor, onder −3,8 graden in RD (`xAxis` [0,9978; −0,06627]); +Y wijst naar de noordzijde. De gevels van schip, koor en toren lopen in de BAG-contour op 0,1 m na evenwijdig onder −3,8 graden, en de nokken van schip en toren liggen in het AHN-DSM evenwijdig daaraan. `groundHeight` 49,29 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` rond de kerk (oostkant, achter de sluiting); aan de west-, zuid- en noordkant ligt het maaiveld 0,2 tot 0,4 m hoger. `groundOffsetMetres` −0,1, onderkant 0,4 m onder maaiveld.

## Onderdelen

- **Schip en koor**: één zadeldak, nok NAP +22,55 m (+15,15 m) op 0,5 m ten noorden van de as, zuidschild helling 1,36 (53,7 graden), noordschild 1,41 (54,7 graden) (AHN-dwarsprofielen van u = −6 tot 13, mediaan over 3 m). Het schip is 10,3 m breed, goten +8,0 m (zuid) en +8,06 m (noord). Het koor is vanaf u = 5,9 smaller (9,25 m) onder hetzelfde dakvlak, dus met hogere goten (+8,5 en +9,0 m), zoals de verspringende goot op de foto's.
- **Sluiting**: driezijdig (BAG), met een schilddak van 1,93 (62,6 graden) vanaf de goot op +8,89 m (AHN langs de nok; het nokeinde ligt op u = 13,7).
- **Topgevel van het schip** naast de toren met een muurkap van 0,45 m breed, 0,25 m boven het dakvlak.
- **Steunberen**: de uitsprongen van de BAG langs zuid- en noordgevel (drie aan elke kant van het schip, één aan elke kant van het koor) en de diagonale hoekberen op de westhoeken van het schip en de vier hoeken van de sluiting, minstens 0,9 m breed. Die van het schip hebben één versnijding op vensterbankhoogte (+2,9 m), die van koor en sluiting twee (+2,6 en +5,6 m), alle met een schuine kap van 45 graden tot 0,6 m onder de goot (foto's RCE 20242929, Commons 2014 en VLEDDER JOHANNES DE DOPERKERK ZIJAANZICHT).
- **Vensters**: spitsboogvensters tussen de steunberen, drie in de zuidgevel van het schip, twee hogere in de zuidgevel van het koor, twee in de noordgevel van het koor en één in het oostvlak van de sluiting; hoge smalle spitsboognissen in de noordgevel van het schip; dichtgezette spitsbogen in het zuidoost- en noordoostvlak van de sluiting.
- **Plint** van 0,15 m rondom tot +0,9 m.
- **Toren**: 6,3 × 6,3 m (BAG), vier geledingen: rondboogfries op +5,5 tot +6,0 m (0,12 m uitstekend, onderkant 51 graden), band met een terugsprong van 0,1 m op +12,3 m, waterlijst met een terugsprong van 0,1 m op +18,3 m. Westdeur, twee galmgaten per zijde in de derde geleding en één galmgat in een spitsboognis per zijde in de vierde.
- **Zadeldak van de toren**: nok langs de kerkas op NAP +35,75 m (+28,35 m), goten op NAP +30,8 m (+23,4 m), helling 1,69 (59 graden) (AHN), topgevels naar west en oost met een muurkap van 0,25 m boven het dakvlak, pijlertjes van 0,9 m op de vier voeten van de topgevels (tot +24,4 m) en op beide toppen (tot +29,2 m).

## Geschat

- De hoogtes van rondboogfries, band en waterlijst van de toren (+6,0, +12,3 en +18,3 m) zijn uit de verhoudingen op vier foto's (RCE 20242926 en 20322630, Commons 2011 en 2014) geschat, geschaald op de gemeten goothoogte van het torendak (AHN). Wikipedia noemt 28,5 m voor de toren; het model komt met de pijlertjes op 29,2 m boven het laagste maaiveld (28,35 m tot de nok).
- Vensterbreedtes en -hoogtes, de deur, de galmgaten, de versnijdingen van de steunberen en de afmetingen van de pijlertjes zijn uit de foto's geschat. De noordgevel van het schip heeft volgens de foto VLEDDER JOHANNES DE DOPERKERK ZIJAANZICHT 2 smalle hoge nissen; hun aantal per travee is vereenvoudigd tot één.
- De nok van het schip is over de hele lengte recht genomen; het AHN wijkt over schip en koor hooguit 0,15 m af.

## Weggelaten of vereenvoudigd

- Vensters, deuren en galmgaten zijn blinde nissen met een spitse top (58 graden); maaswerk, galmborden en de spleetvensters van de toren (circa 0,2 m breed) zijn weggelaten.
- Het dakraampje op het zuidschild van de toren (kleiner dan 0,9 m), de windwijzer op de toren, het kruis op de sluiting, de muurankers, dakgoten en regenpijpen (kleiner dan 0,9 m of zonder reliëf).
- De bogen van het rondboogfries zijn als één doorlopende band gemodelleerd.

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 80 × 80 m bevat het model, zonder de twee PDOK-panden en zonder opvulling (zelfde volume als zonder steun). Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Wikipedia: Johannes de Doperkerk (Vledder)](https://nl.wikipedia.org/wiki/Johannes_de_Doperkerk_(Vledder))
- [Reliwiki: Vledder, Lesturgeonplein 4 - Johannes de Doperkerk](https://reliwiki.nl/index.php/Vledder,_Lesturgeonplein_4_-_Johannes_de_Doperkerk)
- Rijksmonumentenregister: [37474 (kerk)](https://monumentenregister.cultureelerfgoed.nl/monumenten/37474) en [37475 (toren)](https://monumentenregister.cultureelerfgoed.nl/monumenten/37475)
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Johannes_de_Doperkerk,_Vledder) (RCE 20242922, 20242926, 20242928, 20242929, 20322630; Johannes de Doperkerk Vledder.jpg; Vledder - Joh de Doper - 2014; VLEDDER JOHANNES DE DOPERKERK)
- BAG panden 1701100000208934 en 1701100000208933 (voetafdruk)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
