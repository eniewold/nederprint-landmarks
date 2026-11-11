# Koogerkerk (Zuid-Scharwoude)

Een printbaar model van de Koogerkerk, de hervormde (PKN-)kerk aan de Koog in Zuid-Scharwoude (gemeente Dijk en Waard), rijksmonument 23928. Het gepleisterde eenbeukige schip met driezijdige koorsluiting dateert van 1819 en verving een tufstenen voorganger. Nadat de toren in 1905 was ingestort, werd de kerk ingekort en kreeg ze een bakstenen westgevel met een half ingebouwde geveltoren en naaldspits. Tegen de koorsluiting staat een latere aanbouw met zadeldak, die in de BAG bij hetzelfde pand hoort.

## Bestanden

- `koogerkerk-zuid-scharwoude.glb`: gesloten model in meters, Y omhoog, één node `building:kerk`.
- `koogerkerk-zuid-scharwoude.json`: catalogusitem; vervangt BAG-pand 0416100000203769.
- `koogerkerk-zuid-scharwoude-1-100.stl` en `koogerkerk-zuid-scharwoude-1-1000.stl`: printmodellen in millimeters, Z omhoog, vanaf 0,5 m onder maaiveld.
- Generator: `scripts/generate-koogerkerk-zuid-scharwoude.mjs`.

## Oorsprong en oriëntatie

De oorsprong ligt op RD (116251.977, 523157.569), midden in het schip, op maaiveld (NAP +0,40 m). De lokale X-as (0,99805; 0,06238) loopt langs de nok naar het oosten. Dat is 3,6 graden, gemeten aan de langsmuren in de BAG en aan het dwarsprofiel in het AHN5-DSM. Y wijst naar het noorden.

De oostgevel van de aanbouw staat op de oever van een sloot. Het AHN-DTM ligt 0,5 m buiten die muur op NAP −1,2 tot −1,35 m. Daarom loopt de vlakke onderkant door tot 1,8 m onder maaiveld. Het maaiveld wordt gemeten op negen `groundSamplePoints` rond het schip en de toren (AHN-DTM NAP +0,33 tot +0,77 m), niet op de bbox-hoeken in de sloot. `groundOffsetMetres` is 0.

## Onderdelen

- Schip en koor als één lichaam, 9,73 m breed. De muren lopen tot de goot op NAP +9,0 m. Het zadeldak (circa 48 graden) loopt tot de nok op NAP +14,35 m. De driezijdige koorsluiting heeft drie dakschilden naar het eind van de nok.
- Westgevel met een verhoogde gevelafdekking langs beide dakschilden en hoekpijlers die als schouderstukken tot boven de goot doorlopen.
- Steunberen (lisenen van 0,9 × 0,8 m met een schuine afdekking) in vier traveeën aan beide zijden en op de twee hoeken van de koorsluiting.
- Geveltoren van 3,45 m in het vierkant, 1,2 m voor de westgevel. De schacht loopt tot NAP +19,25 m, met daarop een kroonlijst op een schuine kraag. Daarboven staan vier wimbergen over de volle torenbreedte (top NAP +21,15 m), vier hoekpinakels en een achtzijdige naaldspits tot NAP +29,6 m.
- Blinde nissen van 0,3 tot 0,35 m diep:
  - rondboogvensters in elke travee en in de schuine zijden van het koor;
  - twee spitsboogvensters in de westgevel;
  - de torendeur met boogveld en het grote spitsboogvenster in de toren;
  - galmgaten op alle vier de torenzijden.
- Aanbouw aan de oostzijde: goot NAP +4,9 m, nok NAP +6,57 m, nok noord-zuid, met topgevels. Een plat verbindingsstuk op NAP +3,6 m sluit hem aan op de koorsluiting.

## Geschat en weggelaten

Gemeten:

- voetafdruk, steunbeerposities en torenmaat uit de BAG;
- goot, nok, dakhelling en de daken van de aanbouw uit de 3D BAG (LoD2.2) en het AHN5-DSM;
- de spitshoogte uit het AHN5-DSM (29,3 m op 0,5 m-raster; de punt is iets hoger geschat).

Geschat uit foto's: de hoogtes van de kroonlijst en de wimbergen, de pinakels, de spitsvoet en alle venster- en nismaten. Weggelaten (kleiner dan 0,9 m of plat): de wijzerplaten, de ruitvormige siersteentjes, het maaswerk, de windvaan, het kruis op het koor, de goten en de ramen van de aanbouw.

## Controle

De generator levert één gesloten component met genus 0. Het volume is 4540 m³ inclusief de voet onder maaiveld; boven maaiveld komt het overeen met de 3D BAG (3984 m³). De catalogus- en printtest (`Koogerkerk Zuid-Scharwoude catalogue and print test` in de webshop) slaagt. Die controleert de plaatsing via de catalogus, of het model één solid is, en of de opvulling bij 45 graden printbare overhang minder dan 3 % volume toevoegt. Een plaatsing met AHN-DTM als maaiveld zette de onderkant op NAP −1,47 m (onder de slootkant) en de spitspunt op NAP +29,5 m. Renders van vier kanten zijn naast de 3D BAG-reconstructie en de RCE- en Commons-foto's gelegd. Op de kaart nakijken: de aanbouw aan de slootkant (geen zwevende oostgevel) en de hoogte van de spits.

## Bronnen

- [BAG / 3D BAG pand 0416100000203769](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0416100000203769)
- [Rijksmonumentenregister 23928](https://monumentenregister.cultureelerfgoed.nl/monumenten/23928)
- [Wikimedia Commons, Nederlands Hervormde Kerk Zuid-Scharwoude](https://commons.wikimedia.org/wiki/File:Nederlands_Hervormde_Kerk,_Zuid-Scharwoude.jpg) en [RCE-foto toren](https://commons.wikimedia.org/wiki/File:Toren_-_Zuid-Scharwoude_-_20225773_-_RCE.jpg)
- [OpenStreetMap way 51226423](https://www.openstreetmap.org/way/51226423)
- [AHN hoogtegegevens](https://www.ahn.nl/dataroom) (DSM als controle van nok en spits, DTM voor het maaiveld)
- [BGT](https://api.pdok.nl/lv/bgt/ogc/v1) (sloot en oever ten oosten van de aanbouw)
