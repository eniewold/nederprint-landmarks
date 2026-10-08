# Vuurtoren Texel (De Cocksdorp)

GLB in meters (Y omhoog), catalogus-JSON en `vuurtoren-texel-1-1000.stl`
in millimeters (Z omhoog). Generator `scripts/generate-vuurtoren-texel.mjs`.

Hart RD **119438,60; 577404,10**, duinplateau NAP circa +20,91 m.
Lokale +X is zuid, −Y west (entree), −X noord (vluchtladder).
Onderkant −0,5 m. Vier terreinsamples op 5,2 m rond het hart voorkomen
dat de toren naar de lagere duinflank zakt. Vervangt alleen BAG
**0448100000001519**; losstaande woningen blijven PDOK-panden.

Eén gesloten volume: conische stenen mantel, verspringende blinde
raamnissen, deur, vaste vluchtladder met blind rungsreliëf, twee
omgangen, kleinere wachtkamer, glaslichtkap, koepel en radar. Omgangen
hebben schuine kragen en dichte 0,9 m parapetten. Mantel is één continu
conisch oppervlak; koepel een omwentelingsprofiel. Geen duin, muur rond
het plateau of pad toegevoegd dat bestaand terrein zou dubbelen.

BAG geeft hart en voet, AHN de versmalling en hoogtes: romp +26,15 m,
kap +34,70 m, radar +36,15 m boven het plateau. De NVV-objecthoogte
34,7 m correspondeert met de kap; radar volgt AHN-top NAP +57,06 m.
Geschat: omgang-/wachtkamergeleding, koepelprofiel, verspringend
vensterpatroon en 0,35 m nisdiepte, ladderpositie en radarvorm.
Ladder is vast reliëf van 1 m breed, geen losse tralies. Radar is
verbreed tot 0,9 m. Kozijnen, glasstijlen, interieur, dunne kabels,
hekjes en klinknagels weggelaten. Rood is schilderwerk, geen reliëf.

Controle: NoError, één verbonden volume, 6316 driehoeken; 9,2 × 9,0 ×
36,65 mm op 1:1000. Plaatsingstest controleert plateau-samples,
kapversmalling en noordelijke ladder. Volledige 100 × 100 m uitsnede
naar preview en 3MF op 1:1000; 45°-overhang circa 0,2% extra volume.
GLTFLoader, kaartschakelaar en vier renders naast PDOK gecontroleerd;
kleinere lichtkap en echte kapvorm vervangen de brede PDOK-schacht.
Controlebeelden blijven buiten de repo.

Bronnen, 8 oktober 2026:

- PDOK BAG, AHN4 DSM/DTM 0,5 m, actuele orthoHR; bbox 119390,577335,119490,577435.
- [RCE monument 35278](https://monumentenregister.cultureelerfgoed.nl/monumenten/35278).
- [NVV Eierland, objecthoogte](https://www.vuurtorens.org/vuurtoren/eierland/).
- [Oneindig Noord-Holland, twee schuine Commons-foto's](https://onh.nl/verhaal/vuurtoren-eierland-texel-twee-torens-ineen): De Cocksdorp vuurtoren Eierland RM35278 IMG 6024 2020-06-07 en Texel - View East on Eierlandse Vuurtoren II, uitsluitend visuele referentie.

Eigen vereenvoudigde geometrie; bronfoto's niet meegeleverd.
