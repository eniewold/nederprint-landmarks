# Watertoren Hazerswoude-Rijndijk (Hazerswoude-Rijndijk)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-hazerswoude-rijndijk.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is een verjongend achtkant (hull), de consolezone een hull van achtkant naar cirkel met consoles als hulls, reservoir, kraag, fries en dakschijf omwentelingsprofielen (96 segmenten), de hoge borstwering cirkelsegmenten, lisenen en pinakels hulls, liftschacht en vleugel prisma's uit de (3D) BAG, de loopbruggen hulls met een schuine onderkant, en vensters, glasvlakken en oculi blinde nissen.

De watertoren aan de Rijndijk, langs de Oude Rijn, werd in 1915 gebouwd naar ontwerp van A.D. Heederik: 28,5 m hoog, reservoir van 200 m³. Sinds 1985 is hij buiten gebruik; van 1999 tot 2003 werd hij verbouwd tot kantoor (eigenaar Hoogvliet Beheer). De toren staat er nog (luchtfoto en 3D BAG 2023). Een achtkante betonnen schacht op acht hoekkolommen met een bakstenen plint draagt via consoles een rond bakstenen reservoir met lisenen, een rondboogfries en een borstwering met pinakels. Bij de verbouwing kwamen de glazen vlakken tussen de kolommen, een glazen opbouw met een ronde dakschijf, een liftschacht met loopbruggen aan de zuidkant en een kantoorvleugel aan de zuidoostkant. Die vleugel van 4 m hoog staat niet in het AHN (opname vóór de bouw), wel in de 3D BAG (puntenwolk 2023) en op de luchtfoto.

## Bestanden

- `watertoren-hazerswoude-rijndijk.glb`: één node, `building:watertoren-schacht-reservoir-opbouw-liftschacht-en-vleugel`.
- `watertoren-hazerswoude-rijndijk.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-hazerswoude-rijndijk-1-1000.stl`: het model op 1:1000 (34,0 × 17,9 × 31,3 mm).

## Oorsprong en oriëntatie

RD-oorsprong [100041.57, 460315.25] (52,12831 N, 4,58459 O): het hart van de cirkel van BAG-pand 1672100000002789 (kleinste-kwadratenfit op de boog, straal 4,54 m, rest 1 mm), op het maaiveld: AHN-DTM NAP +0,2. De top van het DSM ligt 0,2 m van dat hart.

De lokale X-as is RD-oost (`xAxis` [1, 0]). De vlakken van de achtkante schacht staan op k × 45 graden, de kolommen, consoles en lisenen op 22,5 + k × 45 graden. Hoeken hieronder in graden linksom vanaf de lokale X-as: de liftschacht ligt op het zuiden (270 graden), de vleugel op het zuidoosten.

Het BAG-pand omvat de toren, de liftschacht en de kantoorvleugel; het model vervangt het hele pand. `groundSamplePoints` liggen op 6 m ten oosten, westen en noorden, 10 m ten zuiden (naast de liftschacht) en op (5, 5), buiten de vleugel; `groundHeight` 43,6 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (oost 43,628, west 43,737, noord 43,600, zuid 43,626, noordoost 43,599, gemeten 2026-11-06). Het PDOK-pand staat op 43,57. `groundOffsetMetres` is −0,1.

## Onderdelen

Maten en hoogtes boven het maaiveld (NAP +0,2).

- Schacht: achtkant dat verjongt van 7,5 m over de vlakken aan de voet tot 7,1 m op 15,3 m. Per vlak een bakstenen plint met een rondboogvenster (nis van 1,0 m breed, 0,9 tot 2,85 m) en drie lagen glas tussen de kolommen (nissen van 1,9 m breed en 0,25 m diep: 3,95–7,45, 7,95–11,5 en 12,0–14,8 m), zodat op de hoeken kolommen van 1,1 m blijven staan en daartussen dwarsbalken.
- Ringbalk van 15,3 tot 16,08 m, 0,1 m voor de schacht met een kraag van 40 graden.
- Consolezone: van het achtkant naar een cirkel van 4,3 m op 18,0 m, met acht consoles van 0,9 m breed op de hoeken en per vlak een oculus (ruit van 0,9 bij 1,1 m rond 17,15 m).
- Reservoir: kraag tot de natuurstenen onderrand (straal 4,64 m, 18,37 tot 18,84 m), mantel met straal 4,54 m (BAG) tot de lage borstwering op 26,9 m. Dubbele vensters (als één nis van 1,7 m) op 45, 135, 225 en 315 graden, enkele vensters (0,9 m) op 0, 90, 180 en 270 graden, van 19,9 tot 24,0 m. Rondboogfries als band van 0,15 m van 24,67 tot 25,45 m.
- Acht lisenen van 0,9 m breed, 0,25 m voor de mantel, van 24,4 m tot de pinakels op 28,94 m (Wikipedia: 28,5 m).
- Borstwering: laag (26,9 m) boven de enkele vensters, hoog (28,1 m) boven de dubbele vensters.
- Glazen opbouw: cilinder met straal 3,6 m vanaf de borstwering; dakschijf met straal 4,65 m (luchtfoto 9,2 m doorsnede) en een onderkant van 48 graden, bovenkant 30,5 m (AHN en 3D BAG NAP +30,7); lichtkoepel tot 30,95 m (AHN NAP +31,1).
- Liftschacht aan de zuidkant volgens de BAG (2,7 bij 2,6 m met afgeschuinde hoeken) tot 24,4 m (AHN NAP +24,5).
- Drie loopbruggen van 1,55 m breed (BAG) tussen de liftschacht en de toren: 3,8–7,0 m, 12,0–15,0 m en 18,9–22,3 m, met een onderkant die vanaf beide kanten onder 50 graden naar het midden oploopt.
- Kantoorvleugel: contour van het dakvlak in de 3D BAG, 4,0 m hoog (NAP +4,17) met een witte rand van 0,9 m en een groen dak op 3,7 m, een lage strook van 2,9 m aan de noordoostkant (NAP +3,1), drie vierkante dakramen van 1,3 m en een rond luik, 0,5 m boven het dak (luchtfoto).

