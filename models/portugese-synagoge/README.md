# Portugese Synagoge, Amsterdam

Het model omvat de synagoge, de achteraanbouwen en de drie lage vleugels rond het voorhof. Het vervangt BAG-panden 0363100012170255, 0253, 0258 en 0254 (de laatste drie met hetzelfde voorvoegsel). De hoofdzaal heeft vier doorlopende daknokken met twee gedeelde schildvlakken; het zijn vlakvergelijkingen, geen gestapelde hoogtegebieden.

De GLB is in meters, Y omhoog. Oorsprong RD [122179.747, 486737.966], lokale X richting [0.87467, -0.48472]. Het maaiveld is NAP +1,85 m; de hoogste nok NAP +25,10 m. De gevelbasis ligt 0,30 m onder de bemonsterde grond. De vaste terugvalhoogte 44,784 m is gemeten uit het PDOK-terrein op de drie bemonsteringspunten in het voorhof.

## Bronnen en reconstructie

- PDOK BAG, orthofoto en AHN DSM/DTM 0,5 m, RD-uitsnede [122115, 486700, 122225, 486810], geraadpleegd 9 oktober 2026.
- [3D BAG LoD2.2](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012170255), voor dakvlakken en kilgoten, getoetst aan AHN.
- [Straatgevel](https://commons.wikimedia.org/wiki/File:Portuguese_synagogue_west.jpg), Tadeáš Bednarz, CC BY-SA 4.0.
- [Achtergevel](https://commons.wikimedia.org/wiki/File:Achtergevel_-_Amsterdam_-_20013939_-_RCE.jpg), RCE, fotograaf onbekend, CC BY-SA 4.0.
- [Gevel aan het voorhof](https://commons.wikimedia.org/wiki/File:Binnengevel_op_het_plein_-_Amsterdam_-_20021428_-_RCE.jpg), Han van Gool / RCE, CC BY-SA 4.0.

Geschat naar deze foto's: diepte en precieze maten van de gevelnissen, kroonlijst, parapet, poort en daklichten. De urnen zijn vereenvoudigd en verdikt tot minimaal 0,9 m. Vensters zijn blinde nissen van circa 0,35 m; glas, dunne kozijnen, vlaggen en fijne balusters zijn niet los gemodelleerd. De westelijke dienstvleugel heeft een vlak dak met een hellend dakvlak aan de binnenplaats en vier veelhoekige daklichten. Lage dakhoogtes zijn geregulariseerd naar de AHN-metingen en gevelbeelden; exacte daklichtprofielen blijven een schatting.

## Controle

De hoofdgebouwvoetafdruk en de lage vleugels zijn vergeleken met BAG en de orthofoto. Het hoofdprofiel is getoetst op 3.851 geldige AHN-punten: RMSE 0,63 m; 92,5% binnen 1 m. Nokken, kilgoten en eindvlakken zijn continu. De vier aanzichten zijn naast dezelfde PDOK-aanzichten en de bovenstaande schuine foto's beoordeeld. Gevelnissen, kroonlijst, urnen, poort en daklichten voegen detail toe aan de automatische reconstructie.

De regressietest in `tests/landmark-models.test.ts` controleert de vier nokken, dalende schildvlakken, gevelnissen, plaatsing en alle vleugels. De volledige preview-export op 1:1000 gebruikt een uitsnede van 200 × 200 m, zes PDOK-tegels en 464 onderdelen. Het landmark zit geheel binnen de uitsnede.

De geometrie en printopvulling zijn gesloten manifolds (`NoError`). De ingebedde 45°-printopvulling is dezelfde als de webshop en voegt circa 0,04% volume toe. De zelfstandige STL heeft een vlakke onderplaat van 1 mm die de afzonderlijke gebouwen verbindt; één verbonden gesloten printvolume. Grootte inclusief plaat: 82 × 46 × 24,55 mm op 1:1000. Print Z omhoog, zonder losse steun.

Reproduceren vanuit de landmarkrepo:

```sh
node scripts/generate-portugese-synagoge.mjs
```

[Controlekaart](http://localhost:3049/kaart/52.36750/4.90528/350/1x1/0): bekijk de vier daknokken, raamreeksen en de aansluiting van de lage vleugels rond het voorhof.
