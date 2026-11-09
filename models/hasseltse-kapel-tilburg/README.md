# Hasseltse Kapel (Tilburg)

Vereenvoudigd landmark van de Mariakapel op het Hasseltplein. De kapel dateert rond 1530, volgens [Open Monumentendag](https://www.openmonumentendag.nl/monument/rk-hasseltse-kapel/), en is daarmee aanzienlijk ouder dan het BAG-bouwjaar 1919.

## Bestanden en plaatsing

- `hasseltse-kapel-tilburg.glb`: model in meters, Y omhoog, node `building:kapel`.
- `hasseltse-kapel-tilburg.json`: RD-plaatsing en vervanging van `NL.IMBAG.Pand.0855100000144292`.
- STL's op schaal 1:100 en 1:1000, Z omhoog.
- Generator: `scripts/generate-hasseltse-kapel-tilburg.mjs`.

Oorsprong RD (132613,5, 398639,8), X-as (0,994, -0,11) langs het schip naar de sluiting. Maaiveld NAP +12,835 m; vlakke onderkant op -0,5 m. De ingang staat aan de westzijde.

## Vorm en aannames

Een rechthoekig schip onder zadeldak, de geleidelijk naar de ingebouwde toren oplopende voorgevel, een vierkante toren met spits, de lagere veelzijdige koorsluiting en de zuidelijke aanbouw onder een lessenaarsdak zijn als bouwdelen gemodelleerd. Gevelopeningen zijn blinde rondboognissen.

3D BAG vermeldt circa 122,57 m² grondvlak en nok NAP +21,50 m. AHN5 geeft een hoogst gemeten punt van NAP +27,08 m rondom de torenspits, bij maaiveld +12,835 m; de modeltop is geschat op 14,35 m boven maaiveld. De exacte spits, hoogtes en breedtes van nissen en de contour van de lage aanbouw zijn geschat. Kleine kruisen, hekwerk, goten en maaswerk zijn voor de printschaal weggelaten.

## Controle en bronnen

Het model vormt één gesloten component met genus 0. De gerichte plaatsings- en 45° printtest slaagt; echte preview-exports met en zonder landmarks zijn gemaakt, en beide modellen zijn met schuine foto's vanuit vier richtingen vergeleken. Controlekaart: http://localhost:3000/kaart/51.57624/5.06427/200/1x1/0.

Bronnen: [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0855100000144292), AHN5 0,5 m, PDOK-luchtfoto, [Commons/RCE-foto's](https://commons.wikimedia.org/wiki/Category:Hasseltse_kapel_(Tilburg)), [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/35700) en [Open Monumentendag](https://www.openmonumentendag.nl/monument/rk-hasseltse-kapel/).
