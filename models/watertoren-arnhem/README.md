# Watertoren Arnhem

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-arnhem.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de plattegrond is één veelhoek (een langgerekte achthoek met licht geknikte lange gevels) plus een D-vormig trappenhuis, geëxtrudeerd per bouwdeel; onderbouw en bovenste verdieping zijn verschoven contouren van die veelhoek, vensters en deuren zijn nissen.

Watertoren "De Steenen Tafel" aan de Weg naar de Stenen Tafel 1, op ruim 80 m boven NAP het hoogste punt van Arnhem. Ontworpen in 1925 door de dienst Gemeentewerken Arnhem (projectarchitect J. van Biesen), gebouwd 1926-1928 in zakelijk-expressionistische trant, 22,5 m hoog met één reservoir van 600 m³; rijksmonument 516836. In de onderbouw zit sinds de bouw een café, sinds 1967 restaurant De Steenen Tafel, met een later glazen paviljoen aan de zuidkant.

## Bestanden

- `watertoren-arnhem.glb`: één node van klasse `building`, op het maaiveld. Toren, trappenhuis en paviljoen staan samen op de grond; de export vult elke node apart op.
- `watertoren-arnhem.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-arnhem-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [191865.88, 446038.48], op de symmetrie-as van hoofdblok en trappenhuis in het AHN (de noord- en zuidrand van het dak en de zijkanten van het trappenhuis liggen er symmetrisch omheen), op maaiveld (NAP +83,40 m, rondom gelijk). +X wijst langs de lange as naar het trappenhuis, 14,5 graden linksom van RD-oost (`xAxis` [0.9681, 0.2504]); dat is ook de richting van de westgevel in de BAG en van de gevels van het paviljoen. Vervangt BAG-pand 0202100000235137 (bouwjaar 1927), waarvan de contour toren en paviljoen samen omvat.

## Onderdeel `building:toren-trappenhuis-en-paviljoen`

- Hoofdblok in baksteen: westgevel van 4,8 m op x -8,1, twee afgeschuinde hoeken, lange noord- en zuidgevels die bij x -1,7 flauw naar buiten knikken (10,3 m breed in de knik, 9,5 m aan de einden), schuine oostgevels naar het trappenhuis; 12,3 m lang tot het trappenhuis.
- Gepleisterde onderbouw tot 4,2 m met de hoge betonnen band tot 5,5 m, samen 0,5 m buiten de baksteen (om het trappenhuis 0,3 m). Groot restaurantvenster in de westgevel, deur in de zuidwesthoek, getralied venster in de noordwesthoek, en in de noordgevel per helft een venster en een ingang.
- Bovenste verdieping vanaf 15,4 m 0,2 m terug, met op de noord- en zuidgevel per helft een drieruits bandvenster (2,8 m) naast de knik.
- Dakterras op 17,2 m achter een gesloten borstwering tot 18,0 m (0,9 m breed, in het echt dunner).
- Halfrond trappenhuis van 4,9 m breed tot x 9,45, van de band tot 22,5 m, met een dakterras op 22,1 m achter een rand van 0,9 m en vier bandvensters boven elkaar in de ronding aan de zuidzijde.
- Glazen paviljoen van 12,1 × 8,3 m en 3,8 m hoog aan de zuidkant, met een tussenlid van 4,0 m naar de onderbouw en een lichtkap tot 5,1 m; glaspuien als nissen tussen penanten van 0,9 m of breder: vier in de zuidgevel, twee in de west- en de oostgevel.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Arnhem)): bouwjaar, architect, 22,5 m, 600 m³, café en restaurant.
- [Rijksmonumentenregister 516836](https://monumentenregister.cultureelerfgoed.nl/monumenten/516836): veelzijdig grondplan, halfrond trappenhuis aan de oostkant dat boven het hoofdblok uitsteekt, gepleisterde onderbouw tot ruim 4 m met een hoge betonnen band, iets terugliggende bovenverdieping met twee drieruits bandvensters aan noord- en zuidzijde, vier bandvensters in de ronding van het trappenhuis, platte daken als uitzichtterras met een gesloten borstwering, vensters en ingangen in de noordgevel.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +83,40, dak van het hoofdblok NAP +100,65 (17,25 m), borstwering tot circa 18,0 m, dak van het trappenhuis NAP +105,5 (22,1 m), paviljoen 3,7 m met lichtkap tot 5,1 m; dakranden van hoofdblok en trappenhuis in een stelsel op 14,5 graden.
- BAG-pand 0202100000235137 en luchtfoto (PDOK): contour van de onderbouw (0,5 m buiten de dakrand in het AHN), de knik in de lange gevels, het paviljoen en het tussenlid.
- Foto's [Watertower Arnhem](https://commons.wikimedia.org/wiki/File:Watertower_Arnhem.JPG) en [Klarenbeek Stenen Tafel watertoren](https://commons.wikimedia.org/wiki/File:Klarenbeek_Stenen_Tafel_watertoren.jpg) (westgevel, frontaal): hoogtes van onderbouw, band en terugsprong, geschaald op de borstwering in het AHN; de onderbouw steekt circa 0,5 m uit.
- Foto's [RCE 20345330](https://commons.wikimedia.org/wiki/File:Overzicht_watertoren,_thans_restaurant_-_Arnhem_-_20345330_-_RCE.jpg) en [panoramio](https://commons.wikimedia.org/wiki/File:Restaurant_%22de_Stenen_tafel%22_at_the_highest_point_of_Arnhem_some_85_m_above_sealevel_-_panoramio.jpg) (zuidkant): knik in de zuidgevel, bandvensters naast de knik, deur in de zuidwesthoek, vensters van het trappenhuis, paviljoen.

## Geschat en weggelaten

Geschat: de hoogtes van onderbouw (4,2 m), band (5,5 m) en terugsprong (15,4 m) uit foto's met perspectief; de diepte van de terugsprong (0,2 m); de borstweringen (0,9 m breed en 0,4 tot 0,8 m hoog in plaats van dun); de plaats en maat van de vensters en ingangen in de noordgevel van de onderbouw (het register noemt ze, er is geen foto van de noordkant) en de bandvensters aan de noordkant (gespiegeld van de zuidkant); de vensters van het trappenhuis (vier boven elkaar op de zuidzijde van de ronding); de onderbouw om het trappenhuis (0,3 m; de BAG geeft daar meer, de foto's bijna niets); de glaspuien van het paviljoen en de hoogte van het tussenlid. De opdracht noemt M.A. Brinkman Visser en 1926; Wikipedia en het register noemen J. van Biesen (gemeentewerken), ontwerp 1925.

Weggelaten (kleiner dan 0,9 m, te dun of geen deel van het monument): de vakwerkmast met antennes op het dak (tot circa 27 m), de stalen trap van het hoofddak naar het trappenhuis, hekwerken, de zonneschermen en het luifeltje boven de deur, de ventilatieroosters, de letters "DE STEENEN TAFEL", de betonnen band bovenaan het trappenhuis en de vensters van de begane grond van het trappenhuis. De zuidgevel van de onderbouw zit achter het tussenlid en het paviljoen en heeft geen nissen.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) verandert de 45-gradenopvulling per node, zoals de export die doet, het volume niet (gemeten 1,00000): onderbouw, band en terugsprong springen alleen naar binnen, de nissen hebben een plafond van 56 graden. De doorsneden op 1,5, 2,5, 8, 16, 17,6, 19 en 22,3 m (vensters in onderbouw en paviljoen, schacht, bandvensters, dakterras, trappenhuis) blijven gelijk. Controlebeelden blijven buiten de repo. In een preview-export op 1:1000 (100 × 100 m) krijgt het model geen ondersteuning. Op de kaart staan toren en paviljoen op de plek van het verborgen PDOK-blok, met de voet 0,2 tot 0,6 m in het PDOK-maaiveld van de heuveltop.

Controle-URL: http://localhost:3000/kaart/52.00149/5.92401/200/1x1/0
