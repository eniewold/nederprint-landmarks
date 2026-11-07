# Stefanuskerk (Westerbork)

Hervormde kerk aan de Hoofdstraat in Westerbork, rijksmonument 38743. Een kapel ('capella de Burch') wordt in 1206 genoemd; de huidige gotische kerk kwam er begin vijftiende eeuw in de plaats van een houten voorganger. De onderbouw van de toren is dertiende-eeuws, de bovenbouw uit 1778; in 1778 en 1859 is de kerk grondig hersteld. De naam Stefanuskerk raakte na de reformatie in onbruik en is in 2007 officieel teruggekomen. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters; vervangt BAG-pand 1731100000005010 (schip, toren, portaal, gangetje en de noordelijke aanbouw zijn één pand). Geen buurpand raakt de kerk (de dichtstbijzijnde staan 15 m of verder weg).
- STL op 1:1000: circa 28,9 × 23,4 × 27,9 mm.
- Genereren: `node scripts/generate-stefanuskerk-westerbork.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (237309; 541051), lat/lon 52,850379 / 6,609074, op de as van het schip op maaiveld (NAP +17,3 m). +X loopt langs de nok van de toren naar de sluiting, onder -6,1 graden in RD (`xAxis` [0,99434; -0,10626]); +Y wijst naar de noordzijde. De zuidgevel loopt in de BAG-contour onder -6,3 graden, de noordgevel onder -5,8 graden en de westgevel van de toren haaks daarop; de nok in het AHN-DSM en de 3D BAG ligt evenwijdig. `groundHeight` 59,0 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` rond kerk en toren (west van de toren en naast het portaal); rond het schip ligt het maaiveld tot 0,18 m hoger. De aanbouw ten noorden staat 0,3 m lager (PDOK 58,7 m); zijn onderkant (0,4 m onder het maaiveld van de kerk) zit daar nog 0,1 tot 0,2 m in het terrein. `groundOffsetMetres` −0,1.

## Onderdelen

- **Schip en sluiting**: één zadeldak, nok +13,72 m (NAP +31,0; 3D BAG 31,05) op 0,05 m ten noorden van de as, helling 0,87 (41 graden) aan beide zijden (AHN-dwarsprofielen; 3D BAG +0,87 en -0,86). Het schip is 12,1 m breed en 18,3 m lang tot de sluiting; goten +8,56 m (zuid) en +8,37 m (noord). De driezijdige sluiting volgt de BAG-gevellijnen (zuidoostvlak 5,2 m, oostvlak 4,7 m, noordoostvlak 5,5 m); haar drie schilddakvlakken komen samen op het nokeinde op 9,0 m (3D BAG), het oostvlak onder 55 graden.
- **Bakgoot**: het dak steekt 0,3 m over de gevels, met een schuine onderkant van 48 graden (de witte bakgoot op de foto's).
- **Plint** van 0,12 m tot +2,3 m met een waterlijst van 45 graden, waarop de vensters staan (foto's RCE 20254024 en 20254030).
- **Steunberen**: de vier uitsprongen in de BAG langs zuid- en noordgevel (diepte 1,13 en 0,95 m) en diagonale hoekberen op de twee westhoeken van het schip en de vier hoeken van de sluiting, 0,9 m breed, met versnijdingen van 45 graden op +2,3 en +5,0 m en een afdekking van 45 graden tegen de gevel, zoals de zandstenen afdekkingen op de foto's.
- **Vensters en deuren**: spitsboogvensters tussen de steunberen, drie in de zuid- en drie in de noordgevel (het oostelijke breder), één in het zuidoost- en het noordoostvlak van de sluiting (het oostvlak is dicht), de zuidingang onder het middelste zuidvenster.
- **Toren**: 5,5 × 6,0 m, muren tot +17,7 m met een kroonlijst van 45 graden tot +18,05 m, westdeur, galmgaten (west, zuid en noord één, oost twee boven het schipdak) en de wijzerplaat op de zuidkant als ruitvormige nis.
- **Spits**: vierkante voet met 0,3 m overstek die onder 45 tot 51 graden opklimt tot een achtkant van 4,5 m op +19,4 m, en daarop de achtkante naald tot +27,5 m (zoals op de foto's vanuit het oosten: vier hoekgraten onderaan, acht vlakken erboven).
- **Portaaltje** tegen de noordkant van de toren (BAG 2,45 × 2,35 m) met een lessenaarsdak van +4,6 m tegen de toren naar +3,1 m en een deur in de westgevel (westfoto RCE 20254025).
- **Aanbouw** ten noorden van het schip (BAG 13,5 × 6,6 m): zadeldak met topgevels, nok +5,8 m, goten +2,5 m (AHN 5,75 en 3D BAG 5,8), verbonden met het schip door een gangetje van 2,2 m breed met een plat dak op +2,4 m (AHN), op de plek van de dichtgezette noordingang.

## Geschat

- De muurhoogte van de toren, de kroonlijst, de hoogte van het achtkant en de top van de naald: het AHN geeft de dakrand op +18,5 tot +19,0 m en 27,3 m op 0,5 m van de top; de verhoudingen van voet en naald zijn van de foto's uit het oosten en zuiden.
- De toren ligt 0,15 m noordelijker dan in de BAG (v = -3,3 .. 2,7 in plaats van -3,42 .. 2,61): de dakrand in het AHN ligt 0,3 m noordelijker en de top van de spits op v = -0,1.
- Vensterbreedtes en -hoogtes, de deuren, de galmgaten, de wijzerplaat, de versnijdingen van de steunberen en de plint zijn uit de foto's geschat; de noordvensters staan op de plaatsen van de oude foto van de noordgevel (RCE 20254024), het westelijke met de dichtgezette deur eronder.
- Het lessenaarsdak van het portaal (geen AHN door de schaduw van de toren) en de vorm van de aanbouw: alleen 3D BAG en AHN, er is geen goede foto van de noordkant; de topgevels aan beide einden zijn aangenomen.

## Weggelaten of vereenvoudigd

- Vensters, deuren en galmgaten zijn blinde nissen met een spitse top (58 graden); maaswerk, galmborden en de ronde bogen van de galmgaten zijn weggelaten.
- De smalle spleetvensters en het ovale venster in de toren, de muurankers, de luikjes in de spits, het kruis met windwijzer, de dakluikjes en het ontluchtingspijpje op het schipdak, de regenpijpen (kleiner dan 0,9 m of zonder reliëf).
- Vensters en deuren van de aanbouw en het gangetje (niet op de foto's te zien).

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 80 × 80 m bevat het model, zonder het PDOK-pand en zonder opvulling (zelfde volume als zonder steun). Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Wikipedia: Stefanuskerk (Westerbork)](https://nl.wikipedia.org/wiki/Stefanuskerk_(Westerbork))
- [Rijksmonumentenregister 38743](https://monumentenregister.cultureelerfgoed.nl/monumenten/38743)
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Stefanuskerk_(Westerbork)) (RCE 20226554, 20254022 tot 20254031; 20211018 Stefanuskerk 1 tot 3; Westerbork, kerk foto1 2011-04-02; Stefanuskerk Westerbork; Stefanustsjerke, Westerbork; Kerk van Westerbork2)
- BAG pand 1731100000005010 en [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1731100000005010) (dakvlakken)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
