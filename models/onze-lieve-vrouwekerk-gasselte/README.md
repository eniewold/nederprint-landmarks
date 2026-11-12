# Onze-Lieve-Vrouwekerk (Gasselte)

Het Witte Kerkje in Gasselte is een laatmiddeleeuwse kerk, voor het eerst vermeld in 1328, met een houten dakruiter uit 1787. Het kerkgebouw is rijksmonument 15942.

## Bestanden en ligging

- `onze-lieve-vrouwekerk-gasselte.glb`: gesloten model in meters, glTF Y omhoog.
- `onze-lieve-vrouwekerk-gasselte.json`: oorsprong RD `[249104.5, 554824.7]`, X-as `[0.982, 0.189]` richting koor; vervangt BAG-pand `1680100000015525`.
- `onze-lieve-vrouwekerk-gasselte-1-100.stl` en `onze-lieve-vrouwekerk-gasselte-1-1000.stl`: binaire STL's in millimeters.
- Generator: `scripts/generate-onze-lieve-vrouwekerk-gasselte.mjs`.

## Onderdelen en aannames

De plattegrond en kapvlakken volgen BAG en 3D BAG; het schip met vijfzijdig koor en de vierkante dakruiter met tentdak zijn afzonderlijke bouwdelen. De AHN4-DSM meet 731 cellen binnen het BAG-vlak, waarvan 25 ontbreken; het grootste gat ligt bij de zuidwestelijke dakrand. De dakruiter wordt op aangrenzende cellen tot NAP +35,04 m gemeten; 3D BAG bereikt NAP +35,19 m. Het maaiveld ligt op circa NAP +17,78 m en de nok op circa NAP +28,23 m.

De dakruiter, galmgaten, raamopeningen en maatvoering van de koorvensters zijn vereenvoudigd geschat uit de meetgegevens en foto's. De spits is voor 1:1000 verbreed; windvaan en dun maaswerk zijn weggelaten. De vierzijdige vergelijking met de echte PDOK-gebouwtegel en vier foto's uit verschillende richtingen is uitgevoerd; de fotocamerahoeken zijn niet exact gelijk aan de renders.

## Controle en genereren

Het model heeft één gesloten component, genus 0 en meet ongeveer 21,0 × 9,1 × 17,7 mm op 1:1000. Een gerichte test controleert catalogus, BAG-vervanging, plaatsing, geslotenheid en overhangopvulling. De kaart is met en zonder landmarklaag bekeken; de schuine kaart toont het model en de aansluiting op het maaiveld. De volledige uitsnede is op 1:1000 zonder ondersteuning in de printpreview gecontroleerd.

```sh
node scripts/generate-onze-lieve-vrouwekerk-gasselte.mjs --scale 1000
node scripts/generate-onze-lieve-vrouwekerk-gasselte.mjs --scale 100
```

## Bronnen

- [Rijksdienst voor het Cultureel Erfgoed: Mariakerk, 15942](https://kennis.cultureelerfgoed.nl/index.php/Monumenten/15942)
- [Vrienden van het Witte Kerkje](https://www.vriendenwittekerkjegasselte.nl/)
- [3D BAG: pand 1680100000015525](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1680100000015525)
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0), DSM 0,5 m.
- [Wikimedia Commons: Onze-Lieve-Vrouwekerk Gasselte](https://commons.wikimedia.org/wiki/Category:Onze-Lieve-Vrouwekerk_(Gasselte))
