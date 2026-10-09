# Kasteel Twickel (Delden)

Drie bouwvleugels, twee ongelijke torens, renaissance-ingang en twee bruggen. De bijgebouwen op het voorplein blijven PDOK-objecten.

## Bestanden en plaatsing

- `kasteel-twickel.glb`: meters, Y omhoog; `building:kasteel`, `building:steenbrug en tuinbrug`, `road:voetpaden`.
- `kasteel-twickel.json`: RD-plaatsing, BAG- en BGT-vervanging.
- `kasteel-twickel-1-1000.stl`: millimeters, Z omhoog, verbonden kasteel en bruggen.
- Herbouw: `node scripts/generate-kasteel-twickel.mjs --components`.

RD-oorsprong `[245638,476205]`, +X −60° langs de voorgevel; +Y naar de stenen toegangsbrug. Alleen BAG `1735100000001456` vervangen. Water NAP +14,40 m: PDOK-water 57,827–57,841 m minus lokale mediaan LoD2/AHN 43,433 m. Bemonstering `[-35,0]`, `[35,0]`, `[25,-35]`; ellipsoïdale terugval 57,83 m. Voet 0,8 m onder water. Binnenplaats en omgeving behouden het PDOK-terrein.

## Bouwopbouw en maten

Gevelpolygonen, hellende dakvlakken, torenschachten, spitsen, erkerconsoles en afzonderlijke brugvolumes vormen het model; geen gestapelde hoogtelagen. De vierkante oosttoren krijgt een piramidespits, de slanke noordwesttoren een veel smaller steil dak. Hoofdkap heeft een vlak binnenvlak, zijvleugels hebben lengtenokken. Open binnenplaats wordt begrensd door de vleugels en een verdikte tuinmuur.

| Bouwdeel | Hoogte NAP | Bron |
| --- | --- | --- |
| Binnenvlak hoofddak | 33,85 m | AHN 0,5 m |
| Zuidelijke / noordelijke nok | 33,80 / 33,40 m | AHN en luchtfoto |
| Grote oostelijke spits | 43,60 m | AHN maximum 43,56 m |
| Slanke noordwestspits | 42,75 m | AHN maximum circa 42,63 m |
| Renaissance-topgevel | 36,05 m | AHN, RCE-gevelbeelden |
| Schoorstenen | 34,80–36,15 m | AHN, luchtfoto en foto's |
| Stenen brug bij kasteel | 17,76 m | AHN-brugprofiel |
| Tuinbrug bij binnenplaats / tuin | 16,79 / 16,25 m | AHN-brugprofiel |

Actuele BGT-voetpaden `G1735.45cf62f5725515b2e054002128f9eb56` en `G1735.45cf62f4018615b2e054002128f9eb56` leveren de afzonderlijke wegdekken (`voetpad`, `open verharding`). Dit zijn overal de bovenste 0,50 m van de brug. Constructie heeft daar geen gelijkliggend bovenvlak. BGT-dekvlakken `G1735.45cf62f4ae8815b2e054002128f9eb56` en `G1735.45cf62f4959915b2e054002128f9eb56` worden volledig vervangen.

## Schattingen en printvereenvoudigingen

Positie en profiel van kapellen, raamverdeling, zeven schoorstenen, renaissance-schouders/pinakels, erkerconsoles en het kleine dak aan de oosttoren zijn deels foto-afgeleid en vereenvoudigd. Het kleine risalietdak is een benadering. Dakdetails aan de binnenzijde volgen zichtbare foto's waar AHN door schaduw of begroeiing onvolledig is. Vensternissen zijn 0,35 m diep; speklagen worden met kleine schuine randen aangeduid.

De twee oorspronkelijke ronde brugbogen zijn steile puntbogen met 55° bovenzijden. De houten tuinbrug krijgt vaste onderbouw en zes steile openingen; geen losse horizontale balken. Tuinbalustrade is een gesloten muur van circa 1 m dik. Erkerconsoles lopen schuin uit de gevel naar de onderbouw. Fijne balusters, beeldhouwwerk, roeden, windvanen en lampen vervallen. Nissen blijven ondiep; schoorstenen en kleine dragende delen zijn circa 0,9–1,2 m breed. Geen verborgen interne holten.

## Controle

- Generator/Float32-rondgang: `NoError`; kasteel één positief volume, genus 4 door zichtbare uitsparingen/binnenplaats; beide bruggen afzonderlijk en verbonden aan het kasteel.
- STL 1:1000: 4.038 driehoeken, 21,71 cm³, 53,8 × 81,3 × 30,0 mm.
- Gedeelde printsteuncontrole: kasteel +0,1098% door ondiepe nissen, bruggen en dekken vrijwel 0%; overige draagvlakken minimaal 45°.
- Dekcontrole: 8.765 steekproeven, minimum 0,4999999 m dikte, nul gelijkliggende constructievlakken.
- AHN: 4.920 cellen, 54,1% binnen 1 m, 76,1% binnen 2 m; mediane afwijking 0,86 m. Kapdetails en kleine dakbenaderingen verklaren een deel van de afwijkingen.
- Vier gelijke schuine aanzichten naast PDOK en vier schuine RCE-foto's beoordeeld. Iedere gevel heeft nissen, kapellen en/of ingangsdetaillering; beide ongelijke spitsen zijn zichtbaar.
- Werkelijke preview/3MF 130 × 130 m op 1:1000, 130 × 130 mm en 30,5 mm hoog: gehele kasteel plus beide bruggen binnen de uitsnede.
- Permanente test controleert BAG, waterpunten, beide torentoppen, open binnenplaats, brugbereik, twee vervangen BGT-dekken en werkelijke wegattributen.
- [Controlekaart](http://localhost:3063/kaart/52.26638986/6.71501914/260/1x1/0): controleer de ongelijke torenspitsen, erkers en beide bruggen; `landmarks=0` toont PDOK.

## Bronnen

- [RCE hoofdgebouw 507544](https://monumentenregister.cultureelerfgoed.nl/monumenten/507544): drie vleugels, renaissancefront, kapellen en torens.
- [RCE stenen brug 507550](https://monumentenregister.cultureelerfgoed.nl/monumenten/507550): twee oorspronkelijke ronde bogen, consoles en bordes.
- [Commons Twickel Castle](https://commons.wikimedia.org/wiki/Category:Twickel_Castle): RCE 20008169 voorzijde, 20351309 achterzijde, 20008173 grote toren, 20008176 slanke toren; oorspronkelijke bestandlicenties.
- PDOK BAG, BGT, AHN DSM/DTM 0,5 m, Actueel_orthoHR en 3D Basisvoorziening, 9 oktober 2026.
