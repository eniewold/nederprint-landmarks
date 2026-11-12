# H2O Evangelische Gemeenschap (Hoogeveen)

Het gebouw aan Brinkstraat 26 is het voormalige kantongerecht uit 1900, ontworpen door W.C. Metzelaar met chaletstijl-invloeden. Tegenwoordig gebruikt H2O Hoogeveen het gebouw.

## Bestanden en ligging

- `h2o-evangelische-gemeenschap-hoogeveen.glb`: gesloten model in meters, glTF Y omhoog.
- `h2o-evangelische-gemeenschap-hoogeveen.json`: RD-oorsprong `[228615, 527520]`, X-as `[0.9998, 0.02]`; vervangt BAG-pand `0118100000038775`.
- `h2o-evangelische-gemeenschap-hoogeveen-1-100.stl` en `h2o-evangelische-gemeenschap-hoogeveen-1-1000.stl`: binaire STL's in millimeters.
- Generator: `scripts/generate-h2o-evangelische-gemeenschap-hoogeveen.mjs`.

## Onderdelen en aannames

De BAG-contour en 3D BAG geven de ligging van het dwarse hoofdgebouw met middenrisaliet, de lage eenlaagse entree en de gekoppelde achtervleugel. De kappen zijn opgebouwd uit vlakken; de achtervleugel heeft een vlakke strook en een lange zadeldakstrook. AHN4 meet de nok rond NAP +22,1 m, de lage kap rond NAP +14,6 m en het maaiveld rond NAP +10,53 m. Binnen de BAG-contour ontbreken zes van de 2228 DSM-cellen, op de noordelijke dakrand; omliggende waarden en 3D BAG maken de kapvorm daar controleerbaar.

Gevelvensters en de maatvoering van de middenrisaliet en entree zijn vereenvoudigd geschat uit de foto en de PDOK-reconstructie; vensters zijn blinde nissen en dunne raamroeden en het balkonhek zijn weggelaten. Vierzijdige renders zijn naast de werkelijke PDOK-gebouwtegel gezet. Eén bruikbare schuine Wikimedia-foto toont de voorgevel en een zijde; van de andere zijden is geen bruikbare foto gevonden, zodat die hoofdzakelijk door PDOK, BAG en AHN worden onderbouwd.

## Controle en genereren

Het model heeft één gesloten component, genus 0 en meet circa 35,3 × 20,0 × 11,9 mm op 1:1000. Een gerichte test controleert catalogus, BAG-vervanging, plaatsing, geslotenheid en overhangopvulling. Kaartcontrole en preview moeten nog plaatsvinden.

```sh
node scripts/generate-h2o-evangelische-gemeenschap-hoogeveen.mjs --scale 1000
node scripts/generate-h2o-evangelische-gemeenschap-hoogeveen.mjs --scale 100
```

## Bronnen

- [H2O Hoogeveen: adres en gemeenschap](https://www.h2ohoogeveen.nl/contact/)
- [Monumenten in Nederland, Drenthe: voormalig kantongerecht](https://www.dbnl.org/tekst/sten009monu07_01/sten009monu07_01_0049.php)
- [3D BAG: pand 0118100000038775](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0118100000038775)
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0), DSM 0,5 m.
- [Wikimedia Commons: voormalig kantongerecht Hoogeveen](https://commons.wikimedia.org/wiki/File:Voormalig_kantongerecht_Hoogeveen.jpg)

De kaart is in perspectief gecontroleerd en de preview bevat het volledige gebouw op 1:1000 zonder ondersteuning.
