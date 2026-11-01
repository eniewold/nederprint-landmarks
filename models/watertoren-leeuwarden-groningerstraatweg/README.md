# Watertoren Groningerstraatweg (Leeuwarden)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-leeuwarden-groningerstraatweg.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is één zestienhoekig prisma door de hoeken van de penanten, de travees zijn er boven de dorpel als prisma's uit gesneden, de dakrand is een zestienzijdige afgeknotte piramide, het dak een zestienzijdige kegel; vensters en deur zijn nissen. De verjonging is één lineaire schaal op de hoogte over het hele model.

De Nieuwe Watertoren aan de Groningerstraatweg is in 1925 gebouwd door de Bredasche Beton Maatschappij, 36 m hoog met een reservoir van 1000 m³. In 1973 is hij verhoogd met een groter reservoir en zijn de details in Amsterdamse-Schoolstijl en de ramen achter spuitbeton verdwenen. Sinds 2002 is het de woontoren Aquastate met negen appartementen, met bakstenen penanten en zinken travees.

## Bestanden

- `watertoren-leeuwarden-groningerstraatweg.glb`: één node van klasse `building`, op het maaiveld. De export vult elke node apart op.
- `watertoren-leeuwarden-groningerstraatweg.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-leeuwarden-groningerstraatweg-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [183444.5, 580597.7], het hart van de BAG-contour van pand 0080100000337268 (18,0 × 18,0 m), op maaiveld (NAP +1,0 m; de DTM-mediaan rond de voet ligt tussen 0,9 en 1,4 m). Het hart van de omhullende in het AHN valt er binnen 0,2 m mee samen. Assen in RD-richting (`xAxis` [1, 0]). De acht penanten staan met het midden op 12 + k·45 graden linksom van RD-oost, de travees ertussen op 34,5 + k·45 graden, zoals in de BAG-contour. Vervangt alleen het BAG-pand van de toren; de bergingen uit 2002 ten zuiden en zuidoosten blijven PDOK-panden en liggen minstens 1 m van de voet.

## Onderdeel `building:schacht-met-penanten-travees-en-kegeldak`

- Schacht: acht bakstenen penanten met een vlak van 3,3 m (hoeken op r 9,0 aan de voet, 18,0 m over de penanten) en acht travees ertussen. Het geheel verjongt met 1 − 0,0028·z: 16,1 m over de penanten op de dakrand.
- Travees: tot de dorpel op 19,8 m in het vlak van de penanten (de schacht is daar een zestienhoek); daarboven springen ze 1,1 m in tot het vlak van de BAG-contour (hoeken op r 7,85), tot aan het dak. De dorpel zakt naar buiten iets af.
- Vensters: in zeven travees vijf vensters van 2,2 × 1,8 m boven de dorpel (bovenkant 35,4 tot 22,6 m, steek 3,2 m) en vier van 2,1 × 1,9 m eronder (bovenkant 18,2 tot 7,7 m, steek 3,5 m), als nissen van 0,3 m met een plafond onder 56 graden. De travee naar het zuidoosten (305 graden) is dicht, zoals de zinken travee op de foto.
- Ingang: deurnis van 2,0 × 2,6 m in de travee naar het noordwesten (125 graden), waar het pad van de Groningerstraatweg op de toren uitkomt.
- Dakrand: de bovenkant van de penanten loopt van 35,6 m onder 64 graden naar binnen tot de dakrand op 37,8 m.
- Dak: zestienzijdige kegel van r 6,7 op 37,8 m tot een knopje op 40,6 m (23 graden), met een verdiept dakterras aan de zuidwestzijde (205 tot 250 graden, r 4,7 tot 6,0, vloer op 37,1 m).

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Leeuwarden_Groningerstraatweg)): bouwer, 1925, 36 m, 1000 m³, verbouwing 1973 en woontoren met negen appartementen (2002).
- BAG-pand 0080100000337268 (PDOK): de stervormige contour met de penantvlakken op r 9,0 en de travees op r 7,85, en daarmee de standen van penanten en travees.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld, top NAP +41,65 (40,65 m boven maaiveld), dakrand rond 37,8 m, kegeldak (r 1 op 40,3 tot r 7 op 38,0), het dakterras (vloer rond 37,1 m), de inspringing van de travees boven circa 20 m en de dichte travees daaronder, en de verjonging (straal per sector van 9,1 op 5 m naar 8,0 op 36 m).
- 3D BAG LoD2.2 (bron van de PDOK-reconstructie): alleen het kegeldak op de BAG-contour, recht omhoog geëxtrudeerd.
- Luchtfoto (PDOK, 8 cm): zestienhoekige dakrand, kegeldak met staande naden, dakterras met trappenhuisje, het pad naar de noordwestzijde.
- Foto [Watertoren Leeuwarden 08cw](https://commons.wikimedia.org/wiki/File:Watertoren_Leeuwarden_08cw.JPG) (2007, vanaf het zuiden, schotelantennes voor de dichte travee): gevelindeling met bakstenen penanten, zinken travees, de woonlagen en de schuine dakrand, geschaald op de dakrand in het AHN (15 px/m). De breedte onderaan en bovenaan (verhouding 0,90) bevestigt de verjonging.

## Geschat en weggelaten

Geschat: de hoogte van de dorpel (de foto geeft circa 20 m, het AHN 20 tot 25 m met randpixels), de hoogtes en maten van de vensters en de woonlagen (één foto, 15 px/m), welke travees aan de verborgen noord- en westkant vensters hebben (aangenomen: alle behalve de dichte travee naar het zuidoosten), de plaats en maat van de ingang, de hellingen van dakrand en dorpel, de vorm van het dakterras (de rand is 0,9 m gehouden; in het AHN is hij dunner) en het aantal zijden van dak en dakrand (zestien, zoals de penanten en travees).

Weggelaten (kleiner dan 0,9 m of te dun): het trappenhuisje op het dakterras (steekt nauwelijks boven het dak uit), twee dakramen, het knopje als apart onderdeel, de schotelantennes, de zinken naden en de verschillen tussen zink, baksteen en tegels. De bergingen rond de voet zijn eigen BAG-panden en blijven uit PDOK komen.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vult de 45-gradenopvulling per node, zoals de export die doet, niets op (volumeverhouding 1,000000): de gevels verjongen naar binnen, dorpels, dakrand en dak kijken omhoog en deur en vensters hebben plafonds van 56 graden. De doorsneden op 1,5, 10, 21, 30 en 37,5 m blijven gelijk. Controlebeelden blijven buiten de repo. In een preview-export op 1:1000 (100 × 100 m) krijgt de toren geen ondersteuning. Op de kaart staat hij op de plek van het verborgen PDOK-blok, met de voet 0,1 tot 0,6 m in het PDOK-maaiveld.

Controle-URL: http://localhost:3000/kaart/53.21129/5.81291/200/1x1/0
