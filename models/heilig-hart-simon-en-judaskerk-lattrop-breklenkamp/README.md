# H.H. Simon en Judaskerk (Lattrop-Breklenkamp)

Vereenvoudigd model van de kruisbasiliek aan Dorpsstraat 66. Joseph Cuypers en Pierre Cuypers jr. ontwierpen de kerk in 1925; het rijksmonumentenregister noemt voltooiing in 1936. Het BAG-bouwjaar 1910 in de taak is daarmee geen betrouwbare datering van de huidige kerk.

## Onderdelen en maten

Het model bestaat uit een middenschip met een zadeldak, dwarsschip, vijfzijdige koorsluiting, lagere aanbouwen en een toren met achtzijdige spits. De zichtbare portaal-, venster- en galmgaten zijn ondiepe nissen. De voet ligt 0,5 m onder maaiveld. De oorsprong RD (263148,8, 494501,0) ligt bij de toren; +X wijst langs de nok naar het koor, RD-richting (0,75115, 0,66013). Het vervangt pand `NL.IMBAG.Pand.1774100000242228`.

De 3D BAG geeft het maaiveld op NAP +20,77 m; de nok van het schip ligt ongeveer 15,95 m daarboven. AHN4 meet de steile torenspits tot circa 29 m boven maaiveld; de werkelijke top is dun en ontbreekt deels in het raster. De gemodelleerde spits tot 30,5 m, de geleding van het torendak, nissen, portaal, vensterposities en steunberen zijn geschat uit foto's. Details van de lage aanbouwen en hun vensters zijn vereenvoudigd. Het meest westelijke steunbeerblok aan de zijde van de pastorie is weggelaten omdat het anders het naastgelegen pand doorsnijdt. Glasindeling, wijzerplaten, kruisen, windvaan en details kleiner dan 0,9 m zijn weggelaten.

## Bestanden en controle

De GLB is de bron voor kaart en export (meters, Y omhoog). De STL-bestanden zijn in millimeters op schaal 1:100 en 1:1000. Genereer met `node scripts/generate-heilig-hart-simon-en-judaskerk-lattrop-breklenkamp.mjs`.

De gerichte catalogus- en printtest controleert positie, een gesloten component en het resultaat van 45°-overhangopvulling op 1:1000. Vanuit vier schuine hoeken is de PDOK-gebouwmesh met het model vergeleken: de ontbrekende torenspits is toegevoegd, gevelnissen zijn zichtbaar en het schip, dwarsschip, koor en aanbouwen zijn behouden. De west-, noordwest-, oost- en zuidgevel zijn vergeleken met RCE- en Commons-foto's; de zuidfoto toont ook de kleine dwarsgevel naast het koor. De naastgelegen pastorie heeft in PDOK een top NAP +32,88 m tegenover AHN-p95 +32,79 m; na het weglaten van een steunbeer resteert circa 0,07 m² voetafdrukoverlap langs een gedeelde grens. De kaart en een volledige uitsnede in de preview op 1:1000 zijn gecontroleerd.

## Bronnen

- [Rijksmonumentenregister 508960](https://monumentenregister.cultureelerfgoed.nl/monumenten/508960) en [RCE-beschrijving](https://kennis.cultureelerfgoed.nl/index.php/Monumenten/508960): naam, architectuur en datering.
- [3D BAG, pand 1774100000242228](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1774100000242228): voetafdruk, gebouwas, dakvlakken en maaiveld.
- [PDOK AHN4 DSM](https://service.pdok.nl/rws/ahn/wcs/v1_0): hoogtegegevens op 0,5 m.
- [Noordwestgevel, RCE](https://commons.wikimedia.org/wiki/File:Noordwest-gevel_-_Lattrop_-_20129462_-_RCE.jpg), [oostgevel, RCE](https://commons.wikimedia.org/wiki/File:Oostgevel_-_Lattrop_-_20129463_-_RCE.jpg), [zuidgevel, RCE](https://commons.wikimedia.org/wiki/File:Zuidgevel_-_Lattrop_-_20129464_-_RCE.jpg) en [westgevel, Commons](https://commons.wikimedia.org/wiki/File:RK_Kerk_Lattrop.jpg).
