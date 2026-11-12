# Hervormde kerk (Grolloo)

De hervormde kerk aan Hoofdstraat 19 is een waterstaatskerk uit 1853 en rijksmonument 482937. De afzonderlijke pastorie met haar berging hoort niet bij dit model.

## Bestanden en ligging

- `hervormde-kerk-grolloo.glb`: gesloten model in meters, glTF Y omhoog.
- `hervormde-kerk-grolloo.json`: RD-oorsprong `[241517, 550496]`, X-as `[0.9755, 0.2199]` langs de nok; vervangt BAG-pand `1680100000003506`.
- `hervormde-kerk-grolloo-1-100.stl` en `hervormde-kerk-grolloo-1-1000.stl`: binaire STL's in millimeters.
- Generator: `scripts/generate-hervormde-kerk-grolloo.mjs`.

## Onderdelen en aannames

De BAG-contour en 3D BAG geven de richting en afmetingen van de recht gesloten zaalkerk. De dakvlakken volgen de AHN4-DSM met maaiveld NAP +18,064 m, daknok NAP +27,591 m en torentop circa NAP +36,98 m. Alle 671 DSM-cellen binnen de contour zijn geldig. Het rijksmonumentenregister beschrijft vijf traveeën met rondboogvensters in de zijgevels.

Het model bevat het bakstenen schip met zadeldak en de geveltoren met vierkante houten opbouw, vereenvoudigde achthoekige lantaarn en spits. De open lantaarn is met blinde nissen weergegeven zodat hij op 1:1000 steunvrij en verbonden blijft; de spits is tot minstens 0,9 m verdikt. De maten van de torengeledingen, galmgaten, vensters en voordeur zijn op basis van AHN en voorgevelbeelden geschat; dunne raamstijlen en windvaan zijn weggelaten.

## Controle en genereren

De generator levert één gesloten component, genus 0, van circa 18,7 × 8,9 × 19,2 mm op 1:1000. Een gerichte test controleert catalogus, BAG-vervanging, plaatsing, geslotenheid en overhangopvulling. Vier aanzichten zijn naast de daadwerkelijke PDOK-gebouwreconstructie en beschikbare foto's geplaatst. Wikimedia/RCE bood drie voorgevelbeelden; een betrouwbare schuine foto van de achterzijde is niet gevonden, zodat de achterzijde vooral door BAG en PDOK is onderbouwd. De kaart is met en zonder landmarklaag en schuin bekeken; de volledige uitsnede is op 1:1000 zonder ondersteuning in de printpreview gecontroleerd.

```sh
node scripts/generate-hervormde-kerk-grolloo.mjs --scale 1000
node scripts/generate-hervormde-kerk-grolloo.mjs --scale 100
```

## Bronnen

- [Rijksmonumentenregister 482937](https://monumentenregister.cultureelerfgoed.nl/monumenten/482937)
- [Rijksmonumentenregister: afzonderlijke pastorie 482948](https://www.monumenten.nl/monument/482948)
- [Monumenten in Nederland: Grolloo](https://www.dbnl.org/tekst/sten009monu07_01/sten009monu07_01_0044.php)
- [3D BAG: pand 1680100000003506](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1680100000003506)
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0), DSM 0,5 m.
- [Wikimedia Commons: hervormde kerk Grolloo](https://commons.wikimedia.org/wiki/Category:Hervormde_kerk_(Grolloo))
