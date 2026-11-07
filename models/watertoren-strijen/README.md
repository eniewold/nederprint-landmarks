# Watertoren Strijen (Strijen)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-strijen.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht, ringen, uitlopende reservoirbodem, banden en borstwering zijn één omwentelingsprofiel; de achtkante uitbouw is een stel hulls van achthoeken (met een cirkel op de schacht voor het ondervlak); consoles, lisenen en dakopbouw zijn prisma's; vensters, deur en openingen zijn blinde nissen met een schuin of spits plafond.

De watertoren van Strijen (gemeente Hoeksche Waard) werd in 1914 gebouwd naar ontwerp van Visser & Smit Hanab; hij is 27 m hoog en had een reservoir van 150 m³ (Wikipedia). Hij heeft geen waterfunctie meer en is nu woning en bed & breakfast. De toren staat er nog (BAG "Pand in gebruik", woonfunctie; AHN, luchtfoto en 3D BAG op AHN5). Een ronde, licht verjongende bakstenen schacht met een rondboogdeur aan de straatkant draagt via drie uitgemetselde ringen en acht gebogen betonconsoles een iets wijder reservoir met een betonband, acht lisenen, smalle vensters, een tweede band en een borstwering met kleine vierkante openingen rond een plat, begroeid dak. Rond de schacht hangt op 6,6 tot 10,35 m een achtkante woonuitbouw (latere toevoeging) met een leien plint, een rondom glazen verdieping en een plat dak met zonnepanelen; daaronder blijft de schacht met de deur vrij.

## Bestanden

- `watertoren-strijen.glb`: één node, `building:watertoren-schacht-achtkante-uitbouw-reservoir-en-borstwering`.
- `watertoren-strijen.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-strijen-1-1000.stl`: het model op 1:1000 (12,0 × 12,0 × 27,5 mm).

## Oorsprong en oriëntatie

RD-oorsprong [97934.41, 416844.66] (51,737408 N, 4,561037 O): het middelpunt van een cirkelfit op de 26 hoekpunten van BAG-pand 0617100000720527 (straal 6,35 m, alle punten tussen 6,21 en 6,46 m). Die voetafdruk is de achtkante uitbouw; de schacht staat er concentrisch in (de top ligt in het AHN-DSM binnen 0,25 m van dit punt).

De lokale X-as wijst naar RD-oost (`xAxis` [1, 0]). De achtkant heeft vlakke zijden naar het oosten, noorden, westen en zuiden (luchtfoto: een rechte zuidzijde van 4,9 m), de hoeken op 22,5 + k·45 graden.

Het maaiveld loopt over de toren 1,75 m af: aan de straatkant (noordoost) AHN-DTM NAP +1,45, aan de tuinkant (zuid en west, aan het water) NAP −0,3 (3D BAG maaiveld −0,32). z = 0 ligt op het laagste maaiveld rond de voet; het talud naar de straat laat het model aan het PDOK-terrein over. `groundSamplePoints` liggen daarom aan de tuinkant: [−7, −3], [−5, −5], [−3, −7] en [−7, 0]; `groundHeight` 43,500 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (43,500, 43,529, 44,083 en 43,915, gemeten 2026-11-07). `groundOffsetMetres` is −0,1. Het PDOK-pand staat op 43,50 met de top op 70,06. Het bijgebouw ten zuidoosten (0617100000718342, 1928) staat in PDOK op 49,74, gelijk aan de 3D BAG-nok (NAP +5,9), en blijft van PDOK.

## Onderdelen

Maten en hoogtes boven het maaiveld (NAP −0,3).

- Schacht: rond, straal 3,86 m aan de onderkant, recht verjongend tot 3,3 m op 14,9 m. Deur aan de straatkant (noordoost, 45 graden) als spitse nis van 1,1 m breed van 1,75 m (straatniveau) tot 3,45 m met een top van 50 graden; vensters onder de uitbouw (zuidoost en west, nissen 0,9 × 1,2 m op 2,4 m) en drie kolommen van twee vensters boven de uitbouw (zuidoost, noordoost en west-zuidwest, nissen 0,9 × 1,2/1,3 m op 10,7 en 12,6 m).
- Achtkante uitbouw (omgeschreven straal 6,49 m op de daklijst): ondervlak van 45 graden van de schacht op 4,05 m naar de onderkant van de plint op 6,6 m (apothema 5,6 m); leien plint die naar buiten helt tot apothema 5,88 m op 8,2 m; glazen verdieping (apothema 5,85 m) van 8,2 tot 9,7 m met vier vensternissen van 0,9 × 1,1 m per zijde; daklijst (apothema 6,0 m) met een onderkant van 45 graden van 9,55 tot 10,35 m; plat dak op 10,1 m (AHN NAP +9,8) binnen een 0,9 m brede daklijst.
- Overgang: drie uitgemetselde ringen van elk 0,12 m uitkraging en 0,45 m hoog met een onderkant van 45 graden, van 14,9 tot 16,35 m (straal 3,66 m); daarboven loopt de reservoirbodem uit tot straal 4,05 m op 18,85 m, met acht gebogen consoles van 0,9 m breed (op 22,5 + k·45 graden) van de bovenste ring naar de band.
- Reservoir: betonband met straal 4,2 m (diameter 8,4 m, luchtfoto 8,3 m) van 19,0 tot 19,35 m met een onderkant van 45 graden; wand met straal 4,0 m (bovenaan 3,95 m) met acht lisenen van 0,9 m breed tot straal 4,18 m, van de band tot de bovenkant; vier smalle vensters als nissen van 0,9 × 1,8 m op 21,6 m.
- Bovenkant: band met straal 4,12 m van 25,8 tot 26,1 m (onderkant 45 graden); borstwering met straal 3,97 m en 1,2 m dik tot 27,2 m (3D BAG nok NAP +26,91) met zestien openingen als nissen van 0,9 × 0,45 m, 0,2 m diep, op 26,3 m; plat dak op 26,4 m (AHN NAP +26,1) met een dakopbouw van 3,0 × 1,2 m tot 27,1 m aan de noordkant.

