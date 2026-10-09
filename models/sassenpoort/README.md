# Sassenpoort (Zwolle)

Gesloten landmarkmodel van de poort met vier verschillende hoektorens, schilddak, dakruiter, mezekouw, gekanteelde weergang, dakkapellen en het huis dat hetzelfde BAG-pand deelt.

## Bestanden en plaatsing

- `sassenpoort.glb`: meters, Y omhoog; één node `building:poort, vier hoektorens, dakruiter en aangebouwd huis`.
- `sassenpoort.json`: catalogusplaatsing en exacte vervanging van BAG-pand `0193100000041732`.
- `sassenpoort-1-1000.stl`: millimeters op 1:1000, één verbonden solid en vlakke onderkant.
- Generator `../../scripts/generate-sassenpoort.mjs`.

RD-oorsprong `(203085.58, 502710.86)`, straatniveau NAP +2,86 m; lokale X-as `(0.6, -0.8)` naar de veldzijde. De hoofdroofnok volgt de X-as, bevestigd met luchtfoto, AHN en de historische plattegrond. Onderkant 0,8 m onder straatniveau; eigen maaiveldpunten buiten de muren en buiten de bomen. De panden `0193100000041731`, `0193100000041886` en `0193100000019581` blijven PDOK; alleen het poortpand wordt vervangen.

## Bouw en maten

De ronde veldtorenvoeten gaan via steile kragen over in achtkante bovenbouw; de stadszijdetorens zijn veelhoekig en staan op steunberen/uitkragingen. De oostelijke trapkoker is afzonderlijk opgebouwd. Het hoofdvolume heeft een schilddak, geen zadeldak tussen puntgevels. De kantelen hebben open tussenruimten. De mezekouw rust op een steile kraag en toont drie spaarbogen. De dakruiter heeft een schacht, wijzerplaatnissen, vier puntgeveltjes en een achtkante naald. Het aangebouwde huis heeft zijn eigen zadeldak en vereenvoudigde halsgevel.

BAG bepaalt de voetafdruk; de luchtfoto en plattegrond bepalen torenposities en nokrichting. AHN DSM/DTM van 0,5 m geeft maaiveld, dakhellingen, huisdak en torenhoogten. Hoofdnok 30,32 m boven straat, veldtorenspitsen 33,45 m, stadszijdetorenspitsen 31,25 m, dakruiter 43,85 m. De smalle spitstoppen zijn vanuit zichtbare AHN-dakvlakken en foto's iets boven de rastermaxima geëxtrapoleerd; dit is een schatting, geen landmeetkundige tipmeting. Windvanen en stangen zijn weggelaten.

Vensters, spaarbogen, kantelen, dakkapellen, kraagstenen en de huisgevel zijn uit de foto's en doorsneden vereenvoudigd. Nissen zijn 0,35 m diep; onderdelen circa 0,9 m of breder. Het doorlopende gewelf is spitser gemaakt voor steunvrij printen. De mezekouw heeft een draagkraag in plaats van een vlak vrijhangende onderkant. Kleine afgesloten holtes waar een nis achter een aansluitend bouwdeel kwam, zijn gevuld. Raamroeden, fijne beeldhouwwerken en goten onder 0,9 m zijn weggelaten.

## Controle

Generator: `NoError`, één verbonden solid, genus 4, 4276 driehoeken, 4473,2 m³; STL 20,03 × 18,11 × 44,65 mm op 1:1000. Werkelijke printvoorbereiding met 45° overhang: 4539 → 4545 mm³, circa 0,1% opvulling. De poortopening blijft doorlopend; geen steunmateriaal nodig buiten de normale printbare overhangvoorbereiding.

Regressietest in `tests/landmark-models.test.ts` controleert de exacte BAG-vervanging, alle vier spitstoppen, dakruiter, huisgevel, mezekouw en onderkant. Beide landmarktestsuites slagen met 274 tests.

Vier schuine aanzichten (−35°, 55°, 145°, 235°, 30° elevatie) zijn naast PDOK en schuine Commons/RCE-foto's bekeken. Aan beide veldzijden voegen ronde/achtkante geledingen, volledige spitsen, mezekouw, doorgang en vensters detail toe; aan beide stadszijden de uitgekraagde torens, volledige dakvorm, dakruiter, kantelen en huisgevel. PDOK geeft vlak afgesneden torens en onvolledige dakvlakken.

Volledige uitsnede 80 × 80 m geëxporteerd via `createModelBundle` op 1:1000: preview en 3MF, 137 objecten, 35624 driehoeken, 80 × 80 × 45,5 mm. Controlebeelden en exports blijven buiten de repo. Controlekaart: http://localhost:3015/kaart/52.50996314/6.09550510/160/1x1/0.

## Bronnen

- PDOK BAG WFS `0193100000041732`, actuele orthoHR, AHN DSM/DTM 0,5 m bbox `203040,502660,203150,502770`, geraadpleegd 2026-10-09.
- https://www.dbnl.org/tekst/kuil005noor01_01/kuil005noor01_01_0016.php — E.H. ter Kuile, figuur 21 met plattegronden en dwarsdoorsneden.
- https://monumentenregister.cultureelerfgoed.nl/monumenten/41788
- https://commons.wikimedia.org/wiki/File:Sassenpoort_in_Zwolle.jpg
- https://commons.wikimedia.org/wiki/File:Exterieur_Sassenpoort_-_Zwolle_-_20228707_-_RCE.jpg
- https://commons.wikimedia.org/wiki/File:Sassenpoort,_stadszijde_-_Zwolle_-_20228716_-_RCE.jpg
- https://commons.wikimedia.org/wiki/File:Zwolle_-_Sassenpoort_v1.jpg
