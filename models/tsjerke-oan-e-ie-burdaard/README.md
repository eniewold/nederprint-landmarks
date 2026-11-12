# Tsjerke Oan'e Ie, Burdaard

Zaalkerk uit 1892/93 aan de Ds. R.H. Kuipersstraat, met houten geveltoren, later voorportaal en achteraanbouw. De kerkelijke gemeente dateert de aanbouw in 1919/20 en het voorportaal in 1926.

## Bronnen en maten

- BAG-pand 1722100000002813; [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1722100000002813) voor de plattegrond en dakvlakken.
- PDOK AHN DSM 0,5 m: maaiveld NAP 0,668 m, kerknok NAP circa 12,97 m en grootste waarde bij de torenspits NAP 24,793 m; het model heeft de top op 24,3 m boven maaiveld. De punt en windwijzer zijn niet volledig gemeten.
- [Kerkelijke gemeente, bouwgeschiedenis en foto](https://www.kerkburdaard.nl/tsjerke-ie/); [Religiana](https://religiana.com/web/tsjerke-oane-ie) voor houten geveltoren en portaal.
- PDOK 3D-reconstructie vergeleken vanuit vier richtingen: het dak, de asymmetrische achteraanbouw en voorportaal zijn herkenbaar. De spits ontbreekt in de PDOK-reconstructie en is uit AHN en de foto gereconstrueerd.

## Modellering en schattingen

Lengteas vanaf de voorgevel naar het noordwesten, oorsprong RD (187754, 589892). Het schip is ongeveer 24,4 × 12 m en de nok 12,3 m boven maaiveld; de hele kerk inclusief aanbouwen is circa 41 m lang. Dakvlakken en bouwdelen zijn afzonderlijk gevormd en verenigd. Torenbreedte, spitsvorm, galmgaten en vensterposities zijn op basis van de foto geschat; de galmgaten zijn ondiepe nissen in een gesloten kern. Windwijzer en kleine dak- en geveldetails zijn op schaal 1:1000 te dun en weggelaten; de spits is aan de top tot 0,9 m verbreed.

## Export en controle

Genereer met `node scripts/generate-tsjerke-oan-e-ie-burdaard.mjs --scale 1000` en met `--scale 100`. De STL's zijn één gesloten onderdeel met genus 0; de generator controleert de ondervlakken op de 45-gradengrens. De GLB staat in meters op RD en vervangt het BAG-pand. De 1:1000-afdruk van het model meet circa 41 × 12 × 24,8 mm inclusief 0,5 mm grondinsteek.


De kaart is in perspectief gecontroleerd en de preview bevat de volledige kerk op 1:1000 zonder ondersteuning.
