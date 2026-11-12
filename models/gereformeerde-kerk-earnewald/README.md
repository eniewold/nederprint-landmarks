# Eben Haëzerkerk, Earnewâld

De op het bord als Gereformeerde Kerk aangeduide Eben Haëzerkerk werd in 1906 gebouwd. De zaalkerk heeft een kleine geveltoren, korte dwarsarmen en een lagere achteraanbouw. De vermelding 1915 op het bord volgt de BAG en wijkt af van de door dorpsbronnen genoemde bouwdatum 1906.

## Bronnen en maten

- [3DBAG, BAG-pand 0737100000022700](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0737100000022700) voor de plattegrond en dakvlakken.
- PDOK AHN DSM 0,5 m: maaiveld NAP -0,542 m, hoogste torenpixel NAP 11,636 m. Het model heeft de top op 12,18 m boven maaiveld. Het raster rond de top bevat geen gaten.
- [Friesland.nl](https://www.friesland.nl/nl/locaties/1372100899/eben-haezerkerk) voor naam en bouwjaar; [twee Wikimedia-foto's](https://commons.wikimedia.org/wiki/Category:Eben-Ha%C3%ABzerkerk_(Earnew%C3%A2ld)) voor de gevel en dakruiter.
- Vier zijden vergeleken met de PDOK-reconstructie en de schuine foto's. De dakruiter ontbreekt in de PDOK-reconstructie en is aan de hand van AHN en foto's toegevoegd.

## Model en schattingen

Oorsprong RD (192060, 571780), lengteas naar zuidoost. Het totale model meet circa 26,3 × 11,4 m; schipnok circa 10,03 m boven maaiveld. Schip, dwarsarmen en aanbouw zijn uit dakvlakken gevormd en verenigd. Dakruiterhoogte en -breedte en posities van de vensters zijn geschat uit foto en AHN. De smalle open lantaarn is voor 1:1000 als gesloten kern weergegeven, de top is tot 0,9 m verbreed en windwijzer en luifel zijn te dun en weggelaten.

## Export en controle

Genereer met `node scripts/generate-gereformeerde-kerk-earnewald.mjs --scale 1000` en met `--scale 100`. De STL's zijn één gesloten onderdeel met genus 0; de generator controleert de 45-gradengrens. De GLB staat in meters op RD en vervangt het BAG-pand. De 1:1000-afdruk meet circa 26,3 × 11,4 × 12,7 mm inclusief 0,5 mm grondinsteek.

De kaart is in perspectief gecontroleerd en de preview bevat de volledige kerk op 1:1000 zonder ondersteuning.
