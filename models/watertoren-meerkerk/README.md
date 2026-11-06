# Watertoren Meerkerk (Meerkerk)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-meerkerk.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de onderbouw, de afdekking en de schacht zijn achthoekige prisma's en een hull, de lisenen blokken in de richting van de hoeken, reservoir, rand, omloop en kegeldak één omwentelingsprofiel (96 segmenten), het trappenhuis en het torentje cilinders met een kegel, de vensters en de deur blinde nissen met een schuin plafond.

De watertoren aan de Burgemeester Sloblaan 18 werd in 1935-1936 gebouwd voor de Drinkwaterleiding De Alblasserwaard en De Vijfheerenlanden, naar ontwerp van het Technisch Advies Bureau van de VNG in Amersfoort. Hij is 59,72 m hoog, heeft een reservoir van 560 m³ en is een van de eerste watertorens in beton; sinds 1981 is hij wit geschilderd (rijksmonument 515486). De toren staat er nog (luchtfoto en AHN 2026, foto 2021). Een achtkante schacht van glijbekist beton met acht wandvlakken tussen sterk uitstekende hoeklisenen staat op een met baksteen beklede onderbouw met de ingang; daarboven een ronde reservoirmantel, een trapsgewijs uitkragende rand met een omloop en een betonnen kegeldak. Aan de noordwestzijde loopt een halfrond trappenhuis over de volle hoogte, dat boven de omloop eindigt in een torentje met een deur.

## Bestanden

- `watertoren-meerkerk.glb`: één node, `building:watertoren-schacht-reservoir-omloop-dak-en-trappenhuis`.
- `watertoren-meerkerk.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-meerkerk-1-1000.stl`: het model op 1:1000 (15,8 × 15,8 × 59,9 mm).

## Oorsprong en oriëntatie

RD-oorsprong [127932.05, 436833.73] (51,91933 N, 4,99375 O): het hart van de regelmatige achthoek van BAG-pand 0707100000372807 (gemiddelde van de acht hoeken; apothema 5,66 tot 5,82 m, gemiddeld 5,74 m), op het maaiveld: AHN-DTM NAP −0,5 (−0,4 tot −0,6 tussen 5 en 10 m). De top van het kegeldak in het AHN-DSM 0,5 m ligt 0,2 m van dat hart.

De lokale X-as staat 2,3 graden linksom van RD-oost (`xAxis` [0.99919, 0.04013]), loodrecht op het oostvlak van de achthoek; de wandvlakken staan op k × 45 graden en de hoeken op 22,5 + k × 45 graden. Hoeken hieronder in graden linksom vanaf de lokale X-as: de ingang op 45 graden (noordoost), het trappenhuis op 135 graden (noordwest).

`groundSamplePoints` liggen op 10 m in de vier asrichtingen, buiten de omloop; `groundHeight` 42,99 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (oost 44,05, west 43,70, noord 43,91, zuid 42,99, gemeten 2026-11-06). Het PDOK-pand staat op 42,93. Het PDOK-terrein rond de toren is hobbelig (42,7 tot 44,05 binnen 14 m, terwijl het AHN-DTM vlak is): aan de oostkant ligt het tot circa 0,6 m boven de voet van het model. `groundOffsetMetres` is −0,1.

## Onderdelen

Maten en hoogtes boven het maaiveld (NAP −0,5).

- Bakstenen onderbouw: achthoek met apothema 5,74 m (BAG) tot 5,2 m, met een betonnen afdekking die tot 5,6 m schuin naar de wandvlakken loopt.
- Ingang in het noordoostvlak: deur als nis van 1,7 m breed van 1,0 tot 3,0 m, trap van twee treden (tot 1,0 en 0,5 m, 3,4 m breed, 1,8 m diep) en een betonnen luifel van 4 m breed, 0,6 m diep, met de bovenkant op 4,0 m en een onderkant van 50 graden.
- Drielichten in de zes andere vlakken van de onderbouw (niet in het vlak van het trappenhuis): één nis van 1,3 m breed, van 1,45 tot 3,35 m.
- Schacht: wandvlakken met apothema 5,3 m (0,44 m terug), acht hoeklisenen van 1,2 m breed met het voorvlak op 6,05 m (binnen de bakstenen achthoek), tot de onderkant van het reservoir op 34,8 m. Per travee drie vensters boven elkaar (12,6–14,4, 22,6–24,4 en 31,2–32,8 m), behalve in het vlak van het trappenhuis.
- Reservoir: rond, straal 6,25 m, van 34,8 tot 44,2 m; de onderkant kraagt onder 50 graden uit vanaf 5,2 m over de wandvlakken (vanaf 33,55 m). Vier keer drie vensters op 0, 90, 180 en 270 graden (36,5–38,2, 39,6–41,3 en 42,4–43,6 m).
- Uitkragende rand: onderkant van 50 graden van de mantel tot 7,9 m (46,17 m), rechte rand tot de omloop op 47,85 m (15,8 m doorsnede).
- Kegeldak: opstand met straal 5,75 m tot 49,1 m, kegel van 60 graden vanaf 5,5 m op 49,9 m tot de top op 59,65 m.
- Trappenhuis: cilinder met straal 1,65 m, hart op 5,92 m en 135 graden (tot 7,57 m van het hart, zoals de BAG), van de grond tot in de rand, met twaalf traplichten om de 3,35 m (6,15 tot 43,0 m). Boven de omloop een torentje met straal 1,3 m (hart op 6,1 m) tot 49,9 m met een deur als nis en een kegeldakje van 60 graden tot 52,15 m.

