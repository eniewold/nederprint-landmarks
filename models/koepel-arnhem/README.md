# Koepelgevangenis Arnhem

Het cellengebouw met lessenaarsring, lichtlantaarn, vier traptorens,
oude oost- en westvleugels en de aangebouwde annexen. Vervangt alleen
BAG **0202100000274796**. De kapel **0202100008772992**, het westelijke
losse bijgebouw **0202100000262727**, poort en ringmuur blijven zelfstandige
bronnen.

## Onderzoek

- RD-oorsprong 188751,822 / 444225,866. Cirkelpassing op de BAG-rondwand:
  straal 31,846 m; +X `[.99994,-.01095]` langs de oostelijke verbindingsgang.
- PDOK BAG, actuele orthoHR en AHN DSM/DTM 0,5 m, bbox
  188570,444060,188920,444390, geraadpleegd 2026-10-09.
- De BAG-contour bevat het oude hoofdgebouw. De PDOK-tegel bevat ook
  noordelijke en zuidelijke annexen onder hetzelfde pandnummer. De actuele
  BGT-contour, lokaal-id `G0202.2af034b95c7812c4e05343604191f184`, versie
  `393e0716-aece-7f0a-df29-a638c5a51b99` van 2026-09-23, bevestigt deze
  bijgebouwen. Die zijn volledig meegenomen, inclusief geschulpte zuidrand.
- Maaiveld rond de koepel NAP +35,70 m, laag pad langs de zuidelijke annex
  NAP +31,07 m. Referentiepunten lokaal `[25,-65]`, `[36,-64]`, `[43,-65]`.
  De vlakke voet ligt op het lage niveau; het hogere terrein bedekt de
  onderkant van de volle koepelkern. Zo zweven de lage annexen niet.
- Radiale AHN-medianen geven het koepelprofiel: NAP 53,17 m op r=26,5 m,
  61,35 m op r=20,5 m, 65,41 m op r=12,5 m en 67,20 m op r=4,5 m.
  Lantaarn/piron tot NAP 71,734 m. Lessenaarsrand NAP 49,45 m.
- Gemeten daken: westvleugel goot/nok NAP 44,1/50,85 m, oostvleugel
  45,9/49,65 m, zuidelijke annex 41,2–41,5 m met verhoogde delen 44,85–44,9 m,
  noordelijke annex 49,21 m met opbouw 51,94 m.
- [Rijksmonumentbeschrijving](https://monumentenregister.cultureelerfgoed.nl/monumenten/516731)
  voor hoofdvorm, vier torens, raamritme, veertienzijdige lantaarn en dakvensters.
- Schuine foto's: [cellencomplex](https://commons.wikimedia.org/wiki/File:Arnhem_-_Wilhelminastraat_bij_16_-_Cellencomplex_-_2.jpg),
  [luchtfoto RCE](https://commons.wikimedia.org/wiki/File:Bovenaanzicht_vanaf_zendmast_-_Arnhem_-_20365904_-_RCE.jpg),
  [exterieur](https://commons.wikimedia.org/wiki/File:Koepel_Arnhem,_exterieur.jpg),
  [administratievleugel](https://commons.wikimedia.org/wiki/File:Arnhem_-_Wilhelminastraat_bij_16_-_Administratiegebouw_-_1.jpg).

## Modellering en schattingen

Eén doorlopend omwentelingsprofiel met 224 hoeksegmenten, volle printkern en
vlakke onderkant. Rechte dakprofielsegmenten lopen tussen radiale bronmaten;
geen gestapelde hoogtelagen of DSM-hoogteveld. Vleugels zijn afzonderlijke
prisma's met doorlopende zadeldaken of gemeten vlakke daken, op BAG/BGT-voet.

Geschat en vereenvoudigd: raamverhoudingen en -ritme, grove kantelen,
lichtlantaarn, schoorstenen en annexinstallaties naar foto's. Roevereliëf is
verdikt tot 0,9 m breed; dakvensters en circa 200 zichtbare celvensters zijn
blinde nissen. Ramennissen die door een verbindingsgang worden bedekt zijn
weggelaten, zodat geen ingesloten holtes ontstaan. Nulvolume-oppervlakken
van co-planaire dakroeven worden verwijderd; geen volumes gevuld of gaten
met een reparatie dichtgezet.

Weggelaten: fijn zinkruitpatroon, tralies, dakhekwerk, regenpijpen en consoles
kleiner dan 0,9 m. Het interieur blijft een volle kern voor steunvrij printen.
De losse kapel, ringmuur, poort en westelijke hal vallen buiten de vervanging.

## Controle

Generator: één gesloten verbonden manifold, NoError, genus 0, 20070 driehoeken,
134369,2 m³. STL 1:1000: 130,99 × 113,74 × 41,46 mm. Printvoorbereiding met
45° overhang op echte 1:1000: 137194 → 137227 mm³, minder dan 0,1% opvulling,
NoError. Geen losse steun nodig; alleen kleine nis- en lijstovergangen.

Vier renders naast dezelfde PDOK-hoeken en schuine foto's bekeken:

- −35°: doorlopend rond koepeldak, dakvensters, lantaarn, traptorens en
  volledige vleugels met glasnissen; de annexen blijven aanwezig.
- 55°: geledingen, dakroeven en celraamritme plus oude westkap en lagere
  aanbouw; noordelijke annex heeft afzonderlijke dakopbouw.
- 145°: dakprofiel, kantelen, nisramen en verschillende daken van de
  geschulpte zuidvleugel; geen minder gedetailleerde kant dan PDOK.
- 235°: lichtlantaarn, dakvensters, schoorstenen en volledige zuidrand met
  verschillende gebouwhoogten; de oostvleugel behoudt haar zadeldak.

GLB met de echte three.js GLTFLoader bekeken. Kaartpositie, oriëntatie,
kleur, maaiveld en vervanging met landmarks uit/aan gecontroleerd.
Volledige preview en 3MF via createModelBundle, RD
188640,444125,188860,444345 op 1:1000: 220 × 220 mm, 317 objecten,
407576 driehoeken, totale hoogte 45,4 mm. Het hele complex past in de uitsnede.
Controlebeelden en exports blijven buiten beide repository's.

Regressietest controleert pandvervanging, behoud van de kapel, alle vier
torens, lichtlantaarn, vleugeldaken, beide annexen, onderkant en begrenzing.

[Controlekaart](http://localhost:3024/kaart/51.98528/5.87833/350/1x1/0).
Generator: `node scripts/generate-koepel-arnhem.mjs`.
