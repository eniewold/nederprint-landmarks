# Watertoren Overveen (Overveen)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-overveen.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is een verjongende tienhoekige afgeknotte piramide met lisenen, lijsten en nissen, het reservoir een cilinder met pilasters, lekdorpel en kroonlijst (schuine onderkanten), de onderkant van het reservoir een schuin vlak met consoles, en de kantelen, hoge kantelen en het torentje zijn blokken met piramidekappen.

De watertoren op een duintop bij de Zeeweg in Overveen (gemeente Bloemendaal) is in 1897-1898 in neorenaissancestijl gebouwd voor het Haarlemse waterleidingbedrijf, naar ontwerp van J. Schotel (rijksmonument 511099). Door de ligging op de duin volstond volgens het register een torenhoogte van 26,70 m (Wikipedia noemt 30,95 m). Het reservoir is van het type Intze II, 1200 m³ en 15,00 m in diameter. De schacht bestaat uit tien kolommen die buiten als lisenen tien traveeën vormen en is in twee delen geleed: onder een gebosseerde natuurstenen plint, in negen traveeën een groot getoogd venster van twee lichten met een oculus en in één travee de getoogde ingang met trap, ANNO 1898 en het Haarlemse wapen; daarboven krachtig geprofileerde lijsten en in elke travee een smal hoog getoogd venster; bovenaan een boogfries waaruit twintig gietijzeren consoles het sterk uitkragende reservoir dragen. De ommanteling van het reservoir heeft twintig pilasters met kapitelen, een fries en een kroonlijst, met daarboven kantelen die door hoger opgemetselde kantelen worden onderbroken. Midden op het dak staat een vierkant torentje met kantelen boven de spiltrap.

## Bestanden

- `watertoren-overveen.glb`: één node `building:tienzijdige-schacht-reservoir-kantelen-en-torentje`, op de duintop.
- `watertoren-overveen.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-overveen-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [101238.38, 489776.13] (52,39320 N, 4,59738 O), het hart van het platte dak in het AHN-DSM (cirkelfit op de dakrand). Het zwaartepunt van BAG-pand 0377100000011913 ligt 0,58 m oostelijker; dat pand is de omtrek van het reservoir (straal 8,5 m). Maaiveld op de duintop AHN-DTM NAP +22,05 (ring van 9 tot 12 m: +21,9 tot +22,2; daarbuiten loopt de duin af tot +18,6 op 25 m). Lokale +X is RD -16 graden (`xAxis` [0.96126, -0.27564]); de ingang kijkt naar -Y (RD -106 graden, zuid-zuidwest). De kolommen staan op 36k graden en de traveeën op 18 + 36k graden. `groundHeight` 65,02 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints` op 9,5 m van het hart (65,02 tot 65,18), zodat het model op de duintop staat en niet naar de voet van de duin zakt; de duin zelf zit in het PDOK-terrein en niet in de GLB. Het model vervangt BAG-pand 0377100000011913, zodat het PDOK-blok verdwijnt.

## Onderdeel `building:tienzijdige-schacht-reservoir-kantelen-en-torentje`

Maten als apothema (hart tot travee) of straal, hoogtes boven het maaiveld van de duintop.

- Schacht: tienhoek, muurvlak van 7,15 m op 1,8 m verjongend tot 6,70 m op 12,0 m. Onderkant op -0,5 m.
- Plint: 0,25 tot 0,3 m voor het muurvlak tot 1,8 m, bovenkant onder 45 graden; op elke kolom een natuurstenen voet (0,75 m langs het vlak aan weerszijden, 0,5 m voor het muurvlak) tot 2,15 m.
- Lisenen op de tien kolommen: 1,0 m breed, 0,25 m voor het muurvlak, van de plint tot 11,0 m.
- Onderste deel: in negen traveeën een getoogde nis van 2,0 m breed van 2,0 tot 5,4 m. Ingang (-Y): getoogde deur van 1,7 m, drempel op 0,3 m, top 4,25 m; trap van 2,6 m breed voor de plint (treden tot 0,3 en 0,12 m).
- Lijst tussen het onderste en het bovenste deel: van 6,4 tot 7,0 m, 0,5 m voor het muurvlak, onder- en bovenkant onder 45 graden.
- Bovenste deel: in elke travee een getoogde nis van 1,0 m van 7,9 tot 10,6 m; boogfries met twee boogjes van 1,0 m per travee van 10,75 tot 11,5 m.
- Twintig consoles (0,6 m breed) op de kolommen en de vensterassen, van 11,0 m tot de onderkant van het reservoir op 13,6 m; daartussen een schuine onderkant van het muurvlak op 12,0 m naar de straal 8,2 m op 13,6 m.
- Reservoir: cilinder met straal 8,2 m van 13,6 tot 21,2 m; lekdorpellijst 8,4 m van 15,05 tot 15,6 m; twintig pilasters (0,8 m breed, straal 8,4 m) van 15,6 tot 19,9 m met kapitelen (8,5 m) tot 20,7 m; tussen elk paar pilasters een getoogde nis van 0,9 m van 16,2 tot 19,7 m.
- Kroonlijst: straal 8,65 m van 21,2 tot 22,3 m, onderkant onder 45 graden.
- Borstwering: straal 8,3 m (binnen 7,6 m) van 22,3 m tot de kantelopeningen op 23,6 m, kantelen tot 24,5 m; plat dak binnen de borstwering op 23,45 m.
- Vijf hoge kantelen boven de kolommen op 0, 72, 144, 216 en 288 graden: pijler van 1,2 m tot 26,1 m met piramidekap tot 26,7 m, schouders van 0,65 m tot 25,3 à 25,55 m, stenen schild op de borstwering. Tussen twee hoge kantelen drie kantelen en vier openingen van elk 1,15 m (buitenkant).
- Torentje: vierkant van 3,2 m, zijden op lokaal 61 en -29 graden (luchtfoto), muren van het dak tot 26,8 m met in elke zijde een blinde spitsboog van 1,0 m; op elke hoek een pinakel van 0,9 m tot 27,6 m met piramidekap tot 28,1 m.

