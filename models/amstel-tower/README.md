# Amstel Tower (Amsterdam)

Powerhouse Company, opgeleverd in 2018: woontoren met afgeronde balkons,
hotelbasement en vier lage bovengrondse bouwdelen bij het busplatform.

## Bestanden

- `amstel-tower.glb`: meters, Y omhoog, vijf gesloten `building:`-nodes.
- `amstel-tower.json`: catalogus, positie, vervanging en bronmaten.
- `amstel-tower-1-1000.stl`: millimeters, Z omhoog, vijf losse volumes.
- `amstel-tower-grondplaat-1-1000.stl`: dezelfde gebouwen met een verbonden
  grondplaat van 1 mm voor een zelfstandige print.
- Generator: `scripts/generate-amstel-tower.mjs`, zonder netwerkinvoer;
  `node scripts/generate-amstel-tower.mjs` reproduceert de bestanden.

## Positie en hoogtes

Oorsprong RD **(123100, 484300)**, lokale X oost en Y noord. Z=0 is
**NAP +0,50 m**, gemeten straatniveau ten zuiden van de toren; onderkant
z=-0,90 m verankert de gebouwen in het ruwe PDOK-terrein. De lange hotelas
staat op **20,1 graden in RD**. De toren heeft een andere, asymmetrische
gevelvorm: Bezierhoeken verbinden de rechte gevels uit het AHN-silhouet.

`replacesBuildings` bevat **NL.IMBAG.Pand.0363100012246480**. Onder dit BAG-pand
vallen ook garage en lage gebouwen bij het busplatform. De garageplaat en
het verhoogde busplatform zijn al terrein in PDOK en blijven uit de GLB;
de vier bovengrondse gebouwen blijven als eigen nodes behouden.

Vier vaste maaiveldpunten liggen op de straat en op het hogere plein;
het laagste gemeten PDOK-punt is 43,4537875 m ellipsoïdisch. De terugval
`groundHeight` is gelijk aan deze hoogte en `groundOffsetMetres` is 0.

| Bouwdeel | Hoogte in m NAP | Basis |
| --- | ---: | --- |
| Hotel | 25,40 | AHN en PDOK LoD2.2 |
| Woontorendak | 98,83 | AHN en PDOK LoD2.2 |
| Eerste kroontrap | 101,03 | AHN en PDOK LoD2.2 |
| Dakopbouw | 103,75 | AHN en PDOK LoD2.2 |
| Hoogste dakdetail | 104,01 | AHN |
| Lang laag gebouw | 6,33 | PDOK LoD2.2 en AHN |
| Noordelijk horecagebouw | 5,90 | PDOK LoD2.2 en AHN |
| Kleine dienstgebouwen | 3,67 / 3,08 | PDOK LoD2.2 |

De opdracht noemt 100 m en 2017; de architect noemt 105 m en oplevering
2018. Het model volgt de gemeten daken en de architect voor het bouwjaar.
De 3D BAG-feature-API gaf een serverfout; dakcontouren zijn daarom uit de
daadwerkelijke PDOK LoD2.2-tegel gelezen en tegen AHN gecontroleerd.

## Bouw en print

Een doorlopende afgeronde schacht, hotelprisma's, twee echte kroontrappen,
dakinstallatie en lage bouwdelen vormen de massa. De balkonbanden volgen
de echte verdiepingen: **24 woonlagen met een steek van 3,06 m** boven het
hotel en zes hotellagen met 3,40 m steek. Dit zijn geen gestapelde
DSM-hoogteplakken. Glas en loggia's zijn blinde nissen van **0,35 m**.

De balkonuitkraging is 1,2 m bij de toren en 1 m bij het hotel. De platen
zijn voor 1:1000 verdikt tot **0,9 m**, met 45 graden ondersneden. Glaspuien
en de toegang zijn als blinde nissen weergegeven; de eerste dikke
balkonrand vormt de entreeluifel. De GLB bevat geen losse grondplaat.

## Geschat en weggelaten

Geschat uit de architectfoto's: laagsteek, vensterverdeling, nisdiepte,
balkonprofiel, luifelprofiel en exacte kromming tussen gemeten gevelpunten.
De hotelhoeken zijn geregulariseerd in het stelsel van 20,1 graden; kleine
afwijkingen van de BAG-voetafdruk zijn hiermee vereenvoudigd. De lage
daken zijn vlak gemaakt waar de LoD2.2-variatie minder dan 0,15 m is.

Weggelaten: afzonderlijke glazen balkonleuningen, kozijnen en
paneelranden, omdat hun dikte ruim onder 0,9 m ligt; de dunne zonnepanelen
blijven opgenomen in de hoogte en massa van de dakopbouw, zonder losse
plaatjes. Er staat geen dubbel garage-terrein of busplatform in het model.
Het naburige station, de stationluifels en de perronkappen hebben eigen
BAG-panden en worden door PDOK behouden.

## Controle

- Vijf gesloten nodes, elk één verbonden volume, `NoError`; de STL met
  grondplaat is één verbonden volume.
- Volledige plaatsingstest in `tests/landmark-models.test.ts`: vijf nodes,
  toren- en hotelhoogtes, alle 24 balkonranden, gevelreliëf en geen plaat
  op het busplatform.
- GLTFLoader en vier schuine modelrenders gecontroleerd tegen dezelfde
  vier aanzichten van de echte PDOK-reconstructie en architectfoto's.
- Printbare overhang op **1:1000, 45 graden**: hoofdgebouw circa **0,30%**
  extra volume, lage gebouwen maximaal **0,19%**, steeds `NoError`.
- Kaart met landmarkschakelaar aan/uit gecontroleerd; volledig complex in
  een preview van **180 × 180 m op 180 × 180 mm**, met 1 mm grondplaat,
  hoogteversterking 1 en zonder gegenereerde bruggen geëxporteerd.

## Bronnen

- [Powerhouse Company, Amstel Tower](https://www.powerhouse-company.com/amstel-tower):
  ontwerp, oplevering, verdiepingen, plattegrond en schuine gevelbeelden;
  foto's **Sebastian van Damme**, alleen als referentie bekeken.
- [Wikimedia Commons, Amstel Tower](https://commons.wikimedia.org/wiki/Category:Amstel_Tower):
  broninformatie en controle op gebouwidentiteit; foto's niet meegeleverd.
- PDOK BAG-WFS, pand 0363100012246480 (**CC0**), 12 oktober 2026.
- PDOK AHN DSM/DTM 0,5 m (**CC0**) en Actueel_orthoHR, 12 oktober 2026.
- PDOK gebouwtegel LoD2.2: daken en voetafdrukken, **3D BAG, TU Delft/3DGI,
  CC BY 4.0**. Alleen gemeten vormen gebruikt; geen Mapbox-geometrie.
