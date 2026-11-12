# Dorpskerk (Eelde)

Middeleeuwse eenbeukige dorpskerk met een versmald driezijdig gesloten koor, steunberen en een westelijke dakruiter; rijksmonument 14491. De bestaande 3D-reconstructie van BAG-pand 1730100000003403 wordt vervangen.

## Bestanden en ligging

- `dorpskerk-eelde.glb` en `dorpskerk-eelde.json`: model en catalogusmetadata in meters, oorsprong RD (233754, 572450), X-as (0,964, 0,266) langs het schip naar het koor.
- `dorpskerk-eelde-1-100.stl` en `dorpskerk-eelde-1-1000.stl`: gesloten printmodellen in millimeters.
- Generator: `scripts/generate-dorpskerk-eelde.mjs`.

Het gebruikte maaiveld is NAP +4,282 m; de schipnok ligt op ongeveer NAP +18,28 m en de top van de dakruiter op circa NAP +24,08 m. De onderkant is 0,5 m onder het plaatsingsniveau om in het terrein aan te sluiten. Het model bestaat uit benoemde bouwdelen en dakvlakken, met een schild en een circa 1,2 m brede dakkapel aan de driezijdige koorsluiting.

## Aannames en controle

Vorm en afmetingen van de dakruiter, raam- en deuropeningen, de koordakkapel en steunberen zijn uit de beschikbare foto's, het AHN en 3D BAG benaderd; raamroeden en een zeer dunne windhaan zijn voor de 1:1000-print weggelaten. Nissen zijn ondiep en hebben een printbare punt. In het AHN-raster ontbreekt één cel binnen de BAG-contour; de omliggende dakvlakken zijn wel meetbaar.

De generator levert één gesloten component, genus 0 en 676 driehoeken; het model meet 31,8 × 12,8 × 20,3 mm op 1:1000. De vier modelkanten zijn vergeleken met de PDOK-gebouwtegel en RCE-gevelbeelden; het model voegt vensters, duidelijke koorsteunberen en een dakruiter toe. De foto's benaderen de renderhoeken en zijn niet vanuit exact dezelfde camerastand genomen. De modeltest controleert de catalogusplaatsing, geslotenheid en overhang op 45°. De kaart is met en zonder landmarklaag bekeken en schuin gecontroleerd op plaatsing en maaiveldaansluiting; de volledige uitsnede is op 1:1000 zonder ondersteuning in de printpreview bekeken.

## Bronnen

- [Rijksmonumentenregister 14491](https://monumentenregister.cultureelerfgoed.nl/monumenten/14491) en [Drents erfgoed](https://drenthe.erfgoedcms.nl/bezienswaardigheden/eelde): identiteit en kerkplattegrond.
- [3D BAG pand 1730100000003403](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1730100000003403): contour en dakvlakken; [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0), DSM 0,5 m: hoogten en meetdekking.
- [Wikimedia Commons, Dorpskerk Eelde](https://commons.wikimedia.org/wiki/Category:Dorpskerk_(Eelde)): actuele gevelbeelden en RCE-foto's van de vier kanten.
