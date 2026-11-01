# Watertoren Aalten

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-aalten.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de kern is een zeshoekig prisma met zes losse steunberen, reservoir, kraag, omgang, opbouw, dakrand en kegeldak zijn één omwentelingsprofiel; deur en vensters zijn nissen.

De watertoren aan de Ringweg ten noorden van Aalten is in 1943 gebouwd naar ontwerp van de Lochemse architect G.J. Postel Hzn, in de stijl van de Delftse School. Hij is 37,15 m hoog, heeft reservoirs van 375 en 195 m³ en is gemeentelijk monument.

## Bestanden

- `watertoren-aalten.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een los reservoir of dak zou een voet tot de grondplaat krijgen.
- `watertoren-aalten.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-aalten-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [236784.1, 438893.0], het zwaartepunt van de BAG-contour van pand 0197100000024554 (bouwjaar 1946 in de BAG), op maaiveld (NAP +37,2 m). De top van het kegeldak in het AHN ligt 0,1 m van dat punt. De BAG-contour is een zeshoek met hoeken op 4,4 m van het hart en op elke hoek een steunbeer tot 5,7 à 6,1 m; de steunberen staan gemiddeld op 21,5 + k·60 graden linksom van RD-oost. `xAxis` wijst naar de steunbeer op 21,5 graden (oost-noordoost); de steunberen staan in het model op 0, 60, ... graden en de vakken daartussen op 30 + k·60 graden. Vervangt alleen het BAG-pand van de toren; het kleine pand 29 m noordelijker raakt het model niet.

## Onderdeel `building:kern-steunberen-reservoir-omgang-en-kegeldak`

- Zeshoekige kern (hoeken op 4,4 m, vlakken op 3,81 m) tot in het reservoir, met op elke hoek een steunbeer van 1,3 m breed tot 5,85 m uit het hart, van het maaiveld tot in de kraag (+30,4). In elk vak een brede raamband (1,8 × 0,8 m) vlak onder het reservoir en trapvensters (0,7 × 1,0 m) op +7,6 en +13,6; in het vak naar het zuidzuidoosten de deur (1,4 × 2,4 m) in plaats van het onderste venster.
- Rond reservoir van 11,2 m tussen de steunberen, die er 0,25 m voor staan, van de vlakke witte onderrand op +22,5 (tot 1,8 m uitstekend boven de vakken) tot +29,9, met drie vensters (0,65 m breed) boven elkaar in elk vak.
- Gemetselde kraag onder 57 graden naar de omgang van 12,3 m op +31,0.
- Teruggezette opbouw van 9,2 m met twaalf kleine vensters, overstekende dakrand van 10,7 m (onderkant +33,3, bovenkant +33,8) en een koperen kegeldak van 35,6 graden tot +37,15.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Aalten)): architect, bouwjaar, stijl, 37,15 m, 375 + 195 m³, gemeentelijk monument.
- BAG-pand 0197100000024554 (PDOK, opgehaald 2026-11-01): zeshoekige kern met zes steunberen, hun richting en breedte (1,2 tot 1,8 m in de contour).
- AHN DSM/DTM 0,5 m (PDOK): maaiveld NAP +37,2 rond de voet, hoogste punt NAP +74,61 (antenne); straal van de schacht 5,9 tot 6,2 m met randbloei op 15 tot 30 m, omgang op 31,0 (leuning tot 32,1), dakrand op 33,8 tussen r 4,75 en 5,25, kegeldak van r 4,5 op 34,0 tot de top op 37,0 à 37,2 (helling 0,7). Aan de oostkant heeft het DSM een strook nodata; de westkant is schoon.
- Luchtfoto (PDOK, 8 cm): rond kegeldak van circa 10 m met witte rand, omgang van circa 11,7 m.
- Foto [Iloveachterhoek](https://commons.wikimedia.org/wiki/File:Iloveachterhoek.jpg), van ver en bijna recht: steunberen, vensters in de reservoirvakken, onderrand, kraag, omgang met leuning, opbouw met vensters, dakrand en kegeldak; hoogtes geschaald tussen de omgang en de dakrand in het AHN (42 px/m), breedtes op de schacht.
- Foto [Water Tower Aalten](https://commons.wikimedia.org/wiki/File:Water_Tower_Aalten.JPG), van onderen: de gebogen witte onderrand van het reservoir tussen de steunberen, de raamband eronder en de gemetselde fries onder de omgang.

## Geschat en weggelaten

Geschat: de hoogte van de onderrand (22,5 m) en van de vensters in het reservoir (uit de foto, ±0,5 m), de straal van reservoir (5,6) en opbouw (4,6), de breedte van de steunberen (1,3 m, de BAG geeft 1,2 tot 1,8), de raamband en de trapvensters in de vakken (alleen in één vak op de foto zichtbaar, de rest staat achter bomen; hier in alle zes vakken), de richting en maat van de deur (naar de open plek aan de zuidzuidoostkant op de luchtfoto; geen foto van de voet), het aantal vensters in de opbouw (twaalf), de vlakke onderkant van reservoir en dakrand en de kraaghoek.

Weggelaten (kleiner dan 0,9 m of te dun): de leuning van de omgang, de antennes en schotels, de kleine kap op de top van het dak, de baksteenfries onder de omgang (als kraag gemodelleerd), de witte rand van de onderrand zelf, kabelgoten en installatiekastjes.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met 1,6 %: 31,5 m³ onder de vlakke onderrand van het reservoir boven de vakken en 10,0 m³ onder de overstekende dakrand, de echte overhang. De doorsneden op 1,5, 10, 20,2, 26, 30,5, 32,3 en 35 m (deur, vakken, raamband, reservoir, kraag, opbouw, dak) blijven gelijk. Controlebeelden blijven buiten de repo. In een preview-export op 1:1000 (100 × 100 m) zit de ondersteuning onder de vlakke onderrand van het reservoir in de zes vakken en onder de dakrand, met dunne schoren langs de steunberen. Op de kaart staat de toren op de plek van het verborgen PDOK-blok, met de voet 0,1 tot 0,2 m in het PDOK-maaiveld.

Controle-URL: http://localhost:3000/kaart/51.93246/6.57630/200/1x1/0
