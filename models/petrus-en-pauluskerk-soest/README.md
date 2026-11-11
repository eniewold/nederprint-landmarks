# Petrus en Pauluskerk Soest

De neoclassicistische voorgevel en toren van Theo Molkenboer uit 1852–1853 zijn bewaard. De vroegere basiliek is in 1968 gesloopt en de huidige kerkzaal dateert uit 1969. Het model toont het huidige geheel binnen BAG-pand 0342100000025234, inclusief de eraan verbonden lage vleugels en achterbouw.

## Bronnen en maten

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0342100000025234): ligging, BAG-contour, AHN5-gegevens 2023 en maaiveld NAP +5,668 m.
- [AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0): meetpunten kerkzaaldak circa 14,6 m en bovenste torenpunt circa 33,06 m boven maaiveld; de vereenvoudigde vlakke toren eindigt op 32,7 m.
- [Rijksdienst voor het Cultureel Erfgoed](https://kennis.cultureelerfgoed.nl/index.php/Monumenten/34105) en [Historische Vereniging Soest](https://www.hvsoest.nl/encyclopedie/item/2501/petrus-en-paulus-ency): bewaard front en geschiedenis van de nieuwe kerkzaal.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Petrus_en_Pauluskerk,_Soest): foto's van het historische front en toren; oude zijfoto's tonen de in 1968 gesloopte kerk en zijn uitsluitend voor het bewaarde front gebruikt.

Het huidige zadeldak, vlakke lage vleugels, schilddak van de achterbouw en historische toren zijn afzonderlijke aangesloten bouwdelen. Het lage zijvolume is op AHN-doorsneden gebaseerd. De gevelpilasters en nissen, de torenhoogte zonder bekroning en de achterbouw zijn vereenvoudigd en geschat uit foto's en PDOK; beelden, kruis, balustrades, uurwerk en kleine ornamenten zijn weggelaten. De achterzijde is hoofdzakelijk op PDOK en AHN gebaseerd omdat de beschikbare schuine zijfoto's van vóór de sloop zijn.

## Controle

De generator controleert één gesloten manifoldvolume zonder genus. De gerichte test in `tests/landmark-models.test.ts` controleert catalogus, BAG-vervanging, plaatsing, verbinding, genus en extra volume en doorsneden na 45-graden steungeneratie en slaagt voor 1:1000. Vier definitieve schuine aanzichten zijn naast PDOK en beschikbare foto's bekeken; na vergelijking is de lage zijvleugel toegevoegd volgens het AHN-profiel. De toren en het front zijn naar foto's verduidelijkt; de huidige achterzijde is vooral met PDOK en AHN beoordeeld. De begrenzing van het lage volume is gecorrigeerd tegen aangrenzend pand 0342100000012495: de oppervlakken overlappen niet. Pand 0342100000012567 ligt 3,31 m weg zonder overlap; beide zijn met lokaal AHN gecontroleerd.

Regenereren: `node scripts/generate-petrus-en-pauluskerk-soest.mjs` vanuit de landmarks-repository.
