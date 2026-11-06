# Watertoren Krimpen aan de Lek (Krimpen aan de Lek)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-krimpen-aan-de-lek.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: onderbouw, gordel, conische schacht met banden, fries, witte ringbodem, reservoir, kraag en borstwering zijn één omwenteling van een radiaal profiel; steunberen en kantelen met consoles zijn hulls; deur, vensters, friesbogen en de openingen in de borstwering zijn blinde nissen met een spitse top.

De watertoren is in 1909-1910 gebouwd naar een ontwerp van Visser & Smit uit Papendrecht; volgens Wikipedia en het monumentenregister (rijksmonument 512470, deel van complex 512469) 47,2 m hoog met een ijzeren reservoir van 250 m³. Een ronde toren van rode baksteen in traditioneel-ambachtelijke stijl met neorenaissancemotieven, buitendijks naast de Lekdijk tussen Krimpen aan de Lek en Lekkerkerk, bij de dienstgebouwen van het waterleidingbedrijf. De toren staat er nog (AHN, luchtfoto, BAG-status "pand in gebruik").

BAG-pand 0643100002039539 (bouwjaar 1909, 74,9 m²) is de toren; het model vervangt dat pand. De buurpanden van het complex (0643100002038040, 0643100002039451, 0643100002038248, 0643100002037880, 14 tot 50 m verder) raken het model niet en blijven staan.

## Bestanden

- `watertoren-krimpen-aan-de-lek.glb`: één node, `building:watertoren-onderbouw-steunberen-schacht-fries-reservoir-en-borstwering`.
- `watertoren-krimpen-aan-de-lek.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-krimpen-aan-de-lek-1-1000.stl`: het model op 1:1000 (10,9 × 10,9 × 48,0 mm).

## Oorsprong en oriëntatie

RD-oorsprong [103622.71, 434374.19] (51,895510 N, 4,640778 O): het hart van de BAG-contour, een cirkel met straal 4,68 m (kleinste-kwadratenfit op de 57 hoekpunten van de schacht). Het hart van het platte dak in het AHN-DSM ligt 0,3 à 0,5 m zuidoostelijker, binnen de pixelgrootte en de registratie van het AHN.

De BAG-contour heeft acht steunberen van 1,0 m breed die tot r 5,47 reiken, op RD 13,5 + k·45 graden. De lokale X-as staat op RD 13,5 graden (`xAxis` [0.97237, 0.23345]), zodat de steunberen op veelvouden van 45 graden in het modelstelsel staan. De ingang (register: noordzijde) ligt tussen de steunberen het dichtst bij het noorden, op model 67,5 graden (RD 81 graden).

De toren staat op een terrein dat van NAP +3,6 aan de dijkzijde (noord) naar +2,75 aan de rivierzijde (zuid) afloopt (AHN-DTM); de dijkkruin ligt op NAP +4,6, 20 tot 30 m ten noorden en westen. Zoals bij een toren in een talud ligt z = 0 op het laagste maaiveld rond de voet en blijft het hogere terrein aan de noordkant aan het PDOK-terrein. `groundSamplePoints` liggen op 6 m van het hart tussen de steunberen. `groundHeight` 46,418 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (zuidwest): 47,217, 47,164, 47,206, 46,881, 46,418, 46,556, 46,554 en 46,692 (gemeten 2026-11-06, linksom vanaf model 22,5 graden). Het verschil met het AHN-DTM is 43,55 tot 43,76 m, dus z = 0 ligt op circa NAP +2,77. Aan de noordkant zit de voet tot circa 0,8 m in het terrein. `groundOffsetMetres` is −0,1.

## Onderdelen

Hoogtes boven z = 0 (NAP +2,77).

- Trasraam: rond, 9,36 m (BAG), tot 1,0 m, met een waterlijst van 45 graden naar de onderbouw.
- Onderbouw: 9,06 m boven de waterlijst, verjongend tot 8,24 m op 11,83 m (NAP +14,6).
- Acht steunberen: 1,0 m breed, aan de voet 0,8 m voor de muur (r 5,47, BAG), voorkant verjongend tot r 4,45 op 11,0 m en dan onder 60 graden terug in de muur.
- Ingang: deur van 1,3 m breed onder een spitse rondboog, van 0,83 m (het maaiveld aan de noordkant, NAP +3,6) tot 4,16 m, 0,4 m diep.
- Gepleisterde sierband van 8,4 m van 11,9 tot 12,53 m; gordel van 7,96 m tot 14,63 m met een band van 8,12 m bovenaan.
- Conische schacht: 7,7 m op 14,63 m tot 7,04 m op 33,18 m, met twee sierbanden van 0,3 m (0,12 m uitkragend) op 20,13 en 28,13 m en in elk van de drie geledingen vier staande vensters van 0,9 m onder een rondboog, per geleding 45 graden verdraaid.
- Rondboogfries van 7,34 m van 33,18 tot 35,48 m met twintig blinde bogen van 0,72 m.
- Witte ringbodem: van 7,34 m onder 28 graden uitlopend naar 8,54 m, tot 37,63 m.
- Reservoir: 8,3 m, van 37,63 tot 45,58 m, met twaalf lange vensters van 0,5 m (38,9 tot 43,4 m).
- Kraag van 8,56 m tot 46,38 m; opengewerkte borstwering van 8,5 m en 0,9 m dik tot 47,18 m met twee spitsboogopeningen per vak; plat dak op 45,93 m (NAP +48,7).
- Twaalf kantelen van 0,9 m breed, 0,2 m voor de borstwering (r 4,45), tot 47,68 m (NAP +50,45), elk op een console die onder 17 graden naar een punt op de reservoirwand loopt (44,68 m). Ze staan tussen de reservoirvensters in.

