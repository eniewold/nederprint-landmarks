# Watertoren Sneek

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-sneek.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is één omwentelingsprofiel, reservoir en dakrand zijn zestienhoekige omhulsels, de holle kap bestaat uit vijf zestienzijdige afgeknotte piramides met rechte vlakken, de lantaarn is een achthoek met kroonlijst en koepeltje; deur, vensters en blinde bogen zijn nissen.

De watertoren aan de Lemmerweg in Sneek is in 1908 gebouwd naar ontwerp van architect G. Halbertsma in neorenaissancestijl, 44 m hoog met één reservoir van 350 m³. Sinds 1998 is hij kantoor; gemeentelijk monument.

## Bestanden

- `watertoren-sneek.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een los reservoir of een losse kap zou een voet tot de grondplaat krijgen.
- `watertoren-sneek.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-sneek-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [173039.55, 560114.3], het hart van de ronde BAG-contour van pand 0091100000011099 (straal 5,0 m), dat binnen 0,1 m samenvalt met de top van de lantaarn in het AHN, op maaiveld (NAP +0,38 m). Assen in RD-richting (`xAxis` [1, 0]). De vlakken van het reservoir hebben hun normaal op 10 + k·22,5 graden (linksom vanaf RD-oost), de nissen van de schacht staan op 10 + k·45 graden, de vier dakhuisjes op 55 + k·90 graden (bulten in het AHN-DSM per sector, luchtfoto) en de deur op -35 graden, aan het pad naar het zuidoosten. De stand van vensters en deur volgt uit de frontale foto, waarop de dakhuisjes symmetrisch op ±45 graden staan. Vervangt alleen het BAG-pand van de toren; het dichtstbijzijnde andere pand ligt 26 m verder.

## Onderdeel `building:schacht-reservoir-kap-en-lantaarn`

- Basement van 10,0 m tot +8,0 met een schuine band (53 graden) naar de schacht. Zeven blinde rondboognissen (2,2 m breed) met elk een smal venster erin, en in de achtste travee naar het zuidoosten een vooruitspringend deurportaal (2,0 m breed) met fronton tot +6,3, deur en bovenlicht.
- Ronde bakstenen schacht, verjongend van 9,1 m op +8,6 naar 8,0 m op +20,2, met vier vensters op +10 tot +11,7, vier op +13,7 tot +15,8 (afwisselend verdraaid) en een krans van acht oculi op +19. Gemetselde kraag (53 graden) naar de fries van 8,6 m tot +22,0.
- Kegel van schoren (56 graden) van de fries naar de stenen onderrand van het reservoir op +24,3 (11,9 m over de hoeken), band tot +24,8.
- Zestienzijdig reservoir van 11,6 m over de hoeken tot +31,95, met per vlak twee hoge smalle vensters boven elkaar en een breed venster onder de dakrand.
- Overstekende dakrand: schuine onderkant onder 50 graden tot 13,2 m over de hoeken (12,95 m over de vlakken) op +32,9, voorkant tot +33,25.
- Holle zestienzijdige leien kap van r 5,2 op de dakrand naar r 1,85 op +38,0 (34 m: 4,2; 34,9 m: 3,35; 35,9 m: 2,7; 37 m: 2,15), met vier dakhuisjes van 1,2 m breed (voorvlak 3,65 m uit het hart, venster) onder een spits dak tot +37,1.
- Omgang van 3,8 m met het hekwerk als dichte rand van +37,4 tot +39,1, achtzijdige lantaarn van 2,1 m over de hoeken met een blinde boog per vlak tot +42,0, kroonlijst (51 graden) tot +42,65 en achtzijdig koepeltje tot +44,0.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Sneek)): architect, bouwjaar, 44 m, 350 m³, stijl, monument, kantoor.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +0,38, hoogste punt NAP +44,33 (43,95 m boven maaiveld, koepeltje), dakrand 33,0 tot 33,3 m en 13,0 m breed (randen van het DSM in vier richtingen), straal van de kap per meter hoogte en per sector van 22,5 graden, bulten van de dakhuisjes, omgang en lantaarn.
- BAG-pand 0091100000011099 (1908, in gebruik, 78,8 m², 180 hoekpunten) en luchtfoto (PDOK): ligging, ronde voet, zestien ribben van de kap, vier dakhuisjes, pad naar het zuidoosten.
- Foto [20190529 Watertoren Sneek](https://commons.wikimedia.org/wiki/File:20190529_Watertoren_Sneek.jpg), frontaal over de hele hoogte: basement met rondbogen en deurportaal, verjonging van de schacht, vensters en oculi, kraag, schoren en reservoir; geschaald op de dakrand in het AHN (29,1 px/m in de breedte, hoogtes op de dakrand van 33,2 m).
- Foto [Sneek, Watertoren](https://commons.wikimedia.org/wiki/File:Sneek,_Watertoren.JPG), weinig schuin: vensterindeling van het reservoir, dakrand en verhouding reservoir/dakrand (45,4 px/m), kap en lantaarn.
- Foto [Watertoren (Sneek) (d.j.b.) 04](https://commons.wikimedia.org/wiki/File:Watertoren_(Sneek)_(d.j.b.)_04.jpg): holle kap met ribben, dakhuisjes met spitse daken, omgang, lantaarn en koepel.

## Geschat en weggelaten

Geschat: de hoogtes binnen schacht en reservoir (van de foto's, geschaald op de dakrand; de kap, de omgang en de lantaarn staan op de foto's van onderaf ingekort en komen uit het AHN), de verjonging van de schacht, de diepte van de nissen (0,2 tot 0,6 m), het aantal en de stand van de vensters op de achterkant (zoals op de foto's), de vensters van het reservoir 0,5 m lager dan op de foto zodat de dakrand op een volle muur rust, de schuinte van de dakrand (50 graden, op de foto een vlakkere lijst), de hoogte van de dakhuisjes en de stand van de achthoekige lantaarn.

Weggelaten (kleiner dan 0,9 m of te dun): de windvaan en de pinakels op de dakhuisjes (tot een spits dak samengenomen), het open hekwerk van de omgang (als dichte rand), de open bogen van de lantaarn (blinde nissen; pijlers van 0,35 m zijn te dun), de afzonderlijke schoren onder het reservoir (als dichte kegel), de tandlijst van de fries, de witte banden in het metselwerk en de natuurstenen kruisen om de oculi (vlak in de gevel), de trap voor de deur.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met minder dan 0,1 % (gemeten 1,00003): kegel, dakrand, kraag en kroonlijst hangen niet steiler dan 45 graden. De doorsneden op 1,5, 15, 23, 28, 30,7, 35 en 40 m (portaal en bogen, vensters, schoren, reservoir, vensters onder de dakrand, dakhuisjes, lantaarn) blijven gelijk. Een eerdere versie met de bovenste vensters 0,2 m onder de dakrand kreeg daar een opvulling: de dunne latei werd onder de overstek verdikt. Naast de 3D BAG (LoD2.2) heeft het model van alle vier kanten het basement met portaal, de verjonging, de kraag en de kegel, het overstekende reservoir met vensters, de holle kap met dakhuisjes en de lantaarn; de 3D BAG is een rechte kolom met een grillige top. Controlebeelden blijven buiten de repo. In een preview-export op 1:1000 (100 × 100 m) zitten alleen splinters ondersteuning in een paar vensterlateien van het reservoir. Op de kaart staat de toren op de plek van het verborgen PDOK-blok, met de voet 0,1 tot 0,3 m in het PDOK-maaiveld.

Controle-URL: http://localhost:3000/kaart/53.02766/5.65605/200/1x1/0
