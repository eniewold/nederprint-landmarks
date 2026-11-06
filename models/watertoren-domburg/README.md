# Watertoren Domburg (Domburg)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-domburg.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht, gaanderij, rand, dakkraag en bolkap zijn één omwentelingsprofiel (96 segmenten), de vensters, de deur, de reeksen gekoppelde openingen en de gaanderijvensters blinde nissen.

De watertoren van Domburg werd in 1933 gebouwd voor het in 1932 opgerichte gemeentelijk waterleidingbedrijf, naar ontwerp van ir. H. Sangster en uitgevoerd door C. van Prooyen uit Barendrecht. Hij is 28,5 m hoog, had een reservoir van 200 m³ en is rijksmonument 508066. Hij staat op een duintop in De Manteling van Walcheren, liep in de Tweede Wereldoorlog schade op (de gedichte gaten zijn nog te zien) en is nu een woning. De toren staat er nog (BAG-pand 0717100000022552 in gebruik, AHN, luchtfoto). Een ronde, licht verjongende schacht van gele baksteen op een donkerrode plint om een betonskelet; boven het reservoir een gaanderij met een ring van vensters, een brede uitkragende betonnen rand en een lage, met koper beklede bolkap.

## Bestanden

- `watertoren-domburg.glb`: één node, `building:watertoren-schacht-gaanderij-rand-en-bolkap`.
- `watertoren-domburg.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-domburg-1-1000.stl`: het model op 1:1000 (11,4 × 11,4 × 29,1 mm).

## Oorsprong en oriëntatie

RD-oorsprong [24219.39, 399233.72] (51,56681 N, 3,50083 O): het hart van de cirkel van BAG-pand 0717100000022552 (straal 5,04 m, 47 hoekpunten), op het maaiveld van de duintop: AHN-DTM NAP +15,9 (15,88 tot 15,92 tussen 6,5 en 8 m). Het hart van de bolkap in het AHN-DSM ligt 0,1 m ernaast.

De lokale X-as is RD-oost (`xAxis` [1, 0]), Y is noord. Hoeken hieronder in graden linksom vanaf oost: de deur op 225 graden (zuidwest).

`groundSamplePoints` liggen op 6,5 m in de vier asrichtingen, op het terras rond de voet; `groundHeight` 60,15 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (oost 60,159, west 60,159, noord 60,188, zuid 60,149, gemeten 2026-11-06). Het PDOK-pand staat op 59,94. `groundOffsetMetres` is −0,1. Er staat geen ander pand binnen 25 m.

## Onderdelen

Maten en hoogtes boven het maaiveld (NAP +15,9).

- Schacht: straal 5,04 m aan de voet (BAG), lineair verjongend tot 4,62 m op 24,2 m.
- Ingang aan de zuidwestkant: boognis van 1,3 m breed tot 1,5 m met een spitse boog van 55 graden tot 2,43 m.
- Vensters (nissen van 0,9 m breed, 0,3 m diep): aan de zuidwestkant de twee oorspronkelijke smalle vensters naast de ingang (3,6 tot 5,5 m) en de nieuwere vensters met luiken op 5,6–7,2, 8,1–10,7, 12,4–14,4, 19,5–21,0 en 21,9–23,4 m; aan de oostkant vensters op 4,45–6,1, 5,6–7,4, 9,2–11,1 (één van 1,2 m), 13,0–14,8 en 20,5–22,5 m; vijf kleine vensters (14,55 tot 15,35 m) onder het midden van de reeksen.
- Zes reeksen gekoppelde openingen rond het reservoir: gebogen nissen van 42 graden, 17,4 tot 17,9 m, rond 13,5 + k × 60 graden; daartussen zes groepjes van drie als nis van 1,0 m (18,35 tot 18,85 m).
- Gaanderij: 0,12 m terug (straal 4,5 m) vanaf 24,2 m, met 24 vensters van 0,9 m tussen stijlen van 0,28 m.
- Rand: onderkant onder 50 graden van 24,47 m op straal 4,5 tot de rand met straal 5,7 m (25,9 tot 26,1 m).
- Dakkraag: kegel van de rand (26,1 m) tot de voet van de bolkap (straal 4,3 m op 26,65 m).
- Bolkap: het AHN-profiel van 26,65 m op straal 4,3 tot de top op 28,81 m (NAP +44,71), vrijwel een paraboloïde.