Nissen zijn 0,3 m diep met een plafond dat naar binnen onder 56 graden oploopt.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Meerkerk)): 1936, Technisch Advies Bureau Nederlandse Gemeenten, 59,7 m, 560 m³, een van de eerste betonnen watertorens; in 2010 verkocht.
- [Rijksmonumentenregister 515486](https://monumentenregister.cultureelerfgoed.nl/monumenten/515486): achthoekig, glijbekist beton met acht wandvlakken tussen hoeklisenen, bakstenen onderbouw met de ingang (trap, luifel) en drielichten, drie vensters per travee, ronde reservoirmantel met vier keer drie vensters, kegeldak, trapsgewijs uitkragende rand met omloop, halfrond trappenhuis aan de noordwestzijde met een bovenbouw met deur naar de omloop.
- BAG-pand 0707100000372807 (PDOK, 2026-11-06): regelmatige achthoek met de uitbouw van het trappenhuis aan de noordwestzijde.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld NAP −0,5, top NAP +59,13, kegel met helling 1,77 (60,5 graden), omloop rond NAP +46,3 à +47.
- PDOK-luchtfoto (Actueel_orthoHR): omloop van 15,8 m doorsnede, torentje aan de noordwestzijde.
- Foto's op Wikimedia Commons (categorie "Water tower of Meerkerk"): "Watertoren Meerkerk 2021.jpg" (vanaf het noordoosten, telelens), "Watertoren Meerkerk Trappehuis.JPG" (vanaf het noordwesten), "Watertoren Meerkerk Entree.JPG", "Watertoren Meerkerk 1.jpg" en "2.jpg".

## Geschat en weggelaten

Geschat: alle maten boven de onderbouw behalve de kegel en de top komen uit de foto van 2021 (telelens, recht op een hoek), horizontaal geschaald op de BAG-achthoek en verticaal op de kegel uit het AHN: de straal van het reservoir (6,25 m), de onderkant (34,8 m) en bovenkant (44,2 m) van de mantel, de rand en de omloop (47,85 m; het AHN geeft hier alleen ruis), de diepte van de wandvlakken en de breedte van de lisenen. De hoogtes van de vensters (circa een halve meter onzeker) en de richting van de reservoirvensters komen uit de foto's van het noordoosten en het noordwesten; het trappenhuis en het torentje uit de BAG, de foto van het noordwesten en de verhoging in het DSM. De onderbouw (5,2 m), de deur, de trap en de luifel zijn geschaald op de deur op de foto van de entree. Dat de ingang in het noordoostvlak zit, is afgeleid uit het voetpad van de BGT naar de Burgemeester Sloblaan en de foto; de luchtfoto toont de voet niet door de kanteling van de toren. De vensters zijn in het echt 0,3 à 0,4 m breed en staan als nissen van 0,9 m in het model; de onderkant van de rand is in werkelijkheid getrapt en hier één schuine kraag van 50 graden.

Weggelaten: de ijzeren balustrade van de omloop, de ladder op het dak en de piek op de top (dunner dan 0,9 m), de wangen van de trap en de naam boven de deur, de holle bodem van het reservoir (binnen).

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (80 m uitsnede, steunmethode v2, 45 graden) bevat het model zonder ondersteuningsobject en zonder het PDOK-pand. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een achtkant prisma met een achtkante piramide) de bakstenen onderbouw met ingang, trap en luifel, de hoeklisenen en vensters, het ronde, iets bredere reservoir met vensters, de uitkragende rand met de omloop, het ronde kegeldak en het trappenhuis met het torentje.

Controle-URL: http://localhost:3000/kaart/51.91929/4.99371/200/1x1/0
