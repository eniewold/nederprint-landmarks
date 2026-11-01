# Watertoren S.T.A.R. (Stadskanaal)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-stadskanaal-s-t-a-r.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht en tankhuis zijn prisma's, het dak bestaat uit vlakken (een `hull` voor de vier schilden met de overstek en een tweede voor het zadeldakje met de puntgeveltjes), de schoren zijn wiggen en de vensters nissen.

De watertoren van de S.T.A.R. (Stichting Stadskanaal Rail) staat op het emplacement van het museumstation Stadskanaal, aan het zuidoosteinde van de werkplaats tussen de sporen. Hij is in 2008 gebouwd om de stoomlocomotieven van water te voorzien: een houten toren van 10 m met een reservoir van 50 m³. Een vierkante schacht (onderin liggende, daarboven staande delen) met schoren op de hoeken draagt een overstekend houten tankhuis met een pannendak: schilden onderaan en een zadeldakje met twee puntgeveltjes in de nok.

De plek stond niet in Wikipedia, Wikidata of OSM. Gevonden via de foto bij de rij in de lijst van watertorens in Groningen (categorie Station Stadskanaal op Commons): de toren staat naast de werkplaats van de STAR. Op de luchtfoto staat hij aan het zuidoosteinde van die werkplaats, naast de kolenwagen, en in het AHN als een blok van 9,9 m met een nok langs de dwarsrichting van de sporen.

## Bestanden

- `watertoren-stadskanaal-s-t-a-r.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een los tankhuis zou een voet tot de grondplaat krijgen.
- `watertoren-stadskanaal-s-t-a-r.json`: catalogusitem met RD-oorsprong, `xAxis`, maaiveldpunten en `groundHeight`; zonder `replacesBuildings`.
- `watertoren-stadskanaal-s-t-a-r-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [258869.64, 557767.08], het hart van het dak in het AHN (nok en dakranden), op maaiveld (NAP +6,35 m). De x-as (`xAxis` [0.7009, -0.7133]) loopt langs de sporen naar het zuidoosten (-45,5 graden in RD: de richting van de sporen in OSM en van de kleinste omhullende van de toren in het AHN), de y-as naar het noordoosten. De nok loopt langs y. Het zuidoostvlak (+x) is het vlak dat de foto "Stoom 2016 Stadskanaal 05" frontaal toont, het noordoostvlak (+y) kijkt naar het spoor met de waterkraan.

De toren staat niet in de BAG en dus ook niet als pand in de PDOK-gebouwtegels; er wordt niets vervangen. Het enige pand in de buurt is de werkplaats (0037100000019517, 2008) op bijna 40 m. `groundHeight` 47,63 is het ellipsoïdische maaiveld: NAP +6,35 plus de NLGEO2018-geoïdehoogte van 41,28 m op de oorsprong.

## Onderdeel `building:schacht-tankhuis-en-dak`

- Schacht van 3,03 x 3,03 m tot in het tankhuis, met in het zuidoostvlak een venster (nis van 1,04 x 0,88 m, 2,58 tot 3,46 m).
- Vier schoren op de hoeken van de schacht, in het vlak van het zuidoost- en noordwestvlak, van 2,02 m schuin naar buiten tot 0,73 m naast de schacht (72 graden); in het echt een plank, hier een wig van 0,9 m dik.
- Tankhuis van 4,40 (x) bij 4,85 m (y) van 4,63 tot 7,1 m, 0,69 m langs x en 0,91 m langs y buiten de schacht, met een vlakke onderkant. Een venster vlak onder de goot in het zuidoostvlak (1,0 m breed) en in het noordoostvlak (0,9 m), beide 6,45 tot 7,05 m.
- Overstek van 0,15 m rondom, met een schuine onderkant (53 graden) van de gevel op 7,1 m naar de goot op 7,3 m.
- Vier schilden: de lange vlakken (normaal ±x) onder 48 graden, de korte (normaal ±y) onder 47 graden tot 8,71 m.
- Zadeldakje van 2,52 m lang met twee puntgeveltjes (2,15 m breed, 1,19 m hoog) in de schilden, nok op 9,9 m.

## Bronnen en maten

