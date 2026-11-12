# Hervormde Gemeente (Hollandscheveld)

Neoclassicistische zaalkerk uit 1851 met geveltoren en aangesloten achtercomplex; rijksmonument 22262. Het model vervangt BAG-pand 0118100000126326, inclusief de bijgebouwen die binnen hetzelfde pand vallen.

## Bestanden en ligging

- `hervormde-gemeente-hollandscheveld.glb` en `.json`: model en catalogusmetadata in meters, oorsprong RD (232935, 524982), X-as (0,99885, −0,048) langs de kerk naar het achtercomplex.
- `hervormde-gemeente-hollandscheveld-1-100.stl` en `hervormde-gemeente-hollandscheveld-1-1000.stl`: gesloten printmodellen in millimeters.
- Generator: `scripts/generate-hervormde-gemeente-hollandscheveld.mjs`.

Het gebruikte maaiveld is NAP +13,398 m; de schipnok ligt op ongeveer NAP +28,05 m en de torentop op circa NAP +37,85 m. De onderkant ligt 0,5 m onder het plaatsingsniveau om aan te sluiten op het terrein. Schip, toren, verbinding en achtergebouwen zijn als afzonderlijke bouwdelen met hun dakvlakken opgebouwd.

## Aannames en controle

Afmetingen van de torengeledingen, spits, vensters, ingangen en achterbouw zijn afgeleid uit AHN en foto's en vereenvoudigd. De open torenlantaarn is als printbaar gesloten volume met blinde nissen weergegeven; de te dunne windvaan, leuningen en raamroeden zijn weggelaten. De AHN-DSM bevat binnen de BAG-contour 2817 geldige cellen en geen gaten.

De generator levert één gesloten component, genus 0 en 566 driehoeken; het model meet 56,5 × 22 × 24,95 mm op 1:1000. Vier modelkanten zijn naast de echte PDOK-gebouwtegel en de beschikbare gevelbeelden beoordeeld; de foto's tonen voornamelijk de voorzijde en niet alle hoeken afzonderlijk. Het model voegt vensters, ingangen en torenspits toe aan de PDOK-massa. De modeltest controleert de catalogusplaatsing, geslotenheid en overhang op 45°. De kaart is met en zonder landmarklaag en schuin bekeken; de volledige uitsnede is op 1:1000 zonder ondersteuning in de printpreview gecontroleerd.

## Bronnen

- [Rijksmonumentenregister 22262](https://monumentenregister.cultureelerfgoed.nl/monumenten/22262), [RCE](https://kennis.cultureelerfgoed.nl/index.php/Monumenten/22262) en [Drents erfgoed](https://drenthe.erfgoedcms.nl/drenthe/plaats/hollandscheveld): identiteit, geschiedenis en gebouwtype.
- [3D BAG pand 0118100000126326](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0118100000126326): contour en dakvlakken; [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0), DSM 0,5 m: hoogten en meetdekking.
- [Wikimedia Commons: huidige kerk](https://commons.wikimedia.org/wiki/File:Hervormde_kerk_van_Hollandscheveld.jpg) en [RCE-gevelbeeld](https://commons.wikimedia.org/wiki/File:Exterieur_-_Hollanscheveld_-_20113809_-_RCE.jpg).
