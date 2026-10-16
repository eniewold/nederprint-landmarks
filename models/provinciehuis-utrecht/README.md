# Provinciehuis Utrecht (Utrecht)

Voormalig Fortis-hoofdkantoor aan Archimedeslaan 6, sinds 2012 het Huis voor de provincie. Het model omvat één smalle torenschijf, beide lage kantoorvleugels, het ronde dakpaviljoen, het taps toelopende auditorium, de gebogen entree en twee entreepylonen. De backlogomschrijving van twee gekoppelde schijven komt niet overeen met de geraadpleegde foto's.

## Bestanden en opnieuw genereren

- `provinciehuis-utrecht.glb`: meters, Y omhoog, één gesloten `building:`-node.
- `provinciehuis-utrecht.json`: RD-plaatsing en bronmaten.
- `provinciehuis-utrecht-1-1000.stl`: millimeters, Z omhoog, vlakke onderkant.
- Generator: `node scripts/generate-provinciehuis-utrecht.mjs`; `--out` wijst naar een catalogusmap, `--scale` wijzigt de losse STL-schaal.

## Plaatsing en gemeten bouwdelen

RD-oorsprong `[138965,456310]`, lokaal stelsel 20,5° linksom ten opzichte van RD-oost; de contouren volgen de afzonderlijk gemeten gevellijnen. Lokaal Z=0 correspondeert met de referentie NAP +2,05 m. Drie eigen straatpunten bepalen de plaatsing op het PDOK-terrein; terugval 45,45023 m ellipsoïdisch en `groundOffsetMetres=-0.15`. Het model vervangt alleen BAG-pand `0344100000048051` (1995), inclusief de ondergrondse garage binnen dezelfde registratie. Buren blijven behouden.

De torenkroon ligt op NAP +88,878 m, de dakput op +87,14 m. De lage west- en oostvleugels hebben daken op +13,963/+13,972 m, het ronde dakpaviljoen op +16,497 m. Het auditorium volgt één AHN-vlak `zNAP=17.161462+0.001452311*x-0.077221132*y`, met een afgeronde zuidkop en drie daklichten. Het model gebruikt benoemde bouwdelen, prisma's, een cilinder, een doorlopend dakvlak en omhullenden; geen gestapelde hoogteplakken.

De brede BAG-contour omvat ook de parkeerkelder. Die verbindt het losse STL-model alleen onder maaiveld; de bovenkant van het parkeerterrein en de tuin worden niet als een extra gebouwplaat boven het bestaande PDOK-terrein geplaatst. Het AHN-parkeerdak rond +4,121 m is daarom uitsluitend als meetwaarde vastgelegd.

## Geschat en vereenvoudigd

Vensterbreedte, verdiepingsteek, de grote glasvelden en het raster zijn uit foto's geschat; de minder goed gefotografeerde tegenoverliggende gevel gebruikt hetzelfde regelmatige raster. Vensters zijn blinde nissen van 0,36 m met schuine bovenzijde. De twee kroonlagen hebben blinde nissen van 0,48 m in plaats van vrij overspannen open frames. De ingang krijgt een vereenvoudigde gebogen gesloten luifel met een doorlopende onderzijde; het fijne staalraster is weggelaten. Pylonen zijn gesloten platen van 1,2 m dik met een geschatte top op NAP +29,5 m. Dakmachines en daklichten zijn vereenvoudigd uit ortho en AHN. Ronde kleine auditoriumvensters, vlaggen, gevelvoegen, installatieroosters en leuningen onder 0,9 m zijn weggelaten; letters en kleuren volgen het kaartthema en zijn geen los reliëf.

## Controle

GLB en STL: `NoError`, één verbonden volume, genus 0; GLB 22.928 driehoeken. De canonieke Float32-mesh is gecontroleerd, ook na 45°-overhangverwerking: één verbonden volume zonder ingesloten holtes, circa 0,18% extra opvulling. Voor 1:1000 zijn vensterpenanten, kroonwanden en pylonen robuust gehouden. De permanente regressietest controleert de dakhelling op twee plaatsen, dakhoogtes, gevelreliëf, verbondenheid en maaiveldplaatsing. Kaart aan/uit, vier schuine richtingen en GLTFLoader zijn bekeken. Een volledige 240 × 240 m-uitsnede is op 1:1000 als preview geëxporteerd; het complex valt volledig binnen de uitsnede. Controlebeelden, foto's en exports blijven buiten de repository.

## Bronnen

- PDOK BAG-WFS, pand 0344100000048051; PDOK LoD2.2-gebouwtegels (Kadaster/PDOK, CC BY 4.0), AHN DSM/DTM 0,5 m en actuele orthoHR, geraadpleegd 16 oktober 2026. Daklijnen uit PDOK zijn vergeleken met het AHN; het losse 3D BAG-item was tijdens het onderzoek niet bereikbaar.
- https://service.pdok.nl/lv/bag/wfs/v2_0
- https://service.pdok.nl/rws/ahn/wcs/v1_0
- https://commons.wikimedia.org/wiki/File:Provinciehuis_Utrecht_vooraanzicht.jpg
- https://commons.wikimedia.org/wiki/File:Provinciehuis_Utrecht_zijaanzicht.jpg
- Beide referentiefoto's: Provincie Utrecht team media, CC BY-SA 3.0; alleen bekeken als vormreferentie, niet opgenomen in de repository.
- https://www.asrnederland.nl/nieuws-en-pers/asr-nederland-verkoopt-voormalig-fortis-hoofdkantoor-aan-provincie-utrecht — eigenaar: locatie, bouwjaar, architect en 18 verdiepingen met auditorium.
