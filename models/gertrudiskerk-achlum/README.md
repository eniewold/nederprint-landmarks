# Gertrudiskerk (Achlum)

Protestantse kerk op de terp van Achlum (De Terp 1, gemeente Waadhoeke), rijksmonument 15822, oorspronkelijk gewijd aan Sint Gertrudis. Het schip heeft romaanse tufstenen muren uit de 12e eeuw (vooral aan de noordkant zichtbaar, met een spaarveld en rondboogfries); eind 15e eeuw is het verhoogd, kreeg het een nieuwe kap en spitsboogvensters, en kwamen er een driezijdig gesloten gotisch koor met steunberen en een toren bij. De toren kreeg in 1790 een houten klokkeverdieping met een korte, ingesnoerde spits. Restauraties in 1995 en 2012. Het bouwjaar 1900 in de BAG is een fictieve waarde. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters; vervangt BAG-pand 0070100000325796 (schip, koor, toren en de lage aanbouw zijn één pand). Geen ander PDOK-pand raakt de kerk (de buren liggen 30 m verder).
- STL op 1:1000: circa 36,9 × 10,4 × 25,6 mm.
- Genereren: `node scripts/generate-gertrudiskerk-achlum.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (161401,00; 573478,35), lat/lon 53,147997 / 5,482878, midden in het schip. +X loopt langs de nok naar het koor, onder −8,5 graden in RD (`xAxis` [0,98902; −0,14781]); +Y wijst naar het noorden. De lange gevels liggen in de BAG-contour op −8,7 (zuid) en −8,3 graden (noord); de nok in het AHN-DSM loopt daar evenwijdig aan. z = 0 ligt op het laagste maaiveld rond de voet (noordwesthoek van de toren, AHN-DTM NAP +4,58 m); de terp loopt rond de kerk op tot NAP +4,85 m. `groundHeight` 46,04 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints`. `groundOffsetMetres` −0,1, onderkant 0,4 m onder maaiveld.

## Onderdelen

- **Schip**: 26,3 × 9,9 m (BAG), zadeldak van 52 graden (helling 1,28; AHN-dwarsprofielen 1,29 zuid en 1,27 noord) met de nok op +13,4 m (NAP +17,98), goot op +7,06 m. Kroonlijst/goot rondom die 0,25 m uitkraagt (onderkant 45 graden). Op de westgevel naast de toren een deklijst 0,25 m boven het dakvlak.
- **Koor**: driezijdig gesloten, oostgevel van 4,9 m op 4 m voorbij het schip, schuine zijden vanaf de hoeken van het schip (BAG). Het dak loopt met dezelfde goot rond; de drie koorvlakken gaan door het nokeinde op u = 16,5 m (AHN: de nok daalt daar met 1,75 per meter naar de oostgevel). Twee diagonale steunberen op de oosthoeken, 0,9 m breed en 1,1 m uit de hoek, met een versnijding op +3,4 .. +3,9 m en een schuine afdekking tot onder de goot.
- **Vensters en deuren**: noordgevel vier spitsboogvensters (u = 13,9 / 9,7 / 0 / −7,2, het westelijke kleiner boven de noordingang) en de deur; zuidgevel zes spitsboogvensters; één spitsboogvenster in de oostgevel van het koor; de schuine koorzijden zijn blind (foto's RCE 20004419, 20345398).
- **Toren**: bakstenen romp van 5,2 × 5,6 m (BAG) tot +13,6 m met een lijst, spitsboogvenster beneden en smalle venstertjes in de westgevel en zijgevels; houten klokkeverdieping (1790) 0,5 m ingesprongen tot +15,5 m met twee galmgaten per zijde en een kroonlijst tot +16,0 m; ingesnoerde spits: vierkante voet die uitzwaait naar een achtkant van 4,0 m op +17,2 m, en een naald tot +25,2 m.
- **Lage aanbouw** tegen de zuidkant van de toren: 4,8 × 2,3 m (BAG), lessenaarsdak van +3,7 m tegen de toren naar +3,2 m (AHN NAP +8,0 .. +7,6), deur in de zuidgevel.
- **Plint** van 0,15 m rondom tot +0,6 m.

## Geschat

- De top van de spits: het AHN meet NAP +28,6 m (+24,0) op de hoogste cel, 0,5 m naast de punt; met de gemeten helling van 3,8 per meter straal komt de punt op +25,2 m (NAP +29,8). De hoogte van de torenromp (+13,6 m) en de klokkeverdieping (+15,5 / +16,0 m) zijn afgeleid uit de hoeken van de toren in het AHN (romp, NAP +17,5 .. +18,4) en de verhoudingen op de foto vanuit het zuidwesten; de spitsvoet (+16,0 m) uit de AHN-cellen langs de torenrand (NAP +20,4 .. +20,6).
- Vensterbreedtes en -hoogtes uit de frontale foto van de noordgevel (RCE 20004419), geschaald op de muurhoogte; de zes vensters in de zuidgevel staan op de schuine foto vanuit het zuidoosten en zijn regelmatig verdeeld. Maten van de steunberen, galmgaten en de lijsten zijn uit de foto's geschat.

## Weggelaten of vereenvoudigd

- Vensters, deuren en galmgaten zijn blinde nissen (spitse top van 58 graden of een recht gat met een schuin plafond); roeden, glas-in-lood en luiken zijn weggelaten. De galmgaten zijn rondbogen; ze zijn spits gemaakt voor de print.
- Het spaarveld met rondboogfries en de dichtgezette romaanse vensters in de noordgevel, de gedenksteen, de relieffiguur, de ankers en steigergaten in de toren, de wijzerplaat (vlak of kleiner dan 0,9 m).
- De haan en windvaan op het koor en het kruis op de spits, de ontluchtingspijpen op de nok, regenpijpen, het hekwerk en de grafstenen op het kerkhof (kleiner dan 0,9 m).

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 80 × 80 m bevat het model, zonder het PDOK-pand en zonder opvulling (zelfde volume als zonder steun). Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Wikipedia: Gertrudiskerk (Achlum)](https://nl.wikipedia.org/wiki/Gertrudiskerk_(Achlum))
- [Reliwiki: Achlum, De Terp 1 - Gertrudiskerk](https://reliwiki.nl/index.php/Achlum,_De_Terp_1_-_Gertrudiskerk)
- [Rijksmonumentenregister 15822](https://monumentenregister.cultureelerfgoed.nl/monumenten/15822) en [Wikidata Q3915835](https://www.wikidata.org/wiki/Q3915835)
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Gertrudiskerk,_Achlum) (RCE 20345398, 20004414, 20004419; 20140530 Kerk van Achlum; Gertrudiskerk van Achlum; Gertrudiskerk en Jonkerschap; De Terp 1; Open Kerk Achlum; 2023 Achlum, Gertrudistsjerke (2) en (3))
- BAG pand 0070100000325796 en [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0070100000325796)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
