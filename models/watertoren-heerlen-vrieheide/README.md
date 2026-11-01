# Watertoren Vrieheide (Heerlen)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-heerlen-vrieheide.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht, reservoir en opbouw zijn één omwentelingsprofiel, de voegen tussen de banden omgewentelde V-profielen, de deuromlijsting een hull met een schuine bovenkant; deur en vensters zijn nissen.

De watertoren in Heerlerheide, aan het einde van de KSG-straat naast de buurt Vrieheide, is in 1965 gebouwd naar een ontwerp van H.W.F.C. Heman en F.H. Steeneken. Hij is 41,43 m hoog en heeft een reservoir van 1000 m³. Na de oplevering is de oudere toren uit 1915 aan de Heerlerbaan gesloopt. De toren staat op een heuvel naast de begraafplaats Heerlerheide en draagt telecomantennes.

## Bestanden

- `watertoren-heerlen-vrieheide.glb`: één node van klasse `building`, op het maaiveld. De export vult elke node apart op; een los reservoir zou een eigen voet tot de grondplaat krijgen.
- `watertoren-heerlen-vrieheide.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight`, `groundSamplePoints` en het vervangen BAG-pand.
- `watertoren-heerlen-vrieheide-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [195429.58, 325584.10], het hart van de cirkel door de BAG-contour van pand 0917100000018180 (r 7,55 m, afwijking ≤ 0,06 m; de contour is het reservoir), op het plateau rond de voet (NAP +110,9 m, AHN-DTM op 7 tot 8 m uit het hart). Assen in RD-richting (`xAxis` [1, 0]); de toren is rond, alleen de deur op het noordoosten (50 graden vanaf het oosten, waar het klinkerpad uit de BGT op de toren uitkomt) en de vensters van de opbouw hebben een stand.

Het terrein loopt naar het noordoosten af (NAP +109,0 m op 12 m, de Wikipedia-hoogte van 41,43 m geldt vanaf ongeveer NAP +109,2) en naar het zuidwesten op (+111,5). `groundSamplePoints` liggen op de diagonalen net buiten het reservoir (r 8,5 m); de laagste, op het noordoosten (NAP ≈ +110,6), bepaalt de hoogte, zodat de voet aan de lage kant 0,2 tot 0,3 m en elders ongeveer 0,4 m in het terrein staat. De onderkant ligt op -0,6 m in plaats van -0,3, zodat de voet ook bij het gladdere PDOK-terrein op de helling niet zweeft. `groundHeight` 156,54 = NAP 110,9 + 45,64 (NLGEO2018-geoïde op de oorsprong). De dichtstbijzijnde andere panden (schuurtjes van 2010 en 2024) liggen 25 tot 31 m verderop.

## Onderdeel `building:schacht-reservoir-en-opbouw`

- Gladde betonnen schacht van 5,9 m doorsnede van de voet tot de bodem van het reservoir.
- Deur op het noordoosten: nis van 1,8 × 2,5 m in een betonnen omlijsting van 2,6 × 2,9 m die 0,25 m voor de schacht staat, met een bovenkant die onder 56 graden terugloopt naar de gevel.
- Reservoir van 15,1 m: een vlakke bodem die van de schacht (+26,4) naar buiten iets afloopt naar de afgeronde onderrand (laagste punt +25,6 op r 7,0, als kwart ellips tot r 7,55 op +26,2).
- Geribde bekleding van +26,2 tot het dak op +35,8 in vier banden van 2,4 m, gescheiden door V-voegen van 0,2 m diep en 0,6 m hoog (flanken onder 56 graden) op +28,6, +31,0 en +33,4.
- Plat dak op +35,8 en een ronde opbouw (trappenhuis) van 5,2 m tot +39,6 met acht vensters van 1,0 × 1,4 m (penanten van 1,0 m) van +37,5 tot +38,9.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Heerlen_Vrieheide)): bouwjaar, architecten, 41,43 m, 1000 m³.
- BAG-pand 0917100000018180 (PDOK, ‘Pand in gebruik’, bouwjaar 1961 in de BAG, 164 m²): de cirkel van het reservoir (15,1 m).
- 3D BAG (AHN5, 2024): plat dak op NAP +146,67 tot +146,70 (35,8 m boven het plateau) en de opbouw op NAP +150,5 (39,6 m). Het AHN4-DSM van PDOK ziet op het reservoirdak vooral ruis (mediaan 20 tot 25 m), de opbouw wel (NAP +150,45, straal ongeveer 2,4 m in het 0,5 m-raster).
- AHN DTM 0,5 m (PDOK, opgehaald 2026-11-01): plateau NAP +110,7 tot +111,0 rond de voet, helling naar het noordoosten.
- Foto [Watertoren Heerlen Vrieheide](https://commons.wikimedia.org/wiki/File:Watertoren_Heerlen_Vrieheide.jpg) (telefoto van opzij, 23,8 px/m geschaald op de BAG-diameter): schacht 5,9 m, opbouw ongeveer 5,4 m met railing, bekleding 9,5 m in vier banden, afgeronde onderrand, vensterrij in de opbouw.
- Foto [Heerlen-Watertoren Vrieheide](https://commons.wikimedia.org/wiki/File:Heerlen-Watertoren_Vrieheide.jpg): bodem en onderrand van onderaf; waar de schacht de bodem raakt, ligt die ongeveer 0,8 m hoger dan bij een vlakke bodem.
- Foto [Heerlen Watertoren 3812](https://commons.wikimedia.org/wiki/File:Heerlen_Watertoren_3812.JPG): deur met betonnen omlijsting aan de voet, trap vanaf het lager gelegen pad.
- BGT (PDOK): het klinkerpad dat vanaf het noordoosten op de toren uitkomt.

## Geschat en weggelaten

Geschat: de hoogte van de onderrand en de bodem (de foto's tonen alleen de verhouding met de bekleding; het AHN ziet de onderkant niet), de oplopende bodem (uit het perspectief van één foto van onderaf), de vorm van de afgeronde rand, de diameter van de opbouw (tussen foto en AHN in), het aantal, de maat en de hoogte van de vensters in de opbouw, de diepte en hoogte van de voegen (in het echt smaller; zo blijven ze op 1:1000 zichtbaar) en de maat van de deur en de omlijsting. De deurrichting volgt uit het pad in de BGT; geen foto toont de stand op de kaart.

Weggelaten (kleiner dan 0,9 m of te dun): de railing langs de dakrand en op de opbouw, de telecomantennes en hun beugels (tot ongeveer 42 m), de installatiekasten op het dak, de verticale ribben van de bekleding, het plaquette boven de deur, de naad in de schacht en het hekwerk rond de toren. De trap naar de deur hoort bij het terrein en staat niet in het model.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met een factor 1,119: dat is de kegel onder de vrijwel vlakke bodem van het reservoir, dat 4,6 m buiten de schacht uitkraagt. Voegen, deuromlijsting, deur en vensters hebben flanken en plafonds onder 56 graden; de doorsneden op 1,5, 10, 20, 27,4, 30, 34, 36,5 en 37,8 m blijven gelijk. Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2) komt alleen een kegel steun onder de reservoirbodem en splinters in de deurnis. Op de kaart staat de toren op het verborgen PDOK-blok met de voet 0,46–0,76 m in de helling (oorsprong op het laagste diagonaalpunt), nergens zwevend.

Controle-URL: http://localhost:3000/kaart/50.91858/5.96212/200/1x1/0
