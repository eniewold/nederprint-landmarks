# Grote Kerk, Apeldoorn

Vereenvoudigd model van de neorenaissancistische kruiskerk uit 1891–1892 naar ontwerp van Jan Verheul. Het model bevat de kruisende schilddaken, de veelhoekig afgesloten noord- en zuidarmen, het hoge achtervolume met schuin dak, de toren met achtkante spits en lantaarn, ingangspartijen en de aanbouw uit 2022. De vensters zijn als blinde nissen vereenvoudigd voor de printbaarheid.

## Bronnen en maatvoering

- [Rijksmonument 8162](https://monumentenregister.cultureelerfgoed.nl/monumenten/8162): gebouw- en dakvorm, portalen en torenbekroning.
- [Van Hoogevest Architecten](https://www.vanhoogevest.nl/projecten/grote-kerk-apeldoorn/): de toevoeging uit 2022 aan de noordoostzijde.
- [RCE-foto voorzijde](https://commons.wikimedia.org/wiki/File:Overzicht_voorzijde_kerk_-_Apeldoorn_-_20369718_-_RCE.jpg) en [RCE-foto westgevel](https://commons.wikimedia.org/wiki/File:Exterieur_WESTGEVEL_-_Apeldoorn_-_20339775_-_RCE.jpg): gevel en toren.
- 3D BAG `0200100000086059`: voetafdruk en dakvlakken; nok NAP +43,1 m, dakhelling circa 45 graden. AHN DSM 0,5 m en PDOK actuele luchtfoto: hoogtes en plattegrond; maaiveld circa NAP +17,5 m.
- [Congreslocatiebeschrijving](https://congressen.inapeldoorn.nl/wp-content/uploads/sites/6/2023/10/DEF_010223_Congressstad-brochure-A5-AP-gecomprimeerd.pdf): torenhoogte circa 62 m.

De torengeledingen, lantaarn, galmgatnissen, wijzerplaat, hoekpinakels, dakkapellen, portalen en raamindeling zijn op basis van foto's geschat en vereenvoudigd. De aanbouw heeft een afgeronde plattegrond uit de BAG en een plat dak op geschat 4 m; het AHN van 2018 dateert van vóór deze aanbouw. De schuine gevel- en dakvlakken van de armen en het dak van de achterbouw volgen de contour en hoogtegegevens uit de 3D BAG. Balustrades, wijzers, windvaan en andere delen onder 0,9 m zijn weggelaten. De torentop is op 1:1000 tot 0,9 m verbreed.

## Bestanden en genereren

De GLB gebruikt meters en glTF Y omhoog; de node `building:kerk` vervangt `NL.IMBAG.Pand.0200100000086059`. De oorsprong is RD (193815, 470413), +X loopt langs de hoofdnok. De onderkant ligt 0,4 m onder het maaiveld. Genereer GLB, catalogus-JSON en STL op schaal 1:1000 vanuit de root:

```sh
node scripts/generate-grote-kerk-apeldoorn.mjs
```

## Controle

Het model is één gesloten volume met `NoError`. Een tijdelijke catalogus- en 45°-steuntest is geslaagd; de volumes voor en na de opvulling verschillen minder dan 0,001% en dertien gecontroleerde doorsneden zijn gelijk. Volledige 3MF-exports van een 200 × 200 m uitsnede op 1:1000 met en zonder landmark zijn gemaakt en vanuit vier gelijke hoeken naast foto's bekeken. De kaart en de volledige 1:1000-preview zijn bekeken, inclusief de aansluiting van de aanbouw. De fotohoeken wijken deels af van de vier renderhoeken; het gevelreliëf en de torenbekroning blijven vereenvoudigd.
