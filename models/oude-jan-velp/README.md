# Oude Jan Velp

Model van de Oude Jan aan Kerkstraat 56 in Velp, rijksmonument 42149 en BAG-pand 0275100000009021. Het romaanse schip dateert van omstreeks 1100, de toren uit circa 1200 en de noordelijke kapel uit de late middeleeuwen. Het huidige rechthoekige koor werd in 1948–1950 herbouwd.

## Bronnen en maten

- [Rijksdienst voor het Cultureel Erfgoed](https://kennis.cultureelerfgoed.nl/index.php/Monumenten/42149) en [de Protestantse Gemeente Velp](https://pgvelp.nl/beheren-geschiedenis-oude-jan/).
- [Wikimedia Commons: foto's](https://commons.wikimedia.org/wiki/Category:Oude_kerk,_Velp).
- BAG voor de voetafdruk, 3DBAG LoD2.2 voor schip, koor en kapeldak, en AHN DSM voor de laagste delen van de toren. Het maaiveld bedraagt circa NAP +13,86 m. Rond de toren zijn 80 rastercellen geldig en 36 leeg; de hoogste AHN-meting NAP +36,79 m ligt slechts 22,93 m boven maaiveld en mist het bovenste deel van de spits. De PDOK-reconstructie kapt die daardoor af.
- De kerkgemeente vermeldt een torenhoogte van 35 m. Omdat de bron niet aangeeft of de bekroning meetelt, is de dakpunt op circa 34,2 m gemodelleerd en de fijne bekroning weggelaten. De hoogte en het aandeel van de weggelaten bekroning blijven geschat; het silhouet tussen de schouder en de punt volgt de rechte, op foto's zichtbare dakvlakken.

Het model omvat het schip, de rechthoekige koorsluiting, de noordkapel met schilddak en de toren. De hoogtes van de torenschouder, vensters, galmgaten, steunberen en toegangen zijn uit de hoogtegegevens en foto's geschat. De spitspunt is verbreed voor 1:1000; windvaan, wijzerplaat en fijn venstermaaswerk zijn weggelaten. De voetafdruk is circa 25,2 bij 16,6 m.

## Productie en controle

Het model is één gesloten volume voor afdruk op 1:1000 zonder steunmateriaal. Maak GLB, catalogus-JSON en STL met `node scripts/generate-oude-jan-velp.mjs` in de landmarks-repository. De webshop bevat een plaatsings- en printtest in `tests/landmark-models.test.ts`. Een uitsnede van 150 bij 150 m is geëxporteerd en het model is van vier zijden naast de PDOK-reconstructie en foto's gelegd. Controleer de ligging via [de kaart](http://localhost:3000/kaart/51.99114/5.98050/200/1x1/0).