Nissen zijn 0,3 m diep (de borstwering 0,2 m, de uitbouw 0,25 m) met een plafond dat naar binnen onder 56 graden oploopt; de deur heeft een spitse top van 50 graden.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Strijen)): 1914, Visser & Smit Hanab, 27 m, 150 m³, nu woning en bed & breakfast.
- BAG-pand 0617100000720527 (PDOK, 2026-11-07): bouwjaar 1914, woonfunctie, voetafdruk van 26 hoekpunten, straal 6,35 m.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-07): maaiveld NAP −0,3 (zuid en west) tot +1,45 (straat, noordoost); dak van de uitbouw NAP +9,8 tot de rand op 6,3 m uit het hart (max +10,4); dak van de toren NAP +26,1, equivalente straal boven NAP +15 4,27 m en boven NAP +24 3,3 m; dakopbouw NAP +26,8 tot +26,9.
- 3D BAG (AHN5): maaiveld NAP −0,32, dak 50e percentiel +9,85, 70e percentiel +26,05, nok +26,91.
- PDOK-luchtfoto (Actueel_orthoHR): achtkante uitbouw met zonnepanelen op elke zijde en glas aan de zuid- en westkant; rond, groen dak met een borstwering, lisenen en lichte kasten aan de noordkant; reservoirdiameter 8,3 m.
- Foto op Wikimedia Commons: "Strijen Watertoren 3628.JPG" (Willemjans, 2007, vanaf de straat aan de oost-noordoostkant): ringen, consoles, banden, lisenen, vensters, borstwering met openingen, de uitbouw met plint, glas en daklijst, de deur. Hoogtes afgelezen met een perspectieffit op drie bekende hoogtes (straat NAP +1,45, dak uitbouw +9,8, top +26,9).

## Geschat en weggelaten

Geschat: de stralen van de schacht (3,86 naar 3,3 m) volgen uit de verhoudingen op de foto ten opzichte van de band van 8,4 m; de schuin genomen foto laat de verjonging niet betrouwbaar zien. De hoogtes van de ringen, consoles, banden, het reservoir en de lagen van de uitbouw komen van de perspectieffit op één foto. Het ondervlak van de uitbouw is in het echt een vrijwel vlakke onderkant onder een iets hellende plint; in het model loopt het onder 45 graden naar de schacht (vanaf 4,05 m), zodat het zonder steun te printen is. De consoles zijn in het echt gebogen; hier rechte schuine blokken. De achtkant volgt uit de luchtfoto (de BAG tekent een vrijwel ronde veelhoek). De stand van de deur (noordoost, onder de vensterkolom aan de straat) en van de vensters volgt uit de ene foto; de kolom aan de west-zuidwestkant en het venster aan de westkant onder de uitbouw zijn aangenomen. De smalle vensters in het reservoir zijn in het echt circa 0,3 m breed en hun aantal op de achterkant onbekend; de openingen in de borstwering zijn in het echt kleiner en talrijker (circa vijf per veld). De borstwering is 1,2 m dik genomen zodat er na de openingen 0,95 m blijft. De dakopbouw (maat en plaats) is geschat uit de lichte kasten op de luchtfoto en het AHN.

Weggelaten: de zonnepanelen op het dak van de uitbouw en de begroeiing op het dak van de toren (dunner dan 0,9 m), de raamstijlen van de glazen verdieping (de vensters zijn nissen), het metselverband en de lichte rollagen, de stalen poort en heg aan de straat, en het bijgebouw ten zuidoosten (eigen BAG-pand, blijft van PDOK).

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (80 m uitsnede, steunmethode v2, 45 graden) bevat het model zonder het PDOK-pand; het modelobject heeft met en zonder steun hetzelfde volume (1593 mm³) en er is geen ondersteuningsobject. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een achthoekige doos van 10 m met een veelhoekige kolom tot 26,6 m) de verjongende ronde schacht met deur en vensters, de uitbouw met ondervlak, plint, glazen verdieping en daklijst, de ringen en consoles onder het reservoir, de banden, de lisenen, de vensters en de borstwering met openingen rond het platte dak.

Controle-URL: http://localhost:3000/kaart/51.73741/4.56104/200/1x1/0
