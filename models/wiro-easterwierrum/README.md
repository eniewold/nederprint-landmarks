# Sint-Wirokerk, Easterwierrum

Laat-neogotische voormalige rooms-katholieke pseudobasiliek met vierkante toren, achtkantige bekroning en spits. De kerk is ontworpen door Wolter te Riele en gebouwd in 1925/26; het bord vermeldt het BAG-startjaar 1924.

## Bronnen en maten

- [3DBAG, BAG-pand 0140100000166101](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0140100000166101) voor plattegrond en dakvlakken.
- PDOK AHN DSM 0,5 m: maaiveld NAP 0,532 m, hoogste punt in het spitsraster NAP 27,908 m; het raster direct rond de top is intact. Modeltop 27,38 m boven maaiveld. De PDOK-reconstructie reikt tot circa NAP 25,7 m en mist daarmee het bovenste deel van de spits.
- [Dorpsarchief bouw Sint-Wirokerk](https://www.easterwierrum.nl/bou-r-k-tsjerke-h-wiro/) en [Friesland.nl](https://www.friesland.nl/nl/locaties/1378773406/easterwierrum-oosterwierum); [Wikimedia-foto 1](https://commons.wikimedia.org/wiki/File:20190515_Sint-Wirokerk1_Oosterwierum.jpg) en [foto 2](https://commons.wikimedia.org/wiki/File:20190515_Sint-Wirokerk2_Oosterwierum.jpg).
- Schip, koor, sacristie en toren zijn vergeleken met vier aanzichten van de PDOK-reconstructie en de foto's.

## Model en schattingen

Oorsprong RD (178200, 569249), lengteas west-oost. Model circa 26,6 × 15,8 m; schipnok 14,06 m boven maaiveld. De kerkzaal, koorsluiting, sacristie, toren en steunberen zijn als bouwdelen en dakvlakken gevormd en verenigd. De torenbekroning is met een achthoek benaderd. Positie en breedte van de vensters en galmgaten zijn geschat; de spits is naar de AHN-maximumhoogte en foto's gereconstrueerd en aan de top tot 0,9 m verbreed. Kleine kruis- en geveldetails zijn op 1:1000 te dun en weggelaten.

## Export en controle

Genereer met `node scripts/generate-wiro-easterwierrum.mjs --scale 1000` en met `--scale 100`. De STL's bestaan uit één gesloten onderdeel met genus 0; de generator controleert de 45-gradengrens. De GLB staat in meters op RD en vervangt het BAG-pand. De 1:1000-afdruk meet circa 26,6 × 15,8 × 27,9 mm inclusief 0,5 mm grondinsteek.

De kaart is in perspectief gecontroleerd en de preview bevat de volledige kerk op 1:1000 zonder ondersteuning.
