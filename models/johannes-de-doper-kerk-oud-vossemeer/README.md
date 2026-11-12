# Johannes de Doper kerk, Oud-Vossemeer

Kruiskerk met schip, breed dwarsschip en ingebouwde westtoren met spits. De hoofdvolumes zijn als afzonderlijke bouwdelen met vlakke zadeldaken opgebouwd en verenigd tot één gesloten bouwdeel.

## Bronnen en maten

- [3D BAG pand 0716100000212487](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0716100000212487) geeft de contour en daknokken: schip circa NAP +14,4 m, dwarsschip NAP +14,7 m en maaiveld NAP +0,402 m.
- PDOK AHN DSM 0,5 m meet de westspits tot NAP +24,07 m; het model eindigt op 23,67 m boven maaiveld met een afgevlakte punt voor de print.
- [Rijksmonument 35374](https://monumentenregister.cultureelerfgoed.nl/monumenten/35374) en de [plaatselijke kerkgeschiedenis](https://hervormd-oud-vossemeer.nl/johannes-de-doper-kerk/) beschrijven de kerk en bouwgeschiedenis.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Hervormde_kerk_(Oud-Vossemeer)) bevat recente schuine opnamen van de west- en zuidgevel en historische RCE-opnamen van de overige gevels. De 3D BAG en PDOK ondersteunen de huidige plattegrond aan de minder goed gefotografeerde zijden.

De precieze positie en maat van steunberen, nissen, westtorenovergang en koorsluiting zijn op basis van AHN, PDOK en foto's geschat. Het uurwerk, windvaan, dunne kozijnen en kleine dakramen zijn wegens de schaal vereenvoudigd of weggelaten; ramen en klankopeningen zijn blinde nissen.

## Bestanden en controles

De GLB heeft één node `building:kerk` en vervangt BAG-pand `NL.IMBAG.Pand.0716100000212487`; oorsprong RD (72531, 398624), X-as (0,9947, −0,102). STL's zijn op 1:100 en 1:1000 beschikbaar. Regenereer met `node scripts/generate-johannes-de-doper-kerk-oud-vossemeer.mjs --scale 100` en daarna `--scale 1000`.

Het model is één gesloten manifold zonder onprintbare ondervlakken; de gerichte test controleert componenten en ondersteuning op 1:1000. Vier renders zijn vergeleken met PDOK en beschikbare schuine foto's; de historische foto's tonen niet noodzakelijk elk later detail. De kaart en preview-export van de volledige uitsnede zijn gecontroleerd. In de directe omgeving van de kerk zijn geen afzonderlijke PDOK-panden aangetroffen die het model overlappen.
