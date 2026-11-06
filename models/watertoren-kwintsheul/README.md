# Watertoren Kwintsheul (Kwintsheul)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-kwintsheul.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: het frame is een afgeknotte piramide waar per vak twee doorgangen met een spitse top doorheen zijn gesneden, het motorhuisje een prisma onder een dakvlak en het reservoir een geëxtrudeerd vierkant met afgeronde hoeken.

De watertoren hoort bij tuinderij Sonnehoeck aan de Hollewatering 26 in Kwintsheul (Westland). Hij werd rond 1900 gebouwd (Wikipedia; het register zegt "begin van de twintigste eeuw") voor de besproeiing van de druivenkassen en is rijksmonument 518154 binnen complex 518153. Volgens het register draagt een driedelig vakwerkstalen frame met trekstangen een vierkant ijzeren reservoir met klinknagels. Een ijzeren ladder leidt naar het reservoir, en binnen het frame staat een vernieuwd motorhuisje voor de elektrische pomp, van rabatdelen met een flauw hellend lessenaarsdak. De toren staat er nog (luchtfoto en AHN), op de kade aan de sloot tussen de boerderij en de zuidwestpunt van de druivenkas.

De toren is geen BAG-pand: in de BAG-WFS en in de PDOK-gebouwtegels staat op deze plek niets. De kas (pand 1783100000040899) begint 2,7 m oostelijker, het woonhuis (1783100000040898) 7 m westelijker. `replacesBuildings` is daarom leeg; zonder dit model toont de kaart hier alleen terrein.

## Bestanden

- `watertoren-kwintsheul.glb`: één node, `building:watertoren-frame-motorhuisje-en-reservoir`.
- `watertoren-kwintsheul.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints` en `groundHeight`, zonder vervangen pand.
- `watertoren-kwintsheul-1-1000.stl`: het model op 1:1000 (3,1 × 3,1 × 6,3 mm).

## Oorsprong en oriëntatie

RD-oorsprong [76953.6, 449071.1] (52,024488 N, 4,250040 O): het zwaartepunt van de vlakke top van het reservoir in het AHN-DSM 0,5 m (NAP +6,58 à +6,66 over circa 2,0 bij 2,0 m). Het frame staat recht onder het reservoir. Maaiveld AHN-DTM NAP +0,6 op de kade.

De lokale X-as staat 33 graden linksom van RD-oost (`xAxis` [0.83867, 0.54464]), evenwijdig aan het woonhuis en de kas (BAG-randen op 32,6 en 33 graden), zoals het frame op de foto's met het huis meeloopt. -Y wijst naar de sloot (zuidoost), +X naar de kas.

`groundSamplePoints` liggen op 2,2 m in de vier asrichtingen, net buiten het motorhuisje. Verder kan niet: de kas begint op 2,7 m en de sloot op circa 3 m. `groundHeight` 43,85 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten: +X 44,23, -X 44,07, +Y 44,12 en -Y aan de slootkant 43,85, gemeten op 2026-11-06. Onder het hart ligt het PDOK-terrein op 44,09. `groundOffsetMetres` is −0,1.

## Onderdelen

Maten boven het maaiveld (NAP +0,6).