Nissen zijn 0,25 à 0,3 m diep met een plafond dat naar binnen onder 56 graden oploopt.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Hazerswoude-Rijndijk)): 1915, A.D. Heederik, 28,5 m, 200 m³, buiten gebruik sinds 1985, van 1999 tot 2003 verbouwd tot kantoor, eigendom van Hoogvliet Beheer.
- BAG-pand 1672100000002789 (PDOK, 2026-11-06): cirkel met straal 4,54 m, liftschacht met aansluiting aan de zuidkant, kantoorvleugel aan de zuidoostkant.
- 3D BAG (puntenwolk 2023): dak van de toren NAP +30,7, liftschacht +23,1 tot +25,3, vleugel +4,17 met een lage strook van +3,1.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld NAP +0,2, dakschijf +30,7, lichtkoepel +31,1, liftschacht +24,5; de vleugel ontbreekt nog.
- PDOK-luchtfoto (Actueel_orthoHR): dakschijf van 9,2 m doorsnede met lichtkoepel, vleugel met witte rand, groen dak en dakramen.
- Foto's op Wikimedia Commons (categorie "Watertoren (Hazerswoude-Rijndijk)"): "Rijnwoude 016.jpg" (2007, vanaf het west-zuidwesten), "Rijnwoude 020.jpg" (vanaf het westen, van verder weg) en "Hazerswoude-Rijndijk watertoren bij nacht.jpg" (2007, vanaf het noordwesten).

## Geschat en weggelaten

Geschat: alle hoogtes tussen het maaiveld en de dakschijf komen uit de foto "Rijnwoude 016.jpg", met een schaal die lineair verloopt tussen het maaiveld en de top uit het AHN (circa een halve meter onzeker): de plint, de dwarsbalken, de ringbalk, de consolezone, de onderrand, de vensters, het fries, beide borstweringen, de pinakels (28,94 m; Wikipedia noemt 28,5 m) en de loopbruggen. De breedte van de schacht (7,5 tot 7,1 m), de consoles, de opbouw (straal 3,6 m) en de breedte van de vensters zijn geschaald op de BAG-cirkel. De richting van de schacht (een vlak naar de liftschacht) en van de dubbele en enkele vensters komt uit de foto's en de ligging van de liftschacht; de onderste loopbrug is op de foto deels verborgen. De onderkant van de dakschijf is in het echt vlak en dun en hier een kraag van 48 graden; de vensters (0,5 à 0,6 m breed) staan als nissen van 0,9 m in het model, een paar als één nis van 1,7 m. De vleugel komt uit de 3D BAG en de luchtfoto; er is geen foto van.

Weggelaten: het blinde boogfries in de hoge borstwering, de twee smalle lijsten in het fries, de trapjes naast de pinakels, de stijlen van de glazen opbouw en de balustrade op het dakterras (allemaal smaller dan 0,9 m), de verticale sleuf in de liftschacht, de ingang (op de foto's niet te zien) en het hek rond de tuin.

## Controle

Eén gesloten NoError-node, één component, genus 2 (de lussen door de loopbruggen). In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (80 m uitsnede, steunmethode v2, 45 graden) bevat het model zonder ondersteuningsobject en zonder het PDOK-pand. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een cilinder met een blok ernaast) de verjongende achtkante schacht met kolommen, glasvlakken en plintvensters, de ringbalk, de consoles met oculi, het bredere reservoir met vensters, fries, lisenen, pinakels en borstwering, de glazen opbouw met de dakschijf en lichtkoepel, de losse liftschacht met loopbruggen en de vleugel met rand en dakramen.

Controle-URL: http://localhost:3000/kaart/52.12831/4.58459/200/1x1/0
