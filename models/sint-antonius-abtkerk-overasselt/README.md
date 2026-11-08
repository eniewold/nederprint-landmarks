# Sint Antonius Abtkerk Overasselt

Model van de neoromaanse kruisbasiliek uit 1891 aan Hoogstraat 9 te Overasselt (rijksmonument 523921, architect Carl Weber). Van het oorspronkelijke tweelingtorenplan is alleen de noordwestelijke toren gebouwd. Het model vervangt BAG-pand 0252100000017987; de aangrenzende voormalige pastorie is een afzonderlijk pand en blijft behouden.

## Bronnen en maten

- [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/523921) en [Rijksdienst voor het Cultureel Erfgoed, complex](https://kennis.cultureelerfgoed.nl/index.php/Complexen/523920).
- [Wikimedia Commons: foto's](https://commons.wikimedia.org/wiki/Category:Sint-Antonius_Abtkerk_(Overasselt)).
- [Archieffoto van de koorsluiting](https://www.oozo.nl/oud-beeldmateriaal/heumen/overasselt/overasselt/105960/foto-hoogstraat-9-te-overasselt) en [achterzijde met sacristie](https://www.oozo.nl/oud-beeldmateriaal/heumen/overasselt/overasselt/105736/foto-hoogstraat-9-te-overasselt).
- BAG voor de plattegrond, 3DBAG LoD2.2 voor dakvlakken, nokken en lage aanbouwen, AHN DSM voor de toren en hoogtecontrole. Het gemeten maaiveld is circa NAP +10,08 m en het hoogste AHN-punt circa NAP +49,11 m, of circa 39,0 m boven maaiveld. De punt is 38,9 m hoog gemodelleerd. De 3DBAG-reconstructie mist een groot deel van de toren; het AHN-raster bevat slechts één lege cel rond de toren en laat met foto's het silhouet bepalen. De nok van de kruisende kappen ligt circa 21,2 m boven maaiveld.

Het model omvat het driebeukige schip, de twee kruisende zadeldaken, de apsidiale transeptarmen, het vijfzijdige koor, de lage doopkapel, de sacristie, één torenschacht met achthoekige klokkenetage en spits, nissen, steunberen en dakkapellen. Afmetingen en hoogten van klokkenetage, gevelnissen, ramen, portaal, dakkapellen en apsisdaken zijn uit foto's en hoogtedata geschat. De spits is voor 1:1000 verbreed; kruis, uurwerken, galmborden en klein maas- en metselwerk zijn weggelaten. Het grondvlak is circa 42,7 bij 23,7 m.

## Productie en controle

Het model is één gesloten volume zonder interne holten en bedoeld voor afdruk op 1:1000 zonder ondersteuning. Genereer GLB, JSON en STL met 
ode scripts/generate-sint-antonius-abtkerk-overasselt.mjs` in de landmarks-repository. In de webshop controleert `tests/landmark-models.test.ts` de plaatsing en printbaarheid. Een uitsnede van 150 bij 150 m is geëxporteerd en het model is van vier zijden vergeleken met PDOK en foto's. Controleer de ligging via [de kaart](http://localhost:3000/kaart/51.76059/5.78965/200/1x1/0).

