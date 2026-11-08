# Sint-Annakapel (Breda)

Model van de kapel in Heusdenhout, gesticht omstreeks 1518, met de klokkenstoel uit 1602. De BAG noemt 1900 als bouwjaar; de parochie documenteert een oudere oorsprong.

## Bestanden en plaatsing

`sint-annakapel-breda.glb` bevat de kapel als gesloten `building:kapel`-node; de JSON registreert RD-oorsprong [115685.63, 400272.81], de lengteas [0.9964, 0.0848] en vervangt BAG-pand 0758100000022260. STL-bestanden zijn voor 1:100 en 1:1000. Het script is `scripts/generate-sint-annakapel-breda.mjs`.

## Vorm en aannames

Schip, driezijdige koorsluiting en hellende dakvlakken zijn afgeleid van de BAG-voetafdruk en 3D BAG-dakvlakken; aan het westen staan de gemetselde klokkenstoel, tentdak, toegang en gevelnis. Zijgevels hebben steunberen en blinde vensternissen. Volgens 3D BAG is de voetafdruk 91,05 m², de nok 13,65 m NAP en het maaiveld 4,47 m NAP. AHN5 toont bij de westelijke klokkenstoel samenhangende meetpunten tot ongeveer 17,9 m NAP; de dakpunt is als circa 13,43 m boven maaiveld gemodelleerd.

De hoogtes van de galmgatnis, steunberen en vensters en de verhoudingen van de tentdakrand zijn uit foto's geschat. Riettextuur, raamtraceringen, klok, windvaan en kruis zijn te fijn voor 1:1000 en weggelaten. De galmopening is een blinde nis vanwege printbaarheid; de steunberen zijn verbreed tot 0,9 m. De dakvlakken benaderen de licht gebogen rietkap met vlakke vlakken.

## Controle

De generator meldt een gesloten volume, één component en genus nul. De gerichte catalogus- en printtest controleert de plaatsing, BAG-vervanging, doorsneden en de steunopvulling op 1:1000. Preview-exports met en zonder landmarks zijn vergeleken vanuit vier hoeken. De PDOK-reconstructie mist de klokkenstoel en vensternissen. Controleer op de kaart de aansluiting op het maaiveld, oriëntatie en de hoogte van de klokkenstoel: http://localhost:3000/kaart/51.58999/4.81999/200/1x1/0.

## Bronnen

- [3D BAG pand 0758100000022260](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0758100000022260)
- [AHN5 dataroom](https://www.ahn.nl/dataroom), DSM op 0,5 m
- [Augustinusparochie: Annakapel en geschiedenis](https://augustinusparochiebreda.nl/kerken/annakapel/)
- [Rijksmonumentenregister 10375](https://monumentenregister.cultureelerfgoed.nl/monumenten/10375)
- [Wikimedia Commons: foto's uit diverse richtingen](https://commons.wikimedia.org/wiki/Category:St._Annakapel_(Breda))