# Watertoren Vlissingen (Vlissingen)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-vlissingen.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de ronde schacht is een omwentelingsprofiel (96 segmenten), ommanteling, spits, lantaarn en uikoepel zijn achtkante omwentelingen (8 segmenten, vlakke zijden), dakkapellen, consoles en ingangspartij zijn hulls; vensters, velden en deur zijn blinde nissen.

De watertoren aan de Badhuisstraat 187 werd in 1894 gebouwd voor de N.V. Vlissingsche Duinwaterleiding in neorenaissancestijl. Hij is 35 m hoog, heeft een ijzeren Intze-reservoir van 300 m³ en is rijksmonument 508765; nu is hij een woning. De toren staat er nog (BAG-pand 0718100000001780 in gebruik, AHN, luchtfoto, foto's tot 2026). Een conische ronde schacht van roodbruine baksteen op een gerustikeerde grijszwarte plint, met een uitkragende achtkante reservoirommanteling op gietijzeren consoles, een achtkante leien spits met dakkapellen, een open achtkante lantaarn en een zinken uikoepel.

## Bestanden

- `watertoren-vlissingen.glb`: één node, `building:watertoren-schacht-ingang-ommanteling-dak-en-lantaarn`.
- `watertoren-vlissingen.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-vlissingen-1-1000.stl`: het model op 1:1000 (12,4 × 13,6 × 35,9 mm).

## Oorsprong en oriëntatie

RD-oorsprong [28410.05, 385837.09] (51,44740 N, 3,56607 O): het hart van BAG-pand 0718100000001780 (een 18-hoek met straal 5,36 m), op het maaiveld: AHN-DTM NAP +1,15 (ring van 6 tot 9 m). De top van de uikoepel in het AHN-DSM ligt op het hart.

De lokale X-as is RD-oost (`xAxis` [1, 0]), Y is noord. Hoeken hieronder in graden linksom vanaf oost. De achthoek heeft zijn hoeken op 0, 45, 90 ... graden en zijn zijden op 22,5 + 45k graden: zo staat hij op de luchtfoto, en zo past een achthoekig dakvlak het best op het AHN-DSM. De ingang staat midden onder de zijde op 112,5 graden (noordnoordwest, naar de kruising met de Coosje Buskenstraat); de dakkapellen staan op die zijde en elke tweede zijde verder (112,5, 202,5, 292,5 en 22,5 graden).

`groundSamplePoints` liggen op 7,5 m oost, west en zuid en op 7,5 m noordoost, buiten de treden; `groundHeight` 45,5 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (oost 45,539, west 45,501, zuid 45,580, noordoost 45,512, gemeten 2026-11-06). Voor de ingang ligt het PDOK-terrein lager (45,31 op 7,5 m); de treden lopen daar 0,2 m in het terrein door. Het PDOK-pand staat op 45,14. `groundOffsetMetres` is −0,1. Het dichtstbijzijnde andere pand ligt 12 m verder.

## Onderdelen

Maten en hoogtes boven het maaiveld (NAP +1,15); d is de afstand tot het hart loodrecht op een zijde van de achthoek.

- Plint: straal 5,36 m (BAG) tot 1,24 m, schuin naar de schacht op 1,4 m.
- Schacht: straal 5,2 m op 1,4 m, recht verjongend tot 3,95 m op 15,1 m. Natuurstenen banden (0,12 m uitstek, onderkant 50 graden) op 5,85–6,1, 9,9–10,1 en 14,0–14,15 m; overkragende rollaag (0,25 m) op 12,1–12,5 m.
- Vensters (nissen van 0,9 à 1,0 m, 0,3 m diep): begane grond vijf rondboogvensters (1,6 tot 4,3 m) op 50 en 130 graden van de ingang en recht ertegenover; eerste verdieping acht rechthoekige vensters (6,7 tot 9,5 m) op de ingang en elke 45 graden; onder de consoles acht paren halfronde vensters (14,2 tot 14,8 m), 1,9 m hart op hart.
- Ingangspartij op 112,5 graden: portiek van 3,9 m breed tot 0,75 m voor de schacht, hoofdgestel tot 6,0 m en fronton tot 7,0 m; rondboogdeur van 1,8 m (0,6 tot 4,6 m), twee treden tot 6,95 m van het hart.
- Consoles: zestien ribben van 0,9 m breed op de zijden en hoeken van de achthoek, met een onderkant van 46 graden vanaf 15,1 m en een kop van 0,7 m onder de ommanteling (tot 5,3 m van het hart).
- Schuine onderkant van de ommanteling: achtkant van d = 3,55 op 15,1 m tot d = 5,37 op 17,27 m (50 graden).
- Ommanteling: achtkant d = 5,37 m van 17,27 tot 24,0 m; per zijde twee verdiepte rondboogvelden (1,3 m breed, 0,25 m diep, 19,0 tot de kruin op 23,0 m) met een venster van 0,9 m (19,7 tot 21,7 m) en eronder een veldje van de fries (18,4 tot 18,9 m). Kroonlijst tot d = 5,73 m (24,0 tot 24,55 m, AHN NAP +25,7) met een onderkant van 50 graden.
- Spits: vlakke goot van d = 5,73 tot 4,64 m op 24,55 m, dan acht dakvlakken van 58 graden (AHN: z = 33,12 − 1,6 d NAP) tot het lantaarnvoetstuk (d = 1,36 m op 29,79 m). Vier dakkapellen (1,2 m breed, voorgevel op d = 3,7 m, goot 27,2, top 27,9 m).
- Lantaarnvoetstuk tot 30,6 m, lantaarn d = 1,05 m tot 32,1 m, kraag d = 1,45 m (onderkant 50 graden) tot 32,75 m.
- Uikoepel: achtkant van d = 1,15 m op 32,75, buik 1,3 m (33,2 tot 33,55 m), punt naar d = 0,46 op 34,84 m (AHN NAP +35,99); makelaar (kegel van 0,45 tot 0,2 m) tot 35,6 m.

Nissen hebben een plafond dat naar binnen onder 56 tot 63 graden oploopt.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Vlissingen)): 1894, N.V. Vlissingsche Duinwaterleiding, neorenaissance, 35 m, 300 m³, Badhuisstraat 187.
- [Rijksmonumentenregister 508765](https://monumentenregister.cultureelerfgoed.nl/monumenten/508765): conische schacht en uitkragende achtkante reservoirommanteling op gietijzeren consoles; gerustikeerde plint met een band van grijszwarte steen; vensters onder rondbogen op de begane grond, rechthoekige kozijnen met mozaïek in de boogvelden, verdiepte muurvelden en een rij halfronde vensters in de schacht; boogfries onder de ommanteling; verdiepte rondboogvelden met rechthoekige vensters, boogfries en kroonlijst op de ommanteling; achtkante spits met leien in Maasdekking, chaletachtige dakkapellen, open achtkante lantaarn en zinken uivormige helm; natuurstenen ingangspartij met gecanneleerde Ionische pilasters, fries, consoles en fronton met obelisk.
- BAG-pand 0718100000001780 (PDOK, 2026-11-06): 18-hoek met straal 5,36 m, bouwjaar 1894, in gebruik.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld NAP +1,15; top NAP +35,99; dakvlak z = 33,12 − 1,6 d NAP (achthoek met hoeken op 0, 45, ... graden); vlakke goot en kroonlijst NAP +25,6 à 25,7 tot 6,1 à 6,35 m van het hart in het zuiden, zuidoosten en zuidwesten. In het noorden en oosten mist het DSM de rand van de ommanteling (daar staan alleen gevelpunten); het model is daar gespiegeld. 3D BAG: maaiveld 0,79, nok 35,96.
- PDOK-luchtfoto (Actueel_orthoHR): achtkante leien spits met dakkapellen, de achthoek met hoeken in de asrichtingen.
- Foto's op Wikimedia Commons (categorie "Watertoren Vlissingen"): "Watertoren Vlissingen.JPG" (frontaal op de ingang), "Watertoren, Badhuisstraat 187, Vlissingen.jpg" (telelens), "Vlissingen Watertoren 2010.JPG", "Vlissingen, de watertoren RM508765 foto6 2015-09-29 14.22.jpg" en "Vlissingen-Badhuisstraat 187-watertoren-ro3162" tot "ro3179".

## Geschat en weggelaten

Geschat: de breedtes van ommanteling (d = 5,37 m), lantaarn en uikoepel en de hoogtes boven de rollaag uit de telelensfoto, geschaald op de kroonlijst (d = 5,73 m uit de AHN-rand, 39,4 px/m) en verankerd op de kroonlijst en de top uit het AHN; de hoogtes eronder (plint, banden, vensters, ingangspartij) uit de frontale foto op de ingang (43 px/m tussen maaiveld en de halfronde vensters); de straal van de schacht onder de consoles (3,95 m) uit de telelensfoto. De richting van de ingang volgt uit de frontale foto (de ingang staat midden onder een zijde) en het verharde voorplein op de luchtfoto. De verdeling van de vensters in de schacht rond de toren (acht op de eerste verdieping, vijf op de begane grond) is grof: op de foto's staan aan de ingangskant drie vensters per verdieping. Kleine vensters (0,6 à 0,75 m) zijn nissen van 0,9 m.

Aangepast voor het printen zonder steun: de ommanteling kraagt in werkelijkheid vlak uit op slanke gietijzeren consoles; hier loopt eronder een achtkante onderkant van 50 graden van de schacht tot de ommanteling, met de zestien consoles als ribben eronder. De kroonlijst en de kraag van de lantaarn hebben een onderkant van 50 graden.

Weggelaten: de plint en banden als kleur (grijszwart, natuursteen), de pilasters, het fries, de consoles en de obelisk van de ingangspartij, de mozaïeken, verdiepte muurvelden en strekken in de schacht, de boogfriezen onder de ommanteling en onder de kroonlijst, de vensters van de dakkapellen (0,4 m), de openingen van de lantaarn (stijlen onder 0,9 m; de lantaarn is een dichte achtkant), de windvaan boven de makelaar en de lage muurtjes en het voorplein (zit in het PDOK-terrein).

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (80 m uitsnede, steunmethode v2, 45 graden) bevat het model zonder het PDOK-pand; het ondersteuningsobject is 0,001 mm³ (een rekenrestje). Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een cilinder van maaiveld tot de goot met een achthoekige kegel en een blok als lantaarn) de plint, de verjongende schacht met banden, rollaag en vensters, de ingangspartij, de consoles, de uitkragende achtkante ommanteling met velden en vensters, de kroonlijst, de achtkante spits met dakkapellen, lantaarn, kraag en uikoepel.

Controle-URL: http://localhost:3000/kaart/51.44740/3.56607/200/1x1/0
