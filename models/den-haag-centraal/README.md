# Den Haag Centraal (Den Haag)

`den-haag-centraal.glb` en `den-haag-centraal.json` zijn het kaartmodel;
`den-haag-centraal-1-1000.stl` is de gesloten print van 121,8 × 134,2 × 62,1 mm.
Reproduceer met `node scripts/generate-den-haag-centraal.mjs`.

RD-oorsprong `[82114,455294]`, X-as `[.6065,-.79508]` naar de treinsporen;
Stichthage ligt aan -X. Straatpeil circa NAP +0,85 m, voet -0,8 m.
Vier straatpunten bepalen de plaatsing, zodat tunnel en busplatform het model
niet laten zakken of zweven. Alleen BAG-pand 0518100000271819 wordt vervangen;
New Babylon blijft zichtbaar.

De stationshal volgt de BGT-overkapping van circa 96 × 120 m, inclusief
uitstekende entrees. Het dak heeft doorlopende schuine vlakken naar lage,
vlakke ruitdeksels op een 8 × 12 m module. AHN-percentielen over opeenvolgende
20 m stroken geven NAP 23,25–23,27 m mediaan en 23,51–23,52 m P90.
De kantoorvleugel heeft twee dakhoogten, eindkernen, dakinstallaties en
veertien raamstroken. Drie glazen halgevels hebben blinde panelen en
een afzonderlijke onder- en bovenzone.

Geschat: kozijnverdeling en nisdiepte 0,35 m, maat en verdeling van de
dakinstallaties en parapetten, ruitranddetails en vereenvoudigde randmodules.
De volledige glazen hal is een vaste kern voor printen zonder steun;
ventilatieluiken blijven dicht. Losse letters, kabels en glasroeden onder
0,9 m zijn weggelaten. Afzonderlijke perronkappen, busoverkapping en
metroviaduct buiten de hal zijn geen onderdeel van dit model.

Controle op 9 oktober 2026: Manifold `NoError`, één solid, 9.450 driehoeken.
Catalogus/API en plaatsingstest groen; GLTFLoader gecontroleerd.
Vier renders vanuit -35°, 55°, 145° en 235° zijn naast dezelfde PDOK-camera
en Commons-foto's bekeken: de ontbrekende hal, ruitdaken en gevelverdeling
maken elke zijde herkenbaarder. Een volledige 240 m uitsnede is geëxporteerd
als preview en 3MF: 216 objecten, 68.196 driehoeken, 240 × 240 × 148,6 mm
(hoogste naburige toren inbegrepen). De printbare overhangcheck is op 1:1000
gedraaid: 480.684 naar 481.097 mm³, 0,1% opvulling, geen losse steun nodig.
Kaartcontrole: http://localhost:3020/kaart/52.08111/4.32389/400/1x1/0.

Bronnen: PDOK BAG, BGT overigbouwwerk
8cc96185-9d1a-5b72-8567-b371e7847b47, Actueel_orthoHR en AHN DSM/DTM
0,5 m, bbox `82000,455000,82400,455440`; [ProRail dakmodules](https://www.prorail.nl/nieuws/de-wybertjes-van-den-haag-centraal),
[Benthem Crouwel](https://www.benthemcrouwel.com/projects/the-hague-central-station),
Commons-foto's Station Den Haag Centraal 2017 (Rijnstraat),
The Hague Central Station, Anna van Buerenplein entrance, 2018,
Anna van Buerenplein, Het nieuwe dak en Den Haag centraal station achterkant
foto2 2009-05-22 (alleen het bestaande kantoor).