- [Lijst van watertorens in Groningen](https://nl.wikipedia.org/wiki/Lijst_van_watertorens_in_Groningen): bouwjaar 2008, hoogte 10 m, reservoir 50 m³; de foto bij de rij leidt naar het station.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +6,35 (6,29 tot 6,58 op de maaiveldpunten), nok NAP +16,24 (9,9 m), lange dakvlakken 48 graden en schilden 47 graden (profielen door het hart), goot rond 7,3 m, dakranden circa 4,7 x 5,15 m, nok circa 2,5 m lang. De binnenste dakpixels liggen binnen 0,3 m van het model (mediaan +0,05 m); alleen de gemengde randpixels wijken af.
- Luchtfoto (PDOK, 8 cm): de toren met zijn zadeldakje tussen de sporen naast de kolenwagen, de afmetingen van het dak (circa 4,7 x 5,5 m met de onscherpe rand).
- OpenStreetMap: het station Stadskanaal van de STAR en de richting van de sporen; de toren zelf staat er niet in.
- Foto [Stoom 2016 Stadskanaal 05](https://commons.wikimedia.org/wiki/File:Stoom_2016_Stadskanaal_05.jpg), bijna frontaal op het zuidoostvlak en met een tele genomen (circa 40 m): met de ooghoogte op 1,6 m en de nok op 9,9 m geeft hij 58,6 px/m in het voorvlak van het tankhuis (4,86 m tussen de gevels) en 57,7 px/m in het voorvlak van de schacht. Daaruit de schacht (3,03 m), de onderkant van het tankhuis (4,63 m), de goot (7,36 m), de voet van de puntgeveltjes (8,69 m), de noklengte (2,52 m), de vensters en de schoren.
- Foto [Estaciones y Trenes Europa 2017 - I - 49671078071](https://commons.wikimedia.org/wiki/File:Estaciones_y_Trenes_Europa_2017_-_I_-_49671078071.jpg), schuin op het zuidoost- en noordoostvlak: het puntgeveltje met een driehoekig raampje aan de noordoostkant, het venster in het noordoostvlak van het tankhuis, de leidingen naar de waterkranen en de schoor op de oostelijke hoek.

## Geschat en weggelaten

Geschat: de breedte van het tankhuis in x (4,40 m, uit het AHN en de luchtfoto; geen frontale foto van het zijvlak), een vierkante schacht (alleen de breedte in y is gemeten), de hoogtes uit één telefoto met een aangenomen ooghoogte (±0,2 m), de plaats van het venster in het noordoostvlak (midden) en de schoren aan de noordwestkant (alleen die aan de zuidoostkant zijn op foto's te zien; gespiegeld aangenomen). Het hart ligt ±0,15 m nauwkeurig: het AHN geeft de dakranden in x en y niet symmetrisch rond de nok. Verdikt: de schoren (planken) tot 0,9 m. Het noordwest- en zuidwestvlak hebben geen vensters of deur, omdat er geen foto van is.

Weggelaten (kleiner dan 0,9 m of te dun): de getande onderrand van het tankhuis (circa 0,1 m), de terugliggende liggende delen onderin de schacht, het driehoekige raampje in het puntgeveltje, het groene kastje op de schacht, de leidingen en armen van de waterkranen aan beide kanten (circa 0,3 m), de lantaarns, de trap of ladder aan de noordoostkant en de betonnen voet (circa 0,2 m, in het maaiveld).

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met 3,7 %: onder de vlakke onderkant van het tankhuis (de echte overhang, een wig van 45 graden tot 3,7 m langs de schacht) en een smalle strook achter in de plafonds van de vensternissen, waar de dunne rand boven het venster de wand of de goot erboven draagt. De doorsneden op 1, 2, 2,9, 3,3, 4,8, 6,7, 7,5, 8,2 en 9,3 m blijven gelijk. Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2) komt alleen een wig steun onder het overstekende tankhuis en een strookje in de vensternissen. Op de kaart staat de toren (zonder PDOK-pand) aan het zuidoosteinde van de werkplaats met de voet 0,11–0,18 m in het maaiveld.

Controle-URL: http://localhost:3000/kaart/52.99685/6.93436/200/1x1/0