## Bronnen en maten

- [Rijksmonumentenregister 511099](https://monumentenregister.cultureelerfgoed.nl/monumenten/511099): ontwerper, 26,70 m, tien kolommen en traveeën, de twee delen van de schacht met plint, vensters, ingang, lijsten en boogfries, twintig consoles, het reservoir met twintig pilasters, fries, kroonlijst en kantelen, het torentje, het Intze II-reservoir van 15,00 m.
- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Overveen)): bouwjaren, hoogte en inhoud.
- BAG-pand 0377100000011913 (PDOK, 2026-11-04): omtrek van het reservoir (straal 8,5 m). Binnen 60 m staan geen andere panden.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-04): maaiveld NAP +22,05; plat dak +45,6 tot een straal van circa 6,5 m; kantelen +46,1 tot +46,8 (de dennen rond de toren reiken tot +46 en vervuilen de rand); hoge kanteel +48,3 op RD -160 graden; torentje +48,5 tot +49,6 met antennes tot +50,4. Luchtfoto voor de stand van het torentje en de witte kappen van de hoge kantelen.
- Foto's op Wikimedia Commons: "Watertoren-511099" (telelens, vrijwel orthografisch; schaal 56 px/m op het reservoir: breedte van de schacht uit twee lisenen en een venster, geledingen van reservoir en borstwering, twee hoge kantelen 71 graden uit elkaar, het torentje), "Exterieur OVERZICHT - Overveen - 20284847 - RCE" (van ver: reservoir, kroonlijst, kantelen en drie hoge kantelen), "Watertoren - Haarlem - 20099261 - RCE" en "20099260" (van onder, voor de ingang: plint, vensters, lijsten, boogfries, consoles en de stand van de ingang ten opzichte van de hoge kantelen), "Exterieur OVERZICHT - Overveen - 20284900 - RCE" en "Watertoren-overveen".

## Geschat en weggelaten

Geschat: de hoogtes van alle geledingen uit foto's met de bovenkant van de kantelen (24,5 m) en het dak uit het AHN als ijkpunt (onzekerheid circa een halve meter, de onderste geledingen meer omdat die alleen van onder gefotografeerd zijn); de verjonging van de schacht (14,3 naar 13,4 m over de vlakken) uit de telefoto en de omschrijving "verjongend"; de stand van de ingang (zuid-zuidwest) uit de foto's (de ingang ligt anderhalve travee naast een hoge kanteel) en de AHN-piek van één hoge kanteel; het aantal hoge kantelen: het register noemt vier punten, de foto's tonen er vijf op 72 graden (twee naast elkaar op de telefoto, 71 graden uit elkaar) en die volgen hier; de vorm van pijlers, schouders, schilden en het torentje. De onderkant van het reservoir is een schuin vlak van 43 graden met de consoles ervoor in plaats van een vlakke onderkant op consoles, zodat de print zonder steun kan.

Weggelaten: de raamverdeling (twee lichten en oculus als één nis), de reliëfs boven de deur, de verdiepte boogvelden rond de vensters van het reservoir, de lichtstroken in de borstwering (lager dan 0,9 m), de rode banden in het metselwerk, de leuning op het dak, de antennes en de vlaggenmast. De kantelen zijn grover dan in het echt: drie van 1,15 m tussen twee hoge kantelen in plaats van circa acht van 0,6 m, zodat kantelen en openingen op 1:1000 minstens 0,9 mm zijn.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met 0,0003 %: plint, kolomvoeten, lijst, lekdorpel, kapitelen en kroonlijst hebben een onderkant van 45 graden of steiler, de consoles staan 20 tot 31 graden uit het lood, de onderkant van het reservoir 43 graden, de nissen hebben een plafond van 63 graden en de kappen zijn piramides. Via `createModelBundle` op een uitsnede van 80 m op 1:1000 staat het model compleet in de export (alleen een ondersteuningsobject zonder volume in de boogtoppen van de onderste nissen), de voet 0,05 tot 0,33 m in het PDOK-terrein van de duintop; de PDOK-reconstructie van het pand is verborgen. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een gladde cilinder met een vlak dak op 23,6 m en een blok als torentje tot 26,6 m) de verjongende tienzijdige schacht met plint, kolomvoeten, lisenen, vensternissen, lijst en boogfries, de consoles onder het uitkragende reservoir, de pilasters, vensters, lekdorpel en kroonlijst van het reservoir, de kantelen met vijf hoge kantelen, het torentje met pinakels en aan de zuid-zuidwestkant de ingang met trap.

Controle-URL: http://localhost:3000/kaart/52.39322/4.59729/200/1x1/0
