# A'DAM Toren (Amsterdam)

Bestanden: `a-dam-toren.glb` (meters, glTF Y omhoog), `a-dam-toren.json`
(catalogus, hoofdmaten en bronnen) en `a-dam-toren-1-1000.stl` (millimeters,
Z omhoog, permanente 45° printkragen onder romp en kroon).
Generator: `scripts/generate-a-dam-toren.mjs`.

Oorsprong RD **121972,75; 488554,50**, op maaiveld circa NAP +1,8 m. Lokale
+X volgt de romp naar noordoost (36,04° vanaf RD-oost); de kroon draait
hierover 45°. Onderkant −0,7 m. Terreinsamples liggen op de paden rond de
voet, zonder het IJ of de omliggende gebouwen. Vervangt BAG
**0363100012071204**, inclusief lage vleugel en plint.

De GLB bevat één gesloten bouwvolume met de glazen plint en vleugel,
vier dubbele V-pylonen, de torenkern, een romp met 18 rijen blinde
gevelnissen, aangebouwde brandtrap met bordesnissen, ronde tussenbouw
(diameter 22 m), gedraaide kroon met vooroverhellende gevels,
terrasbalustrade, dakopbouw met V-vormige bovenranden en vier installaties,
ventilatiemast en twee schommelportalen. De mast heeft drie blinde
Andreaskruizen. De vrijstaande delen zijn minimaal 0,9 m dik.

AHN4/DTM geeft maaiveld +1,8 m NAP; kroonterrassen circa +78,1 m en
masttop +96,7 m. Gebouwvoet en vleugel komen uit BAG, richting uit de rechte
gevels. De ronde tussenbouw van 22 m en kern van 10 × 10 m zijn beschreven
in de bouwpublicatie. Geschat uit foto's/AHN: overgangen tussen romp,
tussenbouw en kroon, V-pylonbreedte 2 m, brandtrapdoorsnede 1,45 × 2,7 m,
gevelraster, blinde nisdiepte 0,33 m, vorm en maten van dakopbouw en
installaties, schommelvorm. Schommels en terrasrand zijn verbreed tot
0,9 m. Dunne glaspanelen zijn als gesloten gevels vereenvoudigd;
kozijnen, kabels, losse stoelen, antennes en schotelantennes onder 0,9 m
zijn weggelaten. De mastletters zijn blinde reliëfs.

Controle: Manifold NoError, één verbonden bouwvolume. Hele gebouw in een
110 × 110 m preview-export op 1:1000, inclusief PDOK-terrein en 3MF.
Printbare overhang geeft circa 2,4% opvulling; afzonderlijke STL heeft
vaste kragen voor steunvrij printen. De GLB behoudt de echte vrije vorm.
Webshoptest controleert hoogte, georeferentie, ronde tussenbouw,
kroonrotatie en de hele vleugel. Vier schuine vergelijkingen −35°, 55°,
145°, 235°: de ronde tussenbouw, kroonuitkraging en pylonen blijven in elke
richting leesbaar; gevelraster, plintramen, schommels, installaties en
Andreaskruizen ontbreken in PDOK. Controlebeelden blijven buiten de repo.

Bronnen:

- PDOK BAG WFS, AHN4 DSM/DTM 0,5 m en actuele orthoHR, geraadpleegd 8 oktober 2026.
- [Arcam architectuurgids](https://arcam.nl/architectuur-gids/adam-toren/).
- [Bouwpublicatie met constructiematen](https://www.staalmakers.nl/projecten/adam-toren-amsterdam/).
- [Dakopbouw, Marion Golsteijn](https://commons.wikimedia.org/wiki/File:Top_A%27DAM_Toren.JPG), CC BY-SA 4.0, visuele referentie.
- [Schuin vanaf het IJ, Slaunger](https://commons.wikimedia.org/wiki/File:Shell_Tower_Amsterdam-Noord_from_tour_boat_2016-09-12.jpg), visuele referentie; foto's niet meegeleverd.

Eigen vereenvoudigde geometrie; bronbeelden blijven buiten de repository.
