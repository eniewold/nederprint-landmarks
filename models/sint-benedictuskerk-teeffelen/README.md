# Sint-Benedictuskerk (Teeffelen)

Een vereenvoudigd, steunloos printbaar model van de kerk van de H. Benedictus, met schip, koorsluiting, noordelijke sacristie en toren. De huidige zaalkerk dateert uit 1657 en is later verbouwd; de toren heeft een afzonderlijke monumentregistratie.

## Bestanden en plaatsing

- `sint-benedictuskerk-teeffelen.glb`: gesloten bouwdeel in meters, Y omhoog.
- `sint-benedictuskerk-teeffelen.json`: catalogus, met vervanging van BAG-pand `0828100001452929`.
- `sint-benedictuskerk-teeffelen-1-100.stl` en `sint-benedictuskerk-teeffelen-1-1000.stl`: binaire printbestanden.
- `scripts/generate-sint-benedictuskerk-teeffelen.mjs`: reproduceerbare generator in meters.

Oorsprong RD (162128,5; 423336,0), X-as (0,9837; 0,1796) langs de kerk richting koor. Het grondvlak ligt 0,5 m onder het gemeten maaiveld van circa NAP +6,22 m. De contour en oriëntatie volgen BAG en dakvlakken, het AHN5 laat een torenmeting tot NAP +29,62 m zien. Het model eindigt op circa 23,8 m boven maaiveld; de fijne spits is geschat.

## Vorm en vereenvoudigingen

Het zadeldak, veelhoekige koor, schilddak van de sacristie, steunberen en de vier hoektorentjes zijn herkenbare afzonderlijke bouwdelen. Vensters en galmgaten zijn blinde nissen. Geschat zijn details en diepte van de nissen, de maten van de steunberen, torenbekroning en de sacristie. Balustrade, kruis, maaswerk en kleine dakvensters zijn weggelaten vanwege de 1:1000-printschaal; de hoektorentjes zijn hiervoor verbreed.

## Controle

De generator meldt `NoError`, één component en genus 0. Een gerichte plaatsings- en steuncontrole is geslaagd op 1:1000. Preview-exports met en zonder landmark bevatten de hele kerk. In de vergelijking zijn de vier hoeken naast de PDOK-reconstructie en schuine foto's bekeken: het model herstelt de torenspits en hoektorentjes en voegt gevelnissen, steunberen en het sacristiedak toe.

## Bronnen

- [3D BAG-pand 0828100001452929](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0828100001452929), contour en dakvorm.
- [AHN](https://www.ahn.nl/dataroom), hoogtebeeld AHN5 DSM en maaiveld.
- [Rijksmonumentenregister kerk 25917](https://monumentenregister.cultureelerfgoed.nl/monumenten/25917) en [toren 25918](https://monumentenregister.cultureelerfgoed.nl/monumenten/25918).
- [Wikimedia Commons: foto's van de kerk](https://commons.wikimedia.org/wiki/Category:Sint-Benedictuskerk_(Teeffelen)), inclusief achtergevel en sacristie.