Nissen hebben een plafond dat naar binnen onder 56 graden oploopt.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Domburg)): 1933, Hendrik Sangster, 28,5 m, 200 m³; oorlogsschade, gerenoveerd, koperen dakplaten vernieuwd en enkele ramen toegevoegd; nu een appartement.
- [Rijksmonumentenregister 508066](https://monumentenregister.cultureelerfgoed.nl/monumenten/508066): ronde doorsnede met een geringe afname van de buitendiameter; betonnen reservoir met vlakke bodem op vijf kolommen; gele baksteen op een donkerrode plint; gaanderij boven het reservoir als uitzichttoren; bolkap met koper; rondboogingang met betonnen omlijsting aan de zuidwestzijde; smalle hoge vensters en reeksen gekoppelde gevelopeningen.
- BAG-pand 0717100000022552 (PDOK, 2026-11-06): cirkel met straal 5,04 m, bouwjaar 1930 (register en Wikipedia: 1933).
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld NAP +15,9; top van de bolkap NAP +44,71; bolkap per 0,5 m van het hart 28,81 / 28,65 (1 m) / 28,3 (2 m) / 27,7 (3 m) / 26,86 (4 m), dakkraag 26,3 op 5 m en de rand 26,0 op 5,8 tot 6,2 m (boven het maaiveld). 3D BAG: maaiveld 15,69, nok 45,0.
- PDOK-luchtfoto (Actueel_orthoHR): ronde koperen kap met een luikje in het midden, verhard terras met trap aan de zuidkant.
- Foto's op Wikimedia Commons (categorie "Watertoren Domburg"): "Overzicht - Domburg - 20059248 - RCE.jpg" (van de zuidwestkant met het maaiveld), "Watertoren Domburg 2016.JPG" (telelens, oostkant), "Watertoren Domburg P1390216.jpg" en "P1390217.jpg", "Wasserturm Domburg Oktober 2016 01.jpg" en "02.jpg", "Watertoren Domburg - view from the beach.jpg" (noordwestkant) en "Watertoren Domburg - duinside.jpg".

## Geschat en weggelaten

Geschat: alle maten onder de rand. De hoogtes komen uit de RCE-foto (met maaiveld) en de telelensfoto, geschaald op de voetstraal uit BAG en de rand uit het AHN; de bovenstraal van de schacht (4,62 m) uit de breedteverhouding op die twee foto's (0,91), de straal van de rand (5,75 à 5,9 m op de foto's, 5,8 tot 6,2 m in het AHN) is 5,7 m geworden. De richting van de foto's volgt uit de vaste steek van de reeksen en de groepjes van drie (60 graden) en de deur aan de zuidwestkant uit het register; welke foto de oostkant toont is afgeleid uit de vensters die op twee foto's terugkomen. De vensterverdeling op de noordkant (vanaf het strand: alleen de reeksen en één klein venster) is grof. Kleine vensters (0,4 m) en luiken (0,55 tot 1,2 m) zijn nissen van minstens 0,9 m breed, de reeksen gekoppelde openingen één doorgaande nis.

Aangepast voor het printen zonder steun: de onderkant van de rand is in werkelijkheid vrijwel vlak en de vensterring van de gaanderij 0,9 m hoog (24,2 tot 25,1 m). Hier loopt de onderkant onder 50 graden vanaf 24,47 m, en hebben de gaanderijvensters een spitse bovenkant van 62 graden die als gootje in de onderkant van de rand uitloopt (een recht venster liet een hangende latei achter, waaronder de export de hele rand opvulde). Daardoor is de rand aan de buitenkant 0,2 m dik en ligt de bovenkant 0,1 m boven het AHN.

Weggelaten: de donkerrode plint (alleen kleur), de betonnen omlijstingen van deur en vensters, de stijlen van de gaanderij als losse staanders (0,28 m), het luikje in de bolkap, de lamellen van de luiken, het terras met trap rond de voet (zit in het PDOK-terrein) en de antennes van de oude RCE-foto (verdwenen).

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (80 m uitsnede, steunmethode v2, 45 graden) bevat het model zonder het PDOK-pand; het ondersteuningsobject is 0,002 mm³ (een rekenrestje). Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een cilinder van maaiveld tot een veelhoekige kegel) de verjongende schacht met deur en vensters, de reeksen gekoppelde openingen, de vensterring van de gaanderij, de uitkragende rand, de dakkraag en de ronde bolkap.

Controle-URL: http://localhost:3000/kaart/51.56681/3.50086/200/1x1/0
