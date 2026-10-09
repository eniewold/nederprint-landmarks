# Blaaktoren (Het Potlood) (Rotterdam)

Zeshoekige woontoren met knik in de dakmantel, twaalfvlakkige puntkap, gevelvensters en complete lage westentree. Opgebouwd uit prisma's, dakvlakken en convexe omhulsels van benoemde bouwdelen; geen gestapelde hoogtelagen. Per-rij voorbeeld gelezen: `generate-evoluon.mjs`. Reproductie: `node scripts/generate-blaaktoren.mjs`.

## Bestanden en plaatsing

- `blaaktoren.glb`: meters, Y omhoog, één gesloten `building:`-node.
- `blaaktoren.json`: oorsprong RD `[93245.14,437273.13]`, +X −27,85° in RD, westentree aan lokale −X.
- `blaaktoren-1-1000.stl`: millimeters, Z omhoog; één verbonden volume op een vlakke voet, circa 39,74 × 22,82 × 63,02 mm.

Vervangt alleen BAG `0599100000642847`: dit pand bevat zowel de toren als de westelijke aanbouw. De Kubuswoningen, bibliotheek en overige buurpanden blijven staan. Het AHN meet de punt op NAP +63,6213 m; de 3D BAG-dakvlakken leveren de doorlopende kap tot NAP +63,86708 m. Het verschil van 0,246 m past bij een raster dat de scherpe punt niet precies raakt. De gevelrichting volgt BAG/3D BAG, de torenvoet is regelmatig gemaakt tot een zeshoek met straal 12,75 m. Gevelschouder NAP +41,52 m, dakknik +48,64 m.

De zuidelijke straat ligt rond NAP +3,15 m, de westzijde lager. Drie maaiveldpunten aan de zuidzijde bepalen de plaatsing; de vlakke modelvoet loopt tot −2,3 m door om ook de lage westentree te verankeren. Die verdieping zit in de print onder het terrein en is geen los toegevoegd plateau.

## Onderdelen en schattingen

De dertien woonlagen krijgen afgeschuinde vensternissen met witte borstweringen als ingebed reliëf; de westelijke ontsluitingssectie krijgt smalle trapvensters. Balkonstroken op vijf hoeken zijn blinde inkepingen; verborgen onderste vensters/balkons achter de aanbouw zijn weggelaten om ingesloten holtes te voorkomen. De gevelritmiek, verdiepinghoogte 2,77 m, venster- en balkonmaten en de plaats van de trapvensters zijn uit schuine foto's geschat, vereenvoudigd en regelmatig gemaakt. De fijne ronde vensteronderkanten zijn afgeschuind.

De kap bestaat uit een doorlopende overgang van zeshoek naar twaalfhoek, twaalf dakvlakken tot de punt, twaalf graten van minstens 0,9 m breed en een gedragen galerijrand op circa NAP +51,7 m. De dakvlakrichtingen en knikhoogtes volgen 3D BAG/AHN; galerijrand en gratendikte zijn voor printbaarheid vereenvoudigd. Het dunne onderhoudshek, antennes en fijne metaalnaden zijn weggelaten.

De lage aanbouw heeft twee schuine dakvlakken met een nok die richting toren oploopt, twee zijterrassen en een afzonderlijke steile entreekap tot NAP +13,73 m. De twee dakvlakvergelijkingen komen uit de 3D BAG en zijn gecontroleerd op het AHN-raster. Glaspanelen, interieur en kleine lage gevelvensters zijn weggelaten; de hoofdpoort is een blinde nis. De aanbouw is volledig gevuld tot de vlakke voet.

## Controle (9 oktober 2026)

Generator: `NoError`, één verbonden deel, genus 0, 12.054 driehoeken, 21.942 m³. Geen interne holtes en geen vrije horizontale overspanningen. Gevelnissen circa 0,35 m diep, graten minstens 0,9 mm op 1:1000; uitstekende borstweringen en galerijrand hebben een schuine, gedragen onderzijde.

Catalogus-, API- en echte-exportcontrole: 291 tests geslaagd. Nieuwe regressietest plaatst de complete toren/entree in een lokale uitsnede en controleert vervangpand, alle dertien vensterrijen, de dakpunt en galerij. De bestaande Kubuswoningen-test controleert nu uitsluitend de eigen drie maaiveldpunten, omdat de Blaaktoren dezelfde uitsnede raakt.

Vier volledige GLB-renders naast de werkelijke PDOK-reconstructie op −35°, 55°, 145° en 235° bekeken en met schuine Commons-foto's vanuit Blaak, de Kubuswoningen en de bibliotheek vergeleken. De PDOK-hoofdmassa is al herkenbaar; het model voegt regelmatige dakvlakken, graten, galerijrand, vensterritme, balkonnissen en de westpoort toe. Op de kaart zijn plaatsing, richting, kleur en beide maaiveldniveaus bekeken. Schakelaar uit/aan: de PDOK-toren en aanbouw verschijnen en verdwijnen zoals bedoeld.

Volledige `createModelBundle`-preview-export op 1:1000, RD-uitsnede `[93165,437193,93325,437353]`, 160 × 160 mm, grondplaat 1 mm en hoogteversterking 1; hele toren en westaanbouw in de uitsnede. 3MF-preview visueel bekeken met terrein en omliggende gebouwen. De aanvullende Manifold-controle via de exportvoorbereiding geeft bij 89° en 45° beide `NoError` en 21.176,044 mm³: geen extra steunvolume bij 45°. Geometrisch gecontroleerd; geen fysieke proefprint. Bronbestanden, renders en preview blijven buiten de repo's in de sessiescratchpad.

[Controlekaart](http://127.0.0.1:3037/kaart/51.92056/4.48944/350/1x1/0): controleer het vensterritme, de galerij onder de puntkap en de aansluiting van de westentree op het lagere straatniveau.

## Bronnen

- PDOK BAG `0599100000642847`, AHN DSM/DTM 0,5 m en Actueel_orthoHR, 9 oktober 2026; analysebbox `[93150.71,437188.79,93330.71,437368.79]`.
- [3D BAG, TU Delft/3D geoinformatie](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000642847), CC BY 4.0: dakvlakken en knikhoogtes, regelmatig herbouwd; bronvermelding ook bij de constanten in de generator.
- [Rotterdam Woont: Blaakoverbouwing, blad 3](https://rotterdamwoont.nl/app/uploads/2018/01/4.1982.2-projectbladen-Blaakoverbouwing-3.pdf): vijf woningen per laag, plattegrond en projectcontext.
- Commons: [Rotterdam – Blaaktoren](https://commons.wikimedia.org/wiki/File:Rotterdam_-_Blaaktoren.jpg) en [Kijk Kubus & Blaaktoren](https://commons.wikimedia.org/wiki/File:Rotterdam_-_Kijk_Kubus_%26_Blaaktoren.jpg), Fred Romero; [Centrale bibliotheek en Blaaktoren](https://commons.wikimedia.org/wiki/File:Centrale_bibliotheek_van_Rotterdam_en_Blaaktoren_-_City_of_Rotterdam_(21999005883).jpg), Frans Berkelaar; [Blaaktoren 101](https://commons.wikimedia.org/wiki/File:Blaaktoren_101.JPG), G. Lanting. Alleen visuele referenties, geen fototexturen overgenomen.
