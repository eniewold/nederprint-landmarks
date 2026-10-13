# Le Mirage (Utrecht)

## Bestanden en plaatsing

`le-mirage.glb` in meters met Y omhoog, `le-mirage.json` voor de catalogus en `le-mirage-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-le-mirage.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [135896, 453079], X-as [0.4067366430758002, -0.9135454576426009], Z=0 op NAP 1.9 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 45.179891 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0344100000079355, NL.IMBAG.Pand.0344100000117092.

## Bouwdelen, gemeten maten en aannames

Le Mirage ligt aan het Europaplein/Vliegend Hertlaan in Kanaleneiland, niet in Papendorp op de oude backlogcoördinaten. RD-oorsprong [135896,453079] en de gemeten gevelas -66 graden volgen het eigen pand. Hoofd-BAG 0344100000079355 en de apart geregistreerde hoge hoekvleugel 0344100000117092 vormen samen de hele toren. De lagere C-vleugel 0344100000079356, parkeergarage/terrassen en andere kantoorpanden blijven behouden.

Het silhouet bestaat uit een hogere geknikte glasvleugel met vrijwel vlak dak op NAP 86.774 m, een lagere achtervleugel op 76.604 m, westelijke terugloop op 82.43 m, panorama-liftgevel op 83.95 m en hoge hoekvleugel op circa 86.76 m. De backlog omschreef één schuin dak over de hele lengte, maar de vijf dakvlakken zijn gemeten in 3DBAG/AHN4 en worden door de schuine foto's bevestigd. De kleine westelijke overgang is circa 1.5 m scheef in de reconstructie en vereenvoudigd tot zijn mediane niveau 82.43 m. Het gevouwen front volgt BAG-/dakcontouren in doorgaande gevelvlakken, geen gestapelde hoogtelagen.

Maaiveld NAP 1.9 m en drie gecontroleerde straatpunten leveren een ellipsoïdische terugval van 45.179891 m. Vensters staan als 0.35 m diepe blinde nissen in een geschat raster van 3.6 m per rij en 2.7 m per kolom. Nissen zijn 1.65 m breed; circa 1.05 m materiaal blijft tussen de ramen. Brede plintpuien zijn maximaal 0.45 m diep. Iedere nis wordt op negen punten gecontroleerd zodat minstens ruim 1 m massief materiaal achter de gevel blijft; dunne hoeken krijgen geen doorsnijdende nissen.

De panorama-liften zijn een dik gesloten glasvolume met vensterreliëf, geen losse schacht of open raamrooster. De zilveren bovenkroon heeft ondiepe brede bandnissen van 0.2 m. Raamritme, kroonbanden, plintramen en liftglas zijn uit foto's geschat. De interne terugloopvoeg van maximaal 0.5 m is dichtgemaakt; overige gedeelde contourvoegen zijn maximaal 0.05 m vereenvoudigd. De complete bouwgroep heeft genus 0 en één positief materiaallichaam. Er is geen externe pleinplaat onder het model.

## Weggelaten

Logoletters, aluminiumprofielen, losse antennes en andere delen kleiner dan 0.9 m zijn weggelaten. Het kleine AHN-antennevlak van 2.5 vierkante meter op NAP 89.544 m is geen fictieve grote installatiekop geworden. Intern glas- en liftinterieur blijft massief; er zijn geen doorgaande raamuitsneden. De lage C-vleugel, parkeerterrassen en openbare straten/pleinen zijn geen onderdeel van de toren.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 15,630 driehoeken. Printcontrole per node: NoError, 0.08% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: De panorama-liftgevel, westelijke terugloop en ongelijke daken blijven benoemde bouwdelen met blinde glasnissen.; 55 graden: De lagere achtergevel krijgt een gesloten vensterraster en gemeten dakhoogte; geen open raamvoegen tussen de vleugels.; 145 graden: De geknikte voorkant en hoge afzonderlijke hoekvleugel volgen de volledige eigen BAG-contouren.; 235 graden: De brede voorgevel toont het gevouwen front, blinde zilveren kroonbanden, glasplint en vaste raamverdeling..

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 180 bij 180 mm, 216 objecten, 73,252 driehoeken, 89.7 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- https://lemirageutrecht.nl/ (gebouwbeheerder,21verdiepingen,KPF)
- https://lemirageutrecht.nl/gebouw/ (4panoramaliften,renovatie2020)
- https://lemirageutrecht.nl/locatie/ (Europaplein)
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0344100000079355 (TU Delft/3DGI CC BY4.0)
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0344100000117092 (TU Delft/3DGI CC BY4.0)
- https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)
- https://service.pdok.nl/rws/ahn/wcs/v1_0 (AHN4 DSM/DTM CC0)
- https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actuele ortho)
- https://commons.wikimedia.org/wiki/File:Kantoorgebouw_Mirage_in_Utrecht.jpg (Choinowski CC BY-SA4.0)
- https://commons.wikimedia.org/wiki/File:Le_Mirage-01.jpg (T Houdijk publiek domein)
