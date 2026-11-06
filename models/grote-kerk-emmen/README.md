# Grote of Pancratiuskerk, Emmen

## Bestanden

- `grote-kerk-emmen.glb` — één landmarknode voor kerk en toren.
- `grote-kerk-emmen.json` — kaartmetadata, RD-herkomst, grondhoogte, BAG-vervanging en bronverwijzingen.
- `grote-kerk-emmen-1-1000.stl` — printmesh op schaal 1:1000, zonder steun.
- `../../scripts/generate-grote-kerk-emmen.mjs` — reproduceerbare modelgenerator.

## Opbouw en ligging

Oorsprong RD: `[256678.5, 534157.0]`; +X loopt oostwaarts langs de kerk-as, +Y noordwaarts. Maaiveld: NAP +23.1 m; modelbasis 0.3 m onder maaiveld. Het gebouw is één gesloten samenhangend deel met afzonderlijke volumes voor de kruiskerk en toren, hipped dakvlakken, veldstenen torenvoet, gemetselde geledingen, galerij, achtkantige klokkenverdieping en ingezwenkte spits. De westelijke hoofdingang is als verhoogd rondboogportaal op het torenvlak weergegeven om steunloos te printen.

## Schattingen en vereenvoudigingen

AHN DSM/DTM op 0.5 m resolutie bepaalde de grondhoogte; daknokken en ranke top zijn op basis van AHN-pixels en schuine foto's geschat. Exacte gootlijnen, dakvlakken, torenprofielen, raamverdeling en portaalmaten zijn benaderd uit de BAG/OSM-omtrek, PDOK-luchtfoto en schuine RCE/Commons-foto's. De dunne metalen galerijbalustrade is vervangen door een printbare gesloten galerijrand. Kerkraamopeningen, klokdetails, leien, fijn metselwerk en de dunne horizontale windvaan zijn op deze schaal weggelaten; de spits loopt door tot een printbare punt.

## Controle

- Generator: `node scripts/generate-grote-kerk-emmen.mjs --components` → `NoError`, genus 0, één component.
- Printmesh: `grote-kerk-emmen-1-1000.stl`, 1320 driehoeken, vlakke modelvoet en geen support boven Z = 0.
- Webshoptest: `keeps the Emmen Grote Kerk and Romanesque tower as one closed, printable 1:1000 landmark` controleert deurrelief, GLB-node, bounds, manifold, één component en steunloze secties op schaal 1:1000.
- Kaartcontrole: `http://localhost:3000/kaart/52.78515/6.89440/200/1x1/0`; 200 × 200 mm preview-snijvlak omvat het volledige model.

## Bronnen

- Rijksdienst voor het Cultureel Erfgoed, monument 510954 (kerk) en 14958 (toren).
- OpenStreetMap-way 273317988 en BAG-pand 0114100000202332.
- PDOK AHN DSM/DTM (0.5 m) en Actueel_orthoHR-luchtfoto.
- Wikimedia Commons, overzichts- en RCE-foto's van de Grote of Pancratiuskerk te Emmen.
