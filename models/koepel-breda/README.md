# Koepelgevangenis (Breda)

Volledig cellengebouw, vier gekanteelde traptorens, westelijk dienstgebouw
met zadeldak, lage U-aanbouw en beide verbindingsgangen. Vervangt BAG
**0758100000038514**. Administratiegebouw **0758100000038515**, poort,
ringmuur, kapel en losstaande bijgebouwen blijven PDOK.

## Bestanden en stelsel

`koepel-breda.glb` is in meters, Y omhoog, met normalen en één gesloten
`building:`-node. `koepel-breda.json` is de catalogusbron.
`koepel-breda-1-1000.stl` is een binaire STL in millimeters, Z omhoog.
Reproduceren: `node scripts/generate-koepel-breda.mjs`; `--out` wijst een
catalogusmap aan en `--scale` verandert de STL-schaal.

RD-oorsprong `[113424.789,400331.152]` uit cirkelpassing op de BAG-rondwand;
straal 31,461 m, fitresidu 0,086 m. +X langs de oostelijke gang op −21,5°
in RD, +Y linksom haaks daarop. Maaiveldreferentie NAP +3,072 m; de voet
begint 0,3 m lager. Referentiepunten lokaal `[-12,-35]`, `[12,-35]`, `[0,-39]`.

## Onderzoek en opbouw

PDOK BAG/BGT, Actueel_orthoHR en AHN DSM/DTM 0,5 m op 2026-10-09,
bbox `113302.374,400203.561,113542.374,400443.561`.
Actuele BGT: `G0758.5df91bb155564028893d365ff4136c3c`, versie
`9c21367c-f302-08bd-8857-69c7965bb84d`; historische versies uitgesloten.
De PDOK-tegel en de 3D BAG bevestigen de samengestelde voetafdruk.
Hoogtes van raakpanden zijn uit de PDOK-tegel gelezen; er staat geen
buurpand als hoge vervuilingskolom tegen het model.

Koepel: doorlopend omwentelingsprofiel met 224 hoeksegmenten, volle kern,
28 radiale roeven en drie ringen blinde dakvensters. Radiale AHN-medianen:
r=28,5 m NAP18,747; r=24,5 m NAP24,510; r=18,5 m NAP30,180;
r=12,5 m NAP32,986; r=4,5 m NAP34,797. Geen gestapelde hoogtelagen.
Veertienzijdige lantaarn, tentdak en piron tot AHN-top NAP39,7689 m.

Vier cellagen met dertien raamtravees per quadrant, blinde nissen van
circa 0,35 m. Torens hebben kantelen, schuine lijsten en vensternissen.
Westvleugel: eigen prisma met rechte nok NAP17,11 en goot NAP11,81 m;
U-aanbouw vlak NAP7,55. Westgang heeft een eigen zadeldak; oostgang
vlak NAP11,53 met kleine opbouw. Schoorstenen en daklichten zijn aanwezig.
Bedekte raamposities worden niet uitgesneden: geen ingesloten holtes.

## Geschat en weggelaten

Geschat uit schuine foto's: raamverhoudingen, raamritme van de vleugels,
kantelen, lantaarn/piron en schoorsteendetails. Roevereliëf is verdikt tot
0,9 m voor de print; fijne profielen worden blinde nissen. De gemeten
AHN-top correspondeert met 36,70 m boven de grondreferentie; het register
noemt historisch 37,90 m. Het model volgt de meetbare AHN-top; het zeer
dunne historische topornament is niet op originele dikte gereproduceerd.

Weggelaten: tralies, zinkruitpatroon, dakhekwerk, regenpijpen en ornamenten
kleiner dan 0,9 m; interieur als volle kern voor steunvrij printen. De
afzonderlijk geregistreerde gebouwen van het gevangeniscomplex vallen
buiten de pandvervanging en blijven op de kaart bestaan.

## Controle

Generator: NoError, één verbonden volume, genus 0, 22.610 driehoeken,
79.783,7 m³. STL 1:1000: 112,88 × 67,82 × 37,00 mm.
Printvoorbereiding op 1:1000 met de echte exportfunctie: zowel 89° als
45° geeft 83.431,39 mm³ en NoError; geen extra overhangvolume nodig.
De voetopvulling naar de kaartonderplaat zit in beide resultaten.

GLB bekeken met three.js GLTFLoader. Vier gelijke hoeken naast de
PDOK-reconstructie, telkens 30° hoogte, vergeleken met schuine RCE/Commons-foto's:

- −35°: vloeiend koepeldak, dakvensters, roeven, cellagen en westvleugel.
- 55°: lantaarn, vier torens met kantelen en zichtbare oostelijke gang.
- 145°: zuidelijke cellagen en westelijke U-aanbouw met eigen lagere hoogte.
- 235°: westelijke nok, schoorstenen, daklichten en gevelnissen.

Aan elke kant voegt het model reliëf en regelmatige bouwvormen toe.
Kaartpositie, oriëntatie, kleur, maaiveld en omschakeling PDOK/landmark
daadwerkelijk gecontroleerd. Volledige preview-export en 3MF, RD
`113315,400240,113525,400450`, schaal 1:1000: 210 × 210 mm, 218 objecten,
121.222 driehoeken, totale printhoogte 46,1 mm. Hele model past in de
uitsnede. Export ook met three.js ThreeMFLoader bekeken.

`tests/landmark-models.test.ts` controleert de vervanging, behoud van het
administratiegebouw, vier torens, top, vleugels, annex en begrenzing.
Landmarkmodellen- en API-tests groen; controlebeelden en exports blijven
buiten beide repository's.

[Controlekaart](http://127.0.0.1:3037/kaart/51.59028/4.78722/350/1x1/0).

## Bronnen

- [RCE cellengebouw 526096](https://monumentenregister.cultureelerfgoed.nl/monumenten/526096).
- [RCE dienstgebouw 526095](https://monumentenregister.cultureelerfgoed.nl/monumenten/526095).
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0758100000038514).
- [G.Lanting, vooraanzicht](https://commons.wikimedia.org/wiki/File:P1010275copyKoepelgevangenis_Breda.jpg), CC BY 3.0/GFDL; alleen visuele referentie.
- [RCE achteraanzicht](https://commons.wikimedia.org/wiki/File:Achter_aanzicht_-_Breda_-_20040751_-_RCE.jpg).
- [RCE zijaanzicht](https://commons.wikimedia.org/wiki/File:Zijaanzicht_-_Breda_-_20040750_-_RCE.jpg).