## Bronnen en maten

- [Wikipedia, Watertoren (Krimpen aan de Lek)](https://nl.wikipedia.org/wiki/Watertoren_(Krimpen_aan_de_Lek)): 1909, Visser & Smit, 47,2 m, 250 m³.
- [Rijksmonumentenregister 512470](https://monumentenregister.cultureelerfgoed.nl/monumenten/512470): onderbouw met steunberen, trasraam met gepleisterde waterlijst, vernieuwde entree in de noordzijde met gedenksteen, gepleisterde sierband boven de onderbouw, conische schacht met iets uitkragende gepleisterde sierbanden en staande meerruitsvensters onder rondbogen, uitgemetseld rondboogfries, iets uitkragend reservoir met lange staande vensters, opengewerkte bakstenen borstwering met kantelen, plat dak.
- BAG-pand 0643100002039539 (PDOK, 2026-11-06): cirkel van 9,36 m met acht steunberen tot r 5,47.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): plat dak NAP +48,7 over 7,5 m; borstwering en kantelen tot NAP +50,0 à 50,5 op de zuidrand; buitenmaat van de kop 8,3 à 8,6 m; mast tot NAP +52,2; maaiveld NAP +2,75 (zuid) tot +3,6 (noord).
- Luchtfoto (PDOK, Actueel_orthoHR): plat dak met kantelen en mast.
- Foto's op Wikimedia Commons: "Krimpen aan de Lek - Watertoren vanaf NW.jpg" (telefoto van reservoir, borstwering en schacht), "Exterieur OVERZICHT WATERLEIDINGBEDRIJF MET WATERTOREN - Krimpen aan de Lek - 20302607 - RCE.jpg" (hele toren), "Krimpen ad Lek, watertoren foto2 2010-07-04 11.27.JPG" (onderbouw, gordel en banden), "Kinderdijk Watertoren (Krimpen aan de Lek).jpg" en "Watertoren (Krimpen aan de Lek).JPG" (vanaf de rivier).

## Geschat en weggelaten

Geschat: alle hoogtes tussen de voet en het dak, uit de telefoto vanaf het noordwesten (24,8 px/m) en de RCE-opname (24,4 px/m), met de reservoirbreedte van 8,4 m uit het AHN als schaal en de kanteelkop uit het AHN als nulpunt: de ringbodem (12,2 m onder de kanteelkop), het fries (tot 14,5 m), de sierbanden (19,5 en 27,5 m), de gordel (33 tot 35,1 m) en de sierband van de onderbouw (tot 35,8 m). De diameters van schacht (7,0 m onder het fries, 7,7 m boven de gordel), fries, ring en reservoir komen uit dezelfde foto's; de verjonging van de onderbouw en het verloop van de steunberen uit de foto van 2010 (sterk perspectief, deels achter bomen). Het aantal vensters (twaalf) en kantelen (twaalf) is uit de telefoto geteld. Plaats en vorm van de ingang zijn aangenomen: het register noemt de noordzijde, de foto's laten haar niet zien; hier een deur onder een rondboog tussen de twee noordelijke steunberen. De plaats van de schachtvensters (vier per geleding) is aangenomen. De kantelen zijn 0,9 m breed in plaats van circa 0,6 m, de borstwering 0,9 m dik, en de borstwering heeft twee openingen van 0,36 m per vak in plaats van vier kleinere; de reservoirvensters hebben een spitse top in plaats van een rechte, zodat de export ze niet opvult.

Weggelaten: de mast met tuidraden op het dak en de bliksemafleider (dunner dan 0,9 m), de gedenksteen boven de ingang (vlak ingemetseld), de ankers (de X-vormen) in de reservoirwand, de vensterverdeling, de lamp aan de voet, het hek en de beplanting rond de toren.

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (120 m uitsnede, steunmethode v2, 45 graden) bevat het model zonder ondersteuningsobject en zonder het PDOK-pand. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een prisma van 9,4 m met acht ribben tot het dak) aan elke kant de verjongende onderbouw met steunberen, de sierband en gordel, de smallere conische schacht met banden en rondboogvensters, het rondboogfries, de uitlopende ringbodem, het bredere reservoir met lange vensters en de opengewerkte borstwering met twaalf kantelen op consoles; aan de noordkant daarnaast de ingang.

Controle-URL: http://localhost:3000/kaart/51.89551/4.64078/200/1x1/0