- Frame: een afgeknotte piramide van 3,0 m in het vierkant op het maaiveld tot 2,2 m onder het reservoir op 4,4 m, met vier hoekstijlen van 0,9 m. Het middelste en het bovenste vak zijn open: per vak lopen twee doorgangen dwars door het frame, met zijden langs de binnenkant van de stijlen en een top onder 50 graden (kruisgewelf). Het middelste vak loopt van 1,75 tot 2,5 m, met de top op 2,94 m. Het bovenste vak loopt van 3,25 tot 3,8 m, met de top op 4,10 m. Daartussen blijven de ringen op een en twee derde van de hoogte staan, en daarboven de dragers van het reservoir.
- Motorhuisje: 2,9 m in het vierkant binnen het onderste vak, met een lessenaarsdak van 1,35 m aan de slootkant tot 1,6 m aan de huiskant.
- Reservoir: 2,2 m in het vierkant met afgeronde hoeken (straal 0,25 m), van 4,4 tot 6,0 m.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Kwintsheul)): 1900, voor een tuinderij, een vierkant ijzeren reservoir op een driedelig vakwerkstalen frame, nu gebruikt voor de besproeiing van de kassen. Hoogte en inhoud onbekend.
- [Rijksmonumentenregister 518154](https://monumentenregister.cultureelerfgoed.nl/monumenten/518154): Bij Hollewatering 26; frame met trekstangen, geklonken reservoir, ijzeren ladder, vernieuwd motorhuisje met rabatdelen en lessenaarsdak binnen het frame.
- Foto's op [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Watertoren_(Kwintsheul)): RCE 20389997 en 20390019 (2004, vanaf de overkant van de sloot) en "Watertoren holle watering.jpg" (2009, vanaf de straat). Daaruit komen de verhoudingen: het reservoir is een kwart van de hoogte, het frame is onderaan circa 1,35 keer zo breed als bovenaan, de ringen staan op een en twee derde en het motorhuisje is een kwart van de hoogte. Ook het afgeronde reservoir, de vier stijlen, de kruisende trekstangen, de ladder en het motorhuisje komen van de foto's.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): de vlakke top van het reservoir op NAP +6,58 tot 6,66 (zwaartepunt (76953,58; 449071,08)), circa 2,0 bij 2,0 m; de kade op NAP +0,6.
- PDOK-luchtfoto (Actueel_orthoHR): het reservoir als donker vierkant van circa 2,2 m tegen de zuidwestpunt van de kas, met de randen evenwijdig aan kas en huis.
- PDOK BAG-WFS, BGT en gebouwtegels (2026-11-06): geen pand en geen overig bouwwerk op de toren.

## Geschat en weggelaten

Geschat:

- De hoogte (6,0 m) komt alleen uit het AHN. Op de foto's lijkt de toren hoger: geschaald op een sporteafstand van 0,3 m of op de kasnok komt hij uit op 7,3 à 8 m. De kas is van glas, dus de nokhoogte in het AHN is onzeker, en het AHN-vlak van het reservoir is wel scherp begrensd. Daarom is het AHN gevolgd.
- De breedte van het reservoir (2,2 m), het taps toelopen van het frame, de hoogte van de ringen, de maten van het motorhuisje en de richting van zijn dakhelling komen uit de foto's.
- De stijlen zijn in het echt hoekprofielen van circa 0,15 m en hier 0,9 m, zodat ze op 1:1000 printbaar zijn. De vakken worden daardoor smal (0,5 tot 0,75 m), en de ringen zijn hier dichte platen.

Weggelaten (dunner dan 0,9 m): de kruisende trekstangen in de vakken, de ladder, de klinknagels en naden van het reservoir, de rabatdelen van het motorhuisje en de omgezette bovenrand van het reservoir. Het open onderste vak naast het motorhuisje valt weg, omdat het huisje het vak vrijwel vult. Het woonhuis, de kas en de kade staan als PDOK-reconstructie op de kaart.

## Controle

Eén gesloten NoError-node, één component, genus 6 (de twee kruisende doorgangen in elk van de twee open vakken). In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. De zijden van de vakken staan 5 graden uit het lood, de toppen lopen onder 50 graden, het frame verjongt en het reservoir staat recht op het frame. Een export op 1:1000 (uitsnede van 80 m, steunmethode v2, 45 graden) bevat het model zonder ondersteuningsobject. Kas en woonhuis blijven als PDOK-pand staan. Controlebeelden blijven buiten de repo.

Controle-URL: http://localhost:3000/kaart/52.02449/4.25004/200/1x1/0
