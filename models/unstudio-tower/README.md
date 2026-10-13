# UNStudio Tower (Amsterdam)

## Bestanden en plaatsing

`unstudio-tower.glb` in meters met Y omhoog, `unstudio-tower.json` voor de catalogus en `unstudio-tower-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-unstudio-tower.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [119714, 483360], X-as [0.998440764181981, 0.0558215049931638], Z=0 op NAP -0.6 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 42.369837 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0363100012118868.

## Bouwdelen, gemeten maten en aannames

Het volledige BAG-pand 0363100012118868 bestaat uit een doorgaand hoofdvolume met een lagere noordschouder. Het hoofddak ligt op NAP 81.229 m, de noordschouder op 62.407 m, de hoge schuine dakrand op 82.577 m, de grote installatiekop op 84.568 m en de kleinere westkop op 84.036 m. De dunne oostelijke dakrand is samengevoegd tot een gesloten 1.1 m brede kroonstrook op 83.503 m. Gevelas 3.2 graden en maaiveld NAP -0.6 m volgen BAG/AHN/straatmetingen; de gecontroleerde ellipsoïdische terugval is 42.369837 m.

De witte aluminium gevelbanden en verticale atriumvoids worden door de architect als bepalend voor de toren beschreven. Het gebouw is niet een stapel taps toelopende AHN-plakken. Het massieve hoofdvolume volgt doorgaande gevelvlakken, met circa 1.2-1.3 m diepe gefacetteerde glasvouwen aan zuid en west. De grote verspringende atriumzones liggen blind achter deze vouwen, tot circa 3 m achter de nominale buitengevel en circa 1.8 m achter het gevouwen glasvlak. Hun posities, breedtes en niveaus zijn uit schuine foto's geschat, met circa 1-2 m onzekerheid.

De horizontale witte banden worden zichtbaar door doorgaande 0.35 m diepe blinde glasstroken. De geschatte laagsteek is 3.75 m, glasstrookhoogte 2.3 m en plaatselijke welving tot 0.65 m. Minstens circa 1 m witte band blijft tussen de glasstroken. Bandnissen eindigen circa 0.95 m vóór een gevelhoek en worden één voor één op een gesloten genus-0 gebouw gecontroleerd, zodat de gevouwen hoeken geen aan twee zijden open raamroosters krijgen. De definitieve geometrie hoeft geen bandnis weg te laten door die controle.

De gerenoveerde dubbelhoge lobby is als een brede gesloten glasplint met maximaal 0.55 m diepe blinde puien vereenvoudigd. De noordschouder krijgt zijn eigen lagere dak en de vrijliggende bovenste noordgevel krijgt glasbanden vanaf circa NAP 64 m. Er is geen uitgeholde onderste verdieping, dun open glasframe of publieke straat-/pleinplaat. De naburige Mahlergebouwen, waaronder The Rock en de aangrenzende rode kantoorvleugel, worden niet verborgen.

## Weggelaten

Dunne aluminium-/glasroedes, logoletters, antennes, onderhoudsgieken, losse lamellen en kleine middeninstallaties kleiner dan 0.9 m zijn weggelaten of samengevoegd. Atrium- en lobbyinterieurs blijven massief achter blinde nissen. Detailrondingen en variërende glasprofielen zijn tot doorgaande facetten vereenvoudigd; de oostdakrand krijgt minimum printdikte. Posities en vorm van gevelvouwen/voids en het Moire-bandritme zijn uit foto's geschat.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 18,244 driehoeken. Printcontrole per node: NoError, 0.21% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: De zuidelijke gevouwen glasstroken en verspringende blinde atriumzones maken de gladde reconstructie herkenbaar als UNStudio Tower.; 55 graden: De lagere noordschouder krijgt bandreliëf, een eigen dakniveau en de vrijliggende bovenste noordgevel met gemeten kroon.; 145 graden: De westelijke glasvouw en meerlaagse voids volgen schuine fotos; alle nissen blijven blind en de dakinstallaties blijven benoemde volumes.; 235 graden: De zuid- en westzijde tonen de witte gevelbanden, verticale vouwen en gesloten gerenoveerde glaslobby naast de ongelijke dakvorm..

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 180 bij 180 mm, 235 objecten, 97,972 driehoeken, 92.5 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- https://www.unstudio.com/projects/further/unstudio-tower/ (architect,Moire,banden envoids)
- https://www.unstudio.com/projects/further/unstudio-tower-lobby-remodeling/ (architect,lobbyrenovatie2016-2018)
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012118868 (TU Delft/3DGI CC BY4.0)
- https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)
- https://service.pdok.nl/rws/ahn/wcs/v1_0 (AHN4 DSM/DTM CC0)
- https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actuele ortho)
- https://commons.wikimedia.org/wiki/File:UNStudio_Amsterdam_1.JPG (DennisM CC0)
- https://commons.wikimedia.org/wiki/File:UNStudio_Amsterdam_2.JPG (DennisM CC0)
- https://commons.wikimedia.org/wiki/File:Amsterdam_-_Mahler_4_UN_Studio_(29669086163).jpg (Fred Romero CC BY2.0)
